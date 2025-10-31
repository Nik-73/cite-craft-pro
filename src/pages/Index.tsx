import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import CitationPanel from "@/components/CitationPanel";
import DocumentPreview from "@/components/DocumentPreview";
import GradingPanel from "@/components/GradingPanel";
import StyleSelector from "@/components/StyleSelector";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  citation_order: number;
}

const Index = () => {
  const { toast } = useToast();
  const [citations, setCitations] = useState<Citation[]>([]);
  const [title, setTitle] = useState("Untitled Paper");
  const [content, setContent] = useState("");
  const [citationStyle, setCitationStyle] = useState("APA");

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleCitationsExtracted = (citationsContent: string) => {
    const extractedCitations = citationsContent
      .split("\n")
      .filter((line) => line.trim() !== "");

    const newCitations = extractedCitations.map((citationText, index) => {
      const parts = citationText.split(",").map((part) => part.trim());
      return {
        id: `extracted-${Date.now()}-${index}`,
        author: parts[0] || "Unknown Author",
        title: parts[1] || "Untitled",
        year: parts[2] ? parseInt(parts[2]) : null,
        publication: null,
        url: null,
        doi: null,
        pages: null,
        volume: null,
        issue: null,
        publisher: null,
        citation_order: citations.length + index,
      };
    });

    if (newCitations.length > 0) {
      setCitations([...citations, ...newCitations]);
      toast({
        title: "Citations imported",
        description: `${newCitations.length} citations were extracted and added.`,
      });
    }
  };

  const handleStyleChange = (style: string) => {
    setCitationStyle(style);
    toast({
      title: "Style updated",
      description: `Citation style changed to ${style}`,
    });
  };

  const handleExport = () => {
    toast({
      title: "Export",
      description: "Export functionality coming soon!",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
              CC
            </div>
            <h1 className="text-xl font-bold text-primary">CiteCraft Pro</h1>
          </div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="max-w-md font-semibold"
            placeholder="Paper Title"
          />
        </div>

        <div className="flex items-center gap-2">
          <StyleSelector
            value={citationStyle}
            onChange={handleStyleChange}
          />
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Editor & Upload */}
        <div className="w-1/2 flex flex-col border-r bg-muted/20">
          <div className="p-4 border-b bg-card">
            <h2 className="font-semibold mb-2">Upload & Edit</h2>
            <FileUpload
              onContentExtracted={handleContentChange}
              onCitationsExtracted={handleCitationsExtracted}
            />
          </div>

          <div className="flex-1 overflow-auto p-4">
            <CitationPanel
              citations={citations}
              onCitationsChange={setCitations}
            />
          </div>
        </div>

        {/* Right Panel - Preview & Grading */}
        <div className="w-1/2 flex flex-col bg-background">
          <Tabs defaultValue="preview" className="flex-1 flex flex-col">
            <div className="p-4 border-b bg-card">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="grading">Grading</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="preview" className="flex-1 overflow-auto">
              <DocumentPreview
                title={title}
                content={content}
                citations={citations}
                style={citationStyle}
              />
            </TabsContent>
            <TabsContent value="grading" className="flex-1 overflow-auto p-4">
              <GradingPanel
                content={content}
                citations={citations}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
