import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, FolderOpen } from "lucide-react";
import { SettingsDialog } from "@/components/SettingsDialog";
import { Document, Page, pdfjs } from 'react-pdf';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Index = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [progress, setProgress] = useState(0);
  const [signaturePosition, setSignaturePosition] = useState({ x: 0, y: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [pdfScale, setPdfScale] = useState(1.0);
  const previewRef = useRef<HTMLDivElement>(null);
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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: any }) => {
    setNumPages(numPages);
  };

  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setSignaturePosition({ x, y });
    toast({
      title: "Signature position set",
      description: "Position will be replicated across all PDFs",
    });
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

    const destinationPath = localStorage.getItem("pdfDestinationPath");
    if (!destinationPath) {
      toast({
        title: "No destination set",
        description: "Please set a destination folder in settings",
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

      // @ts-ignore (electron is available in window)
      await window.electron.signPDFs({
        files: Array.from(selectedFiles),
        signaturePosition,
        destinationPath,
        page: currentPage
      });

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
          <SettingsDialog />
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <Card className="p-4">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">PDF Preview & Signature Placement</h2>
              <div 
                ref={previewRef}
                onClick={handlePreviewClick}
                className="min-h-[500px] border rounded-lg p-4 bg-gray-50 relative cursor-crosshair overflow-auto"
              >
                {selectedFiles && selectedFiles.length > 0 ? (
                  <Document
                    file={selectedFiles[0]}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="mx-auto"
                  >
                    <Page 
                      pageNumber={currentPage} 
                      scale={pdfScale}
                      className="relative"
                    />
                    {signaturePosition.x > 0 && (
                      <div 
                        className="absolute w-32 h-12 border-2 border-dashed border-blue-500 bg-blue-50 opacity-50"
                        style={{ 
                          left: `${signaturePosition.x}%`, 
                          top: `${signaturePosition.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <div className="text-xs text-center mt-3">Signature Area</div>
                      </div>
                    )}
                  </Document>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Select a PDF to preview and place signature
                  </div>
                )}
              </div>
              {numPages && (
                <div className="flex justify-between items-center">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage <= 1}
                  >
                    Previous Page
                  </Button>
                  <span>Page {currentPage} of {numPages}</span>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(numPages, prev + 1))}
                    disabled={currentPage >= numPages}
                  >
                    Next Page
                  </Button>
                </div>
              )}
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
                disabled={!selectedFiles || progress > 0 || !signaturePosition.x}
              >
                Sign PDFs
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;