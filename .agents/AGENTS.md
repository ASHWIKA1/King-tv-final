# Workspace Agent Rules

- **Git Operations:** 
  - Never push any changes directly to GitHub (e.g., via `git push`) without explicit prior approval and confirmation from the user.
  - **Target Branch Directive:** Push code to the `main` branch (`git push origin HEAD:main`).
  - **Hostinger Deployment:** Deploy frontend and admin builds via `python sftp_deploy.py` to Hostinger subdomain (`/public_html/king-tv`).
