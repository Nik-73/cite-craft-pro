"""
Indian Kanoon Fraud Judgments Scraper
Scrapes and analyzes Delhi fraud cases where perpetrators were acquitted
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from datetime import datetime
from typing import List, Dict, Optional
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('../data/scraper.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class IndianKanoonScraper:
    """Scraper for Indian Kanoon legal database"""

    BASE_URL = "https://indiankanoon.org"
    SEARCH_URL = f"{BASE_URL}/search/"

    # Common fraud-related IPC sections
    FRAUD_SECTIONS = [
        "420",  # Cheating and dishonestly inducing delivery of property
        "406",  # Criminal breach of trust
        "467",  # Forgery of valuable security
        "468",  # Forgery for purpose of cheating
        "471",  # Using as genuine a forged document
        "120B", # Criminal conspiracy
        "409",  # Criminal breach of trust by public servant
        "477A", # Falsification of accounts
        "463",  # Forgery
        "465",  # Punishment for forgery
    ]

    def __init__(self, delay: float = 2.0):
        """
        Initialize scraper

        Args:
            delay: Delay between requests in seconds to be respectful
        """
        self.delay = delay
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

    def search_cases(self,
                     sections: List[str],
                     court: str = "Delhi",
                     keywords: List[str] = None,
                     page_start: int = 0,
                     max_pages: int = 20) -> List[Dict]:
        """
        Search for cases on Indian Kanoon

        Args:
            sections: List of IPC sections
            court: Court name to filter
            keywords: Additional keywords for search
            page_start: Starting page number
            max_pages: Maximum pages to fetch

        Returns:
            List of case information dictionaries
        """
        all_cases = []

        for section in sections:
            logger.info(f"Searching for Section {section} cases in {court}")

            # Construct search query
            query_parts = [f"Section {section} IPC", court, "acquitted OR acquittal"]
            if keywords:
                query_parts.extend(keywords)

            query = " ".join(query_parts)

            for page in range(page_start, page_start + max_pages):
                try:
                    params = {
                        'formInput': query,
                        'pagenum': page
                    }

                    logger.info(f"Fetching page {page} for Section {section}")
                    response = self.session.get(self.SEARCH_URL, params=params, timeout=30)
                    response.raise_for_status()

                    soup = BeautifulSoup(response.content, 'html.parser')
                    results = soup.find_all('div', class_='result')

                    if not results:
                        logger.info(f"No more results for Section {section} at page {page}")
                        break

                    for result in results:
                        case_data = self._parse_search_result(result, section)
                        if case_data:
                            all_cases.append(case_data)

                    time.sleep(self.delay)

                except Exception as e:
                    logger.error(f"Error fetching page {page} for Section {section}: {e}")
                    continue

        logger.info(f"Total cases found: {len(all_cases)}")
        return all_cases

    def _parse_search_result(self, result_div, section: str) -> Optional[Dict]:
        """Parse a single search result"""
        try:
            # Extract title and link
            title_elem = result_div.find('a', class_='result_title')
            if not title_elem:
                return None

            title = title_elem.get_text(strip=True)
            case_url = self.BASE_URL + title_elem.get('href', '')

            # Extract snippet
            snippet_elem = result_div.find('div', class_='snippet')
            snippet = snippet_elem.get_text(strip=True) if snippet_elem else ""

            # Extract court and date info
            info_elem = result_div.find('div', class_='info_indian_kanoon')
            court_info = info_elem.get_text(strip=True) if info_elem else ""

            # Check if it's a Delhi case
            if 'Delhi' not in court_info and 'Delhi' not in title:
                return None

            # Check if it mentions acquittal
            if not any(word in snippet.lower() or word in title.lower()
                      for word in ['acquit', 'discharged', 'not guilty']):
                return None

            return {
                'title': title,
                'url': case_url,
                'snippet': snippet,
                'court_info': court_info,
                'section': section,
                'scraped_at': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error parsing result: {e}")
            return None

    def get_case_details(self, case_url: str) -> Optional[Dict]:
        """
        Fetch full case details from case page

        Args:
            case_url: URL of the case

        Returns:
            Dictionary with detailed case information
        """
        try:
            logger.info(f"Fetching case details: {case_url}")
            response = self.session.get(case_url, timeout=30)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # Extract case title
            doc_title = soup.find('h1', class_='doc_title')
            title = doc_title.get_text(strip=True) if doc_title else ""

            # Extract full judgment text
            judgment_div = soup.find('div', class_='judgments')
            if not judgment_div:
                judgment_div = soup.find('div', id='judgment')

            judgment_text = judgment_div.get_text(separator='\n', strip=True) if judgment_div else ""

            # Extract metadata
            metadata = self._extract_metadata(soup, judgment_text)

            # Analyze case details
            analysis = self._analyze_judgment(judgment_text)

            time.sleep(self.delay)

            return {
                'url': case_url,
                'title': title,
                'judgment_text': judgment_text,
                'metadata': metadata,
                'analysis': analysis,
                'fetched_at': datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Error fetching case details for {case_url}: {e}")
            return None

    def _extract_metadata(self, soup: BeautifulSoup, text: str) -> Dict:
        """Extract metadata from case page"""
        metadata = {}

        # Try to extract case number
        case_num_match = re.search(r'(?:Crl\.|Criminal|Case No\.|FIR No\.)\s*([A-Z0-9\/\-]+)', text[:2000])
        if case_num_match:
            metadata['case_number'] = case_num_match.group(1)

        # Extract date of judgment
        date_patterns = [
            r'(?:Judgment|Decided|Date).*?(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})',
            r'(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})'
        ]

        for pattern in date_patterns:
            date_match = re.search(pattern, text[:2000], re.IGNORECASE)
            if date_match:
                metadata['judgment_date'] = date_match.group(1)
                break

        # Extract court name
        court_match = re.search(r'((?:High Court|District Court|Sessions Court|Metropolitan|Additional).*?(?:Delhi|NCT))', text[:1000], re.IGNORECASE)
        if court_match:
            metadata['court'] = court_match.group(1).strip()

        # Extract judge names
        judge_pattern = r'(?:Hon\'ble|HONOURABLE|Justice|J\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)'
        judges = re.findall(judge_pattern, text[:1500])
        if judges:
            metadata['judges'] = list(set(judges[:3]))  # Limit to 3 unique names

        return metadata

    def _analyze_judgment(self, text: str) -> Dict:
        """Analyze judgment text for key information"""
        analysis = {
            'provisions_invoked': [],
            'prosecution_arguments': [],
            'defense_arguments': [],
            'duration_indicators': {},
            'outcome': ''
        }

        # Extract IPC sections mentioned
        ipc_sections = re.findall(r'Section\s+(\d+[A-Z]?(?:/\d+[A-Z]?)*)\s+(?:of\s+)?(?:IPC|Indian Penal Code)', text, re.IGNORECASE)
        analysis['provisions_invoked'].extend([f"IPC {s}" for s in ipc_sections])

        # Extract other acts mentioned
        acts = re.findall(r'((?:Prevention of Corruption Act|Negotiable Instruments Act|Companies Act|Banking|IT Act)[^.]{0,50})', text, re.IGNORECASE)
        analysis['provisions_invoked'].extend(acts[:5])

        # Look for prosecution arguments section
        prosecution_section = re.search(r'(?:prosecution|case of the prosecution|prosecution contends)(.*?)(?:defence|accused|case of the accused)', text, re.IGNORECASE | re.DOTALL)
        if prosecution_section:
            prosecution_text = prosecution_section.group(1)[:1000]
            analysis['prosecution_arguments'].append(prosecution_text.strip())

        # Look for defense arguments
        defense_section = re.search(r'(?:defence|case of the accused|defence contends|submissions of the defence)(.*?)(?:analysis|discussion|findings|conclusion)', text, re.IGNORECASE | re.DOTALL)
        if defense_section:
            defense_text = defense_section.group(1)[:1000]
            analysis['defense_arguments'].append(defense_text.strip())

        # Extract filing and decision dates for duration calculation
        filing_date = re.search(r'(?:filed|instituted|lodged).*?(?:on|dated)\s+(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{1,2}\s+\w+\s+\d{4})', text[:3000], re.IGNORECASE)
        if filing_date:
            analysis['duration_indicators']['filing_date'] = filing_date.group(1)

        # Determine outcome
        if any(word in text.lower() for word in ['acquitted', 'discharged', 'not guilty', 'benefit of doubt']):
            analysis['outcome'] = 'Acquittal'

        return analysis

    def save_cases(self, cases: List[Dict], filename: str):
        """Save cases to JSON file"""
        filepath = f"../data/{filename}"
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(cases, f, ensure_ascii=False, indent=2)
        logger.info(f"Saved {len(cases)} cases to {filepath}")


def main():
    """Main execution function"""
    logger.info("Starting Indian Kanoon scraper for Delhi fraud acquittal cases")

    scraper = IndianKanoonScraper(delay=2.0)

    # Search for cases
    logger.info("Phase 1: Searching for cases")
    cases = scraper.search_cases(
        sections=scraper.FRAUD_SECTIONS,
        court="Delhi",
        keywords=["fraud", "cheating"],
        max_pages=25  # Adjust to get ~200+ cases
    )

    # Save initial search results
    scraper.save_cases(cases, 'delhi_fraud_acquittals_search.json')

    # Fetch detailed information for each case
    logger.info(f"Phase 2: Fetching detailed information for {len(cases)} cases")
    detailed_cases = []

    for i, case in enumerate(cases[:250], 1):  # Limit to first 250 to get at least 200 good ones
        logger.info(f"Processing case {i}/{min(250, len(cases))}")
        details = scraper.get_case_details(case['url'])
        if details:
            # Merge search info with detailed info
            details.update(case)
            detailed_cases.append(details)

        # Save periodically
        if i % 20 == 0:
            scraper.save_cases(detailed_cases, f'delhi_fraud_acquittals_detailed_partial_{i}.json')

    # Save final detailed results
    scraper.save_cases(detailed_cases, 'delhi_fraud_acquittals_detailed.json')
    logger.info(f"Scraping complete! Collected {len(detailed_cases)} detailed cases")


if __name__ == "__main__":
    main()
