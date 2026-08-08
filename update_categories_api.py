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

# 2. Get all categories
req = urllib.request.Request(f"{base_url}/admin/taxonomy/categories", headers=headers)
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        categories = json.loads(response.read().decode())
except Exception as e:
    print("Failed to get categories:", e)
    categories = []

# 3. Delete all categories
for cat in categories:
    req = urllib.request.Request(f"{base_url}/admin/taxonomy/categories/{cat['id']}", headers=headers, method='DELETE')
    try:
        urllib.request.urlopen(req, context=ctx)
    except Exception as e:
        print(f"Failed to delete {cat['id']}:", e)

# 4. Create new ones
new_cats = [
    {"nameTa": "நம்ம ஊர்", "name": "Regional", "slug": "our-town", "isNav": True, "isActive": True, "displayOrder": 1, "color": "#1E3A8A"},
    {"nameTa": "செய்திகள்", "name": "News", "slug": "news", "isNav": True, "isActive": True, "displayOrder": 2, "color": "#EF4444"},
    {"nameTa": "வாழ்த்து", "name": "Wishes", "slug": "wishes", "isNav": True, "isActive": True, "displayOrder": 3, "color": "#10B981"},
    {"nameTa": "இரங்கல்", "name": "Obituaries", "slug": "condolences", "isNav": True, "isActive": True, "displayOrder": 4, "color": "#4B5563"},
    {"nameTa": "வணிகம்", "name": "Business", "slug": "business", "isNav": True, "isActive": True, "displayOrder": 5, "color": "#8B5CF6"},
    {"nameTa": "வேலை", "name": "Jobs", "slug": "jobs", "isNav": True, "isActive": True, "displayOrder": 6, "color": "#F59E0B"},
    {"nameTa": "தள்ளுபடி", "name": "Classifieds", "slug": "classifieds", "isNav": True, "isActive": True, "displayOrder": 7, "color": "#EC4899"},
    {"nameTa": "வாங்க விற்க/<<", "name": "Buy/Sell", "slug": "buy-sell", "isNav": True, "isActive": True, "displayOrder": 8, "color": "#06B6D4"}
]

for cat in new_cats:
    data = json.dumps(cat).encode('utf-8')
    req = urllib.request.Request(f"{base_url}/admin/taxonomy/categories", data=data, headers=headers)
    try:
        urllib.request.urlopen(req, context=ctx)
        print(f"Created: {cat['name']}")
    except Exception as e:
        print(f"Failed to create {cat['name']}:", e.read().decode() if hasattr(e, 'read') else str(e))

print("Done!")
