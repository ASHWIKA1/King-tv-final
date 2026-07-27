import os
import sys
import paramiko

HOSTNAME = "193.202.45.164"
PORT = 65002
USERNAME = "u841409365"
PASSWORD = "Eash@2005"

# Directories
ADMIN_REMOTE_DIR = "/home/u841409365/domains/test-technoprint.online/public_html/king-tv"
FRONTEND_REMOTE_DIR = "/home/u841409365/domains/test-technoprint.online/public_html/king-tv/kingstv"

def create_remote_dir(sftp, remote_path):
    parts = [p for p in remote_path.split("/") if p]
    current = ""
    for part in parts:
        current += "/" + part
        try:
            sftp.mkdir(current)
        except IOError:
            pass

def upload_dir_contents(sftp, local_dir, remote_dir, force_all=False):
    remote_dir = remote_dir.rstrip("/")
    print(f"Uploading from local {local_dir} to remote {remote_dir}...")
    create_remote_dir(sftp, remote_dir)
    
    uploaded_files = 0
    skipped_files = 0
    for root, dirs, files in os.walk(local_dir):
        rel_path = os.path.relpath(root, local_dir).replace("\\", "/")
        if rel_path == ".":
            remote_current_dir = remote_dir
        else:
            remote_current_dir = f"{remote_dir}/{rel_path}"

        create_remote_dir(sftp, remote_current_dir)

        for file in files:
            local_file_path = os.path.join(root, file)
            remote_file_path = f"{remote_current_dir}/{file}"
            try:
                local_stat = os.stat(local_file_path)
                try:
                    remote_stat = sftp.stat(remote_file_path)
                    if not force_all and remote_stat.st_size == local_stat.st_size:
                        skipped_files += 1
                        continue
                except IOError:
                    pass

                sftp.put(local_file_path, remote_file_path)
                uploaded_files += 1
            except Exception as ex:
                print(f"  Failed: {file} -> {ex}")
    print(f"Uploaded {uploaded_files} modified/new files ({skipped_files} unchanged files skipped).")

def main():
    print("Connecting to remote server via SSH/SFTP...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        ssh.connect(hostname=HOSTNAME, port=PORT, username=USERNAME, password=PASSWORD, timeout=30, banner_timeout=60)
        print("SSH Connection successful!")
        sftp = ssh.open_sftp()
        print("SFTP Session started!")
    except Exception as e:
        print(f"Connection failed: {e}")
        sys.exit(1)

    local_root = os.getcwd()
    ROOT_REMOTE_DIR = "/home/u841409365/domains/test-technoprint.online/public_html/king-tv"
    ADMIN_REMOTE_DIR = "/home/u841409365/domains/test-technoprint.online/public_html/king-tv/admin"

    # Clean up any misplaced backslash files from public_html
    pub_dir = "/home/u841409365/domains/test-technoprint.online/public_html"
    try:
        for f in sftp.listdir(pub_dir):
            if "\\" in f:
                try:
                    sftp.remove(f"{pub_dir}/{f}")
                except Exception:
                    pass
    except Exception:
        pass

    # 1. Upload React Frontend to REMOTE king-tv root
    local_frontend_dist = os.path.join(local_root, "frontend", "dist")
    upload_dir_contents(sftp, local_frontend_dist, ROOT_REMOTE_DIR)

    # 2. Upload React Admin Dashboard to REMOTE king-tv/admin
    local_admin_dist = os.path.join(local_root, "admin", "dist")
    upload_dir_contents(sftp, local_admin_dist, ADMIN_REMOTE_DIR)

    # Upload local .htaccess rules
    try:
        if os.path.exists(os.path.join(local_root, ".htaccess")):
            sftp.put(os.path.join(local_root, ".htaccess"), ROOT_REMOTE_DIR + "/.htaccess")
            sftp.put(os.path.join(local_root, ".htaccess"), ADMIN_REMOTE_DIR + "/.htaccess")
            print("Uploaded .htaccess to both subdomains.")
    except Exception as e:
        print("Failed to upload .htaccess", e)

    sftp.close()
    ssh.close()
    print("\nFull Deployment completed successfully!")

if __name__ == "__main__":
    main()
