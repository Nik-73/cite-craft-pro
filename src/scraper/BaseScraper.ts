import axios, { AxiosInstance } from 'axios';
import { ScraperConfig, ScraperOptions, ScraperResult, ScraperSource } from './types/index.js';

/**
 * Base class for all legal research scrapers
 * Provides common functionality like HTTP requests, rate limiting, and error handling
 */
export abstract class BaseScraper implements ScraperSource {
  protected client: AxiosInstance;
  protected config: ScraperConfig;
  protected lastRequestTime: number = 0;

  abstract name: string;
  abstract description: string;

  constructor(config: ScraperConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'User-Agent': 'CiteCraftPro-LegalResearch/1.0',
        ...config.headers,
      },
    });
  }

  /**
   * Implements rate limiting to respect source servers
   */
  protected async rateLimit(): Promise<void> {
    if (!this.config.rateLimit) return;

    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minDelay = this.config.rateLimit;

    if (timeSinceLastRequest < minDelay) {
      await new Promise(resolve => setTimeout(resolve, minDelay - timeSinceLastRequest));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Makes an HTTP GET request with rate limiting
   */
  protected async get(url: string, params?: Record<string, any>): Promise<any> {
    await this.rateLimit();

    try {
      const response = await this.client.get(url, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  /**
   * Generates a unique ID for a result
   */
  protected generateId(source: string, identifier: string): string {
    return `${source}-${identifier}`;
  }

  /**
   * Formats date to ISO string
   */
  protected formatDate(dateString: string): string {
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return dateString;
    }
  }

  /**
   * Cleans HTML content to plain text
   */
  protected cleanText(html: string): string {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Abstract methods to be implemented by subclasses
   */
  abstract search(options: ScraperOptions): Promise<ScraperResult[]>;
  abstract getCaseById(id: string): Promise<ScraperResult | null>;
}
