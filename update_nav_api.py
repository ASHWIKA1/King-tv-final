import urllib.request
import urllib.error
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

base_url = "http://localhost:8080/api/v1"

# 1. Login
data = json.dumps({"email": "admin@king24x7.com", "password": "admin123"}).encode('utf-8')
req = urllib.request.Request(f"{base_url}/auth/login", data=data, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        res = json.loads(response.read().decode())
        token = res.get("accessToken")
except urllib.error.URLError as e:
    print("Login failed:", e.read().decode() if hasattr(e, 'read') else str(e))
    exit(1)

headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}

# 2. Get all menus
req = urllib.request.Request(f"{base_url}/admin/menus", headers=headers)
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        menus = json.loads(response.read().decode())
except Exception as e:
    print("Failed to get menus:", e)
    menus = []

# 3. Delete all menus
for menu in menus:
    req = urllib.request.Request(f"{base_url}/admin/menus/{menu['id']}", headers=headers, method='DELETE')
    try:
        urllib.request.urlopen(req, context=ctx)
    except Exception as e:
        print(f"Failed to delete {menu['id']}:", e)

# 4. Create new menus
new_menus = [
    {"titleTa": "நம்ம ஊர்", "titleEn": "Regional", "linkUrl": "/category/our-town", "displayOrder": 1, "isActive": True},
    {"titleTa": "செய்திகள்", "titleEn": "News", "linkUrl": "/category/news", "displayOrder": 2, "isActive": True},
    {"titleTa": "வாழ்த்து", "titleEn": "Wishes", "linkUrl": "/category/wishes", "displayOrder": 3, "isActive": True},
    {"titleTa": "இரங்கல்", "titleEn": "Obituaries", "linkUrl": "/category/condolences", "displayOrder": 4, "isActive": True},
    {"titleTa": "வணிகம்", "titleEn": "Business", "linkUrl": "/category/business", "displayOrder": 5, "isActive": True},
    {"titleTa": "வேலை", "titleEn": "Jobs", "linkUrl": "/category/jobs", "displayOrder": 6, "isActive": True},
    {"titleTa": "தள்ளுபடி", "titleEn": "Classifieds", "linkUrl": "/category/classifieds", "displayOrder": 7, "isActive": True},
    {"titleTa": "வாங்க விற்க/<<", "titleEn": "Buy/Sell", "linkUrl": "/category/buy-sell", "displayOrder": 8, "isActive": True}
]

for menu in new_menus:
    data = json.dumps(menu).encode('utf-8')
    req = urllib.request.Request(f"{base_url}/admin/menus", data=data, headers=headers)
    try:
        urllib.request.urlopen(req, context=ctx)
        print(f"Created: {menu['titleEn']}")
    except Exception as e:
        print(f"Failed to create {menu['titleEn']}:", e.read().decode() if hasattr(e, 'read') else str(e))

print("Done!")
