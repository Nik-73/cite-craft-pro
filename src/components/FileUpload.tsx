import { useState, useRef } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { processDocument } from "@/services/documentProcessor";

interface FileUploadProps {
  paperId: string;
  onContentExtracted: (content: string) => void;
  onCitationsExtracted: (citationsContent: string) => void;
}

const FileDropZone = ({
  onFileSelect,
  file,
  clearFile,
  uploading,
  title,
  description,
}: {
  onFileSelect: (file: File) => void;
  file: File | null;
  clearFile: () => void;
  uploading: boolean;
  title: string;
  description: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleFile(files[0]);
  };

  const handleFile = (selectedFile: File) => {
    onFileSelect(selectedFile);
  };

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        } ${file ? "bg-secondary" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFile}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium mb-1">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        className="hidden"
      />
      {!file && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          Select File
        </Button>
      )}
    </div>
  );
};

const FileUpload = ({
  paperId,
  onContentExtracted,
  onCitationsExtracted,
}: FileUploadProps) => {
  const [uploadMode, setUploadMode] = useState<"single" | "split">("single");
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [citationsFile, setCitationsFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const processFile = async (file: File, type: "content" | "citations") => {
    const text = await file.text();
    if (type === "content") {
      onContentExtracted(text);
      return supabase
        .from("papers")
        .update({ content: text, file_name: file.name, file_type: file.type })
        .eq("id", paperId);
    } else {
      onCitationsExtracted(text);
      // Just process the citations content, no need to store filename
      return { data: null, error: null };
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      if (uploadMode === "single" && mainFile) {
        const { content, citations } = await processDocument(mainFile);
        onContentExtracted(content);
        onCitationsExtracted(citations.join("\n"));

        const { error } = await supabase
          .from("papers")
          .update({
            content,
            file_name: mainFile.name,
            file_type: mainFile.type,
          })
          .eq("id", paperId);

        if (error) throw error;
      } else if (uploadMode === "split") {
        if (mainFile) {
          const result = await processFile(mainFile, "content");
          if (result.error) throw result.error;
        }
        if (citationsFile) {
          const result = await processFile(citationsFile, "citations");
          if (result.error) throw result.error;
        }
      }
      toast({
        title: "Upload successful",
        description: "Your document(s) have been processed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process files",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const canUpload =
    (uploadMode === "single" && mainFile) ||
    (uploadMode === "split" && (mainFile || citationsFile));

  return (
    <div className="space-y-4">
      <Tabs
        value={uploadMode}
        onValueChange={(v) => setUploadMode(v as "single" | "split")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Single Document</TabsTrigger>
          <TabsTrigger value="split">Split Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="single" className="pt-2">
          <FileDropZone
            onFileSelect={setMainFile}
            file={mainFile}
            clearFile={() => setMainFile(null)}
            uploading={uploading}
            title="Upload Combined Document"
            description="Paper and bibliography in one file"
          />
        </TabsContent>
        <TabsContent value="split" className="pt-2 space-y-3">
          <FileDropZone
            onFileSelect={setMainFile}
            file={mainFile}
            clearFile={() => setMainFile(null)}
            uploading={uploading}
            title="Upload Main Paper"
            description="The body of your work"
          />
          <FileDropZone
            onFileSelect={setCitationsFile}
            file={citationsFile}
            clearFile={() => setCitationsFile(null)}
            uploading={uploading}
            title="Upload Bibliography"
            description="Citations or references file"
          />
        </TabsContent>
      </Tabs>

      <Button onClick={handleUpload} disabled={!canUpload || uploading} className="w-full">
        {uploading ? "Processing..." : "Upload & Process"}
      </Button>
    </div>
  );
};

export default FileUpload;
