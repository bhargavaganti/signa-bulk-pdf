import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function SettingsDialog() {
  const [destinationPath, setDestinationPath] = useState("");
  const { toast } = useToast();

  const handleSelectDestination = async () => {
    try {
      // @ts-ignore (electron is available in window)
      const result = await window.electron.showDirectoryPicker();
      if (result) {
        setDestinationPath(result);
        localStorage.setItem("pdfDestinationPath", result);
        toast({
          title: "Settings saved",
          description: "Destination path has been updated",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set destination path",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="destination" className="text-right">
              Destination
            </label>
            <div className="col-span-3 flex gap-2">
              <Input
                id="destination"
                value={destinationPath}
                placeholder="Select destination folder"
                readOnly
              />
              <Button onClick={handleSelectDestination}>Browse</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}