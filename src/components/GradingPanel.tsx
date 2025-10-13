import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Citation {
  id: string;
  author: string;
  title: string;
  year: number | null;
}

interface GradingPanelProps {
  content: string;
  citations: Citation[];
}

const extractInTextCitations = (content: string) => {
  const inTextCitations = new Set<string>();
  const regex = /\[(\d+)\]|\(([^,]+),\s(\d{4})\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (match[1]) {
      inTextCitations.add(match[1]);
    } else if (match[2] && match[3]) {
      inTextCitations.add(`${match[2]}, ${match[3]}`);
    }
  }
  return inTextCitations;
};

const GradingPanel = ({ content, citations }: GradingPanelProps) => {
  const analysis = useMemo(() => {
    const inTextRefs = extractInTextCitations(content);
    const biblioRefs = new Set(
      citations.map((c, i) => (i + 1).toString())
    );
    citations.forEach(c => biblioRefs.add(`${c.author}, ${c.year}`));

    const orphaned = citations.filter((citation, index) => {
      const numericRef = (index + 1).toString();
      const authorYearRef = `${citation.author}, ${citation.year}`;
      return !inTextRefs.has(numericRef) && !inTextRefs.has(authorYearRef);
    });

    const missing = [...inTextRefs].filter(ref => !biblioRefs.has(ref));

    return { orphaned, missing };
  }, [content, citations]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Writing Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysis.orphaned.length > 0 && (
            <div>
              <h3 className="font-semibold">Orphaned Citations</h3>
              <p className="text-sm text-muted-foreground mb-2">
                These citations appear in your bibliography but are not
                referenced in the text.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.orphaned.map((c) => (
                  <li key={c.id} className="text-sm">
                    {c.author}, {c.title} ({c.year})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.missing.length > 0 && (
            <div>
              <h3 className="font-semibold">Missing Citations</h3>
              <p className="text-sm text-muted-foreground mb-2">
                These citations are referenced in your text but are not found
                in the bibliography.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.missing.map((ref) => (
                  <li key={ref} className="text-sm">
                    {ref}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.orphaned.length === 0 && analysis.missing.length === 0 && (
            <p className="text-muted-foreground">
              No writing issues found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GradingPanel;