// This service will handle the parsing of uploaded documents.
// It will separate the main content from the bibliography and extract individual citations.
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const BIBLIOGRAPHY_HEADINGS = [
  "references",
  "bibliography",
  "works cited",
];

/**
 * Extract text from a DOCX file
 */
const extractTextFromDocx = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

/**
 * Extract text from a PDF file
 */
const extractTextFromPdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";

  // Extract text from each page
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + "\n\n";
  }

  return fullText;
};

/**
 * Extract text from a plain text file
 */
const extractTextFromTxt = async (file: File): Promise<string> => {
  return await file.text();
};

/**
 * Process a document file and extract content and citations
 */
export const processDocument = async (file: File) => {
  let text = "";

  // Determine file type and extract text accordingly
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  const mimeType = file.type.toLowerCase();

  try {
    if (
      fileExtension === "docx" ||
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      text = await extractTextFromDocx(file);
    } else if (fileExtension === "pdf" || mimeType === "application/pdf") {
      text = await extractTextFromPdf(file);
    } else if (
      fileExtension === "txt" ||
      mimeType === "text/plain" ||
      mimeType.startsWith("text/")
    ) {
      text = await extractTextFromTxt(file);
    } else {
      // Default to text extraction as fallback
      text = await extractTextFromTxt(file);
    }
  } catch (error) {
    console.error("Error extracting text from file:", error);
    throw new Error(
      `Failed to extract text from ${fileExtension || "unknown"} file. Please ensure the file is not corrupted.`
    );
  }

  // Split text into lines for processing
  const lines = text.split("\n");

  // Find bibliography section
  let bibliographyStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase();
    if (BIBLIOGRAPHY_HEADINGS.includes(line)) {
      bibliographyStartIndex = i;
      break;
    }
  }

  if (bibliographyStartIndex === -1) {
    // No bibliography found, treat the whole document as content
    return { content: text, citations: [] };
  }

  const content = lines.slice(0, bibliographyStartIndex).join("\n");
  const bibliographyText = lines.slice(bibliographyStartIndex + 1).join("\n");

  const citations = bibliographyText
    .split("\n")
    .filter((line) => line.trim() !== "");

  return { content, citations };
};