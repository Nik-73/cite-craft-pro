#!/usr/bin/env python3
"""
Federal Register API Scraper
Scrapes federal regulations, executive orders, and notices
API: https://www.federalregister.gov/developers/documentation/api/v1
"""

import requests
import json
import time
from datetime import datetime, timedelta
from pathlib import Path

class FederalRegisterScraper:
    def __init__(self):
        self.base_url = "https://www.federalregister.gov/api/v1"
        self.data_dir = Path("/home/user/cite-craft-pro/data/federal_register")
        self.data_dir.mkdir(parents=True, exist_ok=True)

    def scrape_recent_documents(self, days=30, limit=1000):
        """Scrape recent Federal Register documents"""
        print(f"[Federal Register] Scraping documents from last {days} days...")

        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        documents = []
        page = 1

        while len(documents) < limit:
            print(f"  Fetching page {page}...")

            params = {
                'conditions[publication_date][gte]': start_date.strftime('%Y-%m-%d'),
                'conditions[publication_date][lte]': end_date.strftime('%Y-%m-%d'),
                'per_page': 100,
                'page': page,
                'order': 'newest'
            }

            try:
                response = requests.get(f"{self.base_url}/documents.json", params=params)
                response.raise_for_status()
                data = response.json()

                if not data.get('results'):
                    break

                documents.extend(data['results'])
                print(f"    Retrieved {len(data['results'])} documents")

                if data.get('count', 0) <= len(documents):
                    break

                page += 1
                time.sleep(0.5)

            except Exception as e:
                print(f"  Error: {e}")
                break

        output_file = self.data_dir / f"documents_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w') as f:
            json.dump(documents, f, indent=2)

        print(f"[Federal Register] Saved {len(documents)} documents to {output_file}")
        return documents

    def scrape_agencies(self):
        """Scrape federal agencies list"""
        print(f"[Federal Register] Scraping agencies...")

        try:
            response = requests.get(f"{self.base_url}/agencies")
            response.raise_for_status()
            agencies = response.json()

            output_file = self.data_dir / "agencies.json"
            with open(output_file, 'w') as f:
                json.dump(agencies, f, indent=2)

            print(f"[Federal Register] Saved agencies to {output_file}")
            return agencies

        except Exception as e:
            print(f"[Federal Register] Error: {e}")
            return []

    def scrape_by_type(self, doc_type='RULE', limit=500):
        """Scrape documents by type (RULE, PRORULE, NOTICE, PRESDOCU)"""
        print(f"[Federal Register] Scraping {doc_type} documents...")

        documents = []
        page = 1

        while len(documents) < limit:
            print(f"  Fetching page {page}...")

            params = {
                'conditions[type][]': doc_type,
                'per_page': 100,
                'page': page,
                'order': 'newest'
            }

            try:
                response = requests.get(f"{self.base_url}/documents.json", params=params)
                response.raise_for_status()
                data = response.json()

                if not data.get('results'):
                    break

                documents.extend(data['results'])

                if data.get('count', 0) <= len(documents):
                    break

                page += 1
                time.sleep(0.5)

            except Exception as e:
                print(f"  Error: {e}")
                break

        output_file = self.data_dir / f"{doc_type.lower()}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w') as f:
            json.dump(documents, f, indent=2)

        print(f"[Federal Register] Saved {len(documents)} {doc_type} documents to {output_file}")
        return documents

if __name__ == "__main__":
    scraper = FederalRegisterScraper()
    scraper.scrape_agencies()
    scraper.scrape_recent_documents(days=90, limit=1000)
    scraper.scrape_by_type('RULE', limit=500)
    scraper.scrape_by_type('PRORULE', limit=500)
    print("[Federal Register] Scraping complete!")
