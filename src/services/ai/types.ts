/**
 * AI Analysis Types for Legal Case Processing
 */

export interface CaseSummary {
  briefSummary: string;
  detailedSummary: string;
  keyFacts: string[];
  proceduralHistory: string;
  wordCount: number;
}

export interface LegalHolding {
  primaryHolding: string;
  secondaryHoldings: string[];
  legalPrinciples: string[];
  ruleOfLaw: string;
  precedentialValue: 'high' | 'medium' | 'low';
}

export interface PrecedentAnalysis {
  citedCases: Array<{
    caseName: string;
    citation: string;
    relationship: 'followed' | 'distinguished' | 'overruled' | 'cited';
    relevance: string;
  }>;
  legalTopics: string[];
  jurisdictionScope: string;
  temporalRelevance: string;
}

export interface CitationRecommendation {
  suggestedCases: Array<{
    caseName: string;
    citation: string;
    relevanceScore: number;
    reason: string;
    suggestedLocation: string;
  }>;
  missingTopics: string[];
  strengthAssessment: string;
}

export interface WritingAnalysis {
  overallAssessment: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: Array<{
    category: 'structure' | 'argument' | 'citation' | 'clarity' | 'legal reasoning';
    issue: string;
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  citationQuality: {
    score: number;
    feedback: string;
  };
  legalReasoningScore: number;
}

export interface ComprehensiveCaseAnalysis {
  caseTitle: string;
  citation: string;
  summary: CaseSummary;
  holding: LegalHolding;
  precedent: PrecedentAnalysis;
  analysisMetadata: {
    analyzedAt: string;
    confidence: number;
    tokensUsed: number;
  };
}

export interface AIAnalysisRequest {
  type: 'summarize' | 'holdings' | 'precedent' | 'recommend' | 'writing-analysis' | 'comprehensive';
  content: string;
  context?: {
    userPaper?: string;
    existingCitations?: any[];
    jurisdiction?: string;
  };
}

export interface AIAnalysisResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
  };
}

export interface AIServiceConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}
