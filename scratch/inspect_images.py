import os
from PIL import Image

images_dir = r"c:\Users\vishal AV\Downloads\king\assets\images"
icons_dir = r"c:\Users\vishal AV\Downloads\king\assets\icons"

for dir_path, name in [(images_dir, "logo-banner-light.png"), 
                       (images_dir, "logo-banner-dark.png"),
                       (icons_dir, "logo-icon-light.png"),
                       (icons_dir, "logo-icon-dark.png")]:
    p = os.path.join(dir_path, name)
    if os.path.exists(p):
        img = Image.open(p)
        print(f"{name}: size={img.size}, mode={img.mode}")
        # Count non-transparent pixels or print some pixels
        if img.mode == 'RGBA':
            pixels = list(img.getdata())
            visible = [p for p in pixels if p[3] > 0]
            print(f"  Visible pixels: {len(visible)} / {len(pixels)}")
            if visible:
                # Find distinct colors of visible pixels (sample)
                colors = set([p[:3] for p in visible[:100]])
                print(f"  Sample visible colors: {list(colors)[:5]}")
        elif img.mode == 'RGB':
            pixels = list(img.getdata())
            print(f"  Total pixels: {len(pixels)}")
            colors = set(pixels[:100])
            print(f"  Sample colors: {list(colors)[:5]}")
    else:
        print(f"{name}: DOES NOT EXIST")
