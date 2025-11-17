#!/usr/bin/env python3
"""
Bulk Legal Data Downloader
Downloads large legal datasets from public bulk data sources
"""

import requests
import json
from datetime import datetime
from pathlib import Path
import time

class BulkDataScraper:
    def __init__(self):
        self.data_dir = Path("/home/user/cite-craft-pro/data/bulk")
        self.data_dir.mkdir(parents=True, exist_ok=True)

    def download_file(self, url, filename, chunk_size=8192):
        """Download large file with progress tracking"""
        print(f"[Bulk] Downloading {filename}...")

        try:
            response = requests.get(url, stream=True, timeout=300)
            response.raise_for_status()

            total_size = int(response.headers.get('content-length', 0))
            output_path = self.data_dir / filename

            with open(output_path, 'wb') as f:
                downloaded = 0
                for chunk in response.iter_content(chunk_size=chunk_size):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)

                        if total_size > 0 and downloaded % (1024 * 1024) == 0:  # Every MB
                            percent = (downloaded / total_size) * 100
                            print(f"    {percent:.1f}% ({downloaded // 1024 // 1024} MB)")

            print(f"[Bulk] Downloaded {filename} ({downloaded // 1024 // 1024} MB)")
            return output_path

        except Exception as e:
            print(f"[Bulk] Error downloading {filename}: {e}")
            return None

    def download_scotus_data(self):
        """Download Supreme Court Database"""
        print(f"[Bulk] Downloading SCOTUS database...")

        # SCDB Modern Database (1946-recent)
        url = "http://scdb.wustl.edu/_brickFiles/2023_01/SCDB_2023_01_justiceCentered_Citation.csv.zip"
        self.download_file(url, "scotus_justice_centered.csv.zip")

        url2 = "http://scdb.wustl.edu/_brickFiles/2023_01/SCDB_2023_01_caseCentered_Citation.csv.zip"
        self.download_file(url2, "scotus_case_centered.csv.zip")

    def download_sample_legal_data(self):
        """Download sample legal datasets"""
        print(f"[Bulk] Creating sample legal data...")

        # Create sample datasets from known public sources
        samples = {
            "sample_cases.json": [
                {
                    "case_id": "550_U.S._544",
                    "case_name": "United States v. Gonzalez-Lopez",
                    "court": "Supreme Court of the United States",
                    "year": 2007,
                    "citations": ["550 U.S. 544", "127 S. Ct. 1765"]
                },
                {
                    "case_id": "347_U.S._483",
                    "case_name": "Brown v. Board of Education",
                    "court": "Supreme Court of the United States",
                    "year": 1954,
                    "citations": ["347 U.S. 483", "74 S. Ct. 686"]
                }
            ],
            "sample_statutes.json": [
                {
                    "statute_id": "42_USC_1983",
                    "title": "Civil action for deprivation of rights",
                    "usc_title": 42,
                    "usc_section": 1983,
                    "enacted": "1871"
                }
            ],
            "sample_regulations.json": [
                {
                    "cfr_citation": "21 CFR 314.50",
                    "title": "Content and format of an application",
                    "agency": "FDA",
                    "last_updated": "2023"
                }
            ]
        }

        for filename, data in samples.items():
            output_path = self.data_dir / filename
            with open(output_path, 'w') as f:
                json.dump(data, f, indent=2)
            print(f"[Bulk] Created {filename}")

if __name__ == "__main__":
    scraper = BulkDataScraper()

    # Download sample data
    scraper.download_sample_legal_data()

    # Try to download SCOTUS data (may take time)
    try:
        scraper.download_scotus_data()
    except Exception as e:
        print(f"[Bulk] SCOTUS download failed: {e}")

    print("[Bulk Download] Scraping complete!")
