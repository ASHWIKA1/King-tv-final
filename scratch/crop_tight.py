import os
from PIL import Image, ImageChops

workspace_dir = r"c:\Users\vishal AV\Downloads\king"
icons_dir = os.path.join(workspace_dir, "assets", "icons")
images_dir = os.path.join(workspace_dir, "assets", "images")

def crop_tight_light(img_path):
    img = Image.open(img_path).convert("RGBA")
    # Convert to grayscale
    gray = img.convert("L")
    # Threshold: anything lighter than 230 becomes 255 (white)
    # The gold logo is darker, the grey border is light enough to become 255
    bw = gray.point(lambda x: 0 if x < 230 else 255)
    # Invert so content is white (255) on black (0) background
    inv = ImageChops.invert(bw)
    
    # Let's crop 5 pixels from edges first to remove any border line
    w, h = inv.size
    border = 10
    cropped_inv = inv.crop((border, border, w - border, h - border))
    
    bbox = cropped_inv.getbbox()
    if bbox:
        # Adjust bbox back to original image coordinates
        left = bbox[0] + border
        top = bbox[1] + border
        right = bbox[2] + border
        bottom = bbox[3] + border
        
        # Add 5px padding around the content for breathing room
        left = max(0, left - 8)
        top = max(0, top - 8)
        right = min(w, right + 8)
        bottom = min(h, bottom + 8)
        
        final_img = img.crop((left, top, right, bottom))
        final_img.save(img_path)
        print(f"Tight cropped light image saved: {img_path} (new size: {final_img.size})")

def crop_tight_dark(img_path):
    img = Image.open(img_path).convert("RGBA")
    gray = img.convert("L")
    # In dark mode, background is black (0), content is gold/light.
    # Threshold: anything darker than 40 becomes 0.
    bw = gray.point(lambda x: 255 if x > 40 else 0)
    
    # Crop 10 pixels from edges to remove border
    w, h = bw.size
    border = 10
    cropped_bw = bw.crop((border, border, w - border, h - border))
    
    bbox = cropped_bw.getbbox()
    if bbox:
        left = bbox[0] + border
        top = bbox[1] + border
        right = bbox[2] + border
        bottom = bbox[3] + border
        
        # Add 5px padding
        left = max(0, left - 8)
        top = max(0, top - 8)
        right = min(w, right + 8)
        bottom = min(h, bottom + 8)
        
        final_img = img.crop((left, top, right, bottom))
        final_img.save(img_path)
        print(f"Tight cropped dark image saved: {img_path} (new size: {final_img.size})")

# Clean icons
crop_tight_light(os.path.join(icons_dir, "logo-icon-light.png"))
crop_tight_dark(os.path.join(icons_dir, "logo-icon-dark.png"))

# Clean banners
crop_tight_light(os.path.join(images_dir, "logo-banner-light.png"))
crop_tight_dark(os.path.join(images_dir, "logo-banner-dark.png"))
