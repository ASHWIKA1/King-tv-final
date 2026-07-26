import os
from PIL import Image, ImageDraw

brain_dir = r"C:\Users\vishal AV\.gemini\antigravity-ide\brain\57260b46-8b5e-4b23-bdc1-a8ff0fff4539"
workspace_dir = r"c:\Users\vishal AV\Downloads\king"
icons_dir = os.path.join(workspace_dir, "assets", "icons")

# Make sure icons directory exists
os.makedirs(icons_dir, exist_ok=True)

# Load original logo-icon source image (img1)
img1_path = os.path.join(brain_dir, "media__1782897260225.png")
if not os.path.exists(img1_path):
    print("Error: Source image not found at", img1_path)
    exit(1)

img1 = Image.open(img1_path).convert("RGBA")
width1, height1 = img1.size

# The bottom half contains the dark logo (gold logo on black rounded square background)
icon_dark_raw = img1.crop((0, height1 // 2, width1, height1))

# Find the bounding box of the rounded square (not pure white)
def get_non_white_bbox(image, threshold=40):
    w, h = image.size
    left, top, right, bottom = w, h, 0, 0
    pixels = image.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            # distance from white (255, 255, 255)
            dist = (255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2
            if dist > threshold * threshold:
                if x < left: left = x
                if y < top: top = y
                if x > right: right = x
                if y > bottom: bottom = y
    if left <= right and top <= bottom:
        return (left, top, right + 1, bottom + 1)
    return None

bbox_dark = get_non_white_bbox(icon_dark_raw)
if not bbox_dark:
    print("Could not find dark icon bounding box")
    exit(1)

l, t, r, b = bbox_dark
# Add 2px margin to ensure we don't cut the square edges
l = max(0, l - 2)
t = max(0, t - 2)
r = min(width1, r + 2)
b = min(height1 // 2, b + 2)

# Crop the dark favicon (exactly like the 4th image)
favicon_dark = icon_dark_raw.crop((l, t, r, b))
# Save it as favicon-dark.png
favicon_dark.save(os.path.join(icons_dir, "favicon-dark.png"))
print("Saved favicon-dark.png of size:", favicon_dark.size)

# Crop the light favicon source (top half) using the same bounding box
icon_light_raw = img1.crop((0, 0, width1, height1 // 2)).crop((l, t, r, b))

# The user wants the 3rd image (gold 'in' symbol on white/transparent background) but WITH curved edges in light mode.
# This means we want the gold logo on a white rounded square, with a transparent background outside the rounded square.
# Since favicon_dark is exactly a gold logo on a black rounded square, we can construct favicon_light by:
# 1. Taking the rounded square mask from favicon_dark (where pixel alpha is > 100 or not white).
# 2. Creating a new image with white background.
# 3. Pasting the gold logo onto it.
# 4. Applying the rounded square mask.
# Let's do this robustly!

# Create a clean white rounded square image of the same size
favicon_light = Image.new("RGBA", favicon_dark.size, (255, 255, 255, 255))

# We paste the gold logo from icon_light_raw onto favicon_light
# The gold logo consists of pixels that are not pure white
pixels_light_raw = icon_light_raw.load()
pixels_light = favicon_light.load()

for y in range(favicon_light.height):
    for x in range(favicon_light.width):
        r, g, b, a = pixels_light_raw[x, y]
        # If it's a gold pixel (not close to white), paste it
        dist_from_white = (255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2
        if dist_from_white > 50 * 50:
            pixels_light[x, y] = (r, g, b, 255)

# Now, we copy the transparency mask from favicon_dark.
# In favicon_dark, the pixels outside the black rounded square are transparent or pure white.
# We make any pixel that is transparent or white in favicon_dark also transparent in favicon_light.
pixels_dark = favicon_dark.load()
for y in range(favicon_light.height):
    for x in range(favicon_light.width):
        r, g, b, a = pixels_dark[x, y]
        # Outside the black rounded square, the background is white
        dist_from_white = (255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2
        if dist_from_white < 20 * 20 or a == 0:
            pixels_light[x, y] = (0, 0, 0, 0)

# Save the final light favicon
favicon_light.save(os.path.join(icons_dir, "favicon-light.png"))
print("Saved favicon-light.png of size:", favicon_light.size)

# Also let's update logo-icon-light.png and logo-icon-dark.png in the same directory to match!
favicon_light.save(os.path.join(icons_dir, "logo-icon-light.png"))
favicon_dark.save(os.path.join(icons_dir, "logo-icon-dark.png"))
print("Done processing icons!")
