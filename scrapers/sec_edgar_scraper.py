#!/usr/bin/env python3
"""
SEC EDGAR Bulk Data Scraper
Downloads SEC filings, enforcement actions, and company data
Data source: https://www.sec.gov/
"""

import requests
import json
import time
from datetime import datetime
from pathlib import Path

class SECEdgarScraper:
    def __init__(self):
        self.base_url = "https://data.sec.gov"
        self.data_dir = Path("/home/user/cite-craft-pro/data/sec_edgar")
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.headers = {
            'User-Agent': 'CiteCraft Pro Legal Research Bot contact@example.com',
            'Accept-Encoding': 'gzip, deflate',
            'Host': 'data.sec.gov'
        }

    def scrape_company_tickers(self):
        """Download company ticker to CIK mapping"""
        print(f"[SEC EDGAR] Scraping company tickers...")

        url = f"{self.base_url}/files/company_tickers.json"

        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            data = response.json()

            output_file = self.data_dir / "company_tickers.json"
            with open(output_file, 'w') as f:
                json.dump(data, f, indent=2)

            print(f"[SEC EDGAR] Saved {len(data)} company tickers to {output_file}")
            return data

        except Exception as e:
            print(f"[SEC EDGAR] Error: {e}")
            return {}

    def scrape_company_submissions(self, cik_list):
        """Download submission history for companies"""
        print(f"[SEC EDGAR] Scraping company submissions...")

        submissions = {}

        for i, cik in enumerate(cik_list[:100]):  # Limit to first 100
            if i % 10 == 0:
                print(f"  Processing company {i+1}/{min(100, len(cik_list))}...")

            cik_padded = str(cik).zfill(10)
            url = f"{self.base_url}/submissions/CIK{cik_padded}.json"

            try:
                response = requests.get(url, headers=self.headers)
                response.raise_for_status()
                data = response.json()

                submissions[cik] = data
                time.sleep(0.1)  # SEC rate limit: 10 requests per second

            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 404:
                    continue
                print(f"    Error for CIK {cik}: {e}")
                time.sleep(1)
            except Exception as e:
                print(f"    Error for CIK {cik}: {e}")
                continue

        output_file = self.data_dir / f"submissions_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w') as f:
            json.dump(submissions, f, indent=2)

        print(f"[SEC EDGAR] Saved {len(submissions)} company submissions to {output_file}")
        return submissions

    def scrape_mutual_fund_data(self):
        """Download mutual fund series and class data"""
        print(f"[SEC EDGAR] Scraping mutual fund data...")

        url = f"{self.base_url}/files/company_tickers_mf.json"

        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            data = response.json()

            output_file = self.data_dir / "mutual_funds.json"
            with open(output_file, 'w') as f:
                json.dump(data, f, indent=2)

            print(f"[SEC EDGAR] Saved mutual fund data to {output_file}")
            return data

        except Exception as e:
            print(f"[SEC EDGAR] Error: {e}")
            return {}

if __name__ == "__main__":
    scraper = SECEdgarScraper()

    # Scrape company tickers
    tickers = scraper.scrape_company_tickers()

    # Get CIK list from tickers
    if tickers:
        cik_list = [company['cik_str'] for company in tickers.values()]
        scraper.scrape_company_submissions(cik_list)

    # Scrape mutual funds
    scraper.scrape_mutual_fund_data()

    print("[SEC EDGAR] Scraping complete!")
