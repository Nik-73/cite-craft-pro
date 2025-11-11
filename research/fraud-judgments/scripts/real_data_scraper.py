"""
Real Data Scraper for Delhi Fraud Cases
Uses judgments.ecourts.gov.in official portal with proper rate limiting
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import random
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)


class EcourtsJudgmentScraper:
    """Scraper for judgments.ecourts.gov.in"""

    BASE_URL = "https://judgments.ecourts.gov.in"
    SEARCH_URL = f"{BASE_URL}/pdfsearch/"

    def __init__(self, output_dir="./real-data"):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': self.BASE_URL
        })
        self.output_dir = output_dir
        import os
        os.makedirs(output_dir, exist_ok=True)

    def search_cases(self, keywords, court_name="Delhi", year_from=2020, year_to=2024):
        """
        Search for cases on eCourts portal

        Args:
            keywords: Search keywords (e.g., "IPC 420 acquitted")
            court_name: Court name to filter
            year_from: Start year
            year_to: End year
        """
        logger.info(f"Searching: {keywords} in {court_name} ({year_from}-{year_to})")

        search_params = {
            'freetext': keywords,
            'court_name': court_name,
            'year_from': year_from,
            'year_to': year_to
        }

        try:
            # Visit main page first to get session
            self.session.get(self.BASE_URL)
            time.sleep(2)

            # Perform search
            response = self.session.get(self.SEARCH_URL, params=search_params, timeout=30)

            if response.status_code == 200:
                return self._parse_search_results(response.content)
            else:
                logger.error(f"Search failed with status {response.status_code}")
                return []

        except Exception as e:
            logger.error(f"Search error: {e}")
            return []

    def _parse_search_results(self, html_content):
        """Parse search results page"""
        soup = BeautifulSoup(html_content, 'html.parser')
        results = []

        # Find result entries (adjust selectors based on actual page structure)
        result_divs = soup.find_all('div', class_='judgment-result')

        for div in result_divs:
            try:
                title = div.find('h3').get_text(strip=True) if div.find('h3') else ""
                link = div.find('a')['href'] if div.find('a') else ""
                snippet = div.find('p').get_text(strip=True) if div.find('p') else ""

                results.append({
                    'title': title,
                    'link': link,
                    'snippet': snippet
                })
            except:
                continue

        logger.info(f"Found {len(results)} results")
        return results

    def manual_collection_guide(self):
        """Generate guide for manual data collection"""
        guide = """
# MANUAL DATA COLLECTION GUIDE
## For Delhi Fraud Acquittal Cases

Since automated scraping faces access restrictions, here's the most reliable approach:

### Method 1: Use judgments.ecourts.gov.in Portal (Recommended)

1. **Visit**: https://judgments.ecourts.gov.in/

2. **Search Parameters**:
   - Court: Select "Delhi High Court"
   - Keywords: Try these searches (one at a time):
     * "IPC 420 acquitted"
     * "IPC 406 acquitted"
     * "fraud acquittal"
     * "cheating acquitted"
     * "criminal breach acquittal"

3. **Filters**:
   - Year Range: 2020-2024
   - Case Type: Criminal
   - Status: Disposed

4. **For Each Result**:
   - Open the judgment
   - Save PDF (Right-click → Save As)
   - Name it: `case_<number>_<IPC_section>.pdf`
   - Note metadata in Excel/Google Sheets:
     * Case number
     * Date of judgment
     * IPC sections
     * Judges
     * Outcome (Acquittal/Discharge)

5. **Target**: Collect 200-250 cases

### Method 2: Use Indian Kanoon (With Browser)

1. **Visit**: https://indiankanoon.org/

2. **Search**: "Section 420 IPC Delhi acquitted"

3. **Filter**:
   - Court: Delhi High Court
   - Document Type: Judgments
   - Date Range: Last 5 years

4. **Collect**:
   - Open each judgment
   - Copy text to Word/Text file
   - Save metadata

### Method 3: Request Bulk Data Access

Contact: Open Justice India (openjustice-in@ their domain)
- Request access to Delhi High Court dataset
- Explain research purpose
- They may provide direct access

### Processing Collected Data

Once you have 200+ cases:

1. **Organize Files**:
```
real-data/
  ├── pdfs/          # All judgment PDFs
  ├── metadata.csv   # Case details spreadsheet
  └── texts/         # Extracted text from PDFs
```

2. **Run Our Analysis**:
```bash
python analyze_collected_data.py
```

### Time Estimate

- **Manual Collection** (200 cases):
  - Finding cases: 10-15 hours
  - Saving & organizing: 5-8 hours
  - **Total**: 15-23 hours over 2-3 days

- **Automated** (if you get API access):
  - Setup: 1-2 hours
  - Running: 3-4 hours
  - **Total**: 4-6 hours

### Tips for Efficiency

1. **Use Multiple Search Terms**:
   - "IPC 420"
   - "Section 420"
   - "Cheating"
   - "Fraud"
   - "Criminal breach of trust"

2. **Filter Effectively**:
   - Always include "acquitted" or "acquittal" in search
   - Use date filters to narrow results
   - Focus on disposed cases only

3. **Batch Process**:
   - Collect 50 cases at a time
   - Run preliminary analysis
   - Adjust search strategy based on findings

4. **Quality Over Quantity**:
   - Better to have 150 well-documented cases
   - Than 300 poorly organized ones

### What To Extract From Each Case

1. **Basic Info**:
   - Case number & year
   - Court & bench
   - Date filed & date decided
   - Duration

2. **Parties**:
   - Appellant/Accused name
   - Respondent/State

3. **Legal**:
   - IPC sections invoked
   - Other acts mentioned
   - Precedents cited

4. **Arguments**:
   - Key prosecution arguments (2-3 points)
   - Key defense arguments (2-3 points)
   - Court's reasoning (2-3 points)

5. **Outcome**:
   - Acquitted/Discharged/Not guilty
   - Grounds for acquittal
   - Observations

### Using Our Analysis Tools

Once data is collected, our scripts will:
- Parse all PDFs/texts
- Extract structured information
- Identify patterns in arguments
- Calculate statistics (duration, provisions, etc.)
- Generate comprehensive research report

Run:
```bash
cd research/fraud-judgments/scripts
python analyze_collected_data.py --input ../real-data/
```

### Need Help?

The reality is:
- **Legitimate bulk data access requires time & permissions**
- **Manual collection is tedious but reliable**
- **Our analysis tools are ready once you have the data**

Best approach:
1. Start manual collection (aim for 50 cases in week 1)
2. Run preliminary analysis
3. Meanwhile, apply for API access for scaling up
        """

        output_file = f"{self.output_dir}/MANUAL_COLLECTION_GUIDE.md"
        with open(output_file, 'w') as f:
            f.write(guide)

        logger.info(f"Guide saved to: {output_file}")
        print(guide)

        return guide


def main():
    """Main execution"""
    print("\n" + "="*80)
    print("REAL DATA COLLECTION FOR DELHI FRAUD ACQUITTAL CASES")
    print("="*80 + "\n")

    scraper = EcourtsJudgmentScraper()

    print("Due to access restrictions on bulk data APIs, here are your options:\n")
    print("1. Manual collection from judgments.ecourts.gov.in (Reliable, Time: ~20 hours)")
    print("2. Apply for Indian Kanoon API access (Takes 1-2 weeks approval)")
    print("3. Use our sample dataset for methodology demonstration\n")

    # Generate manual collection guide
    scraper.manual_collection_guide()

    print("\n" + "="*80)
    print("NEXT STEPS:")
    print("="*80)
    print("1. Review: real-data/MANUAL_COLLECTION_GUIDE.md")
    print("2. Choose collection method based on your timeline")
    print("3. Our analysis tools are ready once you have data")
    print("="*80 + "\n")


if __name__ == "__main__":
    main()
