"""
Analysis script for Delhi fraud acquittal judgments
Extracts patterns, commonalities, and statistics from scraped cases
"""

import json
import re
from datetime import datetime
from collections import Counter, defaultdict
from typing import List, Dict, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class JudgmentAnalyzer:
    """Analyzer for fraud acquittal judgments"""

    def __init__(self, cases_file: str):
        """Load cases from JSON file"""
        with open(cases_file, 'r', encoding='utf-8') as f:
            self.cases = json.load(f)
        logger.info(f"Loaded {len(self.cases)} cases for analysis")

    def analyze_all(self) -> Dict[str, Any]:
        """Perform comprehensive analysis"""
        logger.info("Starting comprehensive analysis...")

        results = {
            'total_cases': len(self.cases),
            'provisions_analysis': self._analyze_provisions(),
            'prosecution_arguments': self._analyze_prosecution_arguments(),
            'defense_arguments': self._analyze_defense_arguments(),
            'temporal_analysis': self._analyze_duration(),
            'court_distribution': self._analyze_courts(),
            'common_acquittal_grounds': self._extract_acquittal_grounds(),
            'keyword_frequency': self._analyze_keywords(),
        }

        return results

    def _analyze_provisions(self) -> Dict:
        """Analyze legal provisions invoked"""
        logger.info("Analyzing legal provisions...")

        all_provisions = []
        ipc_sections = Counter()
        other_acts = Counter()

        for case in self.cases:
            provisions = case.get('analysis', {}).get('provisions_invoked', [])

            for provision in provisions:
                all_provisions.append(provision)

                if 'IPC' in provision:
                    # Extract section numbers
                    sections = re.findall(r'\d+[A-Z]?', provision)
                    for section in sections:
                        ipc_sections[f"Section {section}"] += 1
                else:
                    # Other acts
                    act_name = provision.split(',')[0].strip()
                    other_acts[act_name] += 1

        return {
            'most_common_ipc_sections': ipc_sections.most_common(15),
            'other_acts_invoked': other_acts.most_common(10),
            'total_unique_provisions': len(set(all_provisions))
        }

    def _analyze_prosecution_arguments(self) -> Dict:
        """Analyze common prosecution arguments"""
        logger.info("Analyzing prosecution arguments...")

        all_arguments = []
        argument_themes = Counter()

        # Keywords indicating different argument types
        themes = {
            'documentary_evidence': ['documents', 'evidence', 'records', 'proof', 'material'],
            'witness_testimony': ['witness', 'testimony', 'depose', 'statement', 'examined'],
            'mens_rea': ['intention', 'dishonest', 'fraudulent', 'knowledge', 'deliberately'],
            'monetary_loss': ['loss', 'amount', 'money', 'payment', 'financial'],
            'criminal_breach': ['breach', 'trust', 'fiduciary', 'misappropriate'],
            'conspiracy': ['conspiracy', 'connivance', 'collusion', 'planned'],
        }

        for case in self.cases:
            arguments = case.get('analysis', {}).get('prosecution_arguments', [])

            for arg in arguments:
                all_arguments.append(arg)
                arg_lower = arg.lower()

                # Classify by theme
                for theme, keywords in themes.items():
                    if any(keyword in arg_lower for keyword in keywords):
                        argument_themes[theme] += 1

        return {
            'total_prosecution_arguments': len(all_arguments),
            'common_themes': argument_themes.most_common(),
            'sample_arguments': [arg[:200] for arg in all_arguments[:5]]
        }

    def _analyze_defense_arguments(self) -> Dict:
        """Analyze common defense arguments"""
        logger.info("Analyzing defense arguments...")

        all_arguments = []
        argument_themes = Counter()

        # Common defense themes
        themes = {
            'lack_of_evidence': ['no evidence', 'insufficient', 'lack of', 'not proved', 'failed to prove'],
            'benefit_of_doubt': ['doubt', 'reasonable doubt', 'benefit', 'uncertainty'],
            'no_mens_rea': ['no intention', 'no dishonest', 'bona fide', 'good faith', 'innocent'],
            'procedural_lapses': ['procedure', 'investigation', 'defective', 'irregular', 'violation'],
            'civil_dispute': ['civil', 'commercial', 'contractual', 'business', 'transaction'],
            'false_implication': ['false', 'falsely', 'implicated', 'frame', 'mala fide'],
            'contradictions': ['contradict', 'inconsistent', 'discrepancy', 'variation'],
            'hostile_witnesses': ['hostile', 'turned hostile', 'resile', 'retract'],
        }

        for case in self.cases:
            arguments = case.get('analysis', {}).get('defense_arguments', [])

            for arg in arguments:
                all_arguments.append(arg)
                arg_lower = arg.lower()

                # Classify by theme
                for theme, keywords in themes.items():
                    if any(keyword in arg_lower for keyword in keywords):
                        argument_themes[theme] += 1

        return {
            'total_defense_arguments': len(all_arguments),
            'common_themes': argument_themes.most_common(),
            'sample_arguments': [arg[:200] for arg in all_arguments[:5]]
        }

    def _extract_acquittal_grounds(self) -> Dict:
        """Extract common grounds for acquittal"""
        logger.info("Extracting acquittal grounds...")

        grounds = Counter()
        ground_keywords = {
            'Benefit of Doubt': ['benefit of doubt', 'reasonable doubt', 'doubt'],
            'Insufficient Evidence': ['insufficient evidence', 'lack of evidence', 'no evidence', 'not proved'],
            'Procedural Violations': ['procedure not followed', 'investigation defective', 'irregular investigation'],
            'Civil Dispute': ['civil nature', 'civil dispute', 'commercial dispute', 'not criminal'],
            'No Mens Rea': ['no dishonest intention', 'no criminal intent', 'bona fide'],
            'Contradictions in Evidence': ['contradictions', 'inconsistent', 'discrepancies'],
            'Hostile Witnesses': ['hostile witness', 'turned hostile'],
            'Non-Examination of Key Witnesses': ['key witness not examined', 'material witness not produced'],
        }

        for case in self.cases:
            text = case.get('judgment_text', '').lower()
            snippet = case.get('snippet', '').lower()
            combined_text = text + ' ' + snippet

            for ground, keywords in ground_keywords.items():
                if any(keyword in combined_text for keyword in keywords):
                    grounds[ground] += 1

        return {
            'common_grounds': grounds.most_common(),
            'percentage_distribution': {
                ground: f"{(count/len(self.cases)*100):.1f}%"
                for ground, count in grounds.most_common()
            }
        }

    def _analyze_duration(self) -> Dict:
        """Analyze case duration"""
        logger.info("Analyzing case duration...")

        durations = []
        year_distribution = Counter()

        for case in self.cases:
            # Extract year from judgment date
            metadata = case.get('metadata', {})
            judgment_date = metadata.get('judgment_date', '')

            year_match = re.search(r'(19|20)\d{2}', judgment_date)
            if year_match:
                year = int(year_match.group(0))
                year_distribution[year] += 1

            # Try to calculate duration
            duration_info = case.get('analysis', {}).get('duration_indicators', {})
            filing_date_str = duration_info.get('filing_date', '')

            if filing_date_str and judgment_date:
                try:
                    # Simple year-based duration estimate
                    filing_year = re.search(r'(19|20)\d{2}', filing_date_str)
                    judgment_year = re.search(r'(19|20)\d{2}', judgment_date)

                    if filing_year and judgment_year:
                        duration_years = int(judgment_year.group(0)) - int(filing_year.group(0))
                        if 0 <= duration_years <= 30:  # Sanity check
                            durations.append(duration_years)
                except:
                    pass

        avg_duration = sum(durations) / len(durations) if durations else 0

        return {
            'average_duration_years': round(avg_duration, 1),
            'duration_samples': len(durations),
            'year_distribution': dict(sorted(year_distribution.most_common())),
            'min_duration': min(durations) if durations else 0,
            'max_duration': max(durations) if durations else 0,
        }

    def _analyze_courts(self) -> Dict:
        """Analyze court distribution"""
        logger.info("Analyzing court distribution...")

        courts = Counter()

        for case in self.cases:
            court_info = case.get('court_info', '')
            metadata_court = case.get('metadata', {}).get('court', '')

            court_text = court_info + ' ' + metadata_court

            # Identify court type
            if 'High Court' in court_text:
                courts['Delhi High Court'] += 1
            elif 'District' in court_text or 'Sessions' in court_text:
                courts['District/Sessions Courts'] += 1
            elif 'Metropolitan' in court_text:
                courts['Metropolitan Courts'] += 1
            else:
                courts['Other Courts'] += 1

        return {
            'court_distribution': dict(courts.most_common()),
            'percentage': {
                court: f"{(count/len(self.cases)*100):.1f}%"
                for court, count in courts.items()
            }
        }

    def _analyze_keywords(self) -> Dict:
        """Analyze keyword frequency"""
        logger.info("Analyzing keywords...")

        keywords = Counter()
        important_terms = [
            'acquitted', 'discharged', 'benefit of doubt', 'not proved',
            'false implication', 'civil dispute', 'no evidence',
            'hostile witness', 'contradiction', 'investigation',
            'dishonest intention', 'cheating', 'fraud', 'trust',
            'forgery', 'conspiracy', 'criminal breach'
        ]

        for case in self.cases:
            text = (case.get('judgment_text', '') + ' ' +
                   case.get('snippet', '')).lower()

            for term in important_terms:
                if term in text:
                    keywords[term] += 1

        return {
            'keyword_frequency': dict(keywords.most_common(20)),
            'percentage': {
                keyword: f"{(count/len(self.cases)*100):.1f}%"
                for keyword, count in keywords.most_common(20)
            }
        }

    def generate_summary_report(self) -> str:
        """Generate a human-readable summary report"""
        logger.info("Generating summary report...")

        analysis = self.analyze_all()

        report = f"""
# COMPREHENSIVE ANALYSIS REPORT
## Delhi Fraud Acquittal Cases - Research Study

---

### 1. DATASET OVERVIEW
- **Total Cases Analyzed**: {analysis['total_cases']}
- **Region**: Delhi (High Court, District Courts, Sessions Courts)
- **Case Type**: Fraud-related cases resulting in acquittal
- **Time Period**: {min(analysis['temporal_analysis']['year_distribution'].keys()) if analysis['temporal_analysis']['year_distribution'] else 'N/A'} - {max(analysis['temporal_analysis']['year_distribution'].keys()) if analysis['temporal_analysis']['year_distribution'] else 'N/A'}

---

### 2. LEGAL PROVISIONS ANALYSIS

#### Most Commonly Invoked IPC Sections:
"""
        for section, count in analysis['provisions_analysis']['most_common_ipc_sections'][:10]:
            percentage = (count / analysis['total_cases']) * 100
            report += f"- **{section}**: {count} cases ({percentage:.1f}%)\n"

        report += "\n#### Other Acts Invoked:\n"
        for act, count in analysis['provisions_analysis']['other_acts_invoked'][:5]:
            report += f"- {act}: {count} cases\n"

        report += f"""
---

### 3. CASE DURATION ANALYSIS
- **Average Duration**: {analysis['temporal_analysis']['average_duration_years']} years
- **Minimum Duration**: {analysis['temporal_analysis']['min_duration']} years
- **Maximum Duration**: {analysis['temporal_analysis']['max_duration']} years
- **Cases with Duration Data**: {analysis['temporal_analysis']['duration_samples']}

#### Year-wise Distribution:
"""
        for year, count in sorted(analysis['temporal_analysis']['year_distribution'].items(), reverse=True)[:10]:
            report += f"- {year}: {count} cases\n"

        report += f"""
---

### 4. COURT DISTRIBUTION
"""
        for court, percentage in analysis['court_distribution']['percentage'].items():
            report += f"- **{court}**: {percentage}\n"

        report += f"""
---

### 5. PROSECUTION ARGUMENTS - COMMON THEMES
"""
        for theme, count in analysis['prosecution_arguments']['common_themes']:
            percentage = (count / analysis['total_cases']) * 100
            report += f"- **{theme.replace('_', ' ').title()}**: {count} cases ({percentage:.1f}%)\n"

        report += f"""
---

### 6. DEFENSE ARGUMENTS - COMMON THEMES
"""
        for theme, count in analysis['defense_arguments']['common_themes']:
            percentage = (count / analysis['total_cases']) * 100
            report += f"- **{theme.replace('_', ' ').title()}**: {count} cases ({percentage:.1f}%)\n"

        report += f"""
---

### 7. COMMON GROUNDS FOR ACQUITTAL
"""
        for ground, percentage in analysis['common_acquittal_grounds']['percentage_distribution'].items():
            report += f"- **{ground}**: {percentage}\n"

        report += f"""
---

### 8. KEY FINDINGS & PATTERNS

#### Why Perpetrators Walk Free - Top Reasons:

1. **Insufficient Evidence**: The most common reason for acquittal. Prosecution fails to establish guilt beyond reasonable doubt.

2. **Benefit of Doubt**: Courts apply the principle that when there's doubt, it should favor the accused.

3. **Civil Nature of Disputes**: Many fraud cases are found to be civil/commercial disputes wrongly criminalized.

4. **Procedural Violations**: Defective investigations and procedural lapses weaken the prosecution case.

5. **Hostile Witnesses**: Key witnesses turning hostile or retracting statements.

6. **Contradictions in Evidence**: Inconsistencies in prosecution witness testimonies.

7. **No Mens Rea**: Failure to prove dishonest intention or knowledge of wrongdoing.

8. **Non-examination of Key Witnesses**: Prosecution's failure to examine material witnesses.

---

### 9. METHODOLOGY NOTE

This analysis is based on {analysis['total_cases']} Delhi fraud cases where accused were acquitted, scraped from Indian Kanoon legal database. The data includes judgments from Delhi High Court, District Courts, and Sessions Courts.

**Limitations**:
- Analysis based on publicly available judgments
- Duration calculations are approximate based on available date information
- Some cases may have incomplete metadata

---

**Report Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""

        return report

    def save_analysis(self, filename: str):
        """Save analysis results to JSON and markdown"""
        analysis = self.analyze_all()

        # Save JSON
        json_file = f"../data/{filename}.json"
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, ensure_ascii=False, indent=2)
        logger.info(f"Saved analysis to {json_file}")

        # Save markdown report
        report = self.generate_summary_report()
        md_file = f"../data/{filename}.md"
        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(report)
        logger.info(f"Saved report to {md_file}")

        return analysis, report


def main():
    """Main execution"""
    import sys

    if len(sys.argv) < 2:
        print("Usage: python analyze_judgments.py <cases_json_file>")
        sys.exit(1)

    cases_file = sys.argv[1]
    analyzer = JudgmentAnalyzer(cases_file)
    analysis, report = analyzer.save_analysis('delhi_fraud_acquittals_analysis')

    print("\n" + "="*70)
    print("ANALYSIS COMPLETE")
    print("="*70)
    print(f"\nTotal cases analyzed: {analysis['total_cases']}")
    print(f"Average case duration: {analysis['temporal_analysis']['average_duration_years']} years")
    print(f"\nTop 3 acquittal grounds:")
    for i, (ground, pct) in enumerate(list(analysis['common_acquittal_grounds']['percentage_distribution'].items())[:3], 1):
        print(f"{i}. {ground}: {pct}")

    print("\n" + "="*70)
    print("Full report saved to: ../data/delhi_fraud_acquittals_analysis.md")
    print("="*70)


if __name__ == "__main__":
    main()
