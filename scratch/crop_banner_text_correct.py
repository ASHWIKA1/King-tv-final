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

def get_light_text_bbox(image):
    w, h = image.size
    left, top, right, bottom = w, h, 0, 0
    pixels = image.load()
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            # Light banner background is white/grey. The gold/black text is darker.
            # We want to find pixels that are darker (e.g. r < 200 or g < 200 or b < 200)
            # but we ignore the outer grey border at the edges (which is also grey, but let's exclude edge border by starting x,y slightly inside)
            if x > 15 and x < w - 15 and y > 15 and y < h - 15:
                if r < 220 or g < 220 or b < 220:
                    if x < left: left = x
                    if y < top: top = y
                    if x > right: right = x
                    if y > bottom: bottom = y
    if left <= right and top <= bottom:
        return (left, top, right, bottom)
    return None

def get_dark_text_bbox(image):
    w, h = image.size
    left, top, right, bottom = w, h, 0, 0
    pixels = image.load()
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            # Dark banner background is black (approx < 40). Content is gold/white (approx > 100).
            # The outer border is white/grey (approx > 200 at edges).
            # So we check if pixels are gold/white (r > 80 or g > 80 or b > 80)
            # and not the outer white border (ignore pixels close to edges or where R/G/B are all > 230 at the very edges)
            if x > 15 and x < w - 15 and y > 15 and y < h - 15:
                if r > 80 or g > 80 or b > 80:
                    # check it's not the white border
                    if not (r > 240 and g > 240 and b > 240):
                        if x < left: left = x
                        if y < top: top = y
                        if x > right: right = x
                        if y > bottom: bottom = y
    if left <= right and top <= bottom:
        return (left, top, right, bottom)
    return None

# 1. Process Light Banner
bbox_light = get_light_text_bbox(banner_light_raw)
if bbox_light:
    l, t, r, b = bbox_light
    print("Light text bbox:", bbox_light)
    padding_x = 20
    padding_y = 15
    l_pad = max(0, l - padding_x)
    t_pad = max(0, t - padding_y)
    r_pad = min(width2 // 2, r + padding_x)
    b_pad = min(height2, b + padding_y)
    cropped = banner_light_raw.crop((l_pad, t_pad, r_pad, b_pad))
    cropped.save(os.path.join(images_dir, "logo-banner-light.png"))
    print("Saved light banner:", cropped.size)

# 2. Process Dark Banner
bbox_dark = get_dark_text_bbox(banner_dark_raw)
if bbox_dark:
    l, t, r, b = bbox_dark
    print("Dark text bbox:", bbox_dark)
    padding_x = 20
    padding_y = 15
    l_pad = max(0, l - padding_x)
    t_pad = max(0, t - padding_y)
    r_pad = min(width2 // 2, r + padding_x)
    b_pad = min(height2, b + padding_y)
    cropped = banner_dark_raw.crop((l_pad, t_pad, r_pad, b_pad))
    cropped.save(os.path.join(images_dir, "logo-banner-dark.png"))
    print("Saved dark banner:", cropped.size)
