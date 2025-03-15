
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ScriptModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scriptContent: string;
}

const ScriptModal: React.FC<ScriptModalProps> = ({
  isOpen,
  onOpenChange,
  scriptContent
}) => {
  const handleDownloadScript = () => {
    // Create a text file and download it
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(scriptContent);
    const exportFileDefaultName = 'flow-script.md';
    
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', dataStr);
    downloadLink.setAttribute('download', exportFileDefaultName);
    downloadLink.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Roteiro de Atendimento</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh]">
          <pre className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">{scriptContent}</pre>
        </div>
        <DialogFooter>
          <Button onClick={handleDownloadScript}>
            Baixar Script
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScriptModal;
