from pathlib import Path
from PIL import Image
import os

# مجلد الصور
IMAGES_DIR = Path("images")

# غير الصور اللي فوق 300 KB غادي نضغطوها
MIN_SIZE_KB = 300

# أكبر أبعاد للصورة
MAX_WIDTH = 1600
MAX_HEIGHT = 1600

# الجودة
QUALITY = 76


def to_kb(size_bytes):
    return size_bytes / 1024


def optimize_image(image_path):
    old_size = image_path.stat().st_size
    old_size_kb = to_kb(old_size)

    # نخليو الصور الصغيرة بلا تغيير
    if old_size_kb < MIN_SIZE_KB:
        print(f"SKIP  {image_path.name}  {old_size_kb:.1f} KB")
        return old_size, old_size, False

    temp_path = image_path.with_name(
        image_path.stem + "__temp.webp"
    )

    try:
        with Image.open(image_path) as image:
            image.load()

            # تصغير الأبعاد مع الحفاظ على النسبة
            if image.width > MAX_WIDTH or image.height > MAX_HEIGHT:
                image.thumbnail(
                    (MAX_WIDTH, MAX_HEIGHT),
                    Image.Resampling.LANCZOS
                )

            # تحويل نوع الصورة بشكل مناسب
            if image.mode not in ("RGB", "RGBA"):
                if "transparency" in image.info:
                    image = image.convert("RGBA")
                else:
                    image = image.convert("RGB")

            # حفظ نسخة مؤقتة مضغوطة
            image.save(
                temp_path,
                format="WEBP",
                quality=QUALITY,
                method=6
            )

        new_size = temp_path.stat().st_size

        # نعوض الصورة الأصلية غير إلا كانت الجديدة أصغر
        if new_size < old_size:
            os.replace(temp_path, image_path)

            print(
                f"OK    {image_path.name}  "
                f"{old_size_kb:.1f} KB -> "
                f"{to_kb(new_size):.1f} KB"
            )

            return old_size, new_size, True

        # إذا النسخة الجديدة ماشي أصغر، نحيدوها
        temp_path.unlink(missing_ok=True)

        print(
            f"KEEP  {image_path.name}  "
            f"النسخة الأصلية أصغر"
        )

        return old_size, old_size, False

    except Exception as error:
        temp_path.unlink(missing_ok=True)

        print(
            f"ERROR {image_path.name}: {error}"
        )

        return old_size, old_size, False


def main():
    if not IMAGES_DIR.exists():
        print("ERROR: مجلد images ما كاينش.")
        return

    files = sorted(IMAGES_DIR.rglob("*.webp"))

    if not files:
        print("ما لقيت حتى صورة WebP.")
        return

    print(f"لقينا {len(files)} صورة WebP")
    print("بداية الضغط...\n")

    total_before = 0
    total_after = 0
    optimized_count = 0

    for image_path in files:
        before, after, changed = optimize_image(image_path)

        total_before += before
        total_after += after

        if changed:
            optimized_count += 1

    saved = total_before - total_after

    print("\n" + "=" * 45)
    print(f"عدد الصور المضغوطة: {optimized_count}")
    print(f"الحجم قبل: {total_before / 1024 / 1024:.2f} MB")
    print(f"الحجم بعد: {total_after / 1024 / 1024:.2f} MB")
    print(f"تم توفير: {saved / 1024 / 1024:.2f} MB")
    print("=" * 45)


if __name__ == "__main__":
    main()