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
    dirs = []
    current = remote_path
    while current and current != "/":
        dirs.insert(0, current)
        current = os.path.dirname(current)
    
    for d in dirs:
        try:
            sftp.mkdir(d)
        except IOError:
            pass

def upload_dir_contents(sftp, local_dir, remote_dir):
    print(f"Uploading from local {local_dir} to remote {remote_dir}...")
    create_remote_dir(sftp, remote_dir)
    
    uploaded_files = 0
    for root, dirs, files in os.walk(local_dir):
        rel_path = os.path.relpath(root, local_dir)
        if rel_path == ".":
            remote_current_dir = remote_dir
        else:
            remote_current_dir = os.path.join(remote_dir, rel_path).replace("\\", "/")

        try:
            sftp.mkdir(remote_current_dir)
        except IOError:
            pass

        for file in files:
            local_file_path = os.path.join(root, file)
            remote_file_path = os.path.join(remote_current_dir, file).replace("\\", "/")
            try:
                sftp.put(local_file_path, remote_file_path)
                uploaded_files += 1
            except Exception as ex:
                print(f"  Failed: {file} -> {ex}")
    print(f"Uploaded {uploaded_files} files.")

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
    # 1. Upload React Frontend to REMOTE king-tv
    local_frontend_dist = os.path.join(local_root, "frontend", "dist")
    FRONTEND_REMOTE_DIR = "/home/u841409365/domains/test-technoprint.online/public_html/king-tv"
    upload_dir_contents(sftp, local_frontend_dist, FRONTEND_REMOTE_DIR)

    # 2. Upload React Admin Dashboard to REMOTE king-tv/admin
    local_admin_dist = os.path.join(local_root, "admin", "dist")
    ADMIN_REMOTE_DIR = "/home/u841409365/domains/test-technoprint.online/public_html/king-tv/admin"
    upload_dir_contents(sftp, local_admin_dist, ADMIN_REMOTE_DIR)

    # Upload local .htaccess rules
    try:
        sftp.put(os.path.join(local_root, ".htaccess"), FRONTEND_REMOTE_DIR + "/.htaccess")
        admin_htaccess = os.path.join(local_root, "admin", "public", ".htaccess")
        if os.path.exists(admin_htaccess):
            sftp.put(admin_htaccess, ADMIN_REMOTE_DIR + "/.htaccess")
        print("Uploaded .htaccess to both root and admin subdomains successfully.")
    except Exception as e:
        print("Failed to upload .htaccess", e)

    sftp.close()
    ssh.close()
    print("\nFull Deployment completed successfully!")

if __name__ == "__main__":
    main()
