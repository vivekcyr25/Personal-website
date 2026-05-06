#!/usr/bin/env python3
import subprocess
import sys
import os

os.chdir("C:\\Users\\hp\\Desktop\\personal website")

try:
    # Add all files
    print("📦 Adding files to git...")
    subprocess.run(["git", "add", "."], check=True)
    
    # Commit changes
    print("📝 Committing changes...")
    subprocess.run([
        "git", "commit", "-m", 
        "Update personal website - Deploy to GitHub Pages\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
    ], check=True)
    
    # Push to GitHub
    print("🚀 Pushing to GitHub...")
    subprocess.run(["git", "push", "origin", "main"], check=True)
    
    # Get remote URL
    result = subprocess.run(["git", "config", "--get", "remote.origin.url"], 
                          capture_output=True, text=True, check=True)
    remote_url = result.stdout.strip()
    repo_name = remote_url.split('/')[-1].replace('.git', '')
    username = remote_url.split('/')[-2]
    
    print("\n✅ Successfully pushed to GitHub!")
    print(f"\n📍 Your GitHub Pages URL: https://{username}.github.io/{repo_name}/")
    print(f"\n⚙️  To enable GitHub Pages:")
    print(f"1. Go to: https://github.com/{username}/{repo_name}/settings/pages")
    print(f"2. Select 'main' branch")
    print(f"3. Select '/(root)' folder")
    print(f"4. Click Save")
    print(f"\n✨ Your website will be live at: https://{username}.github.io/{repo_name}/")
    
except subprocess.CalledProcessError as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Unexpected error: {e}")
    sys.exit(1)
