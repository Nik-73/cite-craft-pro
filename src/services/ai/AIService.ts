/**
 * AI Service for Legal Case Analysis
 * Provides comprehensive AI-powered analysis using Claude API
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  AIServiceConfig,
  AIAnalysisRequest,
  AIAnalysisResponse,
  ComprehensiveCaseAnalysis,
  CaseSummary,
  LegalHolding,
  PrecedentAnalysis,
  CitationRecommendation,
  WritingAnalysis
} from './types';

export class AIService {
  private client: Anthropic;
  private model: string;
  private maxTokens: number;
  private temperature: number;

  // Token pricing for Claude Sonnet (per million tokens)
  private readonly INPUT_TOKEN_COST = 3.00;  // $3 per million input tokens
  private readonly OUTPUT_TOKEN_COST = 15.00; // $15 per million output tokens

  constructor(config: AIServiceConfig) {
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
    this.model = config.model || 'claude-sonnet-4-20250514';
    this.maxTokens = config.maxTokens || 4096;
    this.temperature = config.temperature || 0.7;
  }

  /**
   * Calculate cost based on token usage
   */
  private calculateCost(inputTokens: number, outputTokens: number): number {
    const inputCost = (inputTokens / 1_000_000) * this.INPUT_TOKEN_COST;
    const outputCost = (outputTokens / 1_000_000) * this.OUTPUT_TOKEN_COST;
    return inputCost + outputCost;
  }

  /**
   * Make an API call to Claude
   */
  private async makeRequest(
    systemPrompt: string,
    userPrompt: string,
    temperature?: number
  ): Promise<AIAnalysisResponse<string>> {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: temperature ?? this.temperature,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      const content = response.content[0];
      const text = content.type === 'text' ? content.text : '';

      const inputTokens = response.usage.input_tokens;
      const outputTokens = response.usage.output_tokens;

      return {
        success: true,
        data: text,
        usage: {
          inputTokens,
          outputTokens,
          totalCost: this.calculateCost(inputTokens, outputTokens),
        },
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Parse JSON response safely
   */
  private parseJSON<T>(text: string): T | null {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      return JSON.parse(jsonText.trim());
    } catch (error) {
      console.error('JSON Parse Error:', error);
      return null;
    }
  }

  /**
   * Summarize a legal case
   */
  async summarizeCase(caseContent: string): Promise<AIAnalysisResponse<CaseSummary>> {
    const systemPrompt = `You are an expert legal analyst specializing in case summarization.
Your task is to analyze legal cases and provide comprehensive, accurate summaries suitable for legal research.
Always respond with valid JSON matching the CaseSummary interface.`;

    const userPrompt = `Analyze this legal case and provide a comprehensive summary in JSON format:

${caseContent}

Provide a JSON response with this structure:
{
  "briefSummary": "2-3 sentence overview of the case",
  "detailedSummary": "Comprehensive 2-3 paragraph summary",
  "keyFacts": ["fact 1", "fact 2", "fact 3", ...],
  "proceduralHistory": "Brief procedural history",
  "wordCount": number
}`;

    const response = await this.makeRequest(systemPrompt, userPrompt, 0.3);

    if (!response.success || !response.data) {
      return { success: false, error: response.error };
    }

    const summary = this.parseJSON<CaseSummary>(response.data);
    if (!summary) {
      return { success: false, error: 'Failed to parse case summary' };
    }

    return {
      success: true,
      data: summary,
      usage: response.usage,
    };
  }

  /**
   * Extract legal holdings and principles
   */
  async extractHoldings(caseContent: string): Promise<AIAnalysisResponse<LegalHolding>> {
    const systemPrompt = `You are an expert legal scholar specializing in case law analysis.
Your task is to identify and extract legal holdings, principles, and rules from judicial opinions.
Always respond with valid JSON matching the LegalHolding interface.`;

    const userPrompt = `Analyze this legal case and extract the holdings and legal principles in JSON format:

${caseContent}

Provide a JSON response with this structure:
{
  "primaryHolding": "The main legal holding of the case",
  "secondaryHoldings": ["secondary holding 1", "secondary holding 2", ...],
  "legalPrinciples": ["principle 1", "principle 2", ...],
  "ruleOfLaw": "The rule of law established or applied",
  "precedentialValue": "high" | "medium" | "low"
}`;

    const response = await this.makeRequest(systemPrompt, userPrompt, 0.2);

    if (!response.success || !response.data) {
      return { success: false, error: response.error };
    }

    const holding = this.parseJSON<LegalHolding>(response.data);
    if (!holding) {
      return { success: false, error: 'Failed to parse legal holdings' };
    }

    return {
      success: true,
      data: holding,
      usage: response.usage,
    };
  }

  /**
   * Analyze precedents and case relationships
   */
  async analyzePrecedents(caseContent: string): Promise<AIAnalysisResponse<PrecedentAnalysis>> {
    const systemPrompt = `You are an expert legal researcher specializing in precedent analysis and case law relationships.
Your task is to identify cited cases, legal topics, and jurisdictional scope.
Always respond with valid JSON matching the PrecedentAnalysis interface.`;

    const userPrompt = `Analyze this legal case for precedents and citations in JSON format:

${caseContent}

Provide a JSON response with this structure:
{
  "citedCases": [
    {
      "caseName": "Case name",
      "citation": "Reporter citation",
      "relationship": "followed" | "distinguished" | "overruled" | "cited",
      "relevance": "Why this case was cited"
    }
  ],
  "legalTopics": ["topic 1", "topic 2", ...],
  "jurisdictionScope": "Federal/State/Circuit court description",
  "temporalRelevance": "Assessment of how current/relevant this case law is"
}`;

    const response = await this.makeRequest(systemPrompt, userPrompt, 0.3);

    if (!response.success || !response.data) {
      return { success: false, error: response.error };
    }

    const precedent = this.parseJSON<PrecedentAnalysis>(response.data);
    if (!precedent) {
      return { success: false, error: 'Failed to parse precedent analysis' };
    }

    return {
      success: true,
      data: precedent,
      usage: response.usage,
    };
  }

  /**
   * Recommend citations for a legal paper
   */
  async recommendCitations(
    paperContent: string,
    existingCitations: any[] = []
  ): Promise<AIAnalysisResponse<CitationRecommendation>> {
    const systemPrompt = `You are an expert legal writing consultant specializing in citation analysis and recommendations.
Your task is to analyze legal papers and suggest relevant case citations that strengthen legal arguments.
Always respond with valid JSON matching the CitationRecommendation interface.`;

    const citationList = existingCitations.map(c => `${c.author} - ${c.title}`).join('\n');

    const userPrompt = `Analyze this legal paper and recommend additional citations in JSON format:

PAPER CONTENT:
${paperContent}

EXISTING CITATIONS:
${citationList}

Provide a JSON response with this structure:
{
  "suggestedCases": [
    {
      "caseName": "Case name",
      "citation": "Citation format",
      "relevanceScore": 0-100,
      "reason": "Why this case should be cited",
      "suggestedLocation": "Where in the paper to cite this"
    }
  ],
  "missingTopics": ["topic 1", "topic 2", ...],
  "strengthAssessment": "Overall assessment of citation strength"
}`;

    const response = await this.makeRequest(systemPrompt, userPrompt, 0.5);

    if (!response.success || !response.data) {
      return { success: false, error: response.error };
    }

    const recommendation = this.parseJSON<CitationRecommendation>(response.data);
    if (!recommendation) {
      return { success: false, error: 'Failed to parse citation recommendations' };
    }

    return {
      success: true,
      data: recommendation,
      usage: response.usage,
    };
  }

  /**
   * Analyze legal writing quality
   */
  async analyzeWriting(paperContent: string): Promise<AIAnalysisResponse<WritingAnalysis>> {
    const systemPrompt = `You are an expert legal writing professor and consultant.
Your task is to analyze legal papers for structure, argumentation, clarity, and legal reasoning quality.
Provide constructive, specific feedback that helps improve legal writing.
Always respond with valid JSON matching the WritingAnalysis interface.`;

    const userPrompt = `Analyze this legal paper and provide comprehensive writing feedback in JSON format:

${paperContent}

Provide a JSON response with this structure:
{
  "overallAssessment": "Overall evaluation of the paper",
  "strengths": ["strength 1", "strength 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "suggestions": [
    {
      "category": "structure" | "argument" | "citation" | "clarity" | "legal reasoning",
      "issue": "Specific issue identified",
      "suggestion": "Concrete suggestion for improvement",
      "priority": "high" | "medium" | "low"
    }
  ],
  "citationQuality": {
    "score": 0-100,
    "feedback": "Specific feedback on citation usage"
  },
  "legalReasoningScore": 0-100
}`;

    const response = await this.makeRequest(systemPrompt, userPrompt, 0.4);

    if (!response.success || !response.data) {
      return { success: false, error: response.error };
    }

    const analysis = this.parseJSON<WritingAnalysis>(response.data);
    if (!analysis) {
      return { success: false, error: 'Failed to parse writing analysis' };
    }

    return {
      success: true,
      data: analysis,
      usage: response.usage,
    };
  }

  /**
   * Perform comprehensive case analysis (all features combined)
   */
  async comprehensiveAnalysis(
    caseContent: string,
    caseTitle: string,
    citation: string
  ): Promise<AIAnalysisResponse<ComprehensiveCaseAnalysis>> {
    try {
      // Run all analyses in parallel for efficiency
      const [summaryResult, holdingResult, precedentResult] = await Promise.all([
        this.summarizeCase(caseContent),
        this.extractHoldings(caseContent),
        this.analyzePrecedents(caseContent),
      ]);

      if (!summaryResult.success || !holdingResult.success || !precedentResult.success) {
        return {
          success: false,
          error: 'One or more analysis components failed',
        };
      }

      const totalInputTokens =
        (summaryResult.usage?.inputTokens || 0) +
        (holdingResult.usage?.inputTokens || 0) +
        (precedentResult.usage?.inputTokens || 0);

      const totalOutputTokens =
        (summaryResult.usage?.outputTokens || 0) +
        (holdingResult.usage?.outputTokens || 0) +
        (precedentResult.usage?.outputTokens || 0);

      const totalCost = this.calculateCost(totalInputTokens, totalOutputTokens);

      const comprehensiveAnalysis: ComprehensiveCaseAnalysis = {
        caseTitle,
        citation,
        summary: summaryResult.data!,
        holding: holdingResult.data!,
        precedent: precedentResult.data!,
        analysisMetadata: {
          analyzedAt: new Date().toISOString(),
          confidence: 0.85,
          tokensUsed: totalInputTokens + totalOutputTokens,
        },
      };

      return {
        success: true,
        data: comprehensiveAnalysis,
        usage: {
          inputTokens: totalInputTokens,
          outputTokens: totalOutputTokens,
          totalCost,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Comprehensive analysis failed',
      };
    }
  }
}
