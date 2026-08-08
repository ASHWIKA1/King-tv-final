import os
from PIL import Image

brain_dir = r"C:\Users\vishal AV\.gemini\antigravity-ide\brain\57260b46-8b5e-4b23-bdc1-a8ff0fff4539"
workspace_dir = r"c:\Users\vishal AV\Downloads\king"
images_dir = os.path.join(workspace_dir, "assets", "images")

# Load original image
img2 = Image.open(os.path.join(brain_dir, "media__1782897269693.jpg")).convert("RGB")
width2, height2 = img2.size

# Left half (Light banner raw)
banner_light_raw = img2.crop((0, 0, width2 // 2, height2))

# Right half (Dark banner raw)
banner_dark_raw = img2.crop((width2 // 2, 0, width2, height2))

def get_light_text_bbox(image, threshold=40):
    # Find bounding box of pixels that are NOT white (distance from 255, 255, 255 is > threshold)
    w, h = image.size
    left, top, right, bottom = w, h, 0, 0
    pixels = image.load()
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            dist = (255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2
            if dist > threshold * threshold:
                if x < left: left = x
                if y < top: top = y
                if x > right: right = x
                if y > bottom: bottom = y
    if left <= right and top <= bottom:
        return (left, top, right, bottom)
    return None

def get_dark_text_bbox(image, threshold=40):
    # Find bounding box of pixels that are NOT black (distance from 0, 0, 0 is > threshold)
    w, h = image.size
    left, top, right, bottom = w, h, 0, 0
    pixels = image.load()
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            dist = r ** 2 + g ** 2 + b ** 2
            if dist > threshold * threshold:
                # We also need to ignore the outer border if any exists
                # The border is white (255, 255, 255) at the very edges, so let's exclude pixels close to white
                dist_white = (255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2
                if dist_white > 100 * 100:  # Not white/grey border
                    if x < left: left = x
                    if y < top: top = y
                    if x > right: right = x
                    if y > bottom: bottom = y
    if left <= right and top <= bottom:
        return (left, top, right, bottom)
    return None

# 1. Process Light Banner
bbox_light = get_light_text_bbox(banner_light_raw, threshold=50)
if bbox_light:
    l, t, r, b = bbox_light
    # Add padding (e.g. 20px horizontally, 12px vertically)
    padding_x = 24
    padding_y = 16
    
    l_pad = max(0, l - padding_x)
    t_pad = max(0, t - padding_y)
    r_pad = min(width2 // 2, r + padding_x)
    b_pad = min(height2, b + padding_y)
    
    # We want the padding to be filled with white background
    cropped = banner_light_raw.crop((l_pad, t_pad, r_pad, b_pad))
    cropped.save(os.path.join(images_dir, "logo-banner-light.png"))
    print("Saved tight logo-banner-light.png:", cropped.size)

# 2. Process Dark Banner
bbox_dark = get_dark_text_bbox(banner_dark_raw, threshold=50)
if bbox_dark:
    l, t, r, b = bbox_dark
    # Add padding
    padding_x = 24
    padding_y = 16
    
    l_pad = max(0, l - padding_x)
    t_pad = max(0, t - padding_y)
    r_pad = min(width2 // 2, r + padding_x)
    b_pad = min(height2, b + padding_y)
    
    # Crop and save
    cropped = banner_dark_raw.crop((l_pad, t_pad, r_pad, b_pad))
    cropped.save(os.path.join(images_dir, "logo-banner-dark.png"))
    print("Saved tight logo-banner-dark.png:", cropped.size)
