// Type definitions for Indian legal system research

import { ScraperResult } from './index.js';

/**
 * Extended metadata for Indian legal judgments
 */
export interface IndianLegalMetadata {
  // Court Information
  court: string;
  courtLevel: 'Supreme Court' | 'High Court' | 'District Court' | 'Sessions Court' | 'Subordinate Court' | 'Tribunal';
  district?: string;
  state?: string;
  bench?: string;

  // Case Identification
  caseNumber?: string;
  cnrNumber?: string; // Case Number Registration
  caseYear?: number;
  caseType?: string; // Criminal / Civil / Writ / etc.

  // Parties
  parties?: {
    petitioner?: string;
    respondent?: string;
    appellant?: string;
    plaintiff?: string;
    defendant?: string;
    state?: string;
  };

  // Judicial Information
  judges?: string[];
  coram?: string; // Full bench description
  headnote?: string;

  // Dates
  filingDate?: string;
  decisionDate?: string;
  hearingDates?: string[];

  // Legal References
  ipcSections?: string[]; // Indian Penal Code sections
  bnsSections?: string[]; // Bharatiya Nyaya Sanhita sections
  crpcSections?: string[]; // Criminal Procedure Code sections
  cpcSections?: string[]; // Civil Procedure Code sections
  acts?: string[]; // Other acts referenced
  citedCases?: Array<{
    caseName: string;
    citation?: string;
    relationship?: 'followed' | 'distinguished' | 'overruled' | 'cited' | 'approved' | 'relied';
  }>;

  // Language and Semantic Analysis
  language?: string; // Primary language of judgment
  languageCode?: string; // ISO 639 code
  languagePercentage?: number; // % of judgment in primary regional language
  containsEnglishLegalTerms?: boolean;
  translationQuality?: 'original' | 'translated' | 'mixed';

  // Content Sections (for semantic analysis)
  sections?: {
    facts?: string;
    submissions?: string;
    evidence?: string;
    witnessTestimony?: string;
    legalIssues?: string;
    discussion?: string;
    reasoning?: string;
    holding?: string;
    directions?: string;
  };

  // Research-Specific Metadata
  primaryConcept?: 'consent' | 'dishonest_intention' | 'reasonable_doubt' | 'sexual_harassment' | 'cruelty' | 'other';
  hasWitnessTestimony?: boolean;
  reasoningDepth?: 'shallow' | 'moderate' | 'deep';
  ocrQuality?: 'excellent' | 'good' | 'fair' | 'poor';

  // Citation Formats (Indian)
  airCitation?: string; // All India Reporter
  sccCitation?: string; // Supreme Court Cases
  scalesCitation?: string; // Supreme Court Almanac
  criminalLJCitation?: string;
  otherCitations?: string[];
}

/**
 * Result type for Indian legal research
 */
export interface IndianLegalResult extends ScraperResult {
  metadata?: IndianLegalMetadata;
}

/**
 * Search options for Indian legal databases
 */
export interface IndianLegalSearchOptions {
  // Basic Search
  query: string;
  exactPhrase?: string;
  language?: string; // 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'kn' | 'ml' | 'gu' | 'pa' | 'or'

  // Court Filters
  court?: string;
  courtLevel?: 'Supreme Court' | 'High Court' | 'District Court' | 'Sessions Court' | 'Subordinate Court';
  state?: string;
  district?: string;

  // Date Range
  fromDate?: string; // YYYY-MM-DD
  toDate?: string;

  // Legal Filters
  ipcSection?: string | string[];
  bnsSection?: string | string[];
  act?: string;
  caseType?: 'criminal' | 'civil' | 'writ' | 'constitutional' | 'arbitration' | 'company' | 'tax';

  // Result Options
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'date' | 'citations';
  sortOrder?: 'asc' | 'desc';

  // Research Filters (for semantic analysis)
  minLength?: number; // Minimum number of words/pages
  requireWitnessTestimony?: boolean;
  primaryConcept?: string;
}

/**
 * Concepts for semantic gap research
 */
export type LegalConcept =
  | 'consent'
  | 'dishonest_intention'
  | 'reasonable_doubt'
  | 'sexual_harassment'
  | 'cruelty'
  | 'provocation'
  | 'self_defense'
  | 'negligence'
  | 'malice'
  | 'fraud'
  | 'coercion'
  | 'undue_influence'
  | 'mens_rea'
  | 'actus_reus';

/**
 * Language codes for Indian regional languages
 */
export const INDIAN_LANGUAGES = {
  hi: 'Hindi',
  ta: 'Tamil',
  te: 'Telugu',
  bn: 'Bengali',
  mr: 'Marathi',
  kn: 'Kannada',
  ml: 'Malayalam',
  gu: 'Gujarati',
  pa: 'Punjabi',
  or: 'Odia',
  as: 'Assamese',
  ur: 'Urdu',
  sa: 'Sanskrit',
} as const;

/**
 * States and their primary languages
 */
export const STATE_LANGUAGES: Record<string, string[]> = {
  'Uttar Pradesh': ['hi', 'ur'],
  'Bihar': ['hi'],
  'Madhya Pradesh': ['hi'],
  'Rajasthan': ['hi'],
  'Jharkhand': ['hi'],
  'Chhattisgarh': ['hi'],
  'Haryana': ['hi'],
  'Himachal Pradesh': ['hi'],
  'Delhi': ['hi'],
  'Tamil Nadu': ['ta'],
  'Andhra Pradesh': ['te'],
  'Telangana': ['te'],
  'West Bengal': ['bn'],
  'Tripura': ['bn'],
  'Maharashtra': ['mr'],
  'Karnataka': ['kn'],
  'Kerala': ['ml'],
  'Gujarat': ['gu'],
  'Punjab': ['pa'],
  'Chandigarh': ['pa', 'hi'],
  'Odisha': ['or'],
  'Assam': ['as'],
};

/**
 * IPC sections related to research concepts
 */
export const IPC_SECTIONS_BY_CONCEPT: Record<LegalConcept, string[]> = {
  consent: ['375', '376', '354', '354A', '354B', '354C', '354D', '363', '364', '365', '366'],
  dishonest_intention: ['378', '379', '380', '403', '405', '406', '415', '417', '418', '420'],
  reasonable_doubt: [], // Applies to all criminal cases
  sexual_harassment: ['354A', '354B', '354C', '354D', '509'],
  cruelty: ['498A', '304B'],
  provocation: ['299', '300', '304', 'Exception 1 to 300'],
  self_defense: ['96', '97', '98', '99', '100', '101', '102', '103', '104', '105', '106'],
  negligence: ['279', '280', '283', '284', '285', '286', '287', '288', '304A'],
  malice: ['299', '300'],
  fraud: ['415', '416', '417', '418', '419', '420', '421', '422', '423', '424'],
  coercion: ['506', '507', '508', '509'],
  undue_influence: [], // Primarily Contract Act
  mens_rea: [], // General concept across crimes
  actus_reus: [], // General concept across crimes
};
