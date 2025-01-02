import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Settings, Plus, Trash2, FolderOpen } from "lucide-react";

const Index = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(files);
      toast({
        title: "Files selected",
        description: `${files.length} PDF files selected for signing`,
      });
    }
  };

  const handleSignPDFs = async () => {
    if (!selectedFiles) {
      toast({
        title: "No files selected",
        description: "Please select PDF files to sign",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      toast({
        title: "Success",
        description: "All PDFs have been signed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign PDFs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b shadow-sm p-2">
        <div className="flex items-center gap-2 max-w-screen-xl mx-auto">
          <Button variant="outline" size="icon" onClick={() => document.getElementById('pdf-input')?.click()}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <FolderOpen className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" disabled={!selectedFiles}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File List */}
          <Card className="p-4">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">PDF Files</h2>
              <Input
                id="pdf-input"
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="min-h-[300px] border rounded-lg p-4 bg-gray-50">
                {selectedFiles ? (
                  <ul className="space-y-2">
                    {Array.from(selectedFiles).map((file, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <span className="truncate">{file.name}</span>
                        <span className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Drag and drop PDF files here or use the Add button
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Signing Options */}
          <Card className="p-4">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Signing Options</h2>
              <div className="space-y-4">
                {progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Signing Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}
                <Button
                  onClick={handleSignPDFs}
                  className="w-full"
                  disabled={!selectedFiles || progress > 0}
                >
                  Sign PDFs
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;