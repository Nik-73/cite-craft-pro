#!/usr/bin/env tsx
/**
 * Sequences Analyzer
 * Processes all posts from "Rationality: From AI to Zombies" and creates a comprehensive analysis report
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';

// Configuration
const DATA_DIR = path.join(process.cwd(), 'data', 'sequences');
const OUTPUT_DIR = path.join(process.cwd(), 'data', 'sequences-analysis');
const ANALYSIS_FILE = path.join(OUTPUT_DIR, 'post-analyses.json');
const REPORT_FILE = path.join(OUTPUT_DIR, 'THE-SEQUENCES-COMPLETE-INDEX.md');

// Test mode: set to number to limit posts analyzed (for testing)
const TEST_MODE = process.env.TEST_MODE ? parseInt(process.env.TEST_MODE) : null;

// Book structure
const BOOKS = [
  { file: 'map_and_territory.tex', title: 'Map and Territory', number: 1 },
  { file: 'change_mind.tex', title: 'How to Actually Change Your Mind', number: 2 },
  { file: 'machine_in_ghost.tex', title: 'The Machine in the Ghost', number: 3 },
  { file: 'mere_reality.tex', title: 'Mere Reality', number: 4 },
  { file: 'mere_goodness.tex', title: 'Mere Goodness', number: 5 },
  { file: 'becoming_stronger.tex', title: 'Becoming Stronger', number: 6 },
];

interface Post {
  bookNumber: number;
  bookTitle: string;
  chapterTitle: string;
  postTitle: string;
  content: string;
  postNumber: number;
}

interface PostAnalysis {
  bookNumber: number;
  bookTitle: string;
  chapterTitle: string;
  postTitle: string;
  postNumber: number;
  keyPoints: string[];
  importantQuotes: string[];
  summary: string;
  themes: string[];
}

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

/**
 * Parse LaTeX file and extract posts
 */
function parseLatexFile(filePath: string, bookInfo: typeof BOOKS[0]): Post[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const posts: Post[] = [];

  // Extract chapters and posts using regex
  const chapterRegex = /\\chapter\{([^}]+)\}/g;
  const sectionRegex = /\\mysection\{([^}]+)\}/g;

  let currentChapter = '';
  let postNumber = 0;

  // Split content by sections
  const sections = content.split(/\\mysection\{/);

  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    const titleMatch = section.match(/^([^}]+)\}/);

    if (!titleMatch) continue;

    const postTitle = titleMatch[1];
    postNumber++;

    // Find chapter title by looking backwards
    const beforeSection = sections.slice(0, i).join('');
    const chapterMatches = [...beforeSection.matchAll(chapterRegex)];
    if (chapterMatches.length > 0) {
      currentChapter = chapterMatches[chapterMatches.length - 1][1];
    }

    // Extract content (strip LaTeX commands)
    let postContent = section.substring(titleMatch[0].length);
    postContent = cleanLatexContent(postContent);

    // Only include if there's substantial content
    if (postContent.length > 200) {
      posts.push({
        bookNumber: bookInfo.number,
        bookTitle: bookInfo.title,
        chapterTitle: currentChapter,
        postTitle,
        content: postContent,
        postNumber,
      });
    }
  }

  return posts;
}

/**
 * Clean LaTeX content to plain text
 */
function cleanLatexContent(text: string): string {
  let cleaned = text;

  // Remove comments
  cleaned = cleaned.replace(/%.*$/gm, '');

  // Remove common LaTeX commands but keep their content
  cleaned = cleaned.replace(/\\textit\{([^}]+)\}/g, '$1');
  cleaned = cleaned.replace(/\\textbf\{([^}]+)\}/g, '$1');
  cleaned = cleaned.replace(/\\emph\{([^}]+)\}/g, '$1');
  cleaned = cleaned.replace(/\\section\{([^}]+)\}/g, '\n\n## $1\n\n');
  cleaned = cleaned.replace(/\\subsection\{([^}]+)\}/g, '\n\n### $1\n\n');

  // Remove other LaTeX commands
  cleaned = cleaned.replace(/\\[a-zA-Z]+\*/g, '');
  cleaned = cleaned.replace(/\\[a-zA-Z]+/g, '');

  // Remove curly braces
  cleaned = cleaned.replace(/[{}]/g, '');

  // Clean up whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.trim();

  return cleaned;
}

/**
 * Analyze a single post using Claude AI
 */
async function analyzePost(post: Post): Promise<PostAnalysis> {
  const prompt = `Analyze this essay from Eliezer Yudkowsky's "Rationality: From AI to Zombies".

Title: ${post.postTitle}
Chapter: ${post.chapterTitle}
Book: ${post.bookTitle}

Content:
${post.content.substring(0, 15000)} ${post.content.length > 15000 ? '...(truncated)' : ''}

Please provide:
1. **Summary**: A 2-3 sentence summary of the main argument
2. **Key Points**: 3-5 most important insights or arguments (as bullet points)
3. **Important Quotes**: 2-4 most memorable or significant quotes from the text
4. **Themes**: 2-3 main themes or concepts covered

Format your response as JSON:
{
  "summary": "...",
  "keyPoints": ["...", "..."],
  "importantQuotes": ["...", "..."],
  "themes": ["...", "..."]
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return {
      bookNumber: post.bookNumber,
      bookTitle: post.bookTitle,
      chapterTitle: post.chapterTitle,
      postTitle: post.postTitle,
      postNumber: post.postNumber,
      summary: analysis.summary,
      keyPoints: analysis.keyPoints,
      importantQuotes: analysis.importantQuotes,
      themes: analysis.themes,
    };
  } catch (error) {
    console.error(`Error analyzing post "${post.postTitle}":`, error);

    // Return minimal analysis on error
    return {
      bookNumber: post.bookNumber,
      bookTitle: post.bookTitle,
      chapterTitle: post.chapterTitle,
      postTitle: post.postTitle,
      postNumber: post.postNumber,
      summary: 'Analysis pending',
      keyPoints: [],
      importantQuotes: [],
      themes: [],
    };
  }
}

/**
 * Generate markdown report from analyses
 */
function generateReport(analyses: PostAnalysis[]): string {
  let report = `# The Sequences: Complete Index & Analysis

> **Rationality: From AI to Zombies** by Eliezer Yudkowsky
>
> Comprehensive analysis of all ${analyses.length} essays covering rationality, cognitive biases, quantum mechanics, evolution, morality, and artificial intelligence.

---

## Table of Contents

`;

  // Generate TOC
  let currentBook = 0;
  let currentChapter = '';

  for (const analysis of analyses) {
    if (analysis.bookNumber !== currentBook) {
      currentBook = analysis.bookNumber;
      report += `\n### [Book ${analysis.bookNumber}: ${analysis.bookTitle}](#book-${analysis.bookNumber})\n\n`;
    }

    if (analysis.chapterTitle !== currentChapter) {
      currentChapter = analysis.chapterTitle;
      const chapterSlug = currentChapter.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      report += `- [${currentChapter}](#${chapterSlug})\n`;
    }
  }

  report += '\n---\n\n';

  // Generate detailed content
  currentBook = 0;
  currentChapter = '';

  for (const analysis of analyses) {
    // Book header
    if (analysis.bookNumber !== currentBook) {
      currentBook = analysis.bookNumber;
      report += `\n## Book ${analysis.bookNumber}: ${analysis.bookTitle}\n\n`;
    }

    // Chapter header
    if (analysis.chapterTitle !== currentChapter) {
      currentChapter = analysis.chapterTitle;
      report += `\n### ${currentChapter}\n\n`;
    }

    // Post analysis
    report += `#### ${analysis.postTitle}\n\n`;
    report += `**Summary:** ${analysis.summary}\n\n`;

    if (analysis.themes.length > 0) {
      report += `**Themes:** ${analysis.themes.join(', ')}\n\n`;
    }

    if (analysis.keyPoints.length > 0) {
      report += `**Key Points:**\n\n`;
      for (const point of analysis.keyPoints) {
        report += `- ${point}\n`;
      }
      report += '\n';
    }

    if (analysis.importantQuotes.length > 0) {
      report += `**Important Quotes:**\n\n`;
      for (const quote of analysis.importantQuotes) {
        report += `> ${quote}\n\n`;
      }
    }

    report += '---\n\n';
  }

  // Add index by theme
  report += `\n## Thematic Index\n\n`;

  const themeMap = new Map<string, PostAnalysis[]>();
  for (const analysis of analyses) {
    for (const theme of analysis.themes) {
      if (!themeMap.has(theme)) {
        themeMap.set(theme, []);
      }
      themeMap.get(theme)!.push(analysis);
    }
  }

  const sortedThemes = Array.from(themeMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  for (const [theme, posts] of sortedThemes) {
    report += `\n### ${theme}\n\n`;
    for (const post of posts) {
      report += `- **${post.postTitle}** (${post.bookTitle})\n`;
    }
  }

  return report;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Sequences Analysis\n');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load existing analyses if any
  let existingAnalyses: PostAnalysis[] = [];
  if (fs.existsSync(ANALYSIS_FILE)) {
    existingAnalyses = JSON.parse(fs.readFileSync(ANALYSIS_FILE, 'utf-8'));
    console.log(`📂 Loaded ${existingAnalyses.length} existing analyses\n`);
  }

  // Parse all posts
  console.log('📖 Parsing LaTeX files...\n');
  let allPosts: Post[] = [];

  for (const book of BOOKS) {
    const filePath = path.join(DATA_DIR, book.file);
    console.log(`   Processing: ${book.title}`);
    const posts = parseLatexFile(filePath, book);
    allPosts = allPosts.concat(posts);
    console.log(`   Found ${posts.length} posts`);
  }

  console.log(`\n✅ Total posts extracted: ${allPosts.length}\n`);

  // Analyze posts (skip already analyzed)
  console.log('🤖 Analyzing posts with Claude AI...\n');
  if (TEST_MODE) {
    console.log(`⚠️  TEST MODE: Will analyze max ${TEST_MODE} posts\n`);
  }
  const analyses: PostAnalysis[] = [...existingAnalyses];
  const analyzedTitles = new Set(existingAnalyses.map(a => a.postTitle));

  let count = 0;
  for (const post of allPosts) {
    // Test mode limit
    if (TEST_MODE && count >= TEST_MODE) {
      console.log(`\n⚠️  TEST MODE: Stopping after ${TEST_MODE} posts\n`);
      break;
    }
    if (analyzedTitles.has(post.postTitle)) {
      console.log(`   ⏭️  Skipping (already analyzed): ${post.postTitle}`);
      continue;
    }

    count++;
    console.log(`   [${count}/${allPosts.length - existingAnalyses.length}] Analyzing: ${post.postTitle}`);

    const analysis = await analyzePost(post);
    analyses.push(analysis);

    // Save progress every 10 posts
    if (count % 10 === 0) {
      fs.writeFileSync(ANALYSIS_FILE, JSON.stringify(analyses, null, 2));
      console.log(`   💾 Progress saved (${analyses.length} total analyses)`);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Save final analyses
  fs.writeFileSync(ANALYSIS_FILE, JSON.stringify(analyses, null, 2));
  console.log(`\n💾 Saved all ${analyses.length} analyses\n`);

  // Generate report
  console.log('📝 Generating comprehensive report...\n');
  const report = generateReport(analyses);
  fs.writeFileSync(REPORT_FILE, report);

  console.log(`✅ Report generated: ${REPORT_FILE}`);
  console.log(`📊 Total analyses: ${analyses.length}`);
  console.log(`📄 Report size: ${(report.length / 1024).toFixed(2)} KB\n`);
  console.log('🎉 Analysis complete!\n');
}

// Run
main().catch(console.error);
