#!/usr/bin/env node

/**
 * CLI Tool: Legal Article Formatter
 *
 * Formats legal academic articles according to journal standards:
 * - Validates word count (5,000-10,000 words)
 * - Checks for em dashes
 * - Verifies OSCOLA citation format
 * - Analyzes article structure
 * - Generates formatted output (Word/LaTeX)
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  analyzeArticle,
  checkLegalArticleStyle,
  generateLaTeXDocument,
  generateWordDocumentXML,
  replaceEmDashes,
  DEFAULT_LEGAL_ARTICLE_FORMAT,
  type ArticleMetadata,
  type FormattingOptions,
  type StyleIssue,
} from '../services/legalArticleFormatter';

interface CLIOptions {
  input: string;
  output?: string;
  format: 'latex' | 'word' | 'analysis';
  fix?: boolean; // Auto-fix issues like em dashes
  title?: string;
  author?: string;
  affiliation?: string;
}

function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {
    input: '',
    format: 'analysis',
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-i':
      case '--input':
        options.input = args[++i];
        break;
      case '-o':
      case '--output':
        options.output = args[++i];
        break;
      case '-f':
      case '--format':
        options.format = args[++i] as 'latex' | 'word' | 'analysis';
        break;
      case '--fix':
        options.fix = true;
        break;
      case '--title':
        options.title = args[++i];
        break;
      case '--author':
        options.author = args[++i];
        break;
      case '--affiliation':
        options.affiliation = args[++i];
        break;
      case '-h':
      case '--help':
        printHelp();
        process.exit(0);
        break;
    }
  }

  if (!options.input) {
    console.error('Error: Input file required\n');
    printHelp();
    process.exit(1);
  }

  return options;
}

function printHelp() {
  console.log(`
Legal Article Formatter - CiteCraft Pro

USAGE:
  node format-legal-article.ts [OPTIONS]

OPTIONS:
  -i, --input <file>        Input markdown file (required)
  -o, --output <file>       Output file (default: based on format)
  -f, --format <type>       Output format: latex, word, analysis (default: analysis)
  --fix                     Auto-fix issues (e.g., replace em dashes)
  --title <title>           Article title
  --author <author>         Author name
  --affiliation <org>       Author affiliation
  -h, --help                Show this help message

FORMATS:
  analysis   - Display analysis report (word count, style issues, structure)
  latex      - Generate LaTeX document (.tex)
  word       - Generate Word-compatible XML (.xml)

EXAMPLES:
  # Analyze article
  node format-legal-article.ts -i article.md

  # Generate LaTeX with auto-fix
  node format-legal-article.ts -i article.md -f latex -o article.tex --fix

  # Generate Word document
  node format-legal-article.ts -i article.md -f word -o article.xml \\
    --title "My Article" --author "John Smith" --affiliation "University of Oxford"

STYLE CHECKS:
  - Word count: 5,000-10,000 words (including footnotes)
  - Em dashes: Should be replaced with en dashes or hyphens
  - Citations: Must be footnotes (not endnotes)
  - Format: OSCOLA 4th Edition

For more information, see LEGAL_ARTICLE_STYLE_GUIDE.md
`);
}

function extractMetadata(content: string, options: CLIOptions): ArticleMetadata {
  const metadata: ArticleMetadata = {
    title: options.title || 'Untitled Article',
    author: options.author || 'Anonymous',
    affiliation: options.affiliation,
  };

  // Try to extract from markdown frontmatter or first heading
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (!options.title && titleMatch) {
    metadata.title = titleMatch[1];
  }

  const authorMatch = content.match(/^\*\*Author:\*\*\s+(.+)$/m);
  if (!options.author && authorMatch) {
    metadata.author = authorMatch[1];
  }

  const affiliationMatch = content.match(/^\*\*Affiliation:\*\*\s+(.+)$/m);
  if (!options.affiliation && affiliationMatch) {
    metadata.affiliation = affiliationMatch[1];
  }

  // Extract abstract
  const abstractMatch = content.match(/##\s+ABSTRACT\s*\n\n([\s\S]+?)(?=\n##|\n\*\*Keywords)/i);
  if (abstractMatch) {
    metadata.abstract = abstractMatch[1].trim();
  }

  // Extract keywords
  const keywordsMatch = content.match(/\*\*Keywords:\*\*\s+(.+)$/m);
  if (keywordsMatch) {
    metadata.keywords = keywordsMatch[1].split(/[;,]/).map(k => k.trim());
  }

  return metadata;
}

function formatStyleIssues(issues: StyleIssue[]): string {
  if (issues.length === 0) {
    return '✅ No style issues found!';
  }

  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');

  let output = '';

  if (errors.length > 0) {
    output += `\n❌ ERRORS (${errors.length}):\n`;
    errors.forEach((issue, i) => {
      output += `\n${i + 1}. [${issue.type.toUpperCase()}] ${issue.message}\n`;
      if (issue.suggestion) {
        output += `   💡 ${issue.suggestion}\n`;
      }
    });
  }

  if (warnings.length > 0) {
    output += `\n⚠️  WARNINGS (${warnings.length}):\n`;
    warnings.forEach((issue, i) => {
      output += `\n${i + 1}. [${issue.type.toUpperCase()}] ${issue.message}\n`;
      if (issue.suggestion) {
        output += `   💡 ${issue.suggestion}\n`;
      }
    });
  }

  return output;
}

function printAnalysisReport(
  analysis: ReturnType<typeof analyzeArticle>,
  content: string
) {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('    LEGAL ARTICLE ANALYSIS REPORT');
  console.log('═══════════════════════════════════════════════════════\n');

  // Metadata
  console.log('📄 ARTICLE METADATA');
  console.log('─────────────────────────────────────────────────────');
  console.log(`Title:       ${analysis.metadata.title}`);
  console.log(`Author:      ${analysis.metadata.author}`);
  if (analysis.metadata.affiliation) {
    console.log(`Affiliation: ${analysis.metadata.affiliation}`);
  }
  if (analysis.metadata.keywords) {
    console.log(`Keywords:    ${analysis.metadata.keywords.join(', ')}`);
  }

  // Word count
  console.log('\n📊 WORD COUNT');
  console.log('─────────────────────────────────────────────────────');
  console.log(`Total words:  ${analysis.wordCount.toLocaleString()}`);
  console.log(`Footnotes:    ${analysis.footnoteCount}`);

  const minWords = 5000;
  const maxWords = 10000;
  const wordStatus =
    analysis.wordCount < minWords
      ? `❌ TOO SHORT (need ${minWords - analysis.wordCount} more words)`
      : analysis.wordCount > maxWords
      ? `❌ TOO LONG (need to cut ${analysis.wordCount - maxWords} words)`
      : `✅ WITHIN RANGE`;

  console.log(`Status:       ${wordStatus} (${minWords}-${maxWords} words)`);

  // Structure
  console.log('\n🏗️  STRUCTURE');
  console.log('─────────────────────────────────────────────────────');
  console.log(`Title page:   ${analysis.structure.hasTitlePage ? '✅' : '❌'}`);
  console.log(`Abstract:     ${analysis.structure.hasAbstract ? '✅' : '❌'}`);
  console.log(`Keywords:     ${analysis.structure.hasKeywords ? '✅' : '❌'}`);
  console.log(`Sections:     ${analysis.structure.sectionCount}`);

  if (analysis.structure.sections.length > 0) {
    console.log('\nSection outline:');
    analysis.structure.sections.forEach((section, i) => {
      console.log(`  ${i + 1}. ${section}`);
    });
  }

  // Style issues
  console.log('\n🔍 STYLE CHECKS');
  console.log('─────────────────────────────────────────────────────');
  console.log(formatStyleIssues(analysis.styleIssues));

  // Summary
  console.log('\n═══════════════════════════════════════════════════════');
  const hasErrors = analysis.styleIssues.some(i => i.severity === 'error');
  if (hasErrors) {
    console.log('❌ ARTICLE HAS ERRORS - PLEASE FIX BEFORE SUBMISSION');
  } else if (analysis.styleIssues.length > 0) {
    console.log('⚠️  ARTICLE HAS WARNINGS - CONSIDER ADDRESSING');
  } else if (
    analysis.wordCount >= minWords &&
    analysis.wordCount <= maxWords &&
    analysis.structure.hasTitlePage &&
    analysis.structure.hasAbstract
  ) {
    console.log('✅ ARTICLE READY FOR SUBMISSION!');
  } else {
    console.log('⚠️  ARTICLE NEEDS MINOR IMPROVEMENTS');
  }
  console.log('═══════════════════════════════════════════════════════\n');
}

async function main() {
  const options = parseArgs();

  // Read input file
  if (!fs.existsSync(options.input)) {
    console.error(`Error: Input file not found: ${options.input}`);
    process.exit(1);
  }

  let content = fs.readFileSync(options.input, 'utf-8');

  // Auto-fix if requested
  if (options.fix) {
    console.log('🔧 Auto-fixing issues...');
    const original = content;
    content = replaceEmDashes(content);

    if (content !== original) {
      console.log('  ✅ Replaced em dashes with spaced hyphens');
    }
  }

  // Extract metadata
  const metadata = extractMetadata(content, options);

  // Perform analysis
  const analysis = analyzeArticle(content, metadata, DEFAULT_LEGAL_ARTICLE_FORMAT);

  // Handle different output formats
  switch (options.format) {
    case 'analysis':
      printAnalysisReport(analysis, content);
      break;

    case 'latex': {
      const latex = generateLaTeXDocument(content, metadata, DEFAULT_LEGAL_ARTICLE_FORMAT);
      const outputPath =
        options.output || options.input.replace(/\.[^.]+$/, '.tex');
      fs.writeFileSync(outputPath, latex);
      console.log(`✅ LaTeX document generated: ${outputPath}`);
      printAnalysisReport(analysis, content);
      break;
    }

    case 'word': {
      const wordXML = generateWordDocumentXML(content, metadata, DEFAULT_LEGAL_ARTICLE_FORMAT);
      const outputPath =
        options.output || options.input.replace(/\.[^.]+$/, '.xml');
      fs.writeFileSync(outputPath, wordXML);
      console.log(`✅ Word XML generated: ${outputPath}`);
      console.log(`   Import this file into Microsoft Word for final formatting.`);
      printAnalysisReport(analysis, content);
      break;
    }
  }
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
