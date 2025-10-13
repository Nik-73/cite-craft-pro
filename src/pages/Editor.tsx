import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import CitationPanel from "@/components/CitationPanel";
import DocumentPreview from "@/components/DocumentPreview";
import GradingPanel from "@/components/GradingPanel";
import StyleSelector from "@/components/StyleSelector";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Paper {
  id: string;
  title: string;
  content: string | null;
  citation_style: string;
  user_id: string;
}

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

const Editor = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    checkAuth();
    if (paperId) {
      fetchPaper();
      fetchCitations();
    }
  }, [paperId]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchPaper = async () => {
    try {
      const { data, error } = await supabase
        .from("papers")
        .select("*")
        .eq("id", paperId)
        .single();

      if (error) throw error;
      setPaper(data);
      setTitle(data.title);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch paper",
        variant: "destructive",
      });
      navigate("/app");
    } finally {
      setLoading(false);
    }
  };

  const fetchCitations = async () => {
    try {
      const { data, error } = await supabase
        .from("citations")
        .select("*")
        .eq("paper_id", paperId)
        .order("citation_order", { ascending: true });

      if (error) throw error;
      setCitations(data || []);
    } catch (error: any) {
      console.error("Error fetching citations:", error);
    }
  };

  const handleSave = async () => {
    if (!paper) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("papers")
        .update({
          title,
          content: paper.content,
          citation_style: paper.citation_style,
        })
        .eq("id", paper.id);

      if (error) throw error;

      toast({
        title: "Saved",
        description: "Your changes have been saved",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStyleChange = async (style: string) => {
    if (!paper) return;

    try {
      const { error } = await supabase
        .from("papers")
        .update({ citation_style: style })
        .eq("id", paper.id);

      if (error) throw error;

      setPaper({ ...paper, citation_style: style });
      toast({
        title: "Style updated",
        description: `Citation style changed to ${style}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update style",
        variant: "destructive",
      });
    }
  };

  const handleContentChange = (content: string) => {
    if (paper) {
      setPaper({ ...paper, content });
    }
  };

  const handleCitationsExtracted = async (citationsContent: string) => {
    const extractedCitations = citationsContent
      .split("\n")
      .filter((line) => line.trim() !== "");

    const newCitations = extractedCitations.map((citationText, index) => {
      const parts = citationText.split(",").map((part) => part.trim());
      return {
        paper_id: paperId,
        author: parts[0] || "Unknown Author",
        title: parts[1] || "Untitled",
        year: parts[2] ? parseInt(parts[2]) : null,
        citation_order: citations.length + index,
      };
    });

    if (newCitations.length > 0) {
      const { data, error } = await supabase
        .from("citations")
        .insert(newCitations)
        .select();

      if (error) {
        toast({
          title: "Error importing citations",
          description: error.message,
          variant: "destructive",
        });
      } else if (data) {
        setCitations([...citations, ...data]);
        toast({
          title: "Citations imported",
          description: `${data.length} citations were extracted and added.`,
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading paper...</p>
        </div>
      </div>
    );
  }

  if (!paper) return null;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => navigate("/app")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="max-w-md font-semibold"
            placeholder="Paper Title"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <StyleSelector
            value={paper.citation_style}
            onChange={handleStyleChange}
          />
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save"}
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
              paperId={paper.id}
              onContentExtracted={handleContentChange}
              onCitationsExtracted={handleCitationsExtracted}
            />
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <CitationPanel
              paperId={paper.id}
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
                content={paper.content || ""}
                citations={citations}
                style={paper.citation_style}
              />
            </TabsContent>
            <TabsContent value="grading" className="flex-1 overflow-auto p-4">
              <GradingPanel
                content={paper.content || ""}
                citations={citations}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Editor;
