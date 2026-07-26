# Workspace Agent Rules

- **Git Operations:** 
  - Never push any changes directly to GitHub (e.g., via `git push`) without explicit prior approval and confirmation from the user.
  - **Target Branch Directive:** Push code ONLY to the `test-1` branch (`git push origin HEAD:test-1` and `git push final-ssh HEAD:test-1`). DO NOT push to `main` or any other branches going forward.
  - **Hostinger Deployment:** Deploy frontend and admin builds via `python sftp_deploy.py` to Hostinger subdomain (`/public_html/king-tv`).
