
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, MessageCircle, Copy } from 'lucide-react';
import ChatPreview from './ChatPreview';
import { AssistantProfile } from '@/utils/flowTypes';
import { useToast } from "@/components/ui/use-toast";

interface ScriptModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scriptContent: string;
  currentProfile?: AssistantProfile | null;
}

const ScriptModal: React.FC<ScriptModalProps> = ({
  isOpen,
  onOpenChange,
  scriptContent,
  currentProfile
}) => {
  const [isChatPreviewOpen, setIsChatPreviewOpen] = useState(false);
  const { toast } = useToast();
  
  const handleDownloadScript = () => {
    // Create a text file and download it
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(scriptContent);
    const exportFileDefaultName = 'flow-script.md';
    
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', dataStr);
    downloadLink.setAttribute('download', exportFileDefaultName);
    downloadLink.click();
  };

  const handleCopyScript = () => {
    // Copy the script content to clipboard
    navigator.clipboard.writeText(scriptContent).then(() => {
      toast({
        title: "Copiado!",
        description: "Conteúdo do script copiado para a área de transferência.",
      });
    }).catch(err => {
      console.error('Erro ao copiar texto: ', err);
      toast({
        title: "Erro",
        description: "Não foi possível copiar o texto.",
        variant: "destructive"
      });
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Roteiro de Atendimento</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh]">
            <pre className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">{scriptContent}</pre>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsChatPreviewOpen(true)}
                className="gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Preview Chat
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCopyScript}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Copiar Script
              </Button>
            </div>
            <Button onClick={handleDownloadScript} className="gap-2">
              <Download className="h-4 w-4" />
              Baixar Script
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <ChatPreview 
        isOpen={isChatPreviewOpen}
        onOpenChange={setIsChatPreviewOpen}
        scriptContent={scriptContent}
        profile={currentProfile}
      />
    </>
  );
};

export default ScriptModal;
