# AI-Powered Legal Analysis - Comprehensive Guide

## Overview

CiteCraft Pro now includes advanced AI-powered legal analysis capabilities using Claude (Anthropic). This feature provides comprehensive analysis of legal cases, writing feedback, and intelligent citation recommendations to enhance legal research and writing.

## Features

### 1. **Comprehensive Case Analysis**
Automatically analyze legal cases with:
- **Case Summarization**: Brief and detailed summaries, key facts, procedural history
- **Legal Holdings Extraction**: Primary and secondary holdings, legal principles, rules of law
- **Precedent Analysis**: Cited cases, legal topics, jurisdictional scope, temporal relevance

### 2. **Legal Writing Analysis**
Get AI-powered feedback on your legal papers:
- **Overall Assessment**: Comprehensive evaluation of your writing
- **Strengths & Weaknesses**: Specific areas of excellence and improvement
- **Detailed Suggestions**: Categorized by structure, argument, citation, clarity, and legal reasoning
- **Citation Quality Score**: Numerical assessment of citation usage (0-100)
- **Legal Reasoning Score**: Evaluation of argumentative quality (0-100)

### 3. **Smart Citation Recommendations**
Receive intelligent suggestions for:
- **Relevant Cases**: AI suggests cases that strengthen your arguments
- **Relevance Scoring**: Each suggestion rated 0-100 for relevance
- **Placement Guidance**: Where in your paper to cite each case
- **Missing Topics**: Legal areas not adequately covered
- **Strength Assessment**: Overall evaluation of your citation strategy

### 4. **Batch Analysis**
Analyze multiple legal cases simultaneously with:
- **Progress Tracking**: Real-time updates on analysis progress
- **Cost Estimation**: Transparent cost tracking throughout the process
- **Summary Statistics**: Success/failure counts, total costs, token usage

### 5. **Analysis History & Cost Tracking**
Monitor your AI usage:
- **Detailed History**: Every analysis performed with timestamps
- **Cost Breakdown**: Per-analysis and cumulative costs
- **Token Usage**: Input and output tokens for each operation
- **Export Capability**: Download full history as JSON

## Setup

### 1. Get an Anthropic API Key

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in to your account
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (starts with `sk-ant-...`)

### 2. Configure the Application

**Option A: Environment Variable (Recommended for production)**

Add your API key to `.env`:
```env
VITE_ANTHROPIC_API_KEY="sk-ant-your-actual-api-key-here"
```

**Option B: UI Configuration (Development/Testing)**

1. Navigate to the "AI Analysis" tab
2. Paste your API key in the configuration field
3. Click "Configure AI Service"

## Usage Guide

### Analyzing Legal Cases

#### Single Case Analysis
1. Go to "Legal Research" tab
2. Search and import legal cases
3. Navigate to "AI Analysis" tab
4. The imported cases will appear in the analysis panel
5. Click "Analyze All Cases" to process all imported cases

#### Understanding Case Analysis Results

Each analyzed case includes:

**Summary Section**
- Brief Summary: 2-3 sentence overview
- Detailed Summary: Comprehensive 2-3 paragraphs
- Key Facts: Bulleted list of critical facts
- Procedural History: Court progression

**Holdings Section**
- Primary Holding: Main legal principle established
- Secondary Holdings: Additional rulings
- Rule of Law: Legal rule applied/established
- Legal Principles: Broader principles involved
- Precedential Value: High/Medium/Low classification

**Precedent Analysis**
- Cited Cases: Cases referenced in the opinion
  - Case relationship: Followed/Distinguished/Overruled/Cited
  - Relevance explanation
- Legal Topics: Subject matter tags
- Jurisdiction Scope: Geographic/court level applicability
- Temporal Relevance: Currency of the legal principles

### Analyzing Your Legal Writing

1. Upload your paper via "Upload & Edit" tab
2. Go to "AI Analysis" tab
3. Click "Analyze Paper"
4. Review results in the "Writing" and "Citations" tabs

#### Writing Analysis Results

**Overall Assessment**: High-level evaluation of your paper

**Scores**
- Citation Quality: 0-100 scale with specific feedback
- Legal Reasoning: Quality of argumentation (0-100)

**Strengths**: What you're doing well

**Weaknesses**: Areas needing improvement

**Detailed Suggestions**: Specific, actionable feedback
- Categorized by: Structure, Argument, Citation, Clarity, Legal Reasoning
- Prioritized: High/Medium/Low priority
- Includes: Issue description and concrete suggestions

#### Citation Recommendations

**Strength Assessment**: Overall evaluation of citation strategy

**Suggested Cases**
- Case name and citation
- Relevance score (0-100)
- Reason for suggestion
- Suggested location in your paper
- One-click "Add to Citations" button

**Missing Topics**: Legal areas not adequately covered

### Cost Management

#### Understanding Costs

The AI service uses token-based pricing:
- **Input Tokens**: $3.00 per million tokens
- **Output Tokens**: $15.00 per million tokens

**Typical Costs** (estimates):
- Single case analysis: $0.15-0.25
- Writing analysis: $0.10-0.20
- Citation recommendations: $0.08-0.15
- Comprehensive paper analysis: $0.30-0.50

#### Cost Estimation

Before running analysis:
1. Click "Estimate Cost" button
2. Review the estimated cost
3. Proceed if acceptable

#### Monitoring Costs

View real-time cost tracking:
- **Total Cost Badge**: Displayed in panel header
- **History Tab**: Detailed breakdown by analysis type
- **Export**: Download full cost history

## API Reference

### AIService Class

```typescript
import { AIService } from '@/services/ai';

const aiService = new AIService({
  apiKey: 'your-api-key',
  model: 'claude-sonnet-4-20250514', // optional
  maxTokens: 4096, // optional
  temperature: 0.7 // optional
});
```

#### Methods

**summarizeCase(caseContent: string)**
- Returns: `AIAnalysisResponse<CaseSummary>`
- Generates comprehensive case summary

**extractHoldings(caseContent: string)**
- Returns: `AIAnalysisResponse<LegalHolding>`
- Extracts legal holdings and principles

**analyzePrecedents(caseContent: string)**
- Returns: `AIAnalysisResponse<PrecedentAnalysis>`
- Analyzes cited cases and legal topics

**recommendCitations(paperContent: string, existingCitations: any[])**
- Returns: `AIAnalysisResponse<CitationRecommendation>`
- Suggests relevant citations

**analyzeWriting(paperContent: string)**
- Returns: `AIAnalysisResponse<WritingAnalysis>`
- Analyzes legal writing quality

**comprehensiveAnalysis(caseContent: string, caseTitle: string, citation: string)**
- Returns: `AIAnalysisResponse<ComprehensiveCaseAnalysis>`
- Runs all case analyses in parallel

### AnalysisManager Class

Higher-level orchestration:

```typescript
import { AnalysisManager } from '@/services/ai';

const manager = new AnalysisManager('your-api-key');
```

#### Methods

**analyzeCase(content, title, citation, onProgress?)**
- Single case comprehensive analysis with progress callbacks

**batchAnalyzeCases(cases[], onProgress?)**
- Analyze multiple cases with progress tracking

**analyzeLegalWriting(content, onProgress?)**
- Writing quality analysis

**getCitationRecommendations(content, citations, onProgress?)**
- Citation suggestions

**comprehensivePaperAnalysis(content, citations, onProgress?)**
- Combined writing + citation analysis

**getTotalCost()**
- Returns cumulative cost

**getHistory()**
- Returns all analysis records

**clearHistory()**
- Clears analysis history

**exportAnalysisHistory()**
- Exports history as JSON string

**estimateCost(operation, count)**
- Estimates cost before running analysis

## Best Practices

### 1. Cost Optimization

- **Use Estimates**: Always check cost estimates before batch operations
- **Progressive Analysis**: Analyze one case first to verify quality before batch processing
- **Monitor History**: Regularly check the History tab to track spending

### 2. Quality Results

- **Provide Context**: Include complete case text for best analysis
- **Multiple Cases**: Analyze related cases together for pattern recognition
- **Iterative Improvement**: Use writing feedback iteratively to improve your paper

### 3. Integration Workflow

**Recommended workflow**:
1. Search and import cases (Legal Research tab)
2. Upload your draft paper (Upload & Edit tab)
3. Analyze cases individually first (AI Analysis tab)
4. Review case analyses to understand precedents
5. Analyze your paper for writing feedback
6. Review citation recommendations
7. Update your paper based on feedback
8. Re-analyze to verify improvements

### 4. Security

- **API Key Security**: Never commit API keys to version control
- **Use Environment Variables**: Store keys in `.env` for production
- **Rotate Keys**: Regularly rotate API keys as a security best practice

## Troubleshooting

### "API Key Required" Error
- Ensure your API key is correctly set in `.env` or UI
- Verify the key starts with `sk-ant-`
- Check for extra spaces or quotes

### Analysis Fails
- Check your internet connection
- Verify API key is valid and has credits
- Check case content is not empty
- Review browser console for detailed errors

### Unexpected Costs
- Review History tab for detailed breakdown
- Check if batch operations ran unexpectedly
- Use estimate feature before large operations

### Poor Analysis Quality
- Ensure complete case text is provided
- Verify paper content is substantial (not just outline)
- Try increasing temperature in AIService config for more creative analysis

## Advanced Features

### Custom Analysis Workflows

Create custom analysis workflows using the API:

```typescript
import { AnalysisManager } from '@/services/ai';

const manager = new AnalysisManager(apiKey);

// Custom workflow: Analyze + Recommend + Track
async function customWorkflow(paperContent, cases, citations) {
  // Analyze all cases
  const caseResults = await manager.batchAnalyzeCases(cases);

  // Analyze writing
  const writingResult = await manager.analyzeLegalWriting(paperContent);

  // Get recommendations
  const recommendations = await manager.getCitationRecommendations(
    paperContent,
    citations
  );

  // Export history
  const history = manager.exportAnalysisHistory();

  return {
    cases: caseResults,
    writing: writingResult,
    recommendations,
    history,
    totalCost: manager.getTotalCost()
  };
}
```

### Export and Share Analysis

Export analysis results for:
- **Collaboration**: Share with colleagues
- **Record Keeping**: Maintain analysis history
- **Cost Tracking**: Budget management
- **Quality Assurance**: Review analysis quality over time

## Pricing Examples

### Example 1: Single Case Analysis
- Case: 5,000 words
- Input tokens: ~6,500
- Output tokens: ~1,500
- **Cost**: ~$0.18

### Example 2: Batch Analysis (10 Cases)
- Each case: 5,000 words
- Total input: ~65,000 tokens
- Total output: ~15,000 tokens
- **Cost**: ~$1.80

### Example 3: Complete Paper Analysis
- Paper: 8,000 words
- Input tokens: ~10,000
- Output tokens: ~3,000
- **Cost**: ~$0.25

### Example 4: Full Research Session
- 10 case analyses: $1.80
- 1 writing analysis: $0.20
- 1 citation recommendation: $0.15
- **Total Session Cost**: ~$2.15

## Support and Resources

### Documentation
- [Anthropic API Docs](https://docs.anthropic.com)
- [Claude Models](https://www.anthropic.com/claude)

### Getting Help
- Check the browser console for detailed error messages
- Review the Analysis History for patterns
- Verify API key validity at console.anthropic.com

### Feature Requests
- Submit issues via GitHub
- Suggest improvements
- Share your use cases

---

**Version**: 1.0.0
**Last Updated**: 2025-11-16
**AI Model**: Claude Sonnet 4.5 (claude-sonnet-4-20250514)
