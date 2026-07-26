# -*- coding: utf-8 -*-
import os

file_path = r"c:\Users\vishal AV\Downloads\king\frontend\src\pages\ArticleDetail.jsx"

with open(file_path, 'rb') as f:
    content = f.read()

lines = content.split(b'\n')

# We want to remove lines 313 to 355 inclusive (0-indexed 312 to 354).
# And we want to modify the new loadData definition at line 356 (0-indexed 355)
# to define fallbackArticle.

# Let's inspect the target lines to be 100% sure.
target_line_start = lines[312] # b'  const loadData = () => {'
target_line_end = lines[354]   # b'  };'

print("Start line of deleted block:", repr(target_line_start))
print("End line of deleted block:", repr(target_line_end))

# Slice out the lines
new_lines = lines[:312] + lines[355:]

# Now modify the new loadData at index 312 (which was index 355 originally)
# Originally index 355 is b'  const loadData = () => {'
# Let's verify:
print("New index 312:", repr(new_lines[312]))

# We want to replace b'  const loadData = () => {' with:
# b'  const loadData = () => {\n    const idKey = String(id).startsWith(\'demo-\') ? id : `demo-${id}`;\n    const fallbackArticle = allFallbackArticles.find(art => art.id === idKey) || allFallbackArticles[0];'
replacement = (
    b'  const loadData = () => {\n'
    b'    const idKey = String(id).startsWith(\'demo-\') ? id : `demo-${id}`;\n'
    b'    const fallbackArticle = allFallbackArticles.find(art => art.id === idKey) || allFallbackArticles[0];'
)
new_lines[312] = replacement

# Join and write back
new_content = b'\n'.join(new_lines)
with open(file_path, 'wb') as f:
    f.write(new_content)

print("File fixed successfully!")
