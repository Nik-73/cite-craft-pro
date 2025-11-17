#!/usr/bin/env python3
"""
CourtListener API Scraper
Scrapes opinions, dockets, and citation data from Free Law Project
API: https://www.courtlistener.com/help/api/rest/
"""

import requests
import json
import time
from datetime import datetime, timedelta
from pathlib import Path

class CourtListenerScraper:
    def __init__(self):
        self.base_url = "https://www.courtlistener.com/api/rest/v3"
        self.data_dir = Path("/home/user/cite-craft-pro/data/courtlistener")
        self.data_dir.mkdir(parents=True, exist_ok=True)

    def scrape_opinions(self, limit=1000):
        """Scrape recent court opinions"""
        print(f"[CourtListener] Scraping opinions...")

        opinions = []
        url = f"{self.base_url}/opinions/"
        params = {
            'order_by': '-date_filed',
            'page_size': 100
        }

        page = 1
        while len(opinions) < limit:
            print(f"  Fetching page {page}...")
            try:
                response = requests.get(url, params=params)
                response.raise_for_status()
                data = response.json()

                if not data.get('results'):
                    break

                opinions.extend(data['results'])

                if not data.get('next'):
                    break

                url = data['next']
                page += 1
                time.sleep(1)  # Rate limiting

            except Exception as e:
                print(f"  Error: {e}")
                break

        # Save data
        output_file = self.data_dir / f"opinions_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w') as f:
            json.dump(opinions, f, indent=2)

        print(f"[CourtListener] Saved {len(opinions)} opinions to {output_file}")
        return opinions

    def scrape_courts(self):
        """Scrape court metadata"""
        print(f"[CourtListener] Scraping courts database...")

        url = f"{self.base_url}/courts/"
        params = {'page_size': 500}

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            courts = response.json()['results']

            output_file = self.data_dir / "courts.json"
            with open(output_file, 'w') as f:
                json.dump(courts, f, indent=2)

            print(f"[CourtListener] Saved {len(courts)} courts to {output_file}")
            return courts

        except Exception as e:
            print(f"[CourtListener] Error scraping courts: {e}")
            return []

    def scrape_citations(self, limit=1000):
        """Scrape citation relationships between cases"""
        print(f"[CourtListener] Scraping citations...")

        citations = []
        url = f"{self.base_url}/opinion-citations/"
        params = {
            'page_size': 100,
            'order_by': '-id'
        }

        page = 1
        while len(citations) < limit:
            print(f"  Fetching page {page}...")
            try:
                response = requests.get(url, params=params)
                response.raise_for_status()
                data = response.json()

                if not data.get('results'):
                    break

                citations.extend(data['results'])

                if not data.get('next'):
                    break

                url = data['next']
                page += 1
                time.sleep(1)

            except Exception as e:
                print(f"  Error: {e}")
                break

        output_file = self.data_dir / f"citations_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w') as f:
            json.dump(citations, f, indent=2)

        print(f"[CourtListener] Saved {len(citations)} citations to {output_file}")
        return citations

if __name__ == "__main__":
    scraper = CourtListenerScraper()
    scraper.scrape_courts()
    scraper.scrape_opinions(limit=500)
    scraper.scrape_citations(limit=500)
    print("[CourtListener] Scraping complete!")
