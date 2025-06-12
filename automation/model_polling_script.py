import requests
import os
import shutil
import subprocess
import zipfile

# Configuration
RELEASES_API = "https://api.github.com/repos/sadiksha99/Mlops_project_Azure_ML/releases/latest"
LOCAL_CLONE_PATH = "C:/Users/Lars/Documents/school/MLOps/project/repo"
MODEL_DEST_PATH = os.path.join(LOCAL_CLONE_PATH, "api", "models", "mnist-cnn")
LAST_RELEASE_FILE = os.path.join(MODEL_DEST_PATH, ".last_model_release")

def get_latest_release_tag():
    response = requests.get(RELEASES_API)
    response.raise_for_status()
    release = response.json()
    tag = release["tag_name"]

    # Should probably ensure release filename consistency in the azure repo
    asset = next((a for a in release["assets"] if a["name"] == "mnist-model-2.zip"), None)
    if not asset:
        raise RuntimeError("Model asset not found in the release.")

    asset_url = asset["browser_download_url"]
    return tag, asset_url

def download_and_extract_model(zip_url, extract_to):
    print("Downloading latest model release...")
    zip_path = "/tmp/latest_model.zip"
    with requests.get(zip_url, stream=True) as r:
        with open(zip_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
                
    if os.path.exists("/tmp/model_extract"):
        shutil.rmtree("/tmp/model_extract")
    
    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall("/tmp/model_extract")
    
    extracted_root = next(os.scandir("/tmp/model_extract")).path
            
    model_source_path = os.path.join(extracted_root, "INPUT_model_path" ,"mnist-cnn")
    if not os.path.isdir(model_source_path):
        raise RuntimeError("No model folder found in extracted release!")

    if os.path.exists(MODEL_DEST_PATH):
        shutil.rmtree(MODEL_DEST_PATH)
    shutil.copytree(model_source_path, MODEL_DEST_PATH)

def git_commit_and_push(tag):
    subprocess.run(["git", "add", "./api/models/."], cwd=LOCAL_CLONE_PATH, check=True)
    subprocess.run(["git", "commit", "-m", f"Update model to release {tag}"], cwd=LOCAL_CLONE_PATH, check=True)
    subprocess.run(["git", "push"], cwd=LOCAL_CLONE_PATH, check=True)

def main():
    try:
        latest_tag, zip_url = get_latest_release_tag()
        print(f"Latest release: {latest_tag}")

        # Check if already synced
        if os.path.exists(LAST_RELEASE_FILE):
            with open(LAST_RELEASE_FILE, "r") as f:
                last_tag = f.read().strip()
            if latest_tag == last_tag:
                print("No new release.")
                return

        # Update model
        download_and_extract_model(zip_url, MODEL_DEST_PATH)
        
        # Update release tag
        with open(LAST_RELEASE_FILE, "w") as f:
            f.write(latest_tag)

        # Git commit and push
        git_commit_and_push(latest_tag)

        print("Model updated and changes pushed.")
    except Exception as e:
        print(f"Error during update: {e}")

if __name__ == "__main__":
    main()
