import os
import sys
import time
import paramiko

# Read SFTP credentials securely from environment or fall back to configured parameters
HOSTNAME = os.getenv("HOSTINGER_SFTP_HOST", "193.202.45.164")
PORT = int(os.getenv("HOSTINGER_SFTP_PORT", "65002"))
USERNAME = os.getenv("HOSTINGER_SFTP_USER", "u841409365")
PASSWORD = os.getenv("HOSTINGER_SFTP_PASS", "Eash@2005")

def connect_ssh():
    hosts = [HOSTNAME, "test-technoprint.online"]
    last_err = None
    for attempt in range(1, 6):
        for host in hosts:
            try:
                print(f"Connecting to Hostinger SSH ({host}:{PORT}), attempt {attempt}...")
                ssh = paramiko.SSHClient()
                ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
                ssh.connect(hostname=host, port=PORT, username=USERNAME, password=PASSWORD, timeout=30, banner_timeout=60)
                if ssh.get_transport():
                    ssh.get_transport().set_keepalive(10)
                sftp = ssh.open_sftp()
                print("SSH & SFTP connection established!")
                return ssh, sftp
            except Exception as e:
                last_err = e
                print(f"  [Attempt {attempt} via {host} failed: {e}]")
                time.sleep(5)
    raise last_err

def create_remote_dir(sftp, remote_path):
    parts = [p for p in remote_path.split("/") if p]
    current = ""
    for part in parts:
        current += "/" + part
        try:
            sftp.mkdir(current)
        except IOError:
            pass

def upload_file_with_retry(get_sftp_fn, local_file_path, remote_file_path, retries=3):
    for attempt in range(1, retries + 1):
        try:
            sftp = get_sftp_fn()
            sftp.put(local_file_path, remote_file_path)
            return True
        except Exception as e:
            print(f"  [Attempt {attempt} failed for {os.path.basename(local_file_path)}: {e}]", end=" ", flush=True)
            time.sleep(2)
            get_sftp_fn(force_reconnect=True)
    return False

def upload_dir_contents(get_sftp_fn, local_dir, remote_dir):
    remote_dir = remote_dir.rstrip("/")
    print(f"\nUploading from {local_dir} -> {remote_dir}...")
    sftp = get_sftp_fn()
    create_remote_dir(sftp, remote_dir)
    
    uploaded_files = 0
    failed_files = 0
    for root, dirs, files in os.walk(local_dir):
        rel_path = os.path.relpath(root, local_dir).replace("\\", "/")
        remote_current_dir = remote_dir if rel_path == "." else f"{remote_dir}/{rel_path}"

        sftp = get_sftp_fn()
        create_remote_dir(sftp, remote_current_dir)

        for file in files:
            local_file_path = os.path.join(root, file)
            remote_file_path = f"{remote_current_dir}/{file}"
            print(f" -> Uploading {file} ...", end=" ", flush=True)
            if upload_file_with_retry(get_sftp_fn, local_file_path, remote_file_path):
                print("SUCCESS")
                uploaded_files += 1
            else:
                print("FAILED")
                failed_files += 1
                
    print(f"Finished: {uploaded_files} files uploaded, {failed_files} failed.")

def main():
    ssh_ref = [None]
    sftp_ref = [None]

    def get_sftp(force_reconnect=False):
        if force_reconnect or sftp_ref[0] is None or (ssh_ref[0] and not ssh_ref[0].get_transport().is_active()):
            if sftp_ref[0]:
                try: sftp_ref[0].close()
                except Exception: pass
            if ssh_ref[0]:
                try: ssh_ref[0].close()
                except Exception: pass
            ssh_ref[0], sftp_ref[0] = connect_ssh()
        return sftp_ref[0]

    get_sftp()

    local_root = os.getcwd()
    ROOT_REMOTE_DIR = "/home/u841409365/domains/test-technoprint.online/public_html/king-tv"
    ADMIN_REMOTE_DIR = "/home/u841409365/domains/test-technoprint.online/public_html/king-tv/admin"

    # 1. Upload root static files (index.html, all html, js/, css/, assets/)
    print("Uploading root static web files (index.html, js, css, assets)...")
    sftp = get_sftp()
    create_remote_dir(sftp, ROOT_REMOTE_DIR)

    # Root HTML and config files
    for item in os.listdir(local_root):
        local_path = os.path.join(local_root, item)
        if os.path.isfile(local_path) and (item.endswith(".html") or item.endswith(".json") or item.endswith(".js") or item == ".htaccess"):
            remote_path = f"{ROOT_REMOTE_DIR}/{item}"
            print(f" -> Uploading {item} ...", end=" ", flush=True)
            if upload_file_with_retry(get_sftp, local_path, remote_path):
                print("SUCCESS")
            else:
                print("FAILED")

    # Upload directories: js, css, assets
    for folder in ["js", "css", "assets"]:
        local_folder = os.path.join(local_root, folder)
        if os.path.exists(local_folder):
            upload_dir_contents(get_sftp, local_folder, f"{ROOT_REMOTE_DIR}/{folder}")

    # 2. Upload React Admin Dashboard dist to REMOTE king-tv/admin if admin/dist exists
    local_admin_dist = os.path.join(local_root, "admin", "dist")
    if os.path.exists(local_admin_dist):
        upload_dir_contents(get_sftp, local_admin_dist, ADMIN_REMOTE_DIR)
    else:
        # Upload admin directory contents if dist not built
        upload_dir_contents(get_sftp, os.path.join(local_root, "admin"), ADMIN_REMOTE_DIR)

    print("\n[SUCCESS] Deployment to Hostinger subdomain king-tv finished successfully!")

if __name__ == "__main__":
    main()

