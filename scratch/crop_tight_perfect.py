import os
from PIL import Image

brain_dir = r"C:\Users\vishal AV\.gemini\antigravity-ide\brain\57260b46-8b5e-4b23-bdc1-a8ff0fff4539"
workspace_dir = r"c:\Users\vishal AV\Downloads\king"
icons_dir = os.path.join(workspace_dir, "assets", "icons")
images_dir = os.path.join(workspace_dir, "assets", "images")

# Load original images
img1 = Image.open(os.path.join(brain_dir, "media__1782897260225.png")).convert("RGB")
img2 = Image.open(os.path.join(brain_dir, "media__1782897269693.jpg")).convert("RGB")

def get_not_white_bbox(image, threshold=30):
    # Find bounding box of pixels that are not white (i.e., distance from (255, 255, 255) is > threshold)
    width, height = image.size
    left, top, right, bottom = width, height, 0, 0
    
    # We load pixels for fast access
    pixels = image.load()
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            # distance from white
            dist = (255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2
            if dist > threshold * threshold:
                if x < left: left = x
                if y < top: top = y
                if x > right: right = x
                if y > bottom: bottom = y
                
    if left <= right and top <= bottom:
        return (left, top, right + 1, bottom + 1)
    return None

# 1. Icon - Light Theme
width1, height1 = img1.size
icon_light_raw = img1.crop((0, 0, width1, height1 // 2))
# Crop tight to gold symbol
bbox_light = get_not_white_bbox(icon_light_raw, threshold=40)
if bbox_light:
    # Add a bit of padding
    l, t, r, b = bbox_light
    l = max(0, l - 10)
    t = max(0, t - 10)
    r = min(width1, r + 10)
    b = min(height1 // 2, b + 10)
    icon_light = icon_light_raw.crop((l, t, r, b))
    icon_light.save(os.path.join(icons_dir, "logo-icon-light.png"))
    print("Saved logo-icon-light.png:", icon_light.size)

# 2. Icon - Dark Theme
icon_dark_raw = img1.crop((0, height1 // 2, width1, height1))
# Crop tight to black rounded square (which is not white!)
bbox_dark = get_not_white_bbox(icon_dark_raw, threshold=40)
if bbox_dark:
    l, t, r, b = bbox_dark
    # We want to crop to the black square. Let's add 2px margin to ensure we don't cut the square edges.
    l = max(0, l - 2)
    t = max(0, t - 2)
    r = min(width1, r + 2)
    b = min(height1 // 2, b + 2)
    icon_dark = icon_dark_raw.crop((l, t, r, b))
    icon_dark.save(os.path.join(icons_dir, "logo-icon-dark.png"))
    print("Saved logo-icon-dark.png:", icon_dark.size)

# 3. Banner - Light Theme
width2, height2 = img2.size
banner_light_raw = img2.crop((0, 0, width2 // 2, height2))
bbox_b_light = get_not_white_bbox(banner_light_raw, threshold=40)
if bbox_b_light:
    l, t, r, b = bbox_b_light
    l = max(0, l - 10)
    t = max(0, t - 10)
    r = min(width2 // 2, r + 10)
    b = min(height2, b + 10)
    banner_light = banner_light_raw.crop((l, t, r, b))
    banner_light.save(os.path.join(images_dir, "logo-banner-light.png"))
    print("Saved logo-banner-light.png:", banner_light.size)

# 4. Banner - Dark Theme
banner_dark_raw = img2.crop((width2 // 2, 0, width2, height2))
bbox_b_dark = get_not_white_bbox(banner_dark_raw, threshold=40)
if bbox_b_dark:
    l, t, r, b = bbox_b_dark
    l = max(0, l - 2)
    t = max(0, t - 2)
    r = min(width2 // 2, r + 2)
    b = min(height2, b + 2)
    banner_dark = banner_dark_raw.crop((l, t, r, b))
    banner_dark.save(os.path.join(images_dir, "logo-banner-dark.png"))
    print("Saved logo-banner-dark.png:", banner_dark.size)
