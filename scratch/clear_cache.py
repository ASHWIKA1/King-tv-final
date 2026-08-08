import os
import re

workspace_dir = r"c:\Users\vishal AV\Downloads\king"
css_path = os.path.join(workspace_dir, "css", "styles.css")
sw_path = os.path.join(workspace_dir, "sw.js")

# 1. Update css/styles.css to hide the header logo link
print("Updating styles.css...")
with open(css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

# Add logo link hiding rule if not already present
logo_hide_rule = "\n.header-main .logo-link {\n  display: none !important;\n}\n"
if ".header-main .logo-link" not in css_content:
    css_content += logo_hide_rule

with open(css_path, "w", encoding="utf-8") as f:
    f.write(css_content)

# 2. Update sw.js to increment cache version
print("Updating sw.js cache name...")
with open(sw_path, "r", encoding="utf-8") as f:
    sw_content = f.read()

# Replace v5 with v6
sw_content = sw_content.replace("'king24x7-v5'", "'king24x7-v6'")

with open(sw_path, "w", encoding="utf-8") as f:
    f.write(sw_content)

# 3. Update all HTML files with cache-busting version parameter
print("Updating HTML files with cache-busting links...")
html_files = [f for f in os.listdir(workspace_dir) if f.endswith(".html")]

for filename in html_files:
    file_path = os.path.join(workspace_dir, filename)
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace href="css/styles.css" with href="css/styles.css?v=8"
    updated_content = re.sub(
        r'href="css/styles.css(?:\?v=\d+)?"',
        'href="css/styles.css?v=8"',
        content
    )
    
    if updated_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(updated_content)
        print(f"Updated: {filename}")
    else:
        print(f"No match/already updated: {filename}")

print("Workspace cache clearing script completed successfully!")
