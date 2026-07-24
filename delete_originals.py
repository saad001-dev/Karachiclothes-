import os

ROOT_DIR = "./public/images"

deleted = 0
skipped = 0

for root, dirs, files in os.walk(ROOT_DIR):
    for file in files:
        if file.lower().endswith((".jpg", ".jpeg", ".png")):

            original = os.path.join(root, file)
            webp = os.path.splitext(original)[0] + ".webp"

            if os.path.exists(webp):
                os.remove(original)
                deleted += 1
                print(f"🗑 Deleted: {original}")
            else:
                skipped += 1
                print(f"⚠️ Skipped (no webp): {original}")

print("\nFinished")
print("Deleted:", deleted)
print("Skipped:", skipped)