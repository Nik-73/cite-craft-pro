/**
 * OSCOLA (Oxford University Standard for Citation of Legal Authorities) 4th Edition
 * Citation Formatter
 *
 * Implements OSCOLA citation rules for:
 * - Cases (domestic and international)
 * - Legislation
 * - Books
 * - Journal articles
 * - Online sources
 * - Government documents
 */

export interface OSCOLACitation {
  type: 'case' | 'legislation' | 'book' | 'article' | 'online' | 'government';
  id?: string; // Optional unique identifier
}

/**
 * OSCOLA Case Citation
 *
 * Format: Case Name [Year] Citation | Pinpoint
 * Example: R v Smith [2010] EWCA Crim 1234 [45]
 */
export interface OSCOLACase extends OSCOLACitation {
  type: 'case';
  caseName: string; // e.g., "R v Smith" or "State of Punjab v Gurmit Singh"
  year: string; // [2010] or (2010)
  citation: string; // EWCA Crim 1234, or AIR 1996 SC 1149
  court?: string; // Optional for clarity (Supreme Court, High Court)
  pinpoint?: string; // Paragraph or page number [45] or 1149
  url?: string; // Optional for online cases
}

export function formatOSCOLACase(citation: OSCOLACase): string {
  let result = citation.caseName;

  // Add year (square or round brackets)
  if (citation.year) {
    result += ` ${citation.year}`;
  }

  // Add citation
  if (citation.citation) {
    result += ` ${citation.citation}`;
  }

  // Add pinpoint
  if (citation.pinpoint) {
    // Check if it's a paragraph number (use square brackets) or page (no brackets)
    const isParaNum = /^\d+$/.test(citation.pinpoint);
    result += isParaNum ? ` [${citation.pinpoint}]` : `, ${citation.pinpoint}`;
  }

  return result;
}

/**
 * Indian Case Citation
 * Format: Case Name (Year) Citation Court
 * Example: State of Punjab v Gurmit Singh (1996) 2 SCC 384
 */
export interface IndianCase extends OSCOLACase {
  reporter?: 'SCC' | 'SCR' | 'AIR' | 'Cri LJ' | 'Other';
  volume?: string;
  page?: string;
}

export function formatIndianCase(citation: IndianCase): string {
  let result = citation.caseName;

  // Indian cases use round brackets for year
  if (citation.year) {
    result += ` (${citation.year.replace(/[\[\]]/g, '')})`;
  }

  // Volume and reporter
  if (citation.volume && citation.reporter) {
    result += ` ${citation.volume} ${citation.reporter}`;
  }

  // Page number
  if (citation.page) {
    result += ` ${citation.page}`;
  }

  // Court (optional, for clarity with district courts)
  if (citation.court) {
    result += ` (${citation.court})`;
  }

  return result;
}

/**
 * OSCOLA Legislation Citation
 *
 * Format: Short Title Year, section/schedule
 * Example: Human Rights Act 1998, s 3
 */
export interface OSCOLALegislation extends OSCOLACitation {
  type: 'legislation';
  shortTitle: string; // "Human Rights Act"
  year: string; // "1998"
  provision?: string; // "s 3", "sch 2", "art 10"
  jurisdiction?: string; // UK, India, etc.
}

export function formatOSCOLALegislation(citation: OSCOLALegislation): string {
  let result = `${citation.shortTitle} ${citation.year}`;

  if (citation.provision) {
    result += `, ${citation.provision}`;
  }

  return result;
}

/**
 * Indian Legislation Citation
 * Format: Short Title, Year (India), provision
 * Example: Indian Penal Code, 1860 (India), s 375
 */
export interface IndianLegislation extends OSCOLALegislation {
  actNumber?: string; // "45 of 1860"
}

export function formatIndianLegislation(citation: IndianLegislation): string {
  let result = citation.shortTitle;

  if (citation.year) {
    result += `, ${citation.year}`;
  }

  if (citation.jurisdiction) {
    result += ` (${citation.jurisdiction})`;
  }

  if (citation.provision) {
    result += `, ${citation.provision}`;
  }

  return result;
}

/**
 * OSCOLA Book Citation
 *
 * Format: Author, Title (Edition, Publisher Year) Pinpoint
 * Example: Alison L Young, Parliamentary Sovereignty and the Human Rights Act (Hart Publishing 2009) 45
 */
export interface OSCOLABook extends OSCOLACitation {
  type: 'book';
  authors: string[]; // ["Alison L Young"]
  title: string; // "Parliamentary Sovereignty"
  edition?: string; // "2nd edn"
  publisher: string; // "Hart Publishing"
  year: string; // "2009"
  pinpoint?: string; // Page or chapter
  editors?: string[]; // For edited volumes
}

export function formatOSCOLABook(citation: OSCOLABook): string {
  // Authors
  let result = formatAuthors(citation.authors);

  // Title (italicized in actual document)
  result += `, ${citation.title}`;

  // Edition, Publisher, Year
  const details: string[] = [];
  if (citation.edition) {
    details.push(citation.edition);
  }
  details.push(citation.publisher);
  details.push(citation.year);

  result += ` (${details.join(' ')})`;

  // Pinpoint
  if (citation.pinpoint) {
    result += ` ${citation.pinpoint}`;
  }

  return result;
}

/**
 * OSCOLA Journal Article Citation
 *
 * Format: Author, 'Title' (Year) Volume Journal Abbreviation Page
 * Example: John Smith, 'Consent and Autonomy' (2020) 45 Legal Studies 123
 */
export interface OSCOLAArticle extends OSCOLACitation {
  type: 'article';
  authors: string[];
  title: string; // Article title (in single quotes)
  year: string;
  volume?: string;
  issue?: string;
  journal: string; // Journal name or abbreviation
  firstPage: string;
  pinpoint?: string;
  doi?: string; // Optional DOI
  url?: string; // Optional URL
}

export function formatOSCOLAArticle(citation: OSCOLAArticle): string {
  // Authors
  let result = formatAuthors(citation.authors);

  // Title (in single quotes)
  result += `, '${citation.title}'`;

  // Year
  result += ` (${citation.year})`;

  // Volume
  if (citation.volume) {
    result += ` ${citation.volume}`;
  }

  // Issue (optional)
  if (citation.issue) {
    result += `(${citation.issue})`;
  }

  // Journal
  result += ` ${citation.journal}`;

  // Page
  result += ` ${citation.firstPage}`;

  // Pinpoint
  if (citation.pinpoint) {
    result += `, ${citation.pinpoint}`;
  }

  // DOI or URL (optional)
  if (citation.doi) {
    result += ` <https://doi.org/${citation.doi}>`;
  } else if (citation.url) {
    result += ` <${citation.url}>`;
  }

  return result;
}

/**
 * OSCOLA Online Source Citation
 *
 * Format: Author, 'Title' (Website, Date) <URL> accessed Date
 * Example: UN Human Rights Committee, 'General Comment 34' (2011) <http://...> accessed 15 January 2023
 */
export interface OSCOLAOnline extends OSCOLACitation {
  type: 'online';
  authors?: string[];
  title: string;
  website?: string;
  publishDate?: string;
  url: string;
  accessDate: string; // "15 January 2023"
}

export function formatOSCOLAOnline(citation: OSCOLAOnline): string {
  let result = '';

  // Authors (optional)
  if (citation.authors && citation.authors.length > 0) {
    result += formatAuthors(citation.authors) + ', ';
  }

  // Title
  result += `'${citation.title}'`;

  // Website and date
  if (citation.website || citation.publishDate) {
    const details: string[] = [];
    if (citation.website) {
      details.push(citation.website);
    }
    if (citation.publishDate) {
      details.push(citation.publishDate);
    }
    result += ` (${details.join(', ')})`;
  }

  // URL
  result += ` <${citation.url}>`;

  // Access date
  result += ` accessed ${citation.accessDate}`;

  return result;
}

/**
 * Helper: Format authors according to OSCOLA rules
 *
 * - Single author: "John Smith"
 * - Two authors: "John Smith and Jane Doe"
 * - Three authors: "John Smith, Jane Doe and Bob Jones"
 * - Four+ authors: "John Smith and others"
 */
function formatAuthors(authors: string[]): string {
  if (!authors || authors.length === 0) {
    return '';
  }

  if (authors.length === 1) {
    return authors[0];
  }

  if (authors.length === 2) {
    return `${authors[0]} and ${authors[1]}`;
  }

  if (authors.length === 3) {
    return `${authors[0]}, ${authors[1]} and ${authors[2]}`;
  }

  // Four or more authors: use "and others"
  return `${authors[0]} and others`;
}

/**
 * Format any citation type
 */
export function formatOSCOLACitation(citation: OSCOLACitation): string {
  switch (citation.type) {
    case 'case':
      // Check if Indian case
      if ((citation as IndianCase).reporter) {
        return formatIndianCase(citation as IndianCase);
      }
      return formatOSCOLACase(citation as OSCOLACase);

    case 'legislation':
      // Check if Indian legislation
      if ((citation as IndianLegislation).actNumber || citation.jurisdiction === 'India') {
        return formatIndianLegislation(citation as IndianLegislation);
      }
      return formatOSCOLALegislation(citation as OSCOLALegislation);

    case 'book':
      return formatOSCOLABook(citation as OSCOLABook);

    case 'article':
      return formatOSCOLAArticle(citation as OSCOLAArticle);

    case 'online':
      return formatOSCOLAOnline(citation as OSCOLAOnline);

    default:
      return '';
  }
}

/**
 * Generate footnote from citation
 */
export function generateFootnote(citation: OSCOLACitation, noteNumber: number): string {
  const formattedCitation = formatOSCOLACitation(citation);
  return `${noteNumber}. ${formattedCitation}`;
}

/**
 * OSCOLA Short Form Citations (for subsequent references)
 *
 * - Cases: Use short form after first citation
 *   First: R v Smith [2010] EWCA Crim 1234
 *   Later: R v Smith (n 1) [45]
 *
 * - Books: Author, Title (n 1) pinpoint
 *   First: Smith, Evidence Law (OUP 2010)
 *   Later: Smith (n 1) 123
 *
 * - Articles: Author (n 1) pinpoint
 *   First: Smith, 'Consent' (2020) 45 LS 123
 *   Later: Smith (n 1) 125
 */
export function generateShortCitation(
  citation: OSCOLACitation,
  firstNoteNumber: number,
  currentPinpoint?: string
): string {
  switch (citation.type) {
    case 'case': {
      const caseCitation = citation as OSCOLACase;
      let result = caseCitation.caseName;
      result += ` (n ${firstNoteNumber})`;
      if (currentPinpoint) {
        result += ` [${currentPinpoint}]`;
      }
      return result;
    }

    case 'book': {
      const bookCitation = citation as OSCOLABook;
      const firstAuthor = bookCitation.authors[0].split(' ').slice(-1)[0]; // Last name
      let result = firstAuthor;
      result += ` (n ${firstNoteNumber})`;
      if (currentPinpoint) {
        result += ` ${currentPinpoint}`;
      }
      return result;
    }

    case 'article': {
      const articleCitation = citation as OSCOLAArticle;
      const firstAuthor = articleCitation.authors[0].split(' ').slice(-1)[0]; // Last name
      let result = firstAuthor;
      result += ` (n ${firstNoteNumber})`;
      if (currentPinpoint) {
        result += ` ${currentPinpoint}`;
      }
      return result;
    }

    default:
      return `(n ${firstNoteNumber})`;
  }
}

/**
 * OSCOLA "ibid" rule
 *
 * Use "ibid" when citing the same source as the immediately preceding footnote
 * - Same page: "ibid"
 * - Different page: "ibid 45"
 */
export function generateIbid(pinpoint?: string): string {
  if (pinpoint) {
    return `ibid ${pinpoint}`;
  }
  return 'ibid';
}

/**
 * Example citations for testing and documentation
 */
export const EXAMPLE_CITATIONS = {
  ukCase: {
    type: 'case' as const,
    caseName: 'R v Smith',
    year: '[2010]',
    citation: 'EWCA Crim 1234',
    pinpoint: '45',
  },

  indianCase: {
    type: 'case' as const,
    caseName: 'State of Punjab v Gurmit Singh',
    year: '1996',
    reporter: 'SCC' as const,
    volume: '2',
    page: '384',
  },

  indianLegislation: {
    type: 'legislation' as const,
    shortTitle: 'Indian Penal Code',
    year: '1860',
    jurisdiction: 'India',
    provision: 's 375',
  },

  book: {
    type: 'book' as const,
    authors: ['Alison L Young'],
    title: 'Parliamentary Sovereignty and the Human Rights Act',
    publisher: 'Hart Publishing',
    year: '2009',
    pinpoint: '45',
  },

  article: {
    type: 'article' as const,
    authors: ['John Smith', 'Jane Doe'],
    title: 'Consent and Autonomy in Criminal Law',
    year: '2020',
    volume: '45',
    journal: 'Legal Studies',
    firstPage: '123',
    pinpoint: '125',
  },

  online: {
    type: 'online' as const,
    authors: ['UN Human Rights Committee'],
    title: 'General Comment No. 34',
    publishDate: '2011',
    url: 'http://www2.ohchr.org/english/bodies/hrc/docs/gc34.pdf',
    accessDate: '15 January 2023',
  },
};
