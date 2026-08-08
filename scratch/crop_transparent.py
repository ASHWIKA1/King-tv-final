import os
from PIL import Image

brain_dir = r"C:\Users\vishal AV\.gemini\antigravity-ide\brain\57260b46-8b5e-4b23-bdc1-a8ff0fff4539"
workspace_dir = r"c:\Users\vishal AV\Downloads\king"
icons_dir = os.path.join(workspace_dir, "assets", "icons")
images_dir = os.path.join(workspace_dir, "assets", "images")

# Load original images
img1 = Image.open(os.path.join(brain_dir, "media__1782897260225.png")).convert("RGB")
img2 = Image.open(os.path.join(brain_dir, "media__1782897269693.jpg")).convert("RGB")

def make_transparent_light(img, threshold=220):
    # Convert image to RGBA
    rgba = img.convert("RGBA")
    data = rgba.getdata()
    
    new_data = []
    for item in data:
        # If pixel is close to white, make it transparent
        r, g, b, a = item
        if r > threshold and g > threshold and b > threshold:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    rgba.putdata(new_data)
    return rgba

def make_transparent_dark(img, threshold=40):
    # Convert image to RGBA
    rgba = img.convert("RGBA")
    data = rgba.getdata()
    
    new_data = []
    for item in data:
        # If pixel is close to black, make it transparent
        r, g, b, a = item
        if r < threshold and g < threshold and b < threshold:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
            
    rgba.putdata(new_data)
    return rgba

# 1. Icon - Light Theme
width1, height1 = img1.size
icon_light_raw = img1.crop((0, 0, width1, height1 // 2))
# Make white background transparent
icon_light = make_transparent_light(icon_light_raw, threshold=230)
# Find bounding box of non-transparent content
bbox = icon_light.getbbox()
if bbox:
    l, t, r, b = bbox
    # Add small padding
    icon_light = icon_light.crop((max(0, l - 10), max(0, t - 10), min(width1, r + 10), min(height1 // 2, b + 10)))
icon_light.save(os.path.join(icons_dir, "logo-icon-light.png"))
print("Saved transparent logo-icon-light.png:", icon_light.size)

# 2. Icon - Dark Theme
icon_dark_raw = img1.crop((0, height1 // 2, width1, height1))
# The dark icon has a black rounded square. We want to make the white background outside the square transparent,
# but keep the black rounded square intact.
# The white background is at the corners.
icon_dark = make_transparent_light(icon_dark_raw, threshold=240)
# Find bounding box of the rounded square
bbox = icon_dark.getbbox()
if bbox:
    l, t, r, b = bbox
    icon_dark = icon_dark.crop((max(0, l - 2), max(0, t - 2), min(width1, r + 2), min(height1 // 2, b + 2)))
icon_dark.save(os.path.join(icons_dir, "logo-icon-dark.png"))
print("Saved transparent logo-icon-dark.png:", icon_dark.size)

# 3. Banner - Light Theme
width2, height2 = img2.size
banner_light_raw = img2.crop((0, 0, width2 // 2, height2))
# Remove outer 15 pixels to clear the border
banner_light_raw = banner_light_raw.crop((15, 15, width2 // 2 - 15, height2 - 15))
# Make white transparent
banner_light = make_transparent_light(banner_light_raw, threshold=220)
bbox = banner_light.getbbox()
if bbox:
    l, t, r, b = bbox
    banner_light = banner_light.crop((max(0, l - 10), max(0, t - 10), min(banner_light.width, r + 10), min(banner_light.height, b + 10)))
banner_light.save(os.path.join(images_dir, "logo-banner-light.png"))
print("Saved transparent logo-banner-light.png:", banner_light.size)

# 4. Banner - Dark Theme
banner_dark_raw = img2.crop((width2 // 2, 0, width2, height2))
# Remove outer 15 pixels to clear the border
banner_dark_raw = banner_dark_raw.crop((15, 15, width2 // 2 - 15, height2 - 15))
# Make black transparent
banner_dark = make_transparent_dark(banner_dark_raw, threshold=45)
bbox = banner_dark.getbbox()
if bbox:
    l, t, r, b = bbox
    banner_dark = banner_dark.crop((max(0, l - 10), max(0, t - 10), min(banner_dark.width, r + 10), min(banner_dark.height, b + 10)))
banner_dark.save(os.path.join(images_dir, "logo-banner-dark.png"))
print("Saved transparent logo-banner-dark.png:", banner_dark.size)
