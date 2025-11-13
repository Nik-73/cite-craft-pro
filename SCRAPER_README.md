# CiteCraft Pro - Legal Research Scraper

A powerful command-line and web-based tool for searching and scraping legal cases from multiple sources. Built specifically for legal research and citation management.

## Features

- 🔍 **Multi-Source Search**: Search across CourtListener, Google Scholar, and Justia simultaneously
- ⚖️ **Legal-Focused**: Optimized for case law, court opinions, and legal documents
- 🎯 **Advanced Filtering**: Filter by jurisdiction, court, date range, and more
- 📊 **Rich Metadata**: Extract court names, docket numbers, citations, and full case content
- 🖥️ **Dual Interface**: Use via command-line or integrated web UI
- 💾 **Export Capability**: Save results to JSON for further processing
- 🔗 **Direct Integration**: Add scraped cases directly to your citations

## Installation

Dependencies are already installed. The scraper is ready to use!

## Quick Start

### Command Line Interface

#### 1. View Available Sources

```bash
npm run scraper sources
```

#### 2. Search All Sources

```bash
npm run scraper search "Brown v. Board of Education"
```

#### 3. Search Specific Source

```bash
npm run scraper search "Miranda v. Arizona" --source google-scholar
```

#### 4. Search with Filters

```bash
npm run scraper search "Fourth Amendment" --jurisdiction federal --from 2020-01-01 --limit 5
```

#### 5. Save Results to File

```bash
npm run scraper search "contract law" --output results.json
```

#### 6. Get JSON Output

```bash
npm run scraper search "habeas corpus" --json
```

### Web Interface

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the application in your browser

3. Navigate to the **"Legal Research"** tab in the left panel

4. Enter your search query and click **"Search"**

5. Browse results and click **"Add to Citations"** to add cases to your bibliography

## Available Sources

### 1. CourtListener
- **Description**: Free legal opinion and case law database
- **Coverage**: Federal and state courts
- **Source ID**: `courtlistener`

### 2. Google Scholar
- **Description**: Legal case law search via Google Scholar
- **Coverage**: Comprehensive federal and state case law
- **Source ID**: `google-scholar`

### 3. Justia
- **Description**: Free case law and legal information database
- **Coverage**: Federal and state courts, statutes, regulations
- **Source ID**: `justia`

## CLI Command Reference

### Search Command

```bash
npm run scraper search <query> [options]
```

**Arguments:**
- `<query>` - Search query (case name, citation, keywords)

**Options:**
- `-s, --source <source>` - Specific source(s) to search (default: "all")
  - Use single source: `--source courtlistener`
  - Use multiple sources: `--source courtlistener,justia`
  - Use all sources: `--source all`
- `-l, --limit <number>` - Maximum results per source (default: 10)
- `-j, --jurisdiction <jurisdiction>` - Filter by jurisdiction (e.g., "federal", "california")
- `-c, --court <court>` - Filter by court name
- `--from <date>` - Filter cases from date (YYYY-MM-DD)
- `--to <date>` - Filter cases to date (YYYY-MM-DD)
- `-o, --output <file>` - Save results to JSON file
- `--json` - Output results as JSON to stdout

### Sources Command

```bash
npm run scraper sources
```

Lists all available legal research sources with descriptions.

### Get Command

```bash
npm run scraper get <source> <id>
```

Retrieves a specific case by ID from a source.

**Arguments:**
- `<source>` - Source name (courtlistener, google-scholar, justia)
- `<id>` - Case ID or identifier

### Examples Command

```bash
npm run scraper examples
```

Shows detailed usage examples.

## Usage Examples

### Basic Searches

```bash
# Search for a landmark case
npm run scraper search "Roe v. Wade"

# Search for recent employment law cases
npm run scraper search "employment discrimination" --from 2023-01-01

# Search for contract disputes in California
npm run scraper search "breach of contract" --jurisdiction california
```

### Advanced Searches

```bash
# Search multiple sources with date range
npm run scraper search "First Amendment" \
  --source courtlistener,google-scholar \
  --from 2020-01-01 \
  --to 2023-12-31 \
  --limit 20

# Search federal courts only
npm run scraper search "securities fraud" \
  --jurisdiction federal \
  --court "District Court"

# Get comprehensive results and save
npm run scraper search "intellectual property" \
  --source all \
  --limit 50 \
  --output ip-cases.json
```

### Programmatic Usage

```bash
# Get JSON output for processing
npm run scraper search "patent law" --json > patent-cases.json

# Search and pipe to jq for filtering
npm run scraper search "trademark" --json | jq '.[] | select(.date > "2023-01-01")'
```

## Web Interface Guide

### Searching for Cases

1. **Enter Query**: Type your search terms in the search box
   - Case names (e.g., "Brown v. Board of Education")
   - Legal topics (e.g., "Fourth Amendment search and seizure")
   - Citations (e.g., "347 U.S. 483")

2. **Select Source**: Choose which database(s) to search
   - All Sources (recommended for comprehensive results)
   - Specific sources for targeted searches

3. **Apply Filters** (Optional):
   - **Jurisdiction**: Filter by federal, state, or specific jurisdiction
   - **Date Range**: Limit results to specific time periods

4. **Review Results**: Browse search results with:
   - Case title and metadata
   - Court name and date
   - Docket numbers and citations
   - Content preview

5. **Add Citations**: Click "Add to Citations" to import cases directly into your bibliography

### Exporting Results

Click the **"Export Results"** button to download all search results as JSON for:
- Backup and archival
- Further processing
- Sharing with collaborators
- Importing into other tools

## Result Structure

Each scraped case includes:

```typescript
{
  id: string;              // Unique identifier
  title: string;           // Case name
  author?: string;         // Opinion author (if available)
  date?: string;           // Date filed (YYYY-MM-DD)
  url: string;             // Source URL
  source: string;          // Source name
  content: string;         // Case content/opinion
  citation?: {             // Citation formats
    bluebook?: string;
    alwd?: string;
    apa?: string;
  };
  metadata?: {
    court?: string;        // Court name
    caseNumber?: string;   // Case number
    jurisdiction?: string; // Jurisdiction
    docket?: string;       // Docket number
    judges?: string[];     // Judge names
    parties?: {
      plaintiff?: string;
      defendant?: string;
    };
  };
}
```

## Configuration

Edit `scraper.config.json` to customize:

```json
{
  "defaultSource": "all",
  "defaultLimit": 10,
  "rateLimits": {
    "courtlistener": 1000,
    "google-scholar": 2000,
    "justia": 1500
  },
  "sources": {
    "courtlistener": {
      "enabled": true,
      "baseUrl": "https://www.courtlistener.com"
    }
  },
  "outputDirectory": "./scraper-results"
}
```

## Best Practices

### Rate Limiting

The scraper implements rate limiting to respect source servers:
- CourtListener: 1 request per second
- Google Scholar: 1 request per 2 seconds
- Justia: 1 request per 1.5 seconds

**Tip**: Use specific sources instead of "all" for faster searches when you know which database has your target cases.

### Search Tips

1. **Use Quotes**: For exact phrases (e.g., "reasonable doubt")
2. **Be Specific**: Include jurisdiction or date ranges to narrow results
3. **Try Multiple Sources**: Different databases may have different coverage
4. **Use Proper Citations**: Search by citation for exact case retrieval
5. **Save Frequently**: Export important searches to JSON files

### Legal Research Workflow

1. **Initial Search**: Use broad terms across all sources
2. **Refine Query**: Add filters based on initial results
3. **Review Cases**: Check previews before adding to citations
4. **Export Results**: Save comprehensive searches for reference
5. **Add to Citations**: Import relevant cases directly into your paper

## Architecture

### Project Structure

```
src/scraper/
├── types/
│   └── index.ts              # TypeScript type definitions
├── sources/
│   ├── CourtListenerScraper.ts  # CourtListener implementation
│   ├── GoogleScholarScraper.ts  # Google Scholar implementation
│   └── JustiaScraper.ts         # Justia implementation
├── cli/
│   └── index.ts              # Command-line interface
├── BaseScraper.ts            # Base scraper class
└── ScraperManager.ts         # Scraper coordinator

src/components/
└── ScraperPanel.tsx          # React UI component
```

### Technology Stack

- **TypeScript**: Type-safe scraper implementation
- **Axios**: HTTP client for web requests
- **Cheerio**: HTML parsing and data extraction
- **Commander.js**: CLI framework
- **React**: Web interface
- **Shadcn/UI**: UI components

## Troubleshooting

### Command Not Found

If `npm run scraper` doesn't work:

```bash
# Reinstall dependencies
npm install

# Check if ts-node is installed
npm list ts-node
```

### No Results Returned

- Check your internet connection
- Try a different search query
- Verify the source is accessible
- Use more general search terms

### Rate Limiting Errors

- Wait a few seconds between searches
- Use specific sources instead of "all"
- Increase rate limits in `scraper.config.json` (not recommended)

### TypeScript Errors

```bash
# Rebuild TypeScript definitions
npm run build

# Check TypeScript version
npm list typescript
```

## Development

### Adding New Sources

1. Create a new scraper class in `src/scraper/sources/`:

```typescript
import { BaseScraper } from '../BaseScraper';
import { ScraperOptions, ScraperResult } from '../types';

export class MySourceScraper extends BaseScraper {
  name = 'MySource';
  description = 'My custom legal source';

  async search(options: ScraperOptions): Promise<ScraperResult[]> {
    // Implement search logic
  }

  async getCaseById(id: string): Promise<ScraperResult | null> {
    // Implement case retrieval
  }
}
```

2. Register in `ScraperManager.ts`:

```typescript
import { MySourceScraper } from './sources/MySourceScraper';

// In initializeScrapers():
this.scrapers.set('my-source', new MySourceScraper());
```

3. Update TypeScript types in `types/index.ts`:

```typescript
export type ScraperSourceType =
  | 'courtlistener'
  | 'justia'
  | 'google-scholar'
  | 'my-source';  // Add your source
```

### Running Tests

```bash
# Test CLI
npm run scraper examples

# Test web interface
npm run dev
```

## Legal and Ethical Considerations

- **Terms of Service**: Always respect the terms of service of scraped websites
- **Rate Limiting**: Built-in rate limiting prevents server overload
- **Attribution**: Properly cite sources in your research
- **Fair Use**: Scraping for personal research and education is generally acceptable
- **No Commercial Use**: This tool is for educational and research purposes

## Support and Contributing

### Reporting Issues

Found a bug or have a feature request? Create an issue in the repository.

### Contributing

Contributions are welcome! Areas for improvement:
- Additional legal sources
- Better citation parsing
- Enhanced metadata extraction
- UI/UX improvements
- Performance optimizations

## License

This scraper tool is part of CiteCraft Pro and follows the same license terms as the main project.

## Changelog

### Version 1.0.0 (2025-11-13)

- Initial release
- CourtListener, Google Scholar, and Justia scrapers
- CLI interface with Commander.js
- React web interface integration
- Advanced filtering and search options
- JSON export capability
- Rate limiting and error handling

---

**Happy Legal Researching! ⚖️**
