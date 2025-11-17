/**
 * Legal Article Formatter Service
 *
 * Formats legal research articles according to academic journal standards:
 * - 5,000-10,000 words (including footnotes)
 * - 1.5 line spacing
 * - Times New Roman, 12pt
 * - OSCOLA 4th Edition citations
 * - Footnotes (not endnotes)
 * - No em dashes
 */

export interface ArticleMetadata {
  title: string;
  author: string;
  affiliation?: string;
  email?: string;
  abstract?: string;
  keywords?: string[];
  wordCount?: number;
  footnoteCount?: number;
}

export interface FormattingOptions {
  lineSpacing: number; // 1.5 for legal articles
  fontSize: number; // 12pt
  fontFamily: string; // "Times New Roman"
  citationStyle: 'OSCOLA' | 'Bluebook' | 'AGLC';
  maxWords?: number; // 10000
  minWords?: number; // 5000
  avoidEmDashes: boolean; // true
  useFootnotes: boolean; // true (not endnotes)
}

export const DEFAULT_LEGAL_ARTICLE_FORMAT: FormattingOptions = {
  lineSpacing: 1.5,
  fontSize: 12,
  fontFamily: 'Times New Roman',
  citationStyle: 'OSCOLA',
  maxWords: 10000,
  minWords: 5000,
  avoidEmDashes: true,
  useFootnotes: true,
};

/**
 * Validates article against word count requirements
 */
export function validateWordCount(text: string, options: FormattingOptions): {
  valid: boolean;
  wordCount: number;
  message: string;
} {
  // Count words (including footnotes)
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  const min = options.minWords || 5000;
  const max = options.maxWords || 10000;

  if (wordCount < min) {
    return {
      valid: false,
      wordCount,
      message: `Article is too short: ${wordCount} words (minimum: ${min} words)`,
    };
  }

  if (wordCount > max) {
    return {
      valid: false,
      wordCount,
      message: `Article is too long: ${wordCount} words (maximum: ${max} words)`,
    };
  }

  return {
    valid: true,
    wordCount,
    message: `Article length valid: ${wordCount} words (${min}-${max} words)`,
  };
}

/**
 * Replaces em dashes with en dashes or hyphens as appropriate
 */
export function replaceEmDashes(text: string): string {
  // Replace em dash (—) with en dash (–) or hyphen depending on context
  return text
    .replace(/—/g, ' - ') // Em dash to spaced hyphen (clearer for legal writing)
    .replace(/\s+-\s+/g, ' - '); // Normalize spacing
}

/**
 * Converts endnotes to footnotes format
 */
export function convertEndnotesToFootnotes(text: string): {
  text: string;
  footnotes: string[];
} {
  const footnotes: string[] = [];

  // Extract endnotes section
  const endnotesMatch = text.match(/\n#+\s*(?:Endnotes|Notes|References)\s*\n([\s\S]*?)(?:\n#+|$)/i);

  if (!endnotesMatch) {
    return { text, footnotes };
  }

  const endnotesSection = endnotesMatch[1];
  const endnoteLines = endnotesSection.split('\n').filter(line => line.trim());

  // Parse endnotes (format: "1. Text" or "[1] Text")
  const endnotePattern = /^(?:\[?(\d+)\]?\.?)\s+(.+)/;

  endnoteLines.forEach(line => {
    const match = line.match(endnotePattern);
    if (match) {
      const [, num, content] = match;
      footnotes[parseInt(num) - 1] = content.trim();
    }
  });

  // Remove endnotes section
  const mainText = text.replace(endnotesMatch[0], '');

  return { text: mainText, footnotes };
}

/**
 * Generates Word-compatible document XML with proper formatting
 */
export function generateWordDocumentXML(
  content: string,
  metadata: ArticleMetadata,
  options: FormattingOptions = DEFAULT_LEGAL_ARTICLE_FORMAT
): string {
  const { lineSpacing, fontSize, fontFamily } = options;

  // Convert line spacing to half-lines (Word uses 240 = single spacing)
  const lineSpacingValue = Math.round(lineSpacing * 240);

  // Basic Word XML structure with proper formatting
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <!-- Title -->
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:line="${lineSpacingValue}" w:lineRule="auto"/>
        <w:rPr>
          <w:b/>
          <w:sz w:val="${fontSize * 2 + 4}"/> <!-- Title slightly larger -->
        </w:rPr>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="${fontFamily}" w:hAnsi="${fontFamily}"/>
          <w:b/>
          <w:sz w:val="${fontSize * 2 + 4}"/>
        </w:rPr>
        <w:t>${escapeXML(metadata.title)}</w:t>
      </w:r>
    </w:p>

    <!-- Author -->
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:line="${lineSpacingValue}" w:lineRule="auto"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="${fontFamily}" w:hAnsi="${fontFamily}"/>
          <w:sz w:val="${fontSize * 2}"/>
        </w:rPr>
        <w:t>${escapeXML(metadata.author)}</w:t>
      </w:r>
    </w:p>

    ${metadata.affiliation ? `
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:line="${lineSpacingValue}" w:lineRule="auto"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="${fontFamily}" w:hAnsi="${fontFamily}"/>
          <w:i/>
          <w:sz w:val="${fontSize * 2}"/>
        </w:rPr>
        <w:t>${escapeXML(metadata.affiliation)}</w:t>
      </w:r>
    </w:p>
    ` : ''}

    ${metadata.abstract ? `
    <!-- Abstract -->
    <w:p>
      <w:pPr>
        <w:spacing w:line="${lineSpacingValue}" w:lineRule="auto"/>
        <w:rPr>
          <w:b/>
        </w:rPr>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="${fontFamily}" w:hAnsi="${fontFamily}"/>
          <w:b/>
          <w:sz w:val="${fontSize * 2}"/>
        </w:rPr>
        <w:t>Abstract</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr>
        <w:spacing w:line="${lineSpacingValue}" w:lineRule="auto"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="${fontFamily}" w:hAnsi="${fontFamily}"/>
          <w:sz w:val="${fontSize * 2}"/>
        </w:rPr>
        <w:t>${escapeXML(metadata.abstract)}</w:t>
      </w:r>
    </w:p>
    ` : ''}

    <!-- Main content will be inserted here -->
    ${convertContentToWordXML(content, { lineSpacing: lineSpacingValue, fontSize: fontSize * 2, fontFamily })}
  </w:body>
</w:document>`;
}

function escapeXML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function convertContentToWordXML(content: string, formatting: { lineSpacing: number; fontSize: number; fontFamily: string }): string {
  const paragraphs = content.split('\n\n');

  return paragraphs.map(para => `
    <w:p>
      <w:pPr>
        <w:spacing w:line="${formatting.lineSpacing}" w:lineRule="auto"/>
        <w:jc w:val="both"/> <!-- Justified text -->
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="${formatting.fontFamily}" w:hAnsi="${formatting.fontFamily}"/>
          <w:sz w:val="${formatting.fontSize}"/>
        </w:rPr>
        <w:t xml:space="preserve">${escapeXML(para)}</w:t>
      </w:r>
    </w:p>
  `).join('\n');
}

/**
 * Generates LaTeX document with proper legal article formatting
 */
export function generateLaTeXDocument(
  content: string,
  metadata: ArticleMetadata,
  options: FormattingOptions = DEFAULT_LEGAL_ARTICLE_FORMAT
): string {
  const { lineSpacing, fontSize, fontFamily } = options;

  return `\\documentclass[${fontSize}pt,a4paper]{article}

% Packages
\\usepackage{fontspec}
\\usepackage{setspace}
\\usepackage[margin=1in]{geometry}
\\usepackage{footmisc}
\\usepackage[british]{babel}

% Font settings
\\setmainfont{${fontFamily}}

% Line spacing
\\setstretch{${lineSpacing}}

% Footnote settings (no endnotes)
\\usepackage[bottom]{footmisc}

% Title and author
\\title{${escapeLaTeX(metadata.title)}}
\\author{${escapeLaTeX(metadata.author)}${metadata.affiliation ? `\\\\\\small ${escapeLaTeX(metadata.affiliation)}` : ''}}
\\date{}

\\begin{document}

\\maketitle

${metadata.abstract ? `
\\begin{abstract}
${escapeLaTeX(metadata.abstract)}
\\end{abstract}

${metadata.keywords ? `\\textbf{Keywords:} ${metadata.keywords.join(', ')}` : ''}
` : ''}

${convertContentToLaTeX(content)}

\\end{document}`;
}

function escapeLaTeX(text: string): string {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function convertContentToLaTeX(content: string): string {
  // Basic conversion - can be enhanced for complex formatting
  return escapeLaTeX(content);
}

/**
 * Style checker for legal academic writing
 */
export interface StyleIssue {
  type: 'em-dash' | 'endnote' | 'font' | 'spacing' | 'citation' | 'word-count';
  severity: 'error' | 'warning';
  message: string;
  line?: number;
  suggestion?: string;
}

export function checkLegalArticleStyle(
  content: string,
  options: FormattingOptions = DEFAULT_LEGAL_ARTICLE_FORMAT
): StyleIssue[] {
  const issues: StyleIssue[] = [];

  // Check for em dashes
  if (options.avoidEmDashes && content.includes('—')) {
    const count = (content.match(/—/g) || []).length;
    issues.push({
      type: 'em-dash',
      severity: 'warning',
      message: `Found ${count} em dash(es). Consider replacing with en dashes or hyphens for legal writing.`,
      suggestion: 'Use en dashes (–) or spaced hyphens ( - ) instead of em dashes (—).',
    });
  }

  // Check for endnotes
  if (options.useFootnotes && /\n#+\s*(?:Endnotes|Notes)\s*\n/i.test(content)) {
    issues.push({
      type: 'endnote',
      severity: 'error',
      message: 'Document appears to use endnotes. Legal journals require footnotes.',
      suggestion: 'Convert all endnotes to footnotes placed at the bottom of each page.',
    });
  }

  // Check word count
  const wordCountCheck = validateWordCount(content, options);
  if (!wordCountCheck.valid) {
    issues.push({
      type: 'word-count',
      severity: 'error',
      message: wordCountCheck.message,
    });
  }

  // Check for citation format (basic check)
  const hasFootnoteMarkers = /\[\d+\]|\(\d+\)/.test(content);
  if (!hasFootnoteMarkers) {
    issues.push({
      type: 'citation',
      severity: 'warning',
      message: 'No footnote markers found. Ensure all citations are properly footnoted.',
      suggestion: 'Use numbered footnotes for all citations in OSCOLA format.',
    });
  }

  return issues;
}

/**
 * Analysis report for article formatting
 */
export interface ArticleAnalysis {
  metadata: ArticleMetadata;
  wordCount: number;
  footnoteCount: number;
  styleIssues: StyleIssue[];
  structure: {
    hasTitlePage: boolean;
    hasAbstract: boolean;
    hasKeywords: boolean;
    sectionCount: number;
    sections: string[];
  };
}

export function analyzeArticle(
  content: string,
  metadata: ArticleMetadata,
  options: FormattingOptions = DEFAULT_LEGAL_ARTICLE_FORMAT
): ArticleAnalysis {
  const wordCount = content.trim().split(/\s+/).length;
  const footnoteCount = (content.match(/\[\d+\]/g) || []).length;
  const styleIssues = checkLegalArticleStyle(content, options);

  // Extract sections (markdown headers)
  const sectionMatches = content.matchAll(/^#+\s+(.+)$/gm);
  const sections = Array.from(sectionMatches).map(m => m[1]);

  return {
    metadata: {
      ...metadata,
      wordCount,
      footnoteCount,
    },
    wordCount,
    footnoteCount,
    styleIssues,
    structure: {
      hasTitlePage: !!metadata.title,
      hasAbstract: !!metadata.abstract,
      hasKeywords: !!(metadata.keywords && metadata.keywords.length > 0),
      sectionCount: sections.length,
      sections,
    },
  };
}
