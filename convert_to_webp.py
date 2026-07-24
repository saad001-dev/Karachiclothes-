from PIL import Image
import os

# Project folder
ROOT_DIR = "./public/images"

SUPPORTED = (".jpg", ".jpeg", ".png")

converted = 0
skipped = 0

for root, dirs, files in os.walk(ROOT_DIR):
    # Skip node_modules and build folders
    if "node_modules" in root or "dist" in root or ".git" in root:
        continue

    for file in files:
        if file.lower().endswith(SUPPORTED):

            input_path = os.path.join(root, file)
            output_path = os.path.splitext(input_path)[0] + ".webp"

            if os.path.exists(output_path):
                skipped += 1
                continue

            try:
                img = Image.open(input_path)

                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGBA")
                else:
                    img = img.convert("RGB")

                img.save(
                    output_path,
                    "WEBP",
                    quality=85,
                    method=6
                )

                converted += 1
                print(f"✅ {input_path}")

            except Exception as e:
                print(f"❌ {input_path}")
                print(e)

print()
print("Finished")
print("Converted:", converted)
print("Skipped:", skipped)