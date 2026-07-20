from pathlib import Path
from PIL import Image

IMAGES_DIR = Path("images")

TARGETS = {
    "19-680.webp": 48,
    "raft2-680.webp": 50,
    "quad-680.webp": 56,
    "vtt-680.webp": 58,
    "21-768.webp": 58,
    "camping-1-680.webp": 56,
    "bab2-680.webp": 60,
}

for filename, quality in TARGETS.items():
    path = IMAGES_DIR / filename

    if not path.exists():
        print(f"Not found: {filename}")
        continue

    try:
        with Image.open(path) as img:
            img.save(
                path,
                format="WEBP",
                quality=quality,
                method=6,
                optimize=True,
            )

        size_kb = path.stat().st_size / 1024
        print(f"{filename}: {size_kb:.1f} KB")

    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("\nDone!")