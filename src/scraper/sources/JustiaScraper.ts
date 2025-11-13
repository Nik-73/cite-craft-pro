import { BaseScraper } from '../BaseScraper.js';
import { ScraperOptions, ScraperResult } from '../types/index.js';
import * as cheerio from 'cheerio';

/**
 * Scraper for Justia.com - Free Legal Information
 * Justia provides free access to case law, statutes, and legal resources
 */
export class JustiaScraper extends BaseScraper {
  name = 'Justia';
  description = 'Free case law and legal information database';

  constructor() {
    super({
      source: 'justia',
      baseUrl: 'https://law.justia.com',
      rateLimit: 1500, // 1.5 seconds between requests
    });
  }

  /**
   * Search for cases on Justia
   */
  async search(options: ScraperOptions): Promise<ScraperResult[]> {
    const { query, limit = 10, jurisdiction } = options;

    try {
      // Justia uses different paths for different jurisdictions
      const searchPath = jurisdiction
        ? `/cases/${jurisdiction}/search/`
        : '/cases/search/';

      const params = {
        q: query,
      };

      const html = await this.get(searchPath, params);
      return this.parseSearchResults(html, limit);
    } catch (error: any) {
      console.error(`Justia search error: ${error.message}`);
      return [];
    }
  }

  /**
   * Get a specific case by ID/URL path
   */
  async getCaseById(id: string): Promise<ScraperResult | null> {
    try {
      const html = await this.get(`/cases/${id}`);
      return this.parseCase(html, id);
    } catch (error: any) {
      console.error(`Justia case fetch error: ${error.message}`);
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

      const $link = $el.find('h3 a, .title a');
      const title = $link.text().trim();
      const url = $link.attr('href') || '';
      const snippet = $el.find('.snippet, .description').text().trim();
      const meta = $el.find('.meta, .case-meta').text().trim();

      // Extract court and date from metadata
      const dateMatch = meta.match(/\b(19|20)\d{2}\b/);
      const date = dateMatch ? dateMatch[0] : '';

      if (title && url) {
        const fullUrl = url.startsWith('http') ? url : this.config.baseUrl + url;
        const id = this.extractCaseIdFromUrl(url);

        results.push({
          id: this.generateId('justia', id),
          title,
          date: date ? `${date}-01-01` : undefined,
          url: fullUrl,
          source: this.name,
          content: snippet,
          metadata: {
            court: meta,
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

    const title = $('.case-name, h1.title').first().text().trim();
    const court = $('.court-name, .case-court').text().trim();
    const date = $('.date-filed, .case-date').text().trim();
    const docket = $('.docket-number, .case-docket').text().trim();
    const citation = $('.citation').text().trim();

    // Get case content/opinion
    const opinion = $('.case-content, .opinion-content, .case-text')
      .first()
      .text()
      .trim();

    if (!title) return null;

    return {
      id: this.generateId('justia', caseId),
      title,
      date: this.formatDate(date),
      url: `${this.config.baseUrl}/cases/${caseId}`,
      source: this.name,
      content: opinion || 'Full content available at source URL',
      citation: {
        bluebook: citation || undefined,
      },
      metadata: {
        court,
        docket,
      },
    };
  }

  /**
   * Extract case ID from URL
   */
  private extractCaseIdFromUrl(url: string): string {
    const match = url.match(/\/cases\/([^/?]+)/);
    return match ? match[1] : url.replace(/[^a-z0-9]/gi, '-');
  }
}
