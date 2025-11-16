/**
 * Analysis Manager
 * Orchestrates AI-powered legal analysis workflows
 */

import { AIService } from './AIService';
import {
  AIAnalysisResponse,
  ComprehensiveCaseAnalysis,
  CaseSummary,
  LegalHolding,
  PrecedentAnalysis,
  CitationRecommendation,
  WritingAnalysis,
} from './types';

export interface AnalysisResult {
  id: string;
  type: string;
  timestamp: string;
  data: any;
  cost: number;
  tokensUsed: number;
}

export interface BatchAnalysisProgress {
  total: number;
  completed: number;
  failed: number;
  totalCost: number;
  estimatedTimeRemaining: number;
}

export class AnalysisManager {
  private aiService: AIService;
  private analysisHistory: AnalysisResult[] = [];
  private totalCostAccumulated: number = 0;

  constructor(apiKey: string) {
    this.aiService = new AIService({ apiKey });
  }

  /**
   * Get total cost accumulated in this session
   */
  getTotalCost(): number {
    return this.totalCostAccumulated;
  }

  /**
   * Get analysis history
   */
  getHistory(): AnalysisResult[] {
    return [...this.analysisHistory];
  }

  /**
   * Clear analysis history
   */
  clearHistory(): void {
    this.analysisHistory = [];
  }

  /**
   * Record an analysis result
   */
  private recordAnalysis(type: string, data: any, usage?: { totalCost: number; inputTokens: number; outputTokens: number }): void {
    const cost = usage?.totalCost || 0;
    const tokensUsed = (usage?.inputTokens || 0) + (usage?.outputTokens || 0);

    this.analysisHistory.push({
      id: this.generateId(),
      type,
      timestamp: new Date().toISOString(),
      data,
      cost,
      tokensUsed,
    });

    this.totalCostAccumulated += cost;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Analyze a single case comprehensively
   */
  async analyzeCase(
    caseContent: string,
    caseTitle: string,
    citation: string,
    onProgress?: (stage: string) => void
  ): Promise<AIAnalysisResponse<ComprehensiveCaseAnalysis>> {
    onProgress?.('Starting comprehensive analysis...');

    const result = await this.aiService.comprehensiveAnalysis(caseContent, caseTitle, citation);

    if (result.success && result.data) {
      this.recordAnalysis('comprehensive_case_analysis', result.data, result.usage);
      onProgress?.('Analysis complete!');
    } else {
      onProgress?.('Analysis failed');
    }

    return result;
  }

  /**
   * Batch analyze multiple cases
   */
  async batchAnalyzeCases(
    cases: Array<{ content: string; title: string; citation: string }>,
    onProgress?: (progress: BatchAnalysisProgress) => void
  ): Promise<{
    results: Array<AIAnalysisResponse<ComprehensiveCaseAnalysis>>;
    summary: {
      successful: number;
      failed: number;
      totalCost: number;
      totalTokens: number;
    };
  }> {
    const results: Array<AIAnalysisResponse<ComprehensiveCaseAnalysis>> = [];
    let successful = 0;
    let failed = 0;
    let totalCost = 0;
    let totalTokens = 0;
    const startTime = Date.now();

    for (let i = 0; i < cases.length; i++) {
      const caseData = cases[i];
      const result = await this.aiService.comprehensiveAnalysis(
        caseData.content,
        caseData.title,
        caseData.citation
      );

      results.push(result);

      if (result.success) {
        successful++;
        totalCost += result.usage?.totalCost || 0;
        totalTokens += (result.usage?.inputTokens || 0) + (result.usage?.outputTokens || 0);
        this.recordAnalysis('batch_case_analysis', result.data, result.usage);
      } else {
        failed++;
      }

      // Calculate progress and estimated time
      const completed = i + 1;
      const avgTimePerCase = (Date.now() - startTime) / completed;
      const estimatedTimeRemaining = Math.round((avgTimePerCase * (cases.length - completed)) / 1000);

      onProgress?.({
        total: cases.length,
        completed,
        failed,
        totalCost,
        estimatedTimeRemaining,
      });

      // Add a small delay between requests to avoid rate limiting
      if (i < cases.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return {
      results,
      summary: {
        successful,
        failed,
        totalCost,
        totalTokens,
      },
    };
  }

  /**
   * Analyze legal writing
   */
  async analyzeLegalWriting(
    paperContent: string,
    onProgress?: (stage: string) => void
  ): Promise<AIAnalysisResponse<WritingAnalysis>> {
    onProgress?.('Analyzing legal writing...');

    const result = await this.aiService.analyzeWriting(paperContent);

    if (result.success && result.data) {
      this.recordAnalysis('writing_analysis', result.data, result.usage);
      onProgress?.('Writing analysis complete!');
    } else {
      onProgress?.('Writing analysis failed');
    }

    return result;
  }

  /**
   * Get citation recommendations
   */
  async getCitationRecommendations(
    paperContent: string,
    existingCitations: any[],
    onProgress?: (stage: string) => void
  ): Promise<AIAnalysisResponse<CitationRecommendation>> {
    onProgress?.('Generating citation recommendations...');

    const result = await this.aiService.recommendCitations(paperContent, existingCitations);

    if (result.success && result.data) {
      this.recordAnalysis('citation_recommendations', result.data, result.usage);
      onProgress?.('Recommendations ready!');
    } else {
      onProgress?.('Recommendation generation failed');
    }

    return result;
  }

  /**
   * Quick case summary (lighter weight)
   */
  async quickSummary(caseContent: string): Promise<AIAnalysisResponse<CaseSummary>> {
    const result = await this.aiService.summarizeCase(caseContent);

    if (result.success && result.data) {
      this.recordAnalysis('quick_summary', result.data, result.usage);
    }

    return result;
  }

  /**
   * Extract holdings only
   */
  async extractHoldingsOnly(caseContent: string): Promise<AIAnalysisResponse<LegalHolding>> {
    const result = await this.aiService.extractHoldings(caseContent);

    if (result.success && result.data) {
      this.recordAnalysis('holdings_extraction', result.data, result.usage);
    }

    return result;
  }

  /**
   * Analyze precedents only
   */
  async analyzePrecedentsOnly(caseContent: string): Promise<AIAnalysisResponse<PrecedentAnalysis>> {
    const result = await this.aiService.analyzePrecedents(caseContent);

    if (result.success && result.data) {
      this.recordAnalysis('precedent_analysis', result.data, result.usage);
    }

    return result;
  }

  /**
   * Perform comprehensive paper analysis (writing + citations)
   */
  async comprehensivePaperAnalysis(
    paperContent: string,
    existingCitations: any[],
    onProgress?: (stage: string) => void
  ): Promise<{
    writing: AIAnalysisResponse<WritingAnalysis>;
    recommendations: AIAnalysisResponse<CitationRecommendation>;
    totalCost: number;
  }> {
    onProgress?.('Analyzing writing quality...');
    const writingResult = await this.analyzeLegalWriting(paperContent);

    onProgress?.('Generating citation recommendations...');
    const recommendationsResult = await this.getCitationRecommendations(paperContent, existingCitations);

    const totalCost =
      (writingResult.usage?.totalCost || 0) + (recommendationsResult.usage?.totalCost || 0);

    return {
      writing: writingResult,
      recommendations: recommendationsResult,
      totalCost,
    };
  }

  /**
   * Export analysis results to JSON
   */
  exportAnalysisHistory(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        totalCost: this.totalCostAccumulated,
        totalAnalyses: this.analysisHistory.length,
        analyses: this.analysisHistory,
      },
      null,
      2
    );
  }

  /**
   * Get cost estimate for operations
   */
  estimateCost(operation: 'case' | 'writing' | 'citations' | 'comprehensive', count: number = 1): {
    estimatedCost: number;
    estimatedTokens: number;
    description: string;
  } {
    const estimates = {
      case: {
        tokens: 8000,
        cost: 0.15,
        description: 'Comprehensive case analysis (summary + holdings + precedents)',
      },
      writing: {
        tokens: 6000,
        cost: 0.12,
        description: 'Legal writing analysis',
      },
      citations: {
        tokens: 5000,
        cost: 0.10,
        description: 'Citation recommendations',
      },
      comprehensive: {
        tokens: 20000,
        cost: 0.40,
        description: 'Full paper + writing + citation analysis',
      },
    };

    const estimate = estimates[operation];

    return {
      estimatedCost: estimate.cost * count,
      estimatedTokens: estimate.tokens * count,
      description: `${estimate.description} (${count} ${count === 1 ? 'item' : 'items'})`,
    };
  }
}
