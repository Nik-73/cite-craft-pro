/**
 * Free Analysis Manager
 * Manages AI analysis using FREE backends
 */

import { FreeAIService, AIBackend } from './FreeAIService';
import type {
  AIAnalysisResponse,
  CaseSummary,
  LegalHolding,
  ComprehensiveCaseAnalysis,
} from './types';

export interface FreeAnalysisResult {
  id: string;
  type: string;
  timestamp: string;
  data: any;
  backend: AIBackend;
  model: string;
}

export class FreeAnalysisManager {
  private aiService: FreeAIService;
  private analysisHistory: FreeAnalysisResult[] = [];
  private backend: AIBackend;

  constructor(backend: AIBackend, apiKey?: string) {
    this.backend = backend;
    this.aiService = new FreeAIService({ backend, apiKey });
  }

  /**
   * Get analysis history
   */
  getHistory(): FreeAnalysisResult[] {
    return [...this.analysisHistory];
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.analysisHistory = [];
  }

  /**
   * Record an analysis
   */
  private recordAnalysis(type: string, data: any): void {
    const backendInfo = this.aiService.getBackendInfo();

    this.analysisHistory.push({
      id: this.generateId(),
      type,
      timestamp: new Date().toISOString(),
      data,
      backend: backendInfo.backend,
      model: backendInfo.model,
    });
  }

  /**
   * Generate ID
   */
  private generateId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Analyze a single case
   */
  async analyzeCase(
    caseContent: string,
    caseTitle: string,
    citation: string,
    onProgress?: (stage: string) => void
  ): Promise<AIAnalysisResponse<ComprehensiveCaseAnalysis>> {
    try {
      onProgress?.('Starting analysis...');

      onProgress?.('Generating summary...');
      const summaryResult = await this.aiService.summarizeCase(caseContent);

      if (!summaryResult.success || !summaryResult.data) {
        return { success: false, error: summaryResult.error };
      }

      onProgress?.('Extracting holdings...');
      const holdingResult = await this.aiService.extractHoldings(caseContent);

      if (!holdingResult.success || !holdingResult.data) {
        return { success: false, error: holdingResult.error };
      }

      const comprehensiveAnalysis: ComprehensiveCaseAnalysis = {
        caseTitle,
        citation,
        summary: summaryResult.data,
        holding: holdingResult.data,
        precedent: {
          citedCases: [],
          legalTopics: [],
          jurisdictionScope: 'Not analyzed (save API calls)',
          temporalRelevance: 'Current',
        },
        analysisMetadata: {
          analyzedAt: new Date().toISOString(),
          confidence: 0.75,
          tokensUsed:
            (summaryResult.usage?.inputTokens || 0) +
            (summaryResult.usage?.outputTokens || 0) +
            (holdingResult.usage?.inputTokens || 0) +
            (holdingResult.usage?.outputTokens || 0),
        },
      };

      this.recordAnalysis('case_analysis', comprehensiveAnalysis);
      onProgress?.('Analysis complete!');

      return {
        success: true,
        data: comprehensiveAnalysis,
        usage: {
          inputTokens:
            (summaryResult.usage?.inputTokens || 0) + (holdingResult.usage?.inputTokens || 0),
          outputTokens:
            (summaryResult.usage?.outputTokens || 0) + (holdingResult.usage?.outputTokens || 0),
          totalCost: 0, // FREE!
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
      };
    }
  }

  /**
   * Batch analyze cases
   */
  async batchAnalyzeCases(
    cases: Array<{ content: string; title: string; citation: string }>,
    onProgress?: (progress: { completed: number; total: number }) => void
  ): Promise<{
    results: Array<AIAnalysisResponse<ComprehensiveCaseAnalysis>>;
    summary: { successful: number; failed: number };
  }> {
    const results: Array<AIAnalysisResponse<ComprehensiveCaseAnalysis>> = [];
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < cases.length; i++) {
      const caseData = cases[i];
      const result = await this.analyzeCase(caseData.content, caseData.title, caseData.citation);

      results.push(result);

      if (result.success) {
        successful++;
      } else {
        failed++;
      }

      onProgress?.({ completed: i + 1, total: cases.length });

      // Small delay to avoid rate limits
      if (i < cases.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay
      }
    }

    return {
      results,
      summary: { successful, failed },
    };
  }

  /**
   * Quick summary only
   */
  async quickSummary(caseContent: string): Promise<AIAnalysisResponse<CaseSummary>> {
    const result = await this.aiService.summarizeCase(caseContent);

    if (result.success && result.data) {
      this.recordAnalysis('quick_summary', result.data);
    }

    return result;
  }

  /**
   * Export history
   */
  exportHistory(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        backend: this.backend,
        totalAnalyses: this.analysisHistory.length,
        analyses: this.analysisHistory,
      },
      null,
      2
    );
  }

  /**
   * Get backend info
   */
  getBackendInfo() {
    return this.aiService.getBackendInfo();
  }
}
