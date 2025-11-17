#!/usr/bin/env tsx
/**
 * Sequences Index Generator
 * Creates a comprehensive index of "Rationality: From AI to Zombies" with key points and quotes
 * Analyzes text structure without requiring API calls for every post
 */

import fs from 'fs';
import path from 'path';

// Configuration
const DATA_DIR = path.join(process.cwd(), 'data', 'sequences');
const OUTPUT_DIR = path.join(process.cwd(), 'data', 'sequences-analysis');
const INDEX_FILE = path.join(OUTPUT_DIR, 'THE-SEQUENCES-COMPLETE-INDEX.md');

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

interface PostIndex {
  bookNumber: number;
  bookTitle: string;
  chapterTitle: string;
  postTitle: string;
  postNumber: number;
  keyThemes: string[];
  notableQuotes: string[];
  wordCount: number;
}

/**
 * Parse LaTeX file and extract posts
 */
function parseLatexFile(filePath: string, bookInfo: typeof BOOKS[0]): Post[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const posts: Post[] = [];

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
    const chapterMatches = [...beforeSection.matchAll(/\\chapter\{([^}]+)\}/g)];
    if (chapterMatches.length > 0) {
      currentChapter = chapterMatches[chapterMatches.length - 1][1];
    }

    // Extract content
    let postContent = section.substring(titleMatch[0].length);
    postContent = cleanLatexContent(postContent);

    if (postContent.length > 200) {
      posts.push({
        bookNumber: bookInfo.number,
        bookTitle: bookInfo.title,
        chapterTitle: currentChapter,
        postTitle: cleanLatexText(postTitle),
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
  cleaned = cleaned.replace(/\\textbf\{([^}]+)\}/g, '**$1**');
  cleaned = cleaned.replace(/\\emph\{([^}]+)\}/g, '*$1*');
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
 * Clean LaTeX text (for titles, etc.)
 */
function cleanLatexText(text: string): string {
  return text
    .replace(/\\ldots/g, '...')
    .replace(/\\\\/g, '')
    .replace(/[{}]/g, '')
    .replace(/``/g, '"')
    .replace(/''/g, '"')
    .trim();
}

/**
 * Extract notable quotes from post content
 */
function extractQuotes(content: string): string[] {
  const quotes: string[] = [];
  const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 50);

  // Look for sentences that sound like key insights
  const keyPhrases = [
    /\b(rationality|bias|truth|evidence|belief|probability)\b/i,
    /\b(should|must|cannot|never|always)\b/i,
    /\b(important|key|essential|fundamental|crucial)\b/i,
  ];

  for (const sentence of sentences) {
    if (sentence.length > 100 && sentence.length < 300) {
      const matchCount = keyPhrases.filter(phrase => phrase.test(sentence)).length;
      if (matchCount >= 2) {
        quotes.push(sentence + '.');
        if (quotes.length >= 3) break;
      }
    }
  }

  // If we didn't find enough, get the first substantive sentences
  if (quotes.length === 0) {
    quotes.push(...sentences.slice(0, 2).map(s => s + '.'));
  }

  return quotes.slice(0, 3);
}

/**
 * Identify key themes from post content
 */
function identifyThemes(postTitle: string, content: string): string[] {
  const themes: string[] = [];
  const lowerContent = content.toLowerCase();
  const lowerTitle = postTitle.toLowerCase();

  // Theme categories based on common Sequences topics
  const themePatterns: Record<string, RegExp[]> = {
    'Cognitive Biases': [/bias/i, /heuristic/i, /fallacy/i],
    'Bayesian Reasoning': [/bayes/i, /probability/i, /evidence/i, /prior/i],
    'Rationality': [/rational/i, /reason/i, /thinking/i],
    'Truth & Beliefs': [/truth/i, /belief/i, /reality/i],
    'Science & Epistemology': [/science/i, /knowledge/i, /epistemo/i],
    'Evolution': [/evolution/i, /selection/i, /genetic/i],
    'Quantum Physics': [/quantum/i, /physics/i, /wave/i, /particle/i],
    'AI & Intelligence': [/artificial intelligence/i, /\bai\b/i, /intelligence/i],
    'Morality & Ethics': [/moral/i, /ethic/i, /value/i, /good/i],
    'Decision Theory': [/decision/i, /utility/i, /choice/i],
    'Reductionism': [/reductio/i, /emergenc/i, /complexity/i],
    'Language & Meaning': [/meaning/i, /definition/i, /word/i, /language/i],
  };

  for (const [theme, patterns] of Object.entries(themePatterns)) {
    const matchCount = patterns.filter(p => p.test(lowerContent) || p.test(lowerTitle)).length;
    if (matchCount > 0) {
      themes.push(theme);
    }
  }

  // Add title-based themes
  if (lowerTitle.includes('bias')) themes.push('Cognitive Biases');
  if (lowerTitle.includes('rational')) themes.push('Rationality');
  if (lowerTitle.includes('belief')) themes.push('Truth & Beliefs');

  return [...new Set(themes)].slice(0, 3);
}

/**
 * Index a single post
 */
function indexPost(post: Post): PostIndex {
  return {
    bookNumber: post.bookNumber,
    bookTitle: post.bookTitle,
    chapterTitle: post.chapterTitle,
    postTitle: post.postTitle,
    postNumber: post.postNumber,
    keyThemes: identifyThemes(post.postTitle, post.content),
    notableQuotes: extractQuotes(post.content),
    wordCount: post.content.split(/\s+/).length,
  };
}

/**
 * Generate markdown index/report
 */
function generateIndex(indexes: PostIndex[]): string {
  const totalWords = indexes.reduce((sum, idx) => sum + idx.wordCount, 0);

  let report = `# The Sequences: Complete Index

> **Rationality: From AI to Zombies** by Eliezer Yudkowsky
>
> Comprehensive index of all ${indexes.length} essays covering rationality, cognitive biases, quantum mechanics, evolution, morality, and artificial intelligence.
>
> **Total word count:** ~${Math.round(totalWords / 1000)}K words

Generated on: ${new Date().toISOString().split('T')[0]}

---

## Quick Navigation

- [Table of Contents](#table-of-contents)
- [Full Index](#full-index)
- [Thematic Index](#thematic-index)
- [Statistics](#statistics)

---

## Table of Contents

`;

  // Generate book-level TOC
  for (let bookNum = 1; bookNum <= 6; bookNum++) {
    const bookIndexes = indexes.filter(idx => idx.bookNumber === bookNum);
    if (bookIndexes.length > 0) {
      const bookTitle = bookIndexes[0].bookTitle;
      report += `\n### [Book ${bookNum}: ${bookTitle}](#book-${bookNum}-${bookTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')})\n\n`;

      const chapters = [...new Set(bookIndexes.map(idx => idx.chapterTitle))];
      for (const chapter of chapters) {
        const chapterSlug = chapter.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const postCount = bookIndexes.filter(idx => idx.chapterTitle === chapter).length;
        report += `- [${chapter}](#${chapterSlug}) (${postCount} posts)\n`;
      }
    }
  }

  report += '\n---\n\n## Full Index\n\n';

  // Generate detailed content
  let currentBook = 0;
  let currentChapter = '';

  for (const idx of indexes) {
    // Book header
    if (idx.bookNumber !== currentBook) {
      currentBook = idx.bookNumber;
      const bookSlug = idx.bookTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      report += `\n## Book ${idx.bookNumber}: ${idx.bookTitle}\n\n`;
      report += `<a name="book-${idx.bookNumber}-${bookSlug}"></a>\n\n`;
    }

    // Chapter header
    if (idx.chapterTitle !== currentChapter) {
      currentChapter = idx.chapterTitle;
      const chapterSlug = currentChapter.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      report += `\n### ${currentChapter}\n\n`;
      report += `<a name="${chapterSlug}"></a>\n\n`;
    }

    // Post entry
    report += `#### ${idx.postTitle}\n\n`;

    if (idx.keyThemes.length > 0) {
      report += `**Themes:** ${idx.keyThemes.join(', ')}  \n`;
    }

    report += `**Length:** ~${Math.round(idx.wordCount / 100) * 100} words\n\n`;

    if (idx.notableQuotes.length > 0) {
      report += `**Notable excerpts:**\n\n`;
      for (const quote of idx.notableQuotes) {
        report += `> ${quote}\n\n`;
      }
    }

    report += '---\n\n';
  }

  // Add thematic index
  report += `\n## Thematic Index\n\n`;

  const themeMap = new Map<string, PostIndex[]>();
  for (const idx of indexes) {
    for (const theme of idx.keyThemes) {
      if (!themeMap.has(theme)) {
        themeMap.set(theme, []);
      }
      themeMap.get(theme)!.push(idx);
    }
  }

  const sortedThemes = Array.from(themeMap.entries())
    .sort((a, b) => b[1].length - a[1].length); // Sort by frequency

  for (const [theme, posts] of sortedThemes) {
    report += `\n### ${theme} (${posts.length} posts)\n\n`;
    for (const post of posts.slice(0, 20)) { // Limit to first 20
      report += `- **${post.postTitle}** (Book ${post.bookNumber}: ${post.bookTitle})\n`;
    }
    if (posts.length > 20) {
      report += `- ...and ${posts.length - 20} more\n`;
    }
  }

  // Add statistics
  report += `\n## Statistics\n\n`;
  report += `- **Total Posts:** ${indexes.length}\n`;
  report += `- **Total Words:** ~${Math.round(totalWords / 1000)}K\n`;
  report += `- **Average Post Length:** ~${Math.round(totalWords / indexes.length)} words\n`;
  report += `- **Themes Identified:** ${themeMap.size}\n`;

  for (let bookNum = 1; bookNum <= 6; bookNum++) {
    const bookIndexes = indexes.filter(idx => idx.bookNumber === bookNum);
    if (bookIndexes.length > 0) {
      const bookWords = bookIndexes.reduce((sum, idx) => sum + idx.wordCount, 0);
      report += `- **Book ${bookNum}:** ${bookIndexes.length} posts, ~${Math.round(bookWords / 1000)}K words\n`;
    }
  }

  return report;
}

/**
 * Main execution
 */
async function main() {
  console.log('📚 Generating Sequences Index\n');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
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

  // Index all posts
  console.log('🔍 Analyzing posts and extracting themes & quotes...\n');
  const indexes: PostIndex[] = [];

  for (const post of allPosts) {
    process.stdout.write(`\r   Processing ${indexes.length + 1}/${allPosts.length}...`);
    indexes.push(indexPost(post));
  }

  console.log('\n\n✅ All posts indexed\n');

  // Generate index
  console.log('📝 Generating comprehensive index...\n');
  const index = generateIndex(indexes);
  fs.writeFileSync(INDEX_FILE, index);

  console.log(`✅ Index generated: ${INDEX_FILE}`);
  console.log(`📊 Total posts: ${indexes.length}`);
  console.log(`📄 Index size: ${(index.length / 1024).toFixed(2)} KB\n`);
  console.log('🎉 Index generation complete!\n');
}

// Run
main().catch(console.error);
