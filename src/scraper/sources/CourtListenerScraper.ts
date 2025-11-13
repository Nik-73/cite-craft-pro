import { BaseScraper } from '../BaseScraper.js';
import { ScraperOptions, ScraperResult } from '../types/index.js';
import * as cheerio from 'cheerio';

/**
 * Scraper for CourtListener.com - Free Legal Opinion Search
 * CourtListener provides access to millions of legal opinions from federal and state courts
 */
export class CourtListenerScraper extends BaseScraper {
  name = 'CourtListener';
  description = 'Free legal opinion and case law database';

  constructor() {
    super({
      source: 'courtlistener',
      baseUrl: 'https://www.courtlistener.com',
      rateLimit: 1000, // 1 second between requests
    });
  }

  /**
   * Search for cases on CourtListener
   */
  async search(options: ScraperOptions): Promise<ScraperResult[]> {
    const { query, limit = 10, jurisdiction, court, dateFrom, dateTo } = options;

    // Build search query parameters
    const params: Record<string, any> = {
      q: query,
      type: 'o', // opinions
      order_by: 'score desc',
    };

    if (jurisdiction) params.court = jurisdiction;
    if (dateFrom) params.filed_after = dateFrom;
    if (dateTo) params.filed_before = dateTo;

    try {
      const html = await this.get('/api/rest/v3/search/', params);
      return this.parseSearchResults(html, limit);
    } catch (error: any) {
      console.error(`CourtListener search error: ${error.message}`);
      return [];
    }
  }

  /**
   * Get a specific case by ID
   */
  async getCaseById(id: string): Promise<ScraperResult | null> {
    try {
      const html = await this.get(`/opinion/${id}/`);
      return this.parseCase(html, id);
    } catch (error: any) {
      console.error(`CourtListener case fetch error: ${error.message}`);
      return null;
    }
  }

  /**
   * Parse search results HTML
   */
  private parseSearchResults(html: string, limit: number): ScraperResult[] {
    const $ = cheerio.load(html);
    const results: ScraperResult[] = [];

    $('.search-result').slice(0, limit).each((_, element) => {
      const $el = $(element);

      const title = $el.find('.case-name').text().trim();
      const url = this.config.baseUrl + $el.find('a').attr('href');
      const court = $el.find('.court').text().trim();
      const date = $el.find('.date-filed').text().trim();
      const docket = $el.find('.docket-number').text().trim();
      const snippet = $el.find('.snippet').text().trim();

      const id = this.extractCaseId(url);

      if (title && url) {
        results.push({
          id: this.generateId('courtlistener', id),
          title,
          date: this.formatDate(date),
          url,
          source: this.name,
          content: snippet,
          metadata: {
            court,
            docket,
          },
        });
      }
    });

    return results;
  }

  /**
   * Parse individual case page
   */
  private parseCase(html: string, caseId: string): ScraperResult | null {
    const $ = cheerio.load(html);

    const title = $('.case-name').text().trim();
    const court = $('.court-name').text().trim();
    const date = $('.date-filed').text().trim();
    const docket = $('.docket-number').text().trim();
    const opinion = $('.opinion-content').text().trim();
    const judges = $('.judges').text().trim();

    if (!title) return null;

    return {
      id: this.generateId('courtlistener', caseId),
      title,
      date: this.formatDate(date),
      url: `${this.config.baseUrl}/opinion/${caseId}/`,
      source: this.name,
      content: opinion,
      metadata: {
        court,
        docket,
        judges: judges ? judges.split(',').map(j => j.trim()) : [],
      },
    };
  }

  /**
   * Extract case ID from URL
   */
  private extractCaseId(url: string): string {
    const match = url.match(/\/opinion\/(\d+)\//);
    return match ? match[1] : url;
  }
}
