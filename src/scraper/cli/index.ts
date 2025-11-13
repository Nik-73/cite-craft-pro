#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { ScraperManager } from '../ScraperManager.js';
import { ScraperSourceType } from '../types/index.js';

const program = new Command();
const scraper = new ScraperManager();

/**
 * CiteCraft Pro Legal Research Scraper CLI
 * Command-line interface for searching legal cases and documents
 */
program
  .name('legal-scraper')
  .description('Legal research scraper tool for CiteCraft Pro')
  .version('1.0.0');

/**
 * Search command - Search for legal cases
 */
program
  .command('search')
  .description('Search for legal cases across multiple sources')
  .argument('<query>', 'Search query (case name, citation, keywords)')
  .option('-s, --source <source>', 'Specific source to search (courtlistener, google-scholar, justia, or "all")', 'all')
  .option('-l, --limit <number>', 'Maximum number of results per source', '10')
  .option('-j, --jurisdiction <jurisdiction>', 'Filter by jurisdiction (e.g., "federal", "california")')
  .option('-c, --court <court>', 'Filter by court name')
  .option('--from <date>', 'Filter cases from date (YYYY-MM-DD)')
  .option('--to <date>', 'Filter cases to date (YYYY-MM-DD)')
  .option('-o, --output <file>', 'Save results to JSON file')
  .option('--json', 'Output results as JSON to stdout')
  .action(async (query, options) => {
    try {
      const searchOptions = {
        query,
        limit: parseInt(options.limit),
        jurisdiction: options.jurisdiction,
        court: options.court,
        dateFrom: options.from,
        dateTo: options.to,
      };

      let results;

      if (options.source === 'all') {
        results = await scraper.searchAll(searchOptions);
      } else {
        const sources = options.source.split(',') as ScraperSourceType[];
        results = await scraper.searchMultiple(sources, searchOptions);
      }

      // Output results
      if (options.json) {
        console.log(JSON.stringify(results, null, 2));
      } else {
        console.log(scraper.formatResultsForDisplay(results));
      }

      // Save to file if requested
      if (options.output) {
        const json = scraper.exportToJSON(results, options.output);
        const outputPath = path.resolve(options.output);
        fs.writeFileSync(outputPath, json);
        console.log(`\n💾 Results saved to: ${outputPath}`);
      }
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  });

/**
 * Sources command - List available sources
 */
program
  .command('sources')
  .description('List all available legal research sources')
  .action(() => {
    console.log('\n📚 Available Legal Research Sources:\n');

    const sources = scraper.getAvailableScrapers();
    sources.forEach((source, index) => {
      console.log(`${index + 1}. ${source.name}`);
      console.log(`   ${source.description}\n`);
    });

    console.log('💡 Use these source names with the --source option');
  });

/**
 * Get command - Get a specific case by ID
 */
program
  .command('get')
  .description('Get a specific case by ID from a source')
  .argument('<source>', 'Source name (courtlistener, google-scholar, justia)')
  .argument('<id>', 'Case ID or identifier')
  .option('-o, --output <file>', 'Save result to JSON file')
  .option('--json', 'Output result as JSON to stdout')
  .action(async (source, id, options) => {
    try {
      const result = await scraper.getCaseById(source as ScraperSourceType, id);

      if (!result) {
        console.log('❌ Case not found');
        process.exit(1);
      }

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(scraper.formatResultsForDisplay([result]));
      }

      if (options.output) {
        const json = JSON.stringify(result, null, 2);
        const outputPath = path.resolve(options.output);
        fs.writeFileSync(outputPath, json);
        console.log(`\n💾 Result saved to: ${outputPath}`);
      }
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  });

/**
 * Examples command - Show usage examples
 */
program
  .command('examples')
  .description('Show usage examples')
  .action(() => {
    console.log(`
📖 Legal Scraper Usage Examples:

1. Search all sources:
   $ npm run scraper search "Brown v. Board of Education"

2. Search specific source:
   $ npm run scraper search "Miranda v. Arizona" --source google-scholar

3. Search with filters:
   $ npm run scraper search "employment discrimination" --jurisdiction federal --from 2020-01-01

4. Search multiple sources:
   $ npm run scraper search "contract law" --source courtlistener,justia --limit 5

5. Save results to file:
   $ npm run scraper search "Fourth Amendment" --output results.json

6. Get JSON output:
   $ npm run scraper search "habeas corpus" --json > results.json

7. List available sources:
   $ npm run scraper sources

8. Get specific case:
   $ npm run scraper get courtlistener 12345

💡 Tips:
   - Use quotes around multi-word queries
   - Combine filters for more precise results
   - Use --json flag for programmatic parsing
   - Save frequently used searches to shell aliases
    `);
  });

// Parse command line arguments
program.parse();
