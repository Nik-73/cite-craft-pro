import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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

interface CitationPanelProps {
  citations: Citation[];
  onCitationsChange: (citations: Citation[]) => void;
}

const CitationPanel = ({ citations, onCitationsChange }: CitationPanelProps) => {
  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [publication, setPublication] = useState("");
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleAddCitation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!author || !title) {
      toast({
        title: "Missing fields",
        description: "Author and title are required",
        variant: "destructive",
      });
      return;
    }

    const newCitation: Citation = {
      id: Date.now().toString(), // Simple ID generation for local state
      author,
      title,
      year: year ? parseInt(year) : null,
      publication,
      url,
      doi: null,
      pages: null,
      volume: null,
      issue: null,
      publisher: null,
      citation_order: citations.length,
    };

    onCitationsChange([...citations, newCitation]);

    // Reset form
    setAuthor("");
    setTitle("");
    setYear("");
    setPublication("");
    setUrl("");
    setShowForm(false);

    toast({
      title: "Citation added",
      description: "Your citation has been added to the bibliography",
    });
  };

  const handleDeleteCitation = (id: string) => {
    onCitationsChange(citations.filter((c) => c.id !== id));

    toast({
      title: "Citation deleted",
      description: "Citation removed from bibliography",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Citations Library</span>
            <Button
              size="sm"
              onClick={() => setShowForm(!showForm)}
              variant={showForm ? "secondary" : "default"}
            >
              <Plus className="h-4 w-4 mr-1" />
              {showForm ? "Cancel" : "Add Citation"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleAddCitation} className="space-y-3 mb-4 p-4 border rounded-lg bg-secondary/50">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Last, First"
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Article or book title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2024"
                  />
                </div>

                <div>
                  <Label htmlFor="publication">Publication</Label>
                  <Input
                    id="publication"
                    value={publication}
                    onChange={(e) => setPublication(e.target.value)}
                    placeholder="Journal name"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Add to Bibliography
              </Button>
            </form>
          )}

          <div className="space-y-2">
            {citations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No citations yet. Add your first citation to get started.
              </p>
            ) : (
              citations.map((citation, index) => (
                <div
                  key={citation.id}
                  className="p-3 border rounded-lg bg-card hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">
                        [{index + 1}] {citation.author}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {citation.title}
                      </p>
                      {citation.year && (
                        <p className="text-xs text-muted-foreground">
                          {citation.year}
                          {citation.publication && ` • ${citation.publication}`}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCitation(citation.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CitationPanel;
