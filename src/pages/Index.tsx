import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

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
      // This is where we'll integrate with the DSC token
      // For now, we'll just simulate progress
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
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Bulk PDF Signer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="pdf-input" className="block text-sm font-medium">
              Select PDF Files
            </label>
            <Input
              id="pdf-input"
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileSelect}
              className="w-full"
            />
          </div>

          {selectedFiles && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {selectedFiles.length} files selected
              </p>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;