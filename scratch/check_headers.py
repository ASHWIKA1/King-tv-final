import os
import re

for f in os.listdir('.'):
    if f.endswith('.html'):
        try:
            with open(f, 'r', encoding='utf-8') as file:
                content = file.read()
                # Find content between class="header-left" and the closing div
                # We can do a simple search for <div class="header-left"> to the next </div>
                match = re.search(r'<div class="header-left">(.*?)</div>', content, re.DOTALL)
                if match:
                    print(f"{f}: {match.group(1).strip()}")
                else:
                    print(f"{f}: No header-left found")
        except Exception as e:
            print(f"Error reading {f}: {e}")
