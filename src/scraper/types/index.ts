// Type definitions for the legal research scraper

export interface ScraperResult {
  id: string;
  title: string;
  author?: string;
  date?: string;
  url: string;
  source: string;
  content: string;
  citation?: {
    bluebook?: string;
    alwd?: string;
    apa?: string;
  };
  metadata?: {
    court?: string;
    caseNumber?: string;
    jurisdiction?: string;
    docket?: string;
    judges?: string[];
    parties?: {
      plaintiff?: string;
      defendant?: string;
    };
  };
}

export interface ScraperConfig {
  source: string;
  baseUrl: string;
  searchEndpoint?: string;
  timeout?: number;
  headers?: Record<string, string>;
  rateLimit?: number;
}

export interface ScraperOptions {
  query: string;
  limit?: number;
  jurisdiction?: string;
  dateFrom?: string;
  dateTo?: string;
  court?: string;
  caseType?: string;
}

export interface ScraperSource {
  name: string;
  description: string;
  search(options: ScraperOptions): Promise<ScraperResult[]>;
  getCaseById(id: string): Promise<ScraperResult | null>;
}

export type ScraperSourceType =
  | 'courtlistener'
  | 'justia'
  | 'caselaw'
  | 'cornell-lii'
  | 'google-scholar';
