#!/usr/bin/env python3
"""
CanLII Scraper
Scrapes Canadian legal decisions from CanLII
Website: https://www.canlii.org/
"""

import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime
from pathlib import Path
import re

class CanLIIScraper:
    def __init__(self):
        self.base_url = "https://www.canlii.org"
        self.data_dir = Path("/home/user/cite-craft-pro/data/canlii")
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Legal Research Bot) CiteCraftPro/1.0'
        })

    def scrape_recent_decisions(self, jurisdiction='ca', limit=100):
        """Scrape recent decisions from CanLII"""
        print(f"[CanLII] Scraping recent decisions for {jurisdiction}...")

        decisions = []

        # Browse recent decisions page
        url = f"{self.base_url}/en/{jurisdiction}/recent_decisions.html"

        try:
            response = self.session.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            # Find decision links
            decision_links = soup.find_all('a', href=re.compile(r'/en/.*/doc/'))

            print(f"  Found {len(decision_links)} decision links")

            for i, link in enumerate(decision_links[:limit]):
                if i % 10 == 0:
                    print(f"    Processing decision {i+1}/{min(limit, len(decision_links))}...")

                try:
                    decision_url = self.base_url + link['href']
                    decision_data = self.scrape_decision_page(decision_url)

                    if decision_data:
                        decisions.append(decision_data)

                    time.sleep(2)  # Respectful rate limiting

                except Exception as e:
                    print(f"    Error scraping decision: {e}")
                    continue

            # Save data
            output_file = self.data_dir / f"decisions_{jurisdiction}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(output_file, 'w') as f:
                json.dump(decisions, f, indent=2)

            print(f"[CanLII] Saved {len(decisions)} decisions to {output_file}")
            return decisions

        except Exception as e:
            print(f"[CanLII] Error: {e}")
            return []

    def scrape_decision_page(self, url):
        """Scrape individual decision page"""
        try:
            response = self.session.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            # Extract metadata
            data = {
                'url': url,
                'scraped_at': datetime.now().isoformat()
            }

            # Title
            title_elem = soup.find('h1', class_='documentTitle')
            if title_elem:
                data['title'] = title_elem.text.strip()

            # Citation
            citation_elem = soup.find('span', class_='citation')
            if citation_elem:
                data['citation'] = citation_elem.text.strip()

            # Date
            date_elem = soup.find('span', class_='date')
            if date_elem:
                data['date'] = date_elem.text.strip()

            # Court
            court_elem = soup.find('span', class_='court')
            if court_elem:
                data['court'] = court_elem.text.strip()

            # Decision text
            decision_text = soup.find('div', class_='documentContent')
            if decision_text:
                data['content'] = decision_text.get_text(strip=True, separator='\n')

            return data

        except Exception as e:
            print(f"    Error parsing decision page: {e}")
            return None

    def scrape_jurisdictions(self):
        """Get list of all CanLII jurisdictions"""
        print(f"[CanLII] Scraping jurisdictions...")

        jurisdictions = [
            {'code': 'ca', 'name': 'Canada (Federal)'},
            {'code': 'on', 'name': 'Ontario'},
            {'code': 'qc', 'name': 'Quebec'},
            {'code': 'bc', 'name': 'British Columbia'},
            {'code': 'ab', 'name': 'Alberta'},
            {'code': 'sk', 'name': 'Saskatchewan'},
            {'code': 'mb', 'name': 'Manitoba'},
            {'code': 'nb', 'name': 'New Brunswick'},
            {'code': 'ns', 'name': 'Nova Scotia'},
            {'code': 'pe', 'name': 'Prince Edward Island'},
            {'code': 'nl', 'name': 'Newfoundland and Labrador'},
            {'code': 'nt', 'name': 'Northwest Territories'},
            {'code': 'nu', 'name': 'Nunavut'},
            {'code': 'yt', 'name': 'Yukon'}
        ]

        output_file = self.data_dir / "jurisdictions.json"
        with open(output_file, 'w') as f:
            json.dump(jurisdictions, f, indent=2)

        print(f"[CanLII] Saved {len(jurisdictions)} jurisdictions")
        return jurisdictions

if __name__ == "__main__":
    scraper = CanLIIScraper()
    scraper.scrape_jurisdictions()

    # Scrape federal decisions
    scraper.scrape_recent_decisions('ca', limit=50)

    # Scrape Ontario decisions
    scraper.scrape_recent_decisions('on', limit=50)

    print("[CanLII] Scraping complete!")
