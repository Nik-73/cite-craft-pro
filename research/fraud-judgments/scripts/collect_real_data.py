"""
Real Data Collection from eCourts India
Uses the ecourts CLI tool to fetch actual Delhi fraud cases
"""

import subprocess
import json
import os
import time
from datetime import datetime

class EcourtsDataCollector:
    """Collects real case data from eCourts India"""

    # Delhi court codes
    DELHI_STATE_CODE = "3"

    # Delhi courts
    DELHI_COURTS = {
        "1": "Delhi High Court",
        "2": "Tis Hazari District Court",
        "3": "Rohini District Court",
        "4": "Dwarka District Court",
        "5": "Saket District Court",
        "6": "Karkardooma District Court",
        "7": "Patiala House Court"
    }

    # Fraud-related IPC sections
    FRAUD_IPC_SECTIONS = {
        "420": "Cheating and dishonestly inducing delivery of property",
        "406": "Criminal breach of trust",
        "467": "Forgery of valuable security",
        "468": "Forgery for purpose of cheating",
        "471": "Using forged document as genuine",
        "120B": "Criminal conspiracy"
    }

    def __init__(self, output_dir="/home/user/cite-craft-pro/research/fraud-judgments/real-data"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def run_ecourts_command(self, cmd):
        """Run ecourts CLI command"""
        try:
            result = subprocess.run(
                cmd,
                shell=True,
                capture_output=True,
                text=True,
                timeout=60
            )
            return result.stdout, result.stderr, result.returncode
        except subprocess.TimeoutExpired:
            return None, "Command timed out", 1
        except Exception as e:
            return None, str(e), 1

    def get_case_types(self, court_code):
        """Get case types for a Delhi court"""
        print(f"Fetching case types for court {court_code}...")
        cmd = f"ecourts get-case-types --state-code {self.DELHI_STATE_CODE} --court-code {court_code}"
        stdout, stderr, returncode = self.run_ecourts_command(cmd)

        if returncode == 0:
            print(f"✓ Retrieved case types for {self.DELHI_COURTS.get(court_code, f'Court {court_code}')}")
            return stdout
        else:
            print(f"✗ Error: {stderr}")
            return None

    def search_cases_by_act(self, court_code, act_type, year, status="Disposed"):
        """Search for cases by IPC act"""
        print(f"Searching {status} cases for Act {act_type} in year {year}...")
        cmd = f"ecourts get-cases --state-code {self.DELHI_STATE_CODE} --court-code {court_code} --act-type {act_type} --year {year} --status {status}"

        stdout, stderr, returncode = self.run_ecourts_command(cmd)

        if returncode == 0 and stdout:
            print(f"✓ Found cases for Act {act_type}")
            return stdout
        else:
            print(f"- No cases or error for Act {act_type}: {stderr}")
            return None

    def collect_delhi_fraud_cases(self, years_range=range(2020, 2025)):
        """Collect fraud cases from Delhi courts"""
        print("="*70)
        print("REAL DATA COLLECTION FROM eCOURTS INDIA")
        print("="*70)
        print(f"Target: Delhi fraud cases (IPC 420, 406, etc.)")
        print(f"Years: {list(years_range)}")
        print(f"Status: Disposed (including acquittals)")
        print("="*70 + "\n")

        all_cases = []

        # Try each Delhi court
        for court_code, court_name in list(self.DELHI_COURTS.items())[:3]:  # Start with first 3 courts
            print(f"\n📍 {court_name} (Code: {court_code})")
            print("-"*70)

            # Get case types first
            case_types = self.get_case_types(court_code)

            # Search for fraud cases by year
            for year in years_range:
                print(f"\n  Year: {year}")

                # Try searching by IPC section
                for ipc_section, description in self.FRAUD_IPC_SECTIONS.items():
                    print(f"    Searching IPC {ipc_section} ({description[:30]}...)")

                    cases = self.search_cases_by_act(
                        court_code=court_code,
                        act_type=ipc_section,
                        year=year,
                        status="Disposed"
                    )

                    if cases:
                        # Parse and store cases
                        case_data = {
                            'court_code': court_code,
                            'court_name': court_name,
                            'year': year,
                            'ipc_section': ipc_section,
                            'description': description,
                            'cases': cases,
                            'fetched_at': datetime.now().isoformat()
                        }
                        all_cases.append(case_data)

                        # Save incrementally
                        filename = f"{self.output_dir}/cases_{court_code}_{ipc_section}_{year}.txt"
                        with open(filename, 'w') as f:
                            f.write(cases)
                        print(f"      ✓ Saved to {filename}")

                    time.sleep(1)  # Be respectful

        # Save summary
        summary = {
            'total_searches': len(all_cases),
            'courts_searched': list(self.DELHI_COURTS.keys())[:3],
            'years': list(years_range),
            'ipc_sections': list(self.FRAUD_IPC_SECTIONS.keys()),
            'timestamp': datetime.now().isoformat()
        }

        with open(f"{self.output_dir}/collection_summary.json", 'w') as f:
            json.dump(summary, f, indent=2)

        print("\n" + "="*70)
        print(f"Collection complete! Check {self.output_dir}/ for data files")
        print("="*70)

        return all_cases

    def get_orders_for_case(self, case_number, court_code, year):
        """Get orders/judgments for a specific case"""
        cmd = f"ecourts get-orders --case-number {case_number} --state-code {self.DELHI_STATE_CODE} --court-code {court_code} --year {year}"
        stdout, stderr, returncode = self.run_ecourts_command(cmd)

        if returncode == 0:
            return stdout
        return None


def main():
    """Main execution"""
    print("\n🇮🇳 Real Delhi Fraud Cases Data Collection")
    print("Using eCourts India official data\n")

    collector = EcourtsDataCollector()

    # Collect data for recent years
    cases = collector.collect_delhi_fraud_cases(years_range=range(2022, 2025))

    print(f"\n✅ Data collection complete!")
    print(f"Check: research/fraud-judgments/real-data/")


if __name__ == "__main__":
    main()
