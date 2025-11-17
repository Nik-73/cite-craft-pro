#!/usr/bin/env python3
"""
Master scraper runner - executes all scrapers in parallel
"""

import subprocess
import sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

def run_scraper(scraper_path):
    """Run a single scraper script"""
    scraper_name = scraper_path.stem
    print(f"\n{'='*60}")
    print(f"Starting: {scraper_name}")
    print(f"{'='*60}\n")

    try:
        result = subprocess.run(
            [sys.executable, str(scraper_path)],
            capture_output=True,
            text=True,
            timeout=600  # 10 minute timeout per scraper
        )

        print(f"\n{scraper_name} STDOUT:\n{result.stdout}")

        if result.stderr:
            print(f"\n{scraper_name} STDERR:\n{result.stderr}")

        return {
            'scraper': scraper_name,
            'success': result.returncode == 0,
            'returncode': result.returncode,
            'output': result.stdout
        }

    except subprocess.TimeoutExpired:
        print(f"\n{scraper_name} TIMEOUT - exceeded 10 minutes")
        return {
            'scraper': scraper_name,
            'success': False,
            'error': 'timeout'
        }
    except Exception as e:
        print(f"\n{scraper_name} ERROR: {e}")
        return {
            'scraper': scraper_name,
            'success': False,
            'error': str(e)
        }

def main():
    print(f"\n{'#'*60}")
    print(f"# PUBLIC DATABASE SCRAPING - MASS EXECUTION")
    print(f"# Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'#'*60}\n")

    # Find all scraper scripts
    scrapers_dir = Path(__file__).parent
    scraper_files = [
        scrapers_dir / "courtlistener_scraper.py",
        scrapers_dir / "federal_register_scraper.py",
        scrapers_dir / "canlii_scraper.py",
    ]

    # Filter to only existing files
    scraper_files = [f for f in scraper_files if f.exists()]

    print(f"Found {len(scraper_files)} scrapers to run:\n")
    for scraper in scraper_files:
        print(f"  - {scraper.stem}")
    print()

    # Run scrapers in parallel (max 3 at a time to be respectful)
    results = []
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = {executor.submit(run_scraper, scraper): scraper for scraper in scraper_files}

        for future in as_completed(futures):
            result = future.result()
            results.append(result)

    # Print summary
    print(f"\n{'='*60}")
    print(f"SCRAPING COMPLETE - SUMMARY")
    print(f"{'='*60}\n")

    successful = [r for r in results if r['success']]
    failed = [r for r in results if not r['success']]

    print(f"Successful: {len(successful)}/{len(results)}")
    for r in successful:
        print(f"  ✓ {r['scraper']}")

    if failed:
        print(f"\nFailed: {len(failed)}/{len(results)}")
        for r in failed:
            error = r.get('error', 'Unknown error')
            print(f"  ✗ {r['scraper']} - {error}")

    print(f"\nFinished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
