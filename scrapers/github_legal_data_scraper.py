#!/usr/bin/env python3
"""
GitHub Legal Data Repository Scraper
Downloads open legal datasets from GitHub repositories
"""

import requests
import json
import time
from datetime import datetime
from pathlib import Path
import zipfile
import io

class GitHubLegalDataScraper:
    def __init__(self):
        self.data_dir = Path("/home/user/cite-craft-pro/data/github_legal")
        self.data_dir.mkdir(parents=True, exist_ok=True)

    def download_repo_data(self, repo_url, dataset_name):
        """Download data files from a GitHub repository"""
        print(f"[GitHub] Downloading {dataset_name}...")

        try:
            # Convert GitHub URL to raw content URL or API URL
            if 'github.com' in repo_url:
                # Try to get repository info via API
                parts = repo_url.replace('https://github.com/', '').split('/')
                if len(parts) >= 2:
                    owner, repo = parts[0], parts[1]
                    api_url = f"https://api.github.com/repos/{owner}/{repo}/contents"

                    response = requests.get(api_url)
                    if response.status_code == 200:
                        files = response.json()

                        # Download data files (CSV, JSON, etc.)
                        data_files = [f for f in files if isinstance(f, dict) and
                                      any(f.get('name', '').endswith(ext) for ext in ['.csv', '.json', '.txt', '.xml'])]

                        downloaded = []
                        for file_info in data_files[:10]:  # Limit to 10 files
                            file_url = file_info.get('download_url')
                            if file_url:
                                try:
                                    file_response = requests.get(file_url)
                                    file_response.raise_for_status()

                                    output_path = self.data_dir / dataset_name / file_info['name']
                                    output_path.parent.mkdir(parents=True, exist_ok=True)

                                    with open(output_path, 'wb') as f:
                                        f.write(file_response.content)

                                    downloaded.append(file_info['name'])
                                    print(f"    Downloaded: {file_info['name']}")
                                    time.sleep(0.5)

                                except Exception as e:
                                    print(f"    Error downloading {file_info['name']}: {e}")

                        print(f"[GitHub] Downloaded {len(downloaded)} files from {dataset_name}")
                        return downloaded

        except Exception as e:
            print(f"[GitHub] Error downloading {dataset_name}: {e}")
            return []

    def scrape_legal_ml_datasets(self):
        """Download legal ML datasets from neelguha/legal-ml-datasets"""
        print(f"[GitHub] Scraping legal-ml-datasets repo...")

        repo_url = "https://github.com/neelguha/legal-ml-datasets"
        return self.download_repo_data(repo_url, "legal-ml-datasets")

    def scrape_awesome_legal_data(self):
        """Download awesome-legal-data references"""
        print(f"[GitHub] Scraping awesome-legal-data repo...")

        repo_url = "https://github.com/openlegaldata/awesome-legal-data"
        return self.download_repo_data(repo_url, "awesome-legal-data")

    def scrape_cuad_dataset(self):
        """Download CUAD contract dataset metadata"""
        print(f"[GitHub] Scraping CUAD dataset...")

        repo_url = "https://github.com/TheAtticusProject/cuad"
        return self.download_repo_data(repo_url, "cuad")

if __name__ == "__main__":
    scraper = GitHubLegalDataScraper()

    scraper.scrape_legal_ml_datasets()
    scraper.scrape_awesome_legal_data()
    scraper.scrape_cuad_dataset()

    print("[GitHub Legal Data] Scraping complete!")
