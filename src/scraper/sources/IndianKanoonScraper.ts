import * as cheerio from 'cheerio';
import { BaseScraper } from '../BaseScraper.js';
import { ScraperOptions, ScraperResult } from '../types/index.js';
import { IndianLegalSearchOptions, IndianLegalResult, IndianLegalMetadata } from '../types/indian-legal.js';

/**
 * Scraper for IndianKanoon.org - India's largest free legal database
 *
 * Features:
 * - Supreme Court, High Courts, and District Court judgments
 * - Full-text search with regional language support
 * - Cited cases and legal principles
 * - Free and publicly accessible
 *
 * URL Structure:
 * - Search: https://indiankanoon.org/search/?formInput=query&pagenum=1
 * - Case: https://indiankanoon.org/doc/[docid]/
 *
 * Respectful Usage:
 * - Rate limit: 1 request per second (1000ms)
 * - Public service for legal research
 * - No authentication required
 */
export class IndianKanoonScraper extends BaseScraper {
  name = 'IndianKanoon';
  description = 'Indian legal database with Supreme Court, High Courts, and District Courts';

  constructor() {
    super({
      source: 'indiankanoon',
      baseUrl: 'https://indiankanoon.org',
      rateLimit: 1000, // 1 second between requests
      timeout: 30000,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml',
        'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
      },
    });
  }

  /**
   * Search for cases on IndianKanoon
   */
  async search(options: ScraperOptions): Promise<ScraperResult[]> {
    const results: ScraperResult[] = [];
    const limit = options.limit || 20;
    const pagesNeeded = Math.ceil(limit / 10); // IndianKanoon shows ~10 results per page

    try {
      for (let page = 1; page <= pagesNeeded; page++) {
        const pageResults = await this.searchPage(options, page);
        results.push(...pageResults);

        if (results.length >= limit) {
          break;
        }
      }

      return results.slice(0, limit);
    } catch (error: any) {
      console.error(`IndianKanoon search error: ${error.message}`);
      return results; // Return partial results
    }
  }

  /**
   * Search a specific page of results
   */
  private async searchPage(options: ScraperOptions, pageNum: number): Promise<ScraperResult[]> {
    const params: Record<string, string> = {
      formInput: options.query,
      pagenum: pageNum.toString(),
    };

    // Add date filters if provided
    if (options.dateFrom) {
      params.fromdate = this.formatDateForIndianKanoon(options.dateFrom);
    }
    if (options.dateTo) {
      params.todate = this.formatDateForIndianKanoon(options.dateTo);
    }

    // Add court filter if provided
    if (options.court) {
      params.court = options.court;
    }

    const html = await this.get('/search/', params);
    return this.parseSearchResults(html);
  }

  /**
   * Parse search results page
   */
  private parseSearchResults(html: string): ScraperResult[] {
    const $ = cheerio.load(html);
    const results: ScraperResult[] = [];

    // IndianKanoon search results are in div.result
    $('.result').each((_, element) => {
      try {
        const $result = $(element);

        // Extract case link and title
        const titleLink = $result.find('.result_title a').first();
        const title = this.cleanText(titleLink.text());
        const relativeUrl = titleLink.attr('href');

        if (!title || !relativeUrl) return;

        const url = `https://indiankanoon.org${relativeUrl}`;
        const docId = this.extractDocId(relativeUrl);

        // Extract snippet/preview
        const snippet = this.cleanText($result.find('.snippets').text());

        // Extract citation if available
        const citationText = $result.find('.cite').text().trim();

        // Extract court and date from metadata line
        const metadataText = $result.find('.docsource').text();
        const court = this.extractCourt(metadataText);
        const date = this.extractDate(metadataText);

        results.push({
          id: this.generateId('indiankanoon', docId),
          title,
          url,
          source: 'IndianKanoon',
          content: snippet,
          date,
          citation: citationText ? { bluebook: citationText } : undefined,
          metadata: {
            court,
          },
        });
      } catch (error: any) {
        console.error(`Error parsing search result: ${error.message}`);
      }
    });

    return results;
  }

  /**
   * Get full case details by ID
   */
  async getCaseById(id: string): Promise<ScraperResult | null> {
    try {
      // Extract doc ID from our generated ID
      const docId = id.replace('indiankanoon-', '');
      return await this.getCaseByDocId(docId);
    } catch (error: any) {
      console.error(`Error fetching case ${id}: ${error.message}`);
      return null;
    }
  }

  /**
   * Get case by IndianKanoon document ID
   */
  async getCaseByDocId(docId: string): Promise<IndianLegalResult | null> {
    try {
      const url = `/doc/${docId}/`;
      const html = await this.get(url);
      return this.parseFullCase(html, docId);
    } catch (error: any) {
      console.error(`Error fetching case doc ${docId}: ${error.message}`);
      return null;
    }
  }

  /**
   * Parse full case page
   */
  private parseFullCase(html: string, docId: string): IndianLegalResult {
    const $ = cheerio.load(html);

    // Extract title
    const title = this.cleanText($('h1.doc_title, .doctitle').first().text()) ||
                  this.cleanText($('.docsource').first().text());

    // Extract full judgment text
    const judgmentDiv = $('#judgment, .judgments');
    const fullText = this.cleanText(judgmentDiv.text());

    // Extract citation
    const citationText = $('.cite').first().text().trim() ||
                        $('.doc_citations').first().text().trim();

    // Extract court and date
    const docSource = $('.docsource').text();
    const court = this.extractCourt(docSource);
    const date = this.extractDate(docSource);

    // Extract case number
    const caseNumber = this.extractCaseNumber(docSource, title);

    // Extract judges
    const judges = this.extractJudges($);

    // Extract cited cases
    const citedCases = this.extractCitedCases($);

    // Extract IPC/legal sections
    const ipcSections = this.extractIPCSections(fullText);
    const acts = this.extractActs(fullText);

    // Detect language
    const language = this.detectLanguage(fullText);
    const languagePercentage = this.estimateLanguagePercentage(fullText);

    // Try to parse judgment into sections
    const sections = this.parseJudgmentSections($);

    // Determine court level
    const courtLevel = this.determineCourtLevel(court);

    // Build metadata
    const metadata: IndianLegalMetadata = {
      court,
      courtLevel,
      caseNumber,
      judges,
      citedCases,
      ipcSections,
      acts,
      language: language.name,
      languageCode: language.code,
      languagePercentage,
      sections,
      hasWitnessTestimony: this.detectWitnessTestimony(fullText),
      reasoningDepth: this.estimateReasoningDepth(fullText),
    };

    return {
      id: this.generateId('indiankanoon', docId),
      title,
      url: `https://indiankanoon.org/doc/${docId}/`,
      source: 'IndianKanoon',
      content: fullText,
      date,
      citation: citationText ? { bluebook: citationText } : undefined,
      metadata,
    };
  }

  /**
   * Advanced search with Indian legal options
   */
  async searchIndian(options: IndianLegalSearchOptions): Promise<IndianLegalResult[]> {
    // Convert Indian legal options to base scraper options
    const baseOptions: ScraperOptions = {
      query: this.buildIndianQuery(options),
      limit: options.limit,
      court: options.court,
      dateFrom: options.fromDate,
      dateTo: options.toDate,
    };

    const results = await this.search(baseOptions);

    // Enhance results with full case details if needed
    if (options.requireWitnessTestimony || options.minLength) {
      const enhancedResults: IndianLegalResult[] = [];

      for (const result of results) {
        const docId = this.extractDocId(result.url);
        const fullCase = await this.getCaseByDocId(docId);

        if (!fullCase) continue;

        // Apply filters
        if (options.requireWitnessTestimony && !fullCase.metadata?.hasWitnessTestimony) {
          continue;
        }

        if (options.minLength && fullCase.content.split(/\s+/).length < options.minLength) {
          continue;
        }

        enhancedResults.push(fullCase);

        if (enhancedResults.length >= (options.limit || 20)) {
          break;
        }
      }

      return enhancedResults;
    }

    return results as IndianLegalResult[];
  }

  /**
   * Build search query from Indian legal options
   */
  private buildIndianQuery(options: IndianLegalSearchOptions): string {
    const parts: string[] = [options.query];

    if (options.exactPhrase) {
      parts.push(`"${options.exactPhrase}"`);
    }

    if (options.ipcSection) {
      const sections = Array.isArray(options.ipcSection) ? options.ipcSection : [options.ipcSection];
      sections.forEach(section => {
        parts.push(`"Section ${section}"`);
        parts.push(`"IPC ${section}"`);
      });
    }

    if (options.bnsSection) {
      const sections = Array.isArray(options.bnsSection) ? options.bnsSection : [options.bnsSection];
      sections.forEach(section => {
        parts.push(`"BNS ${section}"`);
      });
    }

    if (options.act) {
      parts.push(`"${options.act}"`);
    }

    return parts.join(' ');
  }

  // ===== HELPER METHODS =====

  private extractDocId(url: string): string {
    const match = url.match(/\/doc\/(\d+)\//);
    return match ? match[1] : '';
  }

  private extractCourt(text: string): string {
    // Common patterns: "Supreme Court", "Delhi High Court", "Allahabad High Court"
    const courtMatch = text.match(/(Supreme Court|.+?\s+High Court|.+?\s+District Court|.+?\s+Sessions Court)/i);
    return courtMatch ? courtMatch[1].trim() : 'Unknown Court';
  }

  private extractDate(text: string): string | undefined {
    // Patterns: "on 15 May 2020", "15-05-2020", "15.05.2020"
    const datePatterns = [
      /on\s+(\d{1,2}\s+\w+\s+\d{4})/i,
      /(\d{1,2}[-\.\/]\d{1,2}[-\.\/]\d{4})/,
      /(\w+\s+\d{1,2},?\s+\d{4})/,
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        return this.formatDate(match[1]);
      }
    }

    return undefined;
  }

  private extractCaseNumber(text: string, title: string): string | undefined {
    // Patterns: "Crl. A. No. 123/2020", "Criminal Appeal No. 456 of 2019"
    const patterns = [
      /(?:Crl\.|Criminal|Civil|Writ)\s+(?:Appeal|Petition|Case)\s+No\.?\s*(\d+\s*(?:of|\/)\s*\d{4})/i,
      /(\d+\s*(?:of|\/)\s*\d{4})/,
    ];

    const searchText = text + ' ' + title;

    for (const pattern of patterns) {
      const match = searchText.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }

    return undefined;
  }

  private extractJudges($: cheerio.CheerioAPI): string[] {
    const judges: string[] = [];

    // Look for judge names in common patterns
    $('p, div').each((_, elem) => {
      const text = $(elem).text();

      // Pattern: "CORAM: Justice X, Justice Y"
      const coramMatch = text.match(/CORAM[:\s]+(.+?)(?:\n|$)/i);
      if (coramMatch) {
        const judgeNames = coramMatch[1].split(/,|and/).map(s => s.trim());
        judges.push(...judgeNames);
      }

      // Pattern: "Before: Hon'ble Mr. Justice X"
      const beforeMatch = text.match(/Before[:\s]+(.+?)(?:\n|$)/i);
      if (beforeMatch) {
        judges.push(beforeMatch[1].trim());
      }

      // Pattern: "JUDGMENT/ORDER" followed by judge name
      const judgmentMatch = text.match(/JUDGMENT.*?\n\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,?\s+J\.?)/);
      if (judgmentMatch) {
        judges.push(judgmentMatch[1].trim());
      }
    });

    return [...new Set(judges)]; // Remove duplicates
  }

  private extractCitedCases($: cheerio.CheerioAPI): Array<{ caseName: string; citation?: string }> {
    const citedCases: Array<{ caseName: string; citation?: string }> = [];

    // IndianKanoon marks cited cases with special classes
    $('.cite_tag, a[href*="/doc/"]').each((_, elem) => {
      const text = $(elem).text().trim();
      const href = $(elem).attr('href');

      if (text && text.length > 10) {
        citedCases.push({
          caseName: text,
          citation: href ? `https://indiankanoon.org${href}` : undefined,
        });
      }
    });

    return citedCases.slice(0, 50); // Limit to first 50
  }

  private extractIPCSections(text: string): string[] {
    const sections: Set<string> = new Set();

    // Patterns: "Section 375 IPC", "IPC 376", "S. 420", "धारा 498A"
    const patterns = [
      /(?:Section|S\.|Sec\.|धारा)\s*(\d+[A-Z]?)\s*(?:IPC|आईपीसी|भारतीय दंड संहिता)?/gi,
      /IPC\s*(\d+[A-Z]?)/gi,
      /आईपीसी\s*(\d+[A-Z]?)/gi,
    ];

    for (const pattern of patterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        sections.add(match[1]);
      }
    }

    return Array.from(sections).sort();
  }

  private extractActs(text: string): string[] {
    const acts: Set<string> = new Set();

    // Common act patterns
    const actPatterns = [
      /Indian Penal Code/gi,
      /Code of Criminal Procedure/gi,
      /Evidence Act/gi,
      /Bharatiya Nyaya Sanhita/gi,
      /Sexual Harassment.*?Act[,\s]*\d{4}/gi,
      /Protection of.*?Act[,\s]*\d{4}/gi,
    ];

    for (const pattern of actPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        acts.add(match[0].trim());
      }
    }

    return Array.from(acts);
  }

  private detectLanguage(text: string): { name: string; code: string } {
    // Simple language detection based on Unicode ranges
    const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;
    const tamilCount = (text.match(/[\u0B80-\u0BFF]/g) || []).length;
    const teluguCount = (text.match(/[\u0C00-\u0C7F]/g) || []).length;
    const bengaliCount = (text.match(/[\u0980-\u09FF]/g) || []).length;
    const kannadaCount = (text.match(/[\u0C80-\u0CFF]/g) || []).length;
    const malayalamCount = (text.match(/[\u0D00-\u0D7F]/g) || []).length;
    const gujaratiCount = (text.match(/[\u0A80-\u0AFF]/g) || []).length;
    const gurmukhiCount = (text.match(/[\u0A00-\u0A7F]/g) || []).length; // Punjabi
    const oriyaCount = (text.match(/[\u0B00-\u0B7F]/g) || []).length; // Odia

    const total = text.length;

    if (devanagariCount / total > 0.1) return { name: 'Hindi', code: 'hi' };
    if (tamilCount / total > 0.1) return { name: 'Tamil', code: 'ta' };
    if (teluguCount / total > 0.1) return { name: 'Telugu', code: 'te' };
    if (bengaliCount / total > 0.1) return { name: 'Bengali', code: 'bn' };
    if (kannadaCount / total > 0.1) return { name: 'Kannada', code: 'kn' };
    if (malayalamCount / total > 0.1) return { name: 'Malayalam', code: 'ml' };
    if (gujaratiCount / total > 0.1) return { name: 'Gujarati', code: 'gu' };
    if (gurmukhiCount / total > 0.1) return { name: 'Punjabi', code: 'pa' };
    if (oriyaCount / total > 0.1) return { name: 'Odia', code: 'or' };

    return { name: 'English', code: 'en' };
  }

  private estimateLanguagePercentage(text: string): number {
    const regionalChars = (text.match(/[\u0900-\u0D7F]/g) || []).length;
    const total = text.length;
    return Math.round((regionalChars / total) * 100);
  }

  private parseJudgmentSections($: cheerio.CheerioAPI): any {
    // This is a simplified version - could be enhanced with better NLP
    const fullText = $('#judgment, .judgments').text();

    return {
      facts: this.extractSection(fullText, ['FACTS', 'Background', 'तथ्य']),
      evidence: this.extractSection(fullText, ['EVIDENCE', 'साक्ष्य', 'APPRECIATION OF EVIDENCE']),
      witnessTestimony: this.extractSection(fullText, ['WITNESS', 'साक्षी', 'PW-', 'DW-']),
      reasoning: this.extractSection(fullText, ['DISCUSSION', 'ANALYSIS', 'विश्लेषण', 'FINDINGS']),
      holding: this.extractSection(fullText, ['CONCLUSION', 'HELD', 'निष्कर्ष', 'ORDER']),
    };
  }

  private extractSection(text: string, keywords: string[]): string | undefined {
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[:\\s]+([\\s\\S]{100,}?)(?=\\n\\n[A-Z]{3,}|$)`, 'i');
      const match = text.match(regex);
      if (match) {
        return match[1].trim();
      }
    }
    return undefined;
  }

  private determineCourtLevel(court: string): IndianLegalMetadata['courtLevel'] {
    if (/Supreme Court/i.test(court)) return 'Supreme Court';
    if (/High Court/i.test(court)) return 'High Court';
    if (/District Court/i.test(court)) return 'District Court';
    if (/Sessions Court/i.test(court)) return 'Sessions Court';
    if (/Tribunal/i.test(court)) return 'Tribunal';
    return 'Subordinate Court';
  }

  private detectWitnessTestimony(text: string): boolean {
    const patterns = [
      /PW-?\d+/i,
      /DW-?\d+/i,
      /witness/i,
      /साक्षी/,
      /examination-in-chief/i,
      /cross-examination/i,
      /testified/i,
    ];

    return patterns.some(pattern => pattern.test(text));
  }

  private estimateReasoningDepth(text: string): 'shallow' | 'moderate' | 'deep' {
    const wordCount = text.split(/\s+/).length;
    const legalTerms = (text.match(/(?:held|observed|prima facie|ratio decidendi|obiter|precedent|distinguished)/gi) || []).length;
    const citations = (text.match(/\d{4}\s+SCC|AIR\s+\d{4}|(?:19|20)\d{2}\s+\(\d+\)\s+[A-Z]+/g) || []).length;

    const complexity = (legalTerms / wordCount * 1000) + (citations / 10);

    if (complexity > 5 && wordCount > 3000) return 'deep';
    if (complexity > 2 && wordCount > 1000) return 'moderate';
    return 'shallow';
  }

  private formatDateForIndianKanoon(date: string): string {
    // IndianKanoon expects DD-MM-YYYY
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
