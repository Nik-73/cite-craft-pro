# Delhi Fraud Acquittal Cases - Research Study

Comprehensive research analysis of 200+ Indian fraud cases from Delhi where perpetrators were acquitted.

## Project Overview

This research project systematically collects, analyzes, and documents fraud-related cases from Delhi courts where the accused were acquitted. The study examines:

- Common arguments made by prosecution and defense
- Legal provisions most frequently invoked
- Average time taken to reach conclusions
- Patterns in acquittal grounds
- Regional analysis focused on Delhi jurisdiction

## Structure

```
fraud-judgments/
├── scripts/
│   ├── indian_kanoon_scraper.py    # Web scraper for Indian Kanoon
│   ├── analyze_judgments.py        # Analysis and pattern extraction
│   └── run_research.py              # Main orchestration script
├── data/
│   ├── delhi_fraud_acquittals_search.json         # Initial search results
│   ├── delhi_fraud_acquittals_detailed.json       # Detailed case data
│   ├── delhi_fraud_acquittals_analysis.json       # Analysis results
│   ├── delhi_fraud_acquittals_analysis.md         # Final report
│   └── scraper.log                                 # Scraping logs
├── requirements.txt                 # Python dependencies
└── README.md                        # This file
```

## Installation

1. Ensure Python 3.8+ is installed
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Run Complete Research Pipeline

```bash
cd scripts
python run_research.py
```

This will:
1. Scrape 200+ Delhi fraud acquittal cases from Indian Kanoon
2. Analyze patterns, arguments, and provisions
3. Generate comprehensive research report

### Run Individual Components

**Scraping only:**
```bash
python indian_kanoon_scraper.py
```

**Analysis only (requires scraped data):**
```bash
python analyze_judgments.py ../data/delhi_fraud_acquittals_detailed.json
```

## Data Sources

- **Primary Source**: Indian Kanoon (https://indiankanoon.org)
- **Jurisdiction**: Delhi (High Court, District Courts, Sessions Courts)
- **Case Types**: IPC Sections 420, 406, 467, 468, 471, 120B, 409, 477A, 463, 465
- **Outcome**: Acquittals, discharges, not guilty verdicts

## Research Methodology

### 1. Data Collection
- Web scraping from Indian Kanoon legal database
- Focus on fraud-related IPC sections
- Filter for Delhi jurisdiction and acquittal outcomes
- Extract full judgment texts and metadata

### 2. Data Extraction
- Case metadata (case number, dates, court, judges)
- Legal provisions invoked
- Prosecution arguments
- Defense arguments
- Grounds for acquittal

### 3. Analysis
- Pattern recognition in arguments
- Temporal analysis (case durations)
- Statistical analysis of provisions
- Common acquittal grounds identification
- Keyword frequency analysis

### 4. Reporting
- Comprehensive markdown report
- Statistical summaries
- Key findings and patterns

## Key Features

- **Automated Scraping**: Respectful scraping with rate limiting
- **Comprehensive Analysis**: Multiple dimensions of analysis
- **Pattern Recognition**: Identifies common themes and arguments
- **Statistical Analysis**: Quantitative insights
- **Human-Readable Reports**: Clear, structured documentation

## Legal & Ethical Considerations

- Uses publicly available court judgments
- Respects website rate limits (2-second delay between requests)
- Educational and research purposes only
- Complies with Indian Kanoon's usage guidelines

## Output

The final research document includes:

1. Dataset overview and statistics
2. Legal provisions analysis
3. Case duration analysis
4. Court distribution
5. Prosecution argument themes
6. Defense argument themes
7. Common grounds for acquittal
8. Key findings and patterns
9. Insights on why perpetrators walk free

## Requirements

- Python 3.8+
- requests
- beautifulsoup4
- lxml

## Notes

- Scraping may take several hours due to rate limiting (respectful scraping)
- Requires stable internet connection
- Some cases may have incomplete metadata
- Duration calculations are approximate based on available date information

## License

Research and educational use only.

## Author

Created for comprehensive legal research analysis.

---

**Last Updated**: 2024
