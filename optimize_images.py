from __future__ import annotations

import sys
import zipfile
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    print("Pillow غير مثبت. شغّل:")
    print("python -m pip install pillow")
    input("\nاضغط Enter للخروج...")
    raise SystemExit(1)

QUALITY = 82
MAX_DIMENSION = 1920
LOGO_MAX_DIMENSION = 256
TEXT_EXTENSIONS = {".html", ".htm", ".css", ".js", ".json", ".xml", ".md", ".txt"}
SOURCE_EXTENSIONS = {".jpg", ".jpeg", ".png"}

PROJECT_ROOT = Path(__file__).resolve().parent
IMAGES_DIR = PROJECT_ROOT / "images"
BACKUP_ZIP = PROJECT_ROOT.parent / f"{PROJECT_ROOT.name}-original-images-backup.zip"


def human_size(size: int) -> str:
    units = ["B", "KB", "MB", "GB"]
    value = float(size)
    for unit in units:
        if value < 1024 or unit == units[-1]:
            return f"{value:.1f} {unit}"
        value /= 1024
    return f"{size} B"


def make_backup(files: list[Path]) -> None:
    print(f"\nإنشاء نسخة احتياطية:\n{BACKUP_ZIP}")
    with zipfile.ZipFile(BACKUP_ZIP, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for file in files:
            archive.write(file, file.relative_to(PROJECT_ROOT))


def convert_image(source: Path, target: Path) -> tuple[int, int]:
    old_size = source.stat().st_size

    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)

        max_dimension = (
            LOGO_MAX_DIMENSION
            if "logo" in source.stem.lower() or "favicon" in source.stem.lower()
            else MAX_DIMENSION
        )

        if max(image.size) > max_dimension:
            image.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)

        if image.mode in ("P", "LA"):
            image = image.convert("RGBA")
        elif image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGB")

        save_quality = 90 if max_dimension == LOGO_MAX_DIMENSION else QUALITY
        target.parent.mkdir(parents=True, exist_ok=True)
        image.save(target, "WEBP", quality=save_quality, method=6, optimize=True)

    return old_size, target.stat().st_size


def update_references(mapping: dict[str, str]) -> tuple[int, int]:
    changed_files = 0
    replacements = 0

    for file in PROJECT_ROOT.rglob("*"):
        if not file.is_file():
            continue
        if ".git" in file.parts:
            continue
        if file.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        if file.name == Path(__file__).name:
            continue

        try:
            original = file.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue

        updated = original
        file_replacements = 0

        for old_name, new_name in mapping.items():
            count = updated.count(old_name)
            if count:
                updated = updated.replace(old_name, new_name)
                file_replacements += count

        if updated != original:
            file.write_text(updated, encoding="utf-8", newline="")
            changed_files += 1
            replacements += file_replacements

    return changed_files, replacements


def main() -> None:
    print("=" * 62)
    print("تحسين صور موقع Imsfrane إلى WebP")
    print("=" * 62)
    print(f"مجلد المشروع: {PROJECT_ROOT}")

    if not IMAGES_DIR.is_dir():
        print("\nخطأ: لم أجد مجلد images بجانب السكريبت.")
        print("ضع optimize_images.py داخل جذر المشروع، بجانب images و en و fr.")
        input("\nاضغط Enter للخروج...")
        raise SystemExit(1)

    sources = sorted(
        file for file in IMAGES_DIR.rglob("*")
        if file.is_file() and file.suffix.lower() in SOURCE_EXTENSIONS
    )

    if not sources:
        print("\nلم أجد صور JPG/JPEG/PNG للتحويل.")
        input("\nاضغط Enter للخروج...")
        return

    targets: dict[Path, Path] = {}
    collisions: list[tuple[Path, Path, Path]] = []
    for source in sources:
        target = source.with_suffix(".webp")
        if target in targets and targets[target] != source:
            collisions.append((target, targets[target], source))
        targets[target] = source

    if collisions:
        print("\nتوقفت العملية لأن هناك أسماء ستتعارض:")
        for target, first, second in collisions:
            print(f"- {first.name} و {second.name} سيصبحان {target.name}")
        print("غيّر اسم إحدى الصورتين ثم أعد تشغيل السكريبت.")
        input("\nاضغط Enter للخروج...")
        raise SystemExit(1)

    original_total = sum(file.stat().st_size for file in sources)
    print(f"\nعدد الصور: {len(sources)}")
    print(f"الحجم الأصلي: {human_size(original_total)}")
    answer = input("\nاكتب YES للبدء: ").strip().upper()
    if answer != "YES":
        print("تم الإلغاء بدون تغيير أي ملف.")
        return

    make_backup(sources)

    mapping: dict[str, str] = {}
    converted: list[Path] = []
    new_total = 0

    try:
        print("\nجاري التحويل...")
        for index, source in enumerate(sources, start=1):
            target = source.with_suffix(".webp")
            old_size, new_size = convert_image(source, target)
            converted.append(target)
            new_total += new_size
            mapping[source.name] = target.name

            saving = 0 if old_size == 0 else round((1 - new_size / old_size) * 100)
            print(
                f"[{index}/{len(sources)}] {source.name} -> {target.name} "
                f"({human_size(old_size)} -> {human_size(new_size)}, وفر {saving}%)"
            )

        changed_files, replacements = update_references(mapping)

        for source in sources:
            source.unlink()

    except Exception as exc:
        print(f"\nحدث خطأ: {exc}")
        print("لم تُحذف النسخة الاحتياطية. لا ترفع المشروع قبل المراجعة.")
        input("\nاضغط Enter للخروج...")
        raise

    saved = original_total - new_total
    percent = 0 if original_total == 0 else round(saved / original_total * 100)

    print("\n" + "=" * 62)
    print("تمت العملية بنجاح")
    print(f"الصور المحولة: {len(converted)}")
    print(f"ملفات الكود المعدلة: {changed_files}")
    print(f"عدد الروابط المعدلة: {replacements}")
    print(f"الحجم قبل: {human_size(original_total)}")
    print(f"الحجم بعد: {human_size(new_total)}")
    print(f"التوفير: {human_size(saved)} ({percent}%)")
    print(f"النسخة الاحتياطية: {BACKUP_ZIP}")
    print("=" * 62)
    print("\nافتح en/index.html و fr/index.html وجرب الصور قبل رفع المشروع.")
    input("\nاضغط Enter للخروج...")


if __name__ == "__main__":
    main()
