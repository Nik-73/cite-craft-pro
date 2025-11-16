/**
 * AI Analysis Examples
 * Demonstrates how to use the AI analysis features programmatically
 */

import { AnalysisManager, AIService } from '../src/services/ai';

// Example 1: Basic Case Analysis
async function example1_BasicCaseAnalysis() {
  console.log('=== Example 1: Basic Case Analysis ===\n');

  const apiKey = process.env.VITE_ANTHROPIC_API_KEY || 'your-api-key';
  const manager = new AnalysisManager(apiKey);

  const caseContent = `
    Brown v. Board of Education, 347 U.S. 483 (1954)

    This landmark case challenged the constitutionality of racial segregation
    in public schools. The Court held that "separate educational facilities
    are inherently unequal" and violated the Equal Protection Clause of the
    Fourteenth Amendment. Chief Justice Warren delivered the unanimous opinion,
    overturning Plessy v. Ferguson (1896).

    The Court found that segregation in public education has a detrimental
    effect upon colored children, as it denies them equal educational
    opportunities. The psychological impact of segregation was considered,
    citing social science research.
  `;

  const result = await manager.analyzeCase(
    caseContent,
    'Brown v. Board of Education',
    '347 U.S. 483 (1954)',
    (stage) => console.log(`Progress: ${stage}`)
  );

  if (result.success && result.data) {
    console.log('\n✓ Analysis Complete!\n');
    console.log('Summary:', result.data.summary.briefSummary);
    console.log('\nPrimary Holding:', result.data.holding.primaryHolding);
    console.log('\nPrecedential Value:', result.data.holding.precedentialValue);
    console.log('\nCost:', `$${result.usage?.totalCost.toFixed(4)}`);
  } else {
    console.error('Analysis failed:', result.error);
  }

  console.log('\nTotal session cost:', `$${manager.getTotalCost().toFixed(4)}`);
}

// Example 2: Batch Analysis of Multiple Cases
async function example2_BatchAnalysis() {
  console.log('\n\n=== Example 2: Batch Case Analysis ===\n');

  const apiKey = process.env.VITE_ANTHROPIC_API_KEY || 'your-api-key';
  const manager = new AnalysisManager(apiKey);

  const cases = [
    {
      content: 'Miranda v. Arizona case content...',
      title: 'Miranda v. Arizona',
      citation: '384 U.S. 436 (1966)',
    },
    {
      content: 'Roe v. Wade case content...',
      title: 'Roe v. Wade',
      citation: '410 U.S. 113 (1973)',
    },
    {
      content: 'Gideon v. Wainwright case content...',
      title: 'Gideon v. Wainwright',
      citation: '372 U.S. 335 (1963)',
    },
  ];

  const { results, summary } = await manager.batchAnalyzeCases(
    cases,
    (progress) => {
      console.log(
        `Progress: ${progress.completed}/${progress.total} | ` +
        `Cost: $${progress.totalCost.toFixed(2)} | ` +
        `ETA: ${progress.estimatedTimeRemaining}s`
      );
    }
  );

  console.log('\n✓ Batch Analysis Complete!\n');
  console.log('Results:');
  console.log(`  Successful: ${summary.successful}`);
  console.log(`  Failed: ${summary.failed}`);
  console.log(`  Total Cost: $${summary.totalCost.toFixed(2)}`);
  console.log(`  Total Tokens: ${summary.totalTokens.toLocaleString()}`);
}

// Example 3: Writing Analysis
async function example3_WritingAnalysis() {
  console.log('\n\n=== Example 3: Legal Writing Analysis ===\n');

  const apiKey = process.env.VITE_ANTHROPIC_API_KEY || 'your-api-key';
  const manager = new AnalysisManager(apiKey);

  const paperContent = `
    Title: Analysis of Fourth Amendment Search and Seizure Protections

    Introduction:
    The Fourth Amendment protects citizens from unreasonable searches and
    seizures by the government. This paper examines the evolution of search
    and seizure jurisprudence...

    [Paper content continues...]
  `;

  const result = await manager.analyzeLegalWriting(
    paperContent,
    (stage) => console.log(`Progress: ${stage}`)
  );

  if (result.success && result.data) {
    console.log('\n✓ Writing Analysis Complete!\n');
    console.log('Overall Assessment:', result.data.overallAssessment);
    console.log('\nScores:');
    console.log(`  Citation Quality: ${result.data.citationQuality.score}/100`);
    console.log(`  Legal Reasoning: ${result.data.legalReasoningScore}/100`);
    console.log('\nStrengths:', result.data.strengths.length);
    console.log('Weaknesses:', result.data.weaknesses.length);
    console.log('Suggestions:', result.data.suggestions.length);
    console.log('\nCost:', `$${result.usage?.totalCost.toFixed(4)}`);
  }
}

// Example 4: Citation Recommendations
async function example4_CitationRecommendations() {
  console.log('\n\n=== Example 4: Citation Recommendations ===\n');

  const apiKey = process.env.VITE_ANTHROPIC_API_KEY || 'your-api-key';
  const manager = new AnalysisManager(apiKey);

  const paperContent = `
    This paper argues that digital privacy protections should extend to
    cell phone location data under the Fourth Amendment...
  `;

  const existingCitations = [
    { author: 'Katz', title: 'Katz v. United States', year: 1967 },
    { author: 'Riley', title: 'Riley v. California', year: 2014 },
  ];

  const result = await manager.getCitationRecommendations(
    paperContent,
    existingCitations
  );

  if (result.success && result.data) {
    console.log('\n✓ Recommendations Generated!\n');
    console.log('Suggested Cases:', result.data.suggestedCases.length);
    console.log('\nTop 3 Suggestions:');

    result.data.suggestedCases.slice(0, 3).forEach((suggestion, i) => {
      console.log(`\n${i + 1}. ${suggestion.caseName}`);
      console.log(`   Relevance: ${suggestion.relevanceScore}/100`);
      console.log(`   Reason: ${suggestion.reason}`);
    });

    console.log('\nMissing Topics:', result.data.missingTopics.join(', '));
    console.log('\nCost:', `$${result.usage?.totalCost.toFixed(4)}`);
  }
}

// Example 5: Comprehensive Paper Analysis
async function example5_ComprehensivePaperAnalysis() {
  console.log('\n\n=== Example 5: Comprehensive Paper Analysis ===\n');

  const apiKey = process.env.VITE_ANTHROPIC_API_KEY || 'your-api-key';
  const manager = new AnalysisManager(apiKey);

  const paperContent = 'Your complete legal paper content...';
  const citations = [
    /* existing citations */
  ];

  const result = await manager.comprehensivePaperAnalysis(
    paperContent,
    citations,
    (stage) => console.log(`Progress: ${stage}`)
  );

  console.log('\n✓ Comprehensive Analysis Complete!\n');

  if (result.writing.success && result.writing.data) {
    console.log('Writing Quality:');
    console.log(`  Reasoning Score: ${result.writing.data.legalReasoningScore}/100`);
    console.log(`  Citation Score: ${result.writing.data.citationQuality.score}/100`);
  }

  if (result.recommendations.success && result.recommendations.data) {
    console.log('\nCitation Recommendations:');
    console.log(`  Suggested Cases: ${result.recommendations.data.suggestedCases.length}`);
    console.log(`  Missing Topics: ${result.recommendations.data.missingTopics.length}`);
  }

  console.log('\nTotal Cost:', `$${result.totalCost.toFixed(4)}`);
}

// Example 6: Cost Estimation
async function example6_CostEstimation() {
  console.log('\n\n=== Example 6: Cost Estimation ===\n');

  const apiKey = process.env.VITE_ANTHROPIC_API_KEY || 'your-api-key';
  const manager = new AnalysisManager(apiKey);

  // Estimate before running
  const operations = [
    { type: 'case' as const, count: 1, label: 'Single Case' },
    { type: 'case' as const, count: 10, label: '10 Cases (Batch)' },
    { type: 'writing' as const, count: 1, label: 'Writing Analysis' },
    { type: 'citations' as const, count: 1, label: 'Citation Recommendations' },
    { type: 'comprehensive' as const, count: 1, label: 'Full Paper Analysis' },
  ];

  console.log('Cost Estimates:\n');

  operations.forEach(({ type, count, label }) => {
    const estimate = manager.estimateCost(type, count);
    console.log(`${label}:`);
    console.log(`  Cost: $${estimate.estimatedCost.toFixed(2)}`);
    console.log(`  Tokens: ~${estimate.estimatedTokens.toLocaleString()}`);
    console.log(`  Description: ${estimate.description}\n`);
  });
}

// Example 7: Export Analysis History
async function example7_ExportHistory() {
  console.log('\n\n=== Example 7: Export Analysis History ===\n');

  const apiKey = process.env.VITE_ANTHROPIC_API_KEY || 'your-api-key';
  const manager = new AnalysisManager(apiKey);

  // Run some analyses...
  await manager.quickSummary('Sample case content...');

  // Get history
  const history = manager.getHistory();
  console.log('Analysis History:');
  console.log(`  Total Analyses: ${history.length}`);
  console.log(`  Total Cost: $${manager.getTotalCost().toFixed(4)}`);

  // Export to JSON
  const exportData = manager.exportAnalysisHistory();
  console.log('\nExported JSON (first 200 chars):');
  console.log(exportData.substring(0, 200) + '...');

  // In a real app, you'd save this to a file:
  // fs.writeFileSync('analysis-history.json', exportData);
}

// Example 8: Using AIService Directly (Lower Level)
async function example8_DirectAIService() {
  console.log('\n\n=== Example 8: Direct AIService Usage ===\n');

  const apiKey = process.env.VITE_ANTHROPIC_API_KEY || 'your-api-key';

  const aiService = new AIService({
    apiKey,
    model: 'claude-sonnet-4-20250514',
    maxTokens: 4096,
    temperature: 0.7,
  });

  const caseContent = 'Case content...';

  // Individual operations
  const summary = await aiService.summarizeCase(caseContent);
  const holdings = await aiService.extractHoldings(caseContent);
  const precedents = await aiService.analyzePrecedents(caseContent);

  console.log('Direct API calls completed');
  console.log('Summary success:', summary.success);
  console.log('Holdings success:', holdings.success);
  console.log('Precedents success:', precedents.success);

  if (summary.usage) {
    console.log('\nToken usage (summary):');
    console.log(`  Input: ${summary.usage.inputTokens}`);
    console.log(`  Output: ${summary.usage.outputTokens}`);
    console.log(`  Cost: $${summary.usage.totalCost.toFixed(4)}`);
  }
}

// Main execution
async function main() {
  console.log('AI Analysis Examples\n');
  console.log('Choose an example to run:\n');
  console.log('1. Basic Case Analysis');
  console.log('2. Batch Analysis');
  console.log('3. Writing Analysis');
  console.log('4. Citation Recommendations');
  console.log('5. Comprehensive Paper Analysis');
  console.log('6. Cost Estimation');
  console.log('7. Export History');
  console.log('8. Direct AIService Usage');

  // For demonstration, run example 6 (cost estimation) as it doesn't use credits
  await example6_CostEstimation();

  console.log('\n\nTo run other examples:');
  console.log('1. Set your API key in .env');
  console.log('2. Uncomment the desired example in the main() function');
  console.log('3. Run: tsx examples/ai-analysis-example.ts');
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

// Export for use in other modules
export {
  example1_BasicCaseAnalysis,
  example2_BatchAnalysis,
  example3_WritingAnalysis,
  example4_CitationRecommendations,
  example5_ComprehensivePaperAnalysis,
  example6_CostEstimation,
  example7_ExportHistory,
  example8_DirectAIService,
};
