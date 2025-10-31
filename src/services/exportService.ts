import { jsPDF } from "jspdf";
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip, Packer } from "docx";
import { saveAs } from "file-saver";

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

interface ExportData {
  title: string;
  content: string;
  citations: Citation[];
  style: string;
}

const formatCitation = (citation: Citation, style: string): string => {
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
};

const formatAPA = (citation: Citation): string => {
  let formatted = citation.author;
  if (citation.year) formatted += ` (${citation.year})`;
  formatted += `. ${citation.title}`;
  if (citation.publication) formatted += `. ${citation.publication}`;
  if (citation.volume) formatted += `, ${citation.volume}`;
  if (citation.issue) formatted += `(${citation.issue})`;
  if (citation.pages) formatted += `, ${citation.pages}`;
  if (citation.doi) formatted += `. https://doi.org/${citation.doi}`;
  else if (citation.url) formatted += `. ${citation.url}`;
  return formatted;
};

const formatMLA = (citation: Citation): string => {
  let formatted = `${citation.author}. "${citation.title}."`;
  if (citation.publication) formatted += ` ${citation.publication}`;
  if (citation.volume) formatted += `, vol. ${citation.volume}`;
  if (citation.issue) formatted += `, no. ${citation.issue}`;
  if (citation.year) formatted += `, ${citation.year}`;
  if (citation.pages) formatted += `, pp. ${citation.pages}`;
  if (citation.url) formatted += `. ${citation.url}`;
  return formatted;
};

const formatChicago = (citation: Citation): string => {
  let formatted = `${citation.author}. "${citation.title}."`;
  if (citation.publication) formatted += ` ${citation.publication}`;
  if (citation.volume) formatted += ` ${citation.volume}`;
  if (citation.issue) formatted += `, no. ${citation.issue}`;
  if (citation.year) formatted += ` (${citation.year})`;
  if (citation.pages) formatted += `: ${citation.pages}`;
  if (citation.doi) formatted += `. https://doi.org/${citation.doi}`;
  return formatted;
};

const formatHarvard = (citation: Citation): string => {
  let formatted = citation.author;
  if (citation.year) formatted += ` ${citation.year}`;
  formatted += `, '${citation.title}'`;
  if (citation.publication) formatted += `, ${citation.publication}`;
  if (citation.volume) formatted += `, vol. ${citation.volume}`;
  if (citation.issue) formatted += `, no. ${citation.issue}`;
  if (citation.pages) formatted += `, pp. ${citation.pages}`;
  if (citation.url) formatted += `, available at: ${citation.url}`;
  return formatted;
};

const formatBluebook = (citation: Citation): string => {
  let formatted = citation.title;
  if (citation.publication) formatted += `, ${citation.publication}`;
  if (citation.pages) formatted += ` ${citation.pages}`;
  if (citation.author && citation.year) {
    formatted += ` (${citation.author} ${citation.year})`;
  } else if (citation.year) {
    formatted += ` (${citation.year})`;
  }
  return formatted;
};

const formatALWD = (citation: Citation): string => {
  let formatted = citation.title;
  if (citation.publication) formatted += `, ${citation.publication}`;
  if (citation.author) formatted += `, ${citation.author}`;
  if (citation.year) formatted += ` (${citation.year})`;
  return formatted;
};

const getBibliographyTitle = (style: string): string => {
  switch (style) {
    case "MLA":
      return "Works Cited";
    case "Chicago":
      return "Bibliography";
    default:
      return "References";
  }
};

export const exportToPDF = async (data: ExportData): Promise<void> => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: "letter",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 1;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Title
  doc.setFontSize(16);
  doc.setFont("times", "bold");
  const titleLines = doc.splitTextToSize(data.title || "Untitled Paper", contentWidth);
  checkPageBreak(titleLines.length * 0.25);
  doc.text(titleLines, pageWidth / 2, yPosition, { align: "center" });
  yPosition += titleLines.length * 0.25 + 0.3;

  // Style indicator
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(`${data.style} Format`, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 0.5;

  // Content
  if (data.content) {
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    const contentLines = doc.splitTextToSize(data.content, contentWidth);

    for (const line of contentLines) {
      checkPageBreak(0.2);
      doc.text(line, margin, yPosition);
      yPosition += 0.2;
    }
  }

  yPosition += 0.5;

  // Bibliography
  if (data.citations.length > 0) {
    checkPageBreak(0.5);
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    const bibTitle = getBibliographyTitle(data.style);
    doc.text(bibTitle, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 0.4;

    doc.setFontSize(12);
    doc.setFont("times", "normal");

    data.citations.forEach((citation) => {
      const formatted = formatCitation(citation, data.style);
      const citationLines = doc.splitTextToSize(formatted, contentWidth - 0.5);

      checkPageBreak(citationLines.length * 0.2);

      // Hanging indent
      doc.text(citationLines[0], margin + 0.5, yPosition);
      yPosition += 0.2;

      for (let i = 1; i < citationLines.length; i++) {
        checkPageBreak(0.2);
        doc.text(citationLines[i], margin + 0.5, yPosition);
        yPosition += 0.2;
      }

      yPosition += 0.1; // Space between citations
    });
  }

  // Save the PDF
  const fileName = `${data.title || "research-paper"}.pdf`;
  doc.save(fileName);
};

export const exportToDOCX = async (data: ExportData): Promise<void> => {
  const children: Paragraph[] = [];

  // Title
  children.push(
    new Paragraph({
      text: data.title || "Untitled Paper",
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 200,
      },
    })
  );

  // Style indicator
  children.push(
    new Paragraph({
      text: `${data.style} Format`,
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 400,
      },
    })
  );

  // Content
  if (data.content) {
    const contentParagraphs = data.content.split("\n");
    contentParagraphs.forEach((para) => {
      children.push(
        new Paragraph({
          text: para,
          spacing: {
            after: 200,
          },
        })
      );
    });
  }

  // Add space before bibliography
  children.push(
    new Paragraph({
      text: "",
      spacing: {
        after: 400,
      },
    })
  );

  // Bibliography
  if (data.citations.length > 0) {
    const bibTitle = getBibliographyTitle(data.style);
    children.push(
      new Paragraph({
        text: bibTitle,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 300,
        },
      })
    );

    data.citations.forEach((citation) => {
      const formatted = formatCitation(citation, data.style);
      children.push(
        new Paragraph({
          text: formatted,
          spacing: {
            after: 200,
          },
          indent: {
            left: convertInchesToTwip(0.5),
            hanging: convertInchesToTwip(0.5),
          },
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        children,
      },
    ],
  });

  // Generate and save the document
  const blob = await Packer.toBlob(doc);
  const fileName = `${data.title || "research-paper"}.docx`;
  saveAs(blob, fileName);
};
