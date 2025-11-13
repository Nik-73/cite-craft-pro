import { BaseScraper } from '../BaseScraper.js';
import { ScraperOptions, ScraperResult } from '../types/index.js';
import * as cheerio from 'cheerio';

/**
 * Scraper for Google Scholar Case Law
 * Provides access to legal opinions from federal and state courts
 */
export class GoogleScholarScraper extends BaseScraper {
  name = 'Google Scholar';
  description = 'Legal case law search via Google Scholar';

  constructor() {
    super({
      source: 'google-scholar',
      baseUrl: 'https://scholar.google.com',
      rateLimit: 2000, // 2 seconds between requests (be respectful)
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
  }

  /**
   * Search for legal cases on Google Scholar
   */
  async search(options: ScraperOptions): Promise<ScraperResult[]> {
    const { query, limit = 10, dateFrom, dateTo } = options;

    const params: Record<string, any> = {
      q: query,
      hl: 'en',
      as_sdt: '6', // Case law
    };

    // Add date range if specified
    if (dateFrom || dateTo) {
      params.as_ylo = dateFrom?.split('-')[0] || '';
      params.as_yhi = dateTo?.split('-')[0] || '';
    }

    try {
      const html = await this.get('/scholar', params);
      return this.parseSearchResults(html, limit);
    } catch (error: any) {
      console.error(`Google Scholar search error: ${error.message}`);
      return [];
    }
  }

  /**
   * Get a specific case by ID (citation)
   */
  async getCaseById(id: string): Promise<ScraperResult | null> {
    try {
      const params = {
        q: id,
        hl: 'en',
        as_sdt: '6',
      };

      const html = await this.get('/scholar', params);
      const results = this.parseSearchResults(html, 1);
      return results.length > 0 ? results[0] : null;
    } catch (error: any) {
      console.error(`Google Scholar case fetch error: ${error.message}`);
      return null;
    }
  }

  /**
   * Parse search results HTML
   */
  private parseSearchResults(html: string, limit: number): ScraperResult[] {
    const $ = cheerio.load(html);
    const results: ScraperResult[] = [];

    $('.gs_r.gs_or.gs_scl').slice(0, limit).each((_, element) => {
      const $el = $(element);

      const title = $el.find('.gs_rt a').text().trim();
      const url = $el.find('.gs_rt a').attr('href') || '';
      const snippet = $el.find('.gs_rs').text().trim();
      const metadata = $el.find('.gs_a').text().trim();

      // Parse metadata (typically contains court, date, citation)
      const metaParts = metadata.split('-').map(p => p.trim());
      const court = metaParts[0] || '';
      const citation = metaParts[metaParts.length - 1] || '';

      // Extract date from metadata
      const dateMatch = metadata.match(/\b(19|20)\d{2}\b/);
      const year = dateMatch ? dateMatch[0] : '';

      if (title && url) {
        const id = this.generateIdFromTitle(title);

        results.push({
          id: this.generateId('google-scholar', id),
          title,
          date: year ? `${year}-01-01` : undefined,
          url,
          source: this.name,
          content: snippet,
          citation: {
            bluebook: citation || undefined,
          },
          metadata: {
            court,
          },
        });
      }
    });

    return results;
  }

  /**
   * Generate ID from case title
   */
  private generateIdFromTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  }
}
