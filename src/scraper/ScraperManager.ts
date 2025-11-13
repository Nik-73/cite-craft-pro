import { ScraperOptions, ScraperResult, ScraperSource, ScraperSourceType } from './types/index.js';
import { CourtListenerScraper } from './sources/CourtListenerScraper.js';
import { GoogleScholarScraper } from './sources/GoogleScholarScraper.js';
import { JustiaScraper } from './sources/JustiaScraper.js';

/**
 * Manages multiple legal research scrapers
 * Provides unified interface to search across different sources
 */
export class ScraperManager {
  private scrapers: Map<ScraperSourceType, ScraperSource>;

  constructor() {
    this.scrapers = new Map();
    this.initializeScrapers();
  }

  /**
   * Initialize all available scrapers
   */
  private initializeScrapers(): void {
    this.scrapers.set('courtlistener', new CourtListenerScraper());
    this.scrapers.set('google-scholar', new GoogleScholarScraper());
    this.scrapers.set('justia', new JustiaScraper());
  }

  /**
   * Get list of available scrapers
   */
  getAvailableScrapers(): Array<{ name: ScraperSourceType; description: string }> {
    return Array.from(this.scrapers.entries()).map(([key, scraper]) => ({
      name: key,
      description: scraper.description,
    }));
  }

  /**
   * Search using a specific scraper
   */
  async searchWithSource(
    source: ScraperSourceType,
    options: ScraperOptions
  ): Promise<ScraperResult[]> {
    const scraper = this.scrapers.get(source);

    if (!scraper) {
      throw new Error(`Scraper '${source}' not found`);
    }

    console.log(`🔍 Searching ${scraper.name} for: "${options.query}"`);
    const results = await scraper.search(options);
    console.log(`✅ Found ${results.length} results from ${scraper.name}`);

    return results;
  }

  /**
   * Search across all scrapers
   */
  async searchAll(options: ScraperOptions): Promise<ScraperResult[]> {
    console.log(`🔍 Searching all sources for: "${options.query}"`);

    const promises = Array.from(this.scrapers.values()).map(scraper =>
      scraper.search(options).catch(error => {
        console.error(`Error searching ${scraper.name}:`, error.message);
        return [];
      })
    );

    const resultsArrays = await Promise.all(promises);
    const allResults = resultsArrays.flat();

    console.log(`✅ Found ${allResults.length} total results from all sources`);

    return allResults;
  }

  /**
   * Search across multiple specified scrapers
   */
  async searchMultiple(
    sources: ScraperSourceType[],
    options: ScraperOptions
  ): Promise<ScraperResult[]> {
    console.log(`🔍 Searching ${sources.length} sources for: "${options.query}"`);

    const promises = sources.map(async source => {
      try {
        return await this.searchWithSource(source, options);
      } catch (error: any) {
        console.error(`Error searching ${source}:`, error.message);
        return [];
      }
    });

    const resultsArrays = await Promise.all(promises);
    const allResults = resultsArrays.flat();

    console.log(`✅ Found ${allResults.length} total results`);

    return allResults;
  }

  /**
   * Get a specific case by ID from a source
   */
  async getCaseById(source: ScraperSourceType, id: string): Promise<ScraperResult | null> {
    const scraper = this.scrapers.get(source);

    if (!scraper) {
      throw new Error(`Scraper '${source}' not found`);
    }

    console.log(`📄 Fetching case ${id} from ${scraper.name}`);
    const result = await scraper.getCaseById(id);

    if (result) {
      console.log(`✅ Retrieved case: ${result.title}`);
    } else {
      console.log(`❌ Case not found`);
    }

    return result;
  }

  /**
   * Export results to JSON file
   */
  exportToJSON(results: ScraperResult[], filename?: string): string {
    const output = {
      timestamp: new Date().toISOString(),
      totalResults: results.length,
      results,
    };

    const json = JSON.stringify(output, null, 2);
    const outputFilename = filename || `legal-research-${Date.now()}.json`;

    return json;
  }

  /**
   * Format results for display in terminal
   */
  formatResultsForDisplay(results: ScraperResult[]): string {
    if (results.length === 0) {
      return '📭 No results found';
    }

    let output = `\n📚 Found ${results.length} results:\n\n`;

    results.forEach((result, index) => {
      output += `${index + 1}. ${result.title}\n`;
      output += `   Source: ${result.source}\n`;
      output += `   URL: ${result.url}\n`;

      if (result.date) {
        output += `   Date: ${result.date}\n`;
      }

      if (result.metadata?.court) {
        output += `   Court: ${result.metadata.court}\n`;
      }

      if (result.metadata?.docket) {
        output += `   Docket: ${result.metadata.docket}\n`;
      }

      if (result.citation?.bluebook) {
        output += `   Citation: ${result.citation.bluebook}\n`;
      }

      if (result.content) {
        const preview = result.content.substring(0, 150);
        output += `   Preview: ${preview}${result.content.length > 150 ? '...' : ''}\n`;
      }

      output += '\n';
    });

    return output;
  }
}
