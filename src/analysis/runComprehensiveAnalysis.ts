#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { ComprehensiveLegalAnalyzer } from './comprehensiveLegalAnalysis';

/**
 * CLI tool to run comprehensive legal industry analysis
 * Searches 1500+ sources across multiple legal fields and generates detailed report
 */

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║         COMPREHENSIVE LEGAL INDUSTRY ANALYSIS & RESEARCH TOOL                ║');
  console.log('║         Multi-Source Legal Database Search & Financial Analysis              ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
  console.log();

  // Get API key from environment if available
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;

  const analyzer = new ComprehensiveLegalAnalyzer(apiKey);

  console.log('⚙️  Configuration:');
  console.log(`   • Target: 1500+ legal sources`);
  console.log(`   • Practice Areas: 12 major legal fields`);
  console.log(`   • Sources: CourtListener, Google Scholar, Justia`);
  console.log(`   • AI Analysis: ${apiKey ? 'Enabled ✓' : 'Disabled (no API key)'}`);
  console.log();

  console.log('📋 This analysis will search across:');
  console.log('   1. Criminal Law');
  console.log('   2. Civil Litigation');
  console.log('   3. Corporate Law');
  console.log('   4. Intellectual Property');
  console.log('   5. Employment & Labor Law');
  console.log('   6. Family Law');
  console.log('   7. Tax Law');
  console.log('   8. Real Estate Law');
  console.log('   9. Environmental Law');
  console.log('   10. Immigration Law');
  console.log('   11. Healthcare Law');
  console.log('   12. Bankruptcy Law');
  console.log();

  console.log('⏱️  Estimated time: 15-25 minutes (due to rate limiting)');
  console.log();

  const startTime = Date.now();

  // Progress callback
  const onProgress = (field: string, completed: number, total: number) => {
    const percentage = ((completed / total) * 100).toFixed(1);
    console.log(`\n✓ Completed ${field} [${completed}/${total} fields - ${percentage}%]`);
  };

  // Search all fields
  console.log('🚀 Starting comprehensive search...\n');
  const fieldResults = await analyzer.searchAllFields(15, onProgress);

  // Calculate total
  let totalCases = 0;
  fieldResults.forEach(results => {
    totalCases += results.length;
  });

  console.log('\n' + '═'.repeat(80));
  console.log(`✓ Search Complete! Found ${totalCases.toLocaleString()} legal sources`);
  console.log('═'.repeat(80) + '\n');

  // Generate comprehensive report
  console.log('📊 Generating comprehensive analysis report...\n');
  const report = await analyzer.generateComprehensiveReport(fieldResults);

  // Format and display report
  const formattedReport = analyzer.formatReport(report);
  console.log('\n' + formattedReport);

  // Save report to file
  const outputDir = path.join(process.cwd(), 'analysis-reports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const reportPath = path.join(outputDir, `legal-analysis-${timestamp}.txt`);
  const jsonPath = path.join(outputDir, `legal-analysis-${timestamp}.json`);

  fs.writeFileSync(reportPath, formattedReport, 'utf-8');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf-8');

  console.log('\n📁 Reports saved to:');
  console.log(`   • Text Report: ${reportPath}`);
  console.log(`   • JSON Data: ${jsonPath}`);

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000 / 60).toFixed(1);

  console.log('\n' + '═'.repeat(80));
  console.log(`✓ Analysis Complete! (${duration} minutes)`);
  console.log(`✓ Total Sources: ${totalCases.toLocaleString()}`);
  console.log(`✓ Total Market Size: $${(report.financialBreakdown.totalRevenue / 1000000000).toFixed(2)} billion`);
  console.log('═'.repeat(80));
}

// Run the analysis
main().catch(error => {
  console.error('\n❌ Error during analysis:');
  console.error(error);
  process.exit(1);
});
