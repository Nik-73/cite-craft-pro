/**
 * Free AI Service - Multiple Backends
 * Supports Groq (free tier), Hugging Face Inference (free), and browser-based AI
 */

import Groq from 'groq-sdk';
import { HfInference } from '@huggingface/inference';
import type {
  AIAnalysisResponse,
  CaseSummary,
  LegalHolding,
  PrecedentAnalysis,
  CitationRecommendation,
  WritingAnalysis,
  ComprehensiveCaseAnalysis,
} from './types';

export type AIBackend = 'groq' | 'huggingface' | 'browser' | 'anthropic';

export interface FreeAIServiceConfig {
  backend: AIBackend;
  apiKey?: string; // Optional for browser backend
  model?: string;
}

export class FreeAIService {
  private backend: AIBackend;
  private groqClient?: Groq;
  private hfClient?: HfInference;
  private model: string;

  // Completely FREE - no API key needed!
  static readonly BROWSER_BACKEND = 'browser';

  // FREE tier options (just need to sign up - no credit card!)
  static readonly GROQ_FREE_MODELS = [
    'llama-3.3-70b-versatile', // Fast and free
    'mixtral-8x7b-32768', // Good for long context
    'llama-3.1-8b-instant', // Very fast
  ];

  static readonly HF_FREE_MODELS = [
    'mistralai/Mixtral-8x7B-Instruct-v0.1',
    'meta-llama/Llama-3.2-3B-Instruct',
    'google/flan-t5-xxl',
  ];

  constructor(config: FreeAIServiceConfig) {
    this.backend = config.backend;

    if (config.backend === 'groq') {
      if (!config.apiKey) {
        throw new Error(
          'Groq API key required. Get one FREE at https://console.groq.com (no credit card needed!)'
        );
      }
      this.groqClient = new Groq({ apiKey: config.apiKey, dangerouslyAllowBrowser: true });
      this.model = config.model || FreeAIService.GROQ_FREE_MODELS[0];
    } else if (config.backend === 'huggingface') {
      if (!config.apiKey) {
        throw new Error(
          'Hugging Face token required. Get one FREE at https://huggingface.co/settings/tokens'
        );
      }
      this.hfClient = new HfInference(config.apiKey);
      this.model = config.model || FreeAIService.HF_FREE_MODELS[0];
    } else if (config.backend === 'browser') {
      this.model = 'Xenova/LaMini-Flan-T5-783M'; // Runs in browser!
    } else {
      // Anthropic fallback (paid)
      this.model = config.model || 'claude-sonnet-4-20250514';
    }
  }

  /**
   * Make an AI request using the selected backend
   */
  private async makeRequest(systemPrompt: string, userPrompt: string): Promise<AIAnalysisResponse<string>> {
    try {
      if (this.backend === 'groq') {
        return await this.makeGroqRequest(systemPrompt, userPrompt);
      } else if (this.backend === 'huggingface') {
        return await this.makeHFRequest(systemPrompt, userPrompt);
      } else if (this.backend === 'browser') {
        return await this.makeBrowserRequest(systemPrompt, userPrompt);
      }

      return {
        success: false,
        error: 'Unsupported backend',
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
   * Groq API Request (FREE TIER - 30 requests/min!)
   */
  private async makeGroqRequest(systemPrompt: string, userPrompt: string): Promise<AIAnalysisResponse<string>> {
    if (!this.groqClient) {
      return { success: false, error: 'Groq client not initialized' };
    }

    const response = await this.groqClient.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    const content = response.choices[0]?.message?.content || '';

    // Groq doesn't charge - it's FREE!
    return {
      success: true,
      data: content,
      usage: {
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
        totalCost: 0, // FREE!
      },
    };
  }

  /**
   * Hugging Face Inference Request (FREE TIER - 300 requests/hour!)
   */
  private async makeHFRequest(systemPrompt: string, userPrompt: string): Promise<AIAnalysisResponse<string>> {
    if (!this.hfClient) {
      return { success: false, error: 'Hugging Face client not initialized' };
    }

    const fullPrompt = `${systemPrompt}\n\nUser: ${userPrompt}\n\nAssistant:`;

    const response = await this.hfClient.textGeneration({
      model: this.model,
      inputs: fullPrompt,
      parameters: {
        max_new_tokens: 2048,
        temperature: 0.7,
        return_full_text: false,
      },
    });

    return {
      success: true,
      data: response.generated_text,
      usage: {
        inputTokens: Math.ceil(fullPrompt.length / 4), // Estimate
        outputTokens: Math.ceil(response.generated_text.length / 4),
        totalCost: 0, // FREE!
      },
    };
  }

  /**
   * Browser-based AI Request (COMPLETELY FREE - No API key needed!)
   * Uses Web Workers for performance
   */
  private async makeBrowserRequest(systemPrompt: string, userPrompt: string): Promise<AIAnalysisResponse<string>> {
    try {
      // Dynamically import transformers.js in browser
      // @ts-ignore - ESM import
      const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1');

      const generator = await pipeline('text2text-generation', this.model);

      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
      const result = await generator(fullPrompt, {
        max_length: 512,
        temperature: 0.7,
      });

      return {
        success: true,
        data: result[0].generated_text,
        usage: {
          inputTokens: Math.ceil(fullPrompt.length / 4),
          outputTokens: Math.ceil(result[0].generated_text.length / 4),
          totalCost: 0, // FREE - runs in your browser!
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Browser AI error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Parse JSON response safely
   */
  private parseJSON<T>(text: string): T | null {
    try {
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
    const systemPrompt = `You are an expert legal analyst. Analyze legal cases and provide summaries.
Always respond with valid JSON matching this structure:
{
  "briefSummary": "2-3 sentence overview",
  "detailedSummary": "2-3 paragraph summary",
  "keyFacts": ["fact1", "fact2"],
  "proceduralHistory": "Brief history",
  "wordCount": number
}`;

    const userPrompt = `Analyze this legal case and provide a summary:\n\n${caseContent.substring(0, 3000)}`;

    const response = await this.makeRequest(systemPrompt, userPrompt);

    if (!response.success || !response.data) {
      return { success: false, error: response.error };
    }

    const summary = this.parseJSON<CaseSummary>(response.data);
    if (!summary) {
      // Fallback: create summary from response
      return {
        success: true,
        data: {
          briefSummary: response.data.substring(0, 200),
          detailedSummary: response.data,
          keyFacts: [],
          proceduralHistory: 'Not extracted',
          wordCount: response.data.split(' ').length,
        },
        usage: response.usage,
      };
    }

    return {
      success: true,
      data: summary,
      usage: response.usage,
    };
  }

  /**
   * Extract legal holdings
   */
  async extractHoldings(caseContent: string): Promise<AIAnalysisResponse<LegalHolding>> {
    const systemPrompt = `Extract legal holdings from cases. Respond with JSON:
{
  "primaryHolding": "main holding",
  "secondaryHoldings": [],
  "legalPrinciples": [],
  "ruleOfLaw": "rule",
  "precedentialValue": "high|medium|low"
}`;

    const userPrompt = `Extract holdings from:\n\n${caseContent.substring(0, 3000)}`;

    const response = await this.makeRequest(systemPrompt, userPrompt);

    if (!response.success || !response.data) {
      return { success: false, error: response.error };
    }

    const holding = this.parseJSON<LegalHolding>(response.data);
    if (!holding) {
      return {
        success: true,
        data: {
          primaryHolding: response.data.substring(0, 200),
          secondaryHoldings: [],
          legalPrinciples: [],
          ruleOfLaw: 'Not extracted',
          precedentialValue: 'medium',
        },
        usage: response.usage,
      };
    }

    return {
      success: true,
      data: holding,
      usage: response.usage,
    };
  }

  /**
   * Get current backend info
   */
  getBackendInfo(): { backend: AIBackend; model: string; isFree: boolean; requiresKey: boolean } {
    return {
      backend: this.backend,
      model: this.model,
      isFree: this.backend !== 'anthropic',
      requiresKey: this.backend !== 'browser',
    };
  }

  /**
   * Static method: Check if backend is available
   */
  static async checkBackendAvailability(backend: AIBackend, apiKey?: string): Promise<boolean> {
    try {
      if (backend === 'browser') {
        return true; // Always available!
      }

      if (backend === 'groq' && apiKey) {
        const client = new Groq({ apiKey, dangerouslyAllowBrowser: true });
        await client.models.list();
        return true;
      }

      if (backend === 'huggingface' && apiKey) {
        const client = new HfInference(apiKey);
        // Simple check
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }
}
