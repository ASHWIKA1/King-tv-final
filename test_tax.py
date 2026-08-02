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
    print("Login failed:", e)
    exit(1)

headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}

# Add Category
cat_data = {
    "name": "Test Category",
    "nameTa": "Test Category Tamil",
    "slug": "test-category",
    "isNav": True,
    "isActive": True
}
req = urllib.request.Request(f"{base_url}/admin/taxonomy/categories", data=json.dumps(cat_data).encode('utf-8'), headers=headers, method='POST')
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        print("Created category:", response.read().decode())
except Exception as e:
    print("Failed to create category:", e.read().decode() if hasattr(e, 'read') else e)

# Fetch Nav Menus
req = urllib.request.Request(f"{base_url}/public/menus", headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        menus = json.loads(response.read().decode())
        print("Menus count:", len(menus))
        for m in menus:
            if m.get('titleEn') == 'Test Category':
                print("FOUND Test Category in Nav Menu!")
except Exception as e:
    print("Failed to get menus:", e)

