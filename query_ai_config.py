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

req = urllib.request.Request(f"{base_url}/admin/ai-config", headers=headers)
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        print(response.read().decode())
except Exception as e:
    print("Failed to get ai config:", e.read().decode() if hasattr(e, 'read') else str(e))

