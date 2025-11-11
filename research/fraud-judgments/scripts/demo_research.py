"""
Demo version of the research pipeline
Runs on a smaller dataset to demonstrate functionality quickly
"""

import os
import sys
import logging
from datetime import datetime

# Import the scraper and analyzer
from indian_kanoon_scraper import IndianKanoonScraper
from analyze_judgments import JudgmentAnalyzer

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def run_demo_scrape(max_cases=30):
    """Run a demo scrape with limited cases"""
    logger.info("="*70)
    logger.info("DEMO: SCRAPING SAMPLE CASES")
    logger.info(f"Target: {max_cases} cases")
    logger.info("="*70)

    scraper = IndianKanoonScraper(delay=1.5)  # Slightly faster for demo

    # Search for cases - fewer pages
    logger.info("Searching for Delhi fraud acquittal cases...")
    cases = scraper.search_cases(
        sections=['420', '406', '467'],  # Limit to 3 most common sections
        court="Delhi",
        keywords=["fraud", "acquitted"],
        max_pages=5  # Fewer pages for demo
    )

    logger.info(f"Found {len(cases)} cases from search")

    # Save search results
    scraper.save_cases(cases, 'demo_search_results.json')

    # Fetch details for limited number
    logger.info(f"Fetching detailed information for first {max_cases} cases...")
    detailed_cases = []

    for i, case in enumerate(cases[:max_cases], 1):
        logger.info(f"Processing {i}/{min(max_cases, len(cases))}: {case['title'][:60]}...")
        details = scraper.get_case_details(case['url'])

        if details:
            details.update(case)
            detailed_cases.append(details)

    logger.info(f"Successfully collected {len(detailed_cases)} detailed cases")

    # Save detailed results
    scraper.save_cases(detailed_cases, 'demo_detailed_cases.json')

    return detailed_cases


def run_demo_analysis(cases_file):
    """Run analysis on demo data"""
    logger.info("\n" + "="*70)
    logger.info("DEMO: ANALYZING CASES")
    logger.info("="*70)

    analyzer = JudgmentAnalyzer(cases_file)
    analysis, report = analyzer.save_analysis('demo_analysis')

    logger.info(f"✓ Analyzed {analysis['total_cases']} cases")

    return analysis, report


def main():
    """Main demo execution"""
    print("\n" + "="*70)
    print("DELHI FRAUD ACQUITTAL CASES - DEMO")
    print("="*70)
    print("This demo runs on a smaller dataset (~30 cases) to demonstrate")
    print("the research methodology. For full 200+ case analysis, run:")
    print("  python run_research.py")
    print("="*70 + "\n")

    start_time = datetime.now()

    # Run demo scrape
    try:
        detailed_cases = run_demo_scrape(max_cases=30)
        if len(detailed_cases) < 10:
            logger.warning(f"Only collected {len(detailed_cases)} cases. Continuing with analysis...")
    except Exception as e:
        logger.error(f"Scraping failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

    # Run analysis
    try:
        cases_file = '../data/demo_detailed_cases.json'
        analysis, report = run_demo_analysis(cases_file)
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

    # Print summary
    print("\n" + "="*70)
    print("DEMO RESULTS SUMMARY")
    print("="*70)
    print(f"Cases analyzed: {analysis['total_cases']}")
    print(f"Average duration: {analysis['temporal_analysis']['average_duration_years']} years")
    print(f"\nTop 5 IPC Sections:")
    for section, count in analysis['provisions_analysis']['most_common_ipc_sections'][:5]:
        print(f"  - {section}: {count} cases")

    print(f"\nTop 3 Acquittal Grounds:")
    for i, (ground, pct) in enumerate(list(analysis['common_acquittal_grounds']['percentage_distribution'].items())[:3], 1):
        print(f"  {i}. {ground}: {pct}")

    print(f"\nTop Defense Argument Themes:")
    for theme, count in analysis['defense_arguments']['common_themes'][:5]:
        pct = (count / analysis['total_cases']) * 100
        print(f"  - {theme.replace('_', ' ').title()}: {count} cases ({pct:.1f}%)")

    elapsed = datetime.now() - start_time
    print("\n" + "="*70)
    print(f"Demo completed in: {elapsed}")
    print("\nOutput files:")
    print("  - ../data/demo_detailed_cases.json")
    print("  - ../data/demo_analysis.json")
    print("  - ../data/demo_analysis.md")
    print("="*70 + "\n")

    # Print preview of report
    print("REPORT PREVIEW:")
    print("="*70)
    print(report[:1500])
    print("\n... (see full report in ../data/demo_analysis.md)")
    print("="*70)


if __name__ == "__main__":
    main()
