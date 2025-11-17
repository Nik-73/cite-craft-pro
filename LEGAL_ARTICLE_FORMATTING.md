# Legal Article Formatting Tools

**CiteCraft Pro** now includes comprehensive tools for formatting legal academic articles according to journal submission standards.

---

## 🎯 Quick Start

### Format an Existing Article

```bash
# Analyze your article
npm run format-article -- -i your-article.md

# Generate LaTeX with auto-fix
npm run format-article -- -i your-article.md -f latex -o output.tex --fix

# Generate Word-compatible XML
npm run format-article -- -i your-article.md -f word -o output.xml
```

### Start from Template

```bash
# Copy the template
cp templates/legal-article-template.md my-article.md

# Edit with your content
nano my-article.md

# Check formatting
npm run format-article -- -i my-article.md
```

---

## 📋 Journal Requirements Supported

### Standard Specifications

- ✅ **Word Count:** 5,000 - 10,000 words (inclusive of footnotes)
- ✅ **Line Spacing:** 1.5 lines
- ✅ **Font:** Times New Roman, 12pt
- ✅ **Citation Style:** OSCOLA 4th Edition
- ✅ **Citations:** Footnotes (not endnotes)
- ✅ **Typography:** No em dashes (use en dashes or hyphens)
- ✅ **Content:** Contemporary relevance with analytical legal engagement

### What Gets Validated

The formatter checks:
- Word count (including footnotes)
- Em dash usage
- Endnotes vs. footnotes
- Citation format
- Document structure (title, abstract, keywords)
- Section organization

---

## 🛠️ Tools and Services

### 1. Legal Article Formatter

**Location:** `src/services/legalArticleFormatter.ts`

**Key Functions:**

```typescript
import {
  analyzeArticle,
  checkLegalArticleStyle,
  validateWordCount,
  replaceEmDashes,
  generateLaTeXDocument,
  generateWordDocumentXML,
  DEFAULT_LEGAL_ARTICLE_FORMAT
} from '@/services/legalArticleFormatter';

// Analyze article structure and style
const analysis = analyzeArticle(content, metadata);
console.log(`Word count: ${analysis.wordCount}`);
console.log(`Style issues: ${analysis.styleIssues.length}`);

// Check for style violations
const issues = checkLegalArticleStyle(content);
issues.forEach(issue => {
  console.log(`${issue.severity}: ${issue.message}`);
});

// Auto-fix em dashes
const fixedContent = replaceEmDashes(content);

// Generate formatted output
const latex = generateLaTeXDocument(content, metadata);
const wordXML = generateWordDocumentXML(content, metadata);
```

### 2. OSCOLA Citation Formatter

**Location:** `src/services/oscolaCitations.ts`

**Supported Citation Types:**
- Cases (UK and Indian)
- Legislation (UK and Indian)
- Books
- Journal articles
- Online sources
- Government documents

**Example Usage:**

```typescript
import {
  formatOSCOLACitation,
  generateFootnote,
  generateShortCitation,
  generateIbid,
  type IndianCase,
  type OSCOLAArticle
} from '@/services/oscolaCitations';

// Format Indian case
const indianCase: IndianCase = {
  type: 'case',
  caseName: 'State of Punjab v Gurmit Singh',
  year: '1996',
  reporter: 'SCC',
  volume: '2',
  page: '384'
};

const formatted = formatOSCOLACitation(indianCase);
// Output: "State of Punjab v Gurmit Singh (1996) 2 SCC 384"

// Generate footnote
const footnote = generateFootnote(indianCase, 1);
// Output: "1. State of Punjab v Gurmit Singh (1996) 2 SCC 384"

// Short form for subsequent references
const shortForm = generateShortCitation(indianCase, 1, '387');
// Output: "State of Punjab v Gurmit Singh (n 1) [387]"

// Use ibid for immediate repetition
const ibid = generateIbid('45');
// Output: "ibid 45"
```

**Full Example:**

```typescript
// Journal article citation
const article: OSCOLAArticle = {
  type: 'article',
  authors: ['John Smith', 'Jane Doe'],
  title: 'Consent and Autonomy in Criminal Law',
  year: '2020',
  volume: '45',
  issue: '2',
  journal: 'Legal Studies',
  firstPage: '123',
  pinpoint: '125'
};

console.log(formatOSCOLACitation(article));
// Output: "John Smith and Jane Doe, 'Consent and Autonomy in Criminal Law' (2020) 45(2) Legal Studies 123, 125"
```

### 3. CLI Tool

**Location:** `src/cli/format-legal-article.ts`

**Commands:**

```bash
# Analyze article (default)
npm run format-article -- -i article.md

# Generate LaTeX
npm run format-article -- -i article.md -f latex -o article.tex

# Generate Word XML
npm run format-article -- -i article.md -f word -o article.xml

# Auto-fix common issues
npm run format-article -- -i article.md --fix

# Specify metadata
npm run format-article -- -i article.md \\
  --title "My Legal Article" \\
  --author "John Smith" \\
  --affiliation "University of Oxford"
```

**Sample Output:**

```
═══════════════════════════════════════════════════════
    LEGAL ARTICLE ANALYSIS REPORT
═══════════════════════════════════════════════════════

📄 ARTICLE METADATA
─────────────────────────────────────────────────────
Title:       Semantic Gaps in Legal Translation
Author:      John Smith
Affiliation: University of Oxford
Keywords:    legal translation, OSCOLA, multilingual law

📊 WORD COUNT
─────────────────────────────────────────────────────
Total words:  7,542
Footnotes:    87
Status:       ✅ WITHIN RANGE (5,000-10,000 words)

🏗️  STRUCTURE
─────────────────────────────────────────────────────
Title page:   ✅
Abstract:     ✅
Keywords:     ✅
Sections:     5

Section outline:
  1. Introduction
  2. Legal Framework
  3. Empirical Analysis
  4. Implications
  5. Conclusion

🔍 STYLE CHECKS
─────────────────────────────────────────────────────
⚠️  WARNINGS (1):

1. [EM-DASH] Found 12 em dash(es). Consider replacing...
   💡 Use en dashes (–) or spaced hyphens ( - ) instead

═══════════════════════════════════════════════════════
⚠️  ARTICLE HAS WARNINGS - CONSIDER ADDRESSING
═══════════════════════════════════════════════════════
```

---

## 📚 Documentation

### Comprehensive Guides

1. **[LEGAL_ARTICLE_STYLE_GUIDE.md](./LEGAL_ARTICLE_STYLE_GUIDE.md)**
   - Complete formatting requirements
   - OSCOLA citation examples
   - Writing style guidance
   - Famous papers analysis
   - Submission checklist

2. **[templates/legal-article-template.md](./templates/legal-article-template.md)**
   - Ready-to-use article template
   - Proper structure and formatting
   - Example footnotes
   - Section organization

---

## 🎓 OSCOLA Citation Quick Reference

### Cases

**UK Cases:**
```
R v Smith [2010] EWCA Crim 1234
Donoghue v Stevenson [1932] AC 562 (HL)
```

**Indian Cases:**
```
State of Punjab v Gurmit Singh (1996) 2 SCC 384
Bharwada Bhoginbhai v State of Gujarat (1983) 4 SCC 302
```

### Legislation

**UK:**
```
Human Rights Act 1998, s 3
Constitutional Reform Act 2005, sch 2
```

**Indian:**
```
Indian Penal Code, 1860 (India), s 375
Constitution of India, art 21
```

### Secondary Sources

**Books:**
```
Alison L Young, Parliamentary Sovereignty and the Human Rights Act (Hart Publishing 2009) 45
```

**Journal Articles:**
```
John Smith, 'Consent and Autonomy' (2020) 45 Legal Studies 123, 125
```

**Online Sources:**
```
UN Human Rights Committee, 'General Comment No. 34' (2011) <http://...> accessed 15 January 2023
```

### Subsequent References

**Short form:**
```
1. State of Punjab v Gurmit Singh (1996) 2 SCC 384
...
15. State of Punjab (n 1) 387
```

**Ibid:**
```
23. John Smith, 'Title' (2020) 45 LS 123
24. ibid 125
```

---

## 🔧 Integration with Your Workflow

### Programmatic Usage

```typescript
import { analyzeArticle } from '@/services/legalArticleFormatter';
import { formatOSCOLACitation } from '@/services/oscolaCitations';

// In your application
async function processLegalArticle(markdownContent: string) {
  // Extract metadata
  const metadata = {
    title: 'My Article',
    author: 'John Smith',
    affiliation: 'University'
  };

  // Analyze
  const analysis = analyzeArticle(markdownContent, metadata);

  // Report issues
  if (analysis.styleIssues.length > 0) {
    console.log('Style issues found:');
    analysis.styleIssues.forEach(issue => {
      console.log(`- ${issue.message}`);
    });
  }

  // Check word count
  if (analysis.wordCount < 5000) {
    console.log('Article too short');
  }

  return analysis;
}
```

### NPM Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "format-article": "tsx src/cli/format-legal-article.ts",
    "check-article": "tsx src/cli/format-legal-article.ts -f analysis",
    "article:latex": "tsx src/cli/format-legal-article.ts -f latex --fix",
    "article:word": "tsx src/cli/format-legal-article.ts -f word --fix"
  }
}
```

---

## ✅ Submission Checklist

Before submitting your article, verify:

### Content Requirements
- [ ] 5,000-10,000 words (including footnotes)
- [ ] Contemporary relevance demonstrated
- [ ] Analytical issue of law engaged
- [ ] Clear thesis statement
- [ ] Original contribution to scholarship

### Formatting Requirements
- [ ] Times New Roman, 12pt
- [ ] 1.5 line spacing
- [ ] 1-inch margins all sides
- [ ] No em dashes used
- [ ] All citations as footnotes (not endnotes)

### Structure Requirements
- [ ] Title page with author and affiliation
- [ ] Abstract (150-250 words)
- [ ] Keywords (4-6 keywords)
- [ ] Logical section structure
- [ ] Clear introduction and conclusion

### Citation Requirements
- [ ] All sources cited in OSCOLA format
- [ ] Footnotes numbered consecutively
- [ ] Short forms used correctly
- [ ] Ibid used appropriately
- [ ] Pinpoint citations included

### Quality Checks
- [ ] Proofread for typos and grammar
- [ ] Consistent terminology
- [ ] Clear, professional writing
- [ ] Counter-arguments addressed
- [ ] Limitations acknowledged

**Run the automated check:**
```bash
npm run format-article -- -i your-article.md
```

---

## 📖 Example: Converting Research to Article

Let's convert the research report from `research/FINAL_RESEARCH_REPORT.md` into a journal article:

### Step 1: Copy Template

```bash
cp templates/legal-article-template.md article-semantic-gaps.md
```

### Step 2: Adapt Content

- **Introduction:** Condense executive summary → 500-800 words
- **Literature Review:** Expand theoretical background
- **Methodology:** Summarize from Section 1
- **Analysis:** Focus on 2-3 key findings (not all tiers)
- **Implications:** Draw from policy recommendations
- **Conclusion:** Synthesize main argument

### Step 3: Format Citations

```typescript
// Convert references to OSCOLA
const case1: IndianCase = {
  type: 'case',
  caseName: 'State of Punjab v Gurmit Singh',
  year: '1996',
  reporter: 'SCC',
  volume: '2',
  page: '384'
};

const legislation: IndianLegislation = {
  type: 'legislation',
  shortTitle: 'Indian Penal Code',
  year: '1860',
  jurisdiction: 'India',
  provision: 's 375'
};
```

### Step 4: Check Formatting

```bash
npm run format-article -- -i article-semantic-gaps.md --fix
```

### Step 5: Generate Submission File

```bash
# For LaTeX submission
npm run format-article -- -i article-semantic-gaps.md -f latex -o submission.tex

# For Word submission
npm run format-article -- -i article-semantic-gaps.md -f word -o submission.xml
```

---

## 🔗 Resources

### Official OSCOLA Guide
- [OSCOLA 4th Edition](https://www.law.ox.ac.uk/oscola)
- [Quick Reference Guide](https://www.law.ox.ac.uk/sites/files/oxlaw/oscola_4th_edn_hart_2012quickreferenceguide.pdf)

### Legal Writing Resources
- Bryan Garner, *The Redbook: A Manual on Legal Style*
- Rupert Cross, *Precedent in English Law*
- Legal writing guides from top law journals

### Famous Legal Articles to Study
- HLA Hart, 'Positivism and the Separation of Law and Morals' (1958) 71 Harvard Law Review 593
- Lon Fuller, 'The Forms and Limits of Adjudication' (1978) 92 Harvard Law Review 353
- Ronald Dworkin, 'Hard Cases' (1975) 88 Harvard Law Review 1057

---

## 🤝 Contributing

Improvements to the legal formatting tools are welcome!

**Areas for enhancement:**
- Additional citation types
- Support for more jurisdictions
- Enhanced style checking
- Bibliography generation
- Reference management integration

---

## 📄 License

The legal article formatting tools are part of CiteCraft Pro and follow the same license.

---

**Version:** 1.0
**Last Updated:** November 17, 2025

For questions or issues, please refer to:
- [LEGAL_ARTICLE_STYLE_GUIDE.md](./LEGAL_ARTICLE_STYLE_GUIDE.md) for comprehensive guidance
- [templates/legal-article-template.md](./templates/legal-article-template.md) for the article template
- GitHub Issues for technical problems

---

**Happy writing! 📝⚖️**
