import { useMemo } from "react";

interface Citation {
  id: string;
  author: string;
  title: string;
  year: number | null;
  publication: string | null;
  url: string | null;
  doi: string | null;
  pages: string | null;
  volume: string | null;
  issue: string | null;
  publisher: string | null;
}

interface DocumentPreviewProps {
  title: string;
  content: string;
  citations: Citation[];
  style: string;
}

const DocumentPreview = ({ title, content, citations, style }: DocumentPreviewProps) => {
  const formattedCitations = useMemo(() => {
    return citations.map((citation, index) => {
      switch (style) {
        case "APA":
          return formatAPA(citation);
        case "MLA":
          return formatMLA(citation);
        case "Chicago":
          return formatChicago(citation);
        case "Harvard":
          return formatHarvard(citation);
        case "Bluebook":
          return formatBluebook(citation);
        case "ALWD":
          return formatALWD(citation);
        default:
          return formatAPA(citation);
      }
    });
  }, [citations, style]);

  const formatAPA = (citation: Citation) => {
    let formatted = `${citation.author}`;
    if (citation.year) formatted += ` (${citation.year})`;
    formatted += `. ${citation.title}`;
    if (citation.publication) formatted += `. <em>${citation.publication}</em>`;
    if (citation.volume) formatted += `, ${citation.volume}`;
    if (citation.issue) formatted += `(${citation.issue})`;
    if (citation.pages) formatted += `, ${citation.pages}`;
    if (citation.doi) formatted += `. https://doi.org/${citation.doi}`;
    else if (citation.url) formatted += `. ${citation.url}`;
    return formatted;
  };

  const formatMLA = (citation: Citation) => {
    let formatted = `${citation.author}. "${citation.title}."`;
    if (citation.publication) formatted += ` <em>${citation.publication}</em>`;
    if (citation.volume) formatted += `, vol. ${citation.volume}`;
    if (citation.issue) formatted += `, no. ${citation.issue}`;
    if (citation.year) formatted += `, ${citation.year}`;
    if (citation.pages) formatted += `, pp. ${citation.pages}`;
    if (citation.url) formatted += `. ${citation.url}`;
    return formatted;
  };

  const formatChicago = (citation: Citation) => {
    let formatted = `${citation.author}. "${citation.title}."`;
    if (citation.publication) formatted += ` <em>${citation.publication}</em>`;
    if (citation.volume) formatted += ` ${citation.volume}`;
    if (citation.issue) formatted += `, no. ${citation.issue}`;
    if (citation.year) formatted += ` (${citation.year})`;
    if (citation.pages) formatted += `: ${citation.pages}`;
    if (citation.doi) formatted += `. https://doi.org/${citation.doi}`;
    return formatted;
  };

  const formatHarvard = (citation: Citation) => {
    let formatted = `${citation.author}`;
    if (citation.year) formatted += ` ${citation.year}`;
    formatted += `, '${citation.title}'`;
    if (citation.publication) formatted += `, <em>${citation.publication}</em>`;
    if (citation.volume) formatted += `, vol. ${citation.volume}`;
    if (citation.issue) formatted += `, no. ${citation.issue}`;
    if (citation.pages) formatted += `, pp. ${citation.pages}`;
    if (citation.url) formatted += `, available at: ${citation.url}`;
    return formatted;
  };

  const formatBluebook = (citation: Citation) => {
    // Simplified for court cases: Case Name, Source page number (Court year)
    // We'll use the 'title' for the case name and 'publication' for the source.
    let formatted = `<em>${citation.title}</em>`;
    if (citation.publication) formatted += `, ${citation.publication}`;
    if (citation.pages) formatted += ` ${citation.pages}`;
    if (citation.author && citation.year) {
      formatted += ` (${citation.author} ${citation.year})`;
    } else if (citation.year) {
      formatted += ` (${citation.year})`;
    }
    return formatted;
  };

  const formatALWD = (citation: Citation) => {
    // Case Name, Reporter, Court (Year)
    // We'll use 'title' for case name, 'publication' for reporter, and 'author' for court.
    let formatted = `<em>${citation.title}</em>`;
    if (citation.publication) formatted += `, ${citation.publication}`;
    if (citation.author) formatted += `, ${citation.author}`;
    if (citation.year) formatted += ` (${citation.year})`;
    return formatted;
  };

  const bibliographyTitle = useMemo(() => {
    switch (style) {
      case "MLA":
        return "Works Cited";
      case "Chicago":
        return "Bibliography";
      default:
        return "References";
    }
  }, [style]);

  return (
    <div className="document-paper max-w-4xl mx-auto my-8 p-12 min-h-[11in] font-serif">
      {/* Title Page */}
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold mb-2">{title || "Untitled Paper"}</h1>
        <div className="border-t border-b border-border py-2 my-4">
          <p className="text-sm text-muted-foreground">{style} Format</p>
        </div>
      </div>

      {/* Content */}
      <div className="mb-12 space-y-4">
        {content ? (
          <div className="whitespace-pre-wrap leading-relaxed text-justify">
            {content}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12 border-2 border-dashed border-border rounded-lg">
            <p className="mb-2">No content yet</p>
            <p className="text-sm">Upload a document to see it formatted here</p>
          </div>
        )}
      </div>

      {/* Bibliography */}
      {citations.length > 0 && (
        <div className="border-t-2 border-border pt-8">
          <h2 className="text-xl font-bold mb-6 text-center">{bibliographyTitle}</h2>
          <div className="space-y-4">
            {formattedCitations.map((formatted, index) => (
              <div
                key={index}
                className="pl-8 -indent-8 text-sm leading-relaxed"
              >
                <span className="font-bold">[{index + 1}]</span>{" "}
                <span dangerouslySetInnerHTML={{ __html: formatted }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footnotes placeholder */}
      {citations.length > 0 && (
        <div className="mt-12 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground italic">
            Footnotes will appear here as they are referenced in the text
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentPreview;
