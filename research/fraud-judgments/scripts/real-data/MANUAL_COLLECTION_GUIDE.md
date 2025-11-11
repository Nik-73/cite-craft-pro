
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
        