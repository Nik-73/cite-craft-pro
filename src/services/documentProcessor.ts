// This service will handle the parsing of uploaded documents.
// It will separate the main content from the bibliography and extract individual citations.

const BIBLIOGRAPHY_HEADINGS = [
  "references",
  "bibliography",
  "works cited",
];

export const processDocument = async (file: File) => {
  const text = await file.text();
  const lines = text.split("\n");

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