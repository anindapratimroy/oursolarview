import os
from PIL import Image

def resize_images():
    img_dir = "planets/img_others"
    if not os.path.exists(img_dir):
        print(f"Directory not found: {img_dir}")
        return

    # Resize all 8k_*.jpg to 2k_*.jpg and 4k_*.jpg
    for file in os.listdir(img_dir):
        if file.startswith("8k_") and file.endswith((".jpg", ".jpeg")):
            path = os.path.join(img_dir, file)
            print(f"Processing {file}...")
            try:
                with Image.open(path) as img:
                    # Original is 8192x4096 (usually)
                    # Create 2K version
                    img_2k = img.resize((2048, 1024), Image.Resampling.LANCZOS)
                    img_2k.save(path.replace('8k_', '2k_'), quality=85)
                    
                    # Create 4K version
                    img_4k = img.resize((4096, 2048), Image.Resampling.LANCZOS)
                    img_4k.save(path.replace('8k_', '4k_'), quality=85)
                    
                print(f"Successfully generated 2K and 4K for {file}")
            except Exception as e:
                print(f"Failed processing {file}: {e}")

if __name__ == "__main__":
    resize_images()
