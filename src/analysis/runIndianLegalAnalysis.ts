#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { ComprehensiveIndianLegalAnalyzer } from './comprehensiveIndianLegalAnalysis';

/**
 * CLI tool to run comprehensive Indian legal industry analysis
 * Searches 1500+ sources across multiple Indian legal fields and generates detailed report
 */

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║    🇮🇳 COMPREHENSIVE INDIAN LEGAL INDUSTRY ANALYSIS & RESEARCH TOOL          ║');
  console.log('║         Multi-Source Legal Database Search & Financial Analysis              ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
  console.log();

  // Get API key from environment if available
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;

  const analyzer = new ComprehensiveIndianLegalAnalyzer(apiKey);

  console.log('⚙️  Configuration:');
  console.log(`   • Target: 1500+ legal sources`);
  console.log(`   • Practice Areas: 13 major Indian legal fields`);
  console.log(`   • Sources: CourtListener, Google Scholar, Justia`);
  console.log(`   • AI Analysis: ${apiKey ? 'Enabled ✓' : 'Disabled (no API key)'}`);
  console.log(`   • Currency: USD & INR (₹)`);
  console.log();

  console.log('📋 This analysis will search across:');
  console.log('   1. Civil Litigation');
  console.log('   2. Criminal Law');
  console.log('   3. Corporate & Commercial Law');
  console.log('   4. Tax Law (Income Tax & GST)');
  console.log('   5. Intellectual Property');
  console.log('   6. Real Estate & Property Law');
  console.log('   7. Family & Matrimonial Law');
  console.log('   8. Labour & Employment Law');
  console.log('   9. Constitutional & Public Interest Law');
  console.log('   10. Arbitration & Mediation');
  console.log('   11. Banking & Finance Law');
  console.log('   12. Consumer Protection');
  console.log('   13. Cyber Law & Data Privacy');
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
  console.log('🚀 Starting comprehensive Indian legal market search...\n');
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
  console.log('📊 Generating comprehensive Indian legal industry analysis report...\n');
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
  const reportPath = path.join(outputDir, `indian-legal-analysis-${timestamp}.txt`);
  const jsonPath = path.join(outputDir, `indian-legal-analysis-${timestamp}.json`);

  fs.writeFileSync(reportPath, formattedReport, 'utf-8');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf-8');

  console.log('\n📁 Reports saved to:');
  console.log(`   • Text Report: ${reportPath}`);
  console.log(`   • JSON Data: ${jsonPath}`);

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000 / 60).toFixed(1);

  console.log('\n' + '═'.repeat(80));
  console.log(`✓ Indian Legal Industry Analysis Complete! (${duration} minutes)`);
  console.log(`✓ Total Sources: ${totalCases.toLocaleString()}`);
  console.log(`✓ Total Market Size: $${(report.financialBreakdown.totalRevenue / 1000000000).toFixed(2)} billion (₹${(report.financialBreakdown.totalRevenueINR / 10000000).toFixed(2)} crore)`);
  console.log(`✓ Exchange Rate: 1 USD = ₹${report.metadata.currency.exchangeRate}`);
  console.log('═'.repeat(80));
}

// Run the analysis
main().catch(error => {
  console.error('\n❌ Error during analysis:');
  console.error(error);
  process.exit(1);
});
