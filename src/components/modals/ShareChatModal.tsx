
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AssistantProfile } from '@/utils/flowTypes';

interface ShareChatModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scriptContent: string;
  currentProfile?: AssistantProfile | null;
}

const ShareChatModal: React.FC<ShareChatModalProps> = ({
  isOpen,
  onOpenChange,
  scriptContent,
  currentProfile
}) => {
  const { toast } = useToast();
  const [embedCode, setEmbedCode] = useState<string>('');
  
  // Generate the embed code when the modal is opened
  useEffect(() => {
    if (isOpen) {
      generateEmbedCode();
    }
  }, [isOpen, scriptContent, currentProfile]);
  
  // Generate the embed code with the script content and profile
  const generateEmbedCode = () => {
    // Create a base64 encoded version of the script for URL
    const encodedScript = btoa(encodeURIComponent(scriptContent));
    const profileName = currentProfile?.name || 'Assistente';
    const profileCompany = currentProfile?.company || '';
    
    // Create the embed code with floating button and chat interface
    const code = `<script>
  // FlowAssistant Embed Code
  (function() {
    // Create styles
    const style = document.createElement('style');
    style.innerHTML = \`
      .flowassistant-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #9b87f5;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        transition: all 0.3s ease;
      }
      .flowassistant-button:hover {
        background-color: #7E69AB;
      }
      .flowassistant-icon {
        width: 30px;
        height: 30px;
      }
      .flowassistant-chat {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 9998;
        overflow: hidden;
        display: none;
        transition: all 0.3s ease;
      }
      .flowassistant-chat.open {
        display: block;
      }
      .flowassistant-iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
    \`;
    document.head.appendChild(style);
    
    // Create chat button
    const button = document.createElement('div');
    button.className = 'flowassistant-button';
    button.innerHTML = '<svg class="flowassistant-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    
    // Create chat container
    const chatContainer = document.createElement('div');
    chatContainer.className = 'flowassistant-chat';
    
    // Create iframe with encoded script data
    const chatIframe = document.createElement('iframe');
    chatIframe.className = 'flowassistant-iframe';
    chatIframe.src = "https://led-flowmap.netlify.app/?script=${encodedScript}&name=${encodeURIComponent(profileName)}&company=${encodeURIComponent(profileCompany)}";
    
    // Append elements to DOM
    chatContainer.appendChild(chatIframe);
    document.body.appendChild(button);
    document.body.appendChild(chatContainer);
    
    // Toggle chat on button click
    button.addEventListener('click', function() {
      chatContainer.classList.toggle('open');
    });
  })();
</script>`;
    
    setEmbedCode(code);
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode)
      .then(() => {
        toast({
          title: "Código copiado!",
          description: "O código de incorporação foi copiado para a área de transferência.",
        });
      })
      .catch((err) => {
        console.error('Failed to copy code: ', err);
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o código.",
          variant: "destructive",
        });
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Compartilhar Chatbot</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh]">
          <div className="p-4 mb-4 bg-gray-50 rounded-lg">
            <p className="mb-2 text-sm text-gray-600">
              Copie o código abaixo e cole-o em qualquer site para adicionar este chatbot como um botão flutuante.
              Quando os visitantes clicarem no botão, o chatbot será aberto em uma janela de chat.
            </p>
          </div>
          <pre className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap overflow-x-auto text-xs border">{embedCode}</pre>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleCopyCode} 
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            Copiar Código de Incorporação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareChatModal;
