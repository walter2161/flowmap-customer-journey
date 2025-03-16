
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, QrCode, Loader2, Check, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface WhatsAppSyncProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const WhatsAppSync: React.FC<WhatsAppSyncProps> = ({
  isOpen,
  onOpenChange
}) => {
  const { toast } = useToast();
  const [syncStep, setSyncStep] = useState<'initial' | 'connecting' | 'connected' | 'error'>('initial');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  
  // Mock QR code for demonstration purposes
  const mockQrCode = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WhatsAppSyncExample";
  
  const handleStartSync = () => {
    // In a real app, this would call an API to generate a WhatsApp QR code
    setSyncStep('connecting');
    
    // Simulate API call delay
    setTimeout(() => {
      setQrCodeUrl(mockQrCode);
      
      // Simulate successful connection after 5 seconds
      setTimeout(() => {
        setSyncStep('connected');
        toast({
          title: "WhatsApp conectado com sucesso!",
          description: "O chatbot agora responderá às mensagens do WhatsApp.",
        });
      }, 5000);
    }, 2000);
  };
  
  const handleDisconnect = () => {
    // In a real app, this would call an API to disconnect WhatsApp
    setSyncStep('initial');
    setQrCodeUrl(null);
    toast({
      title: "WhatsApp desconectado",
      description: "O chatbot não responderá mais às mensagens do WhatsApp.",
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            Sincronização com WhatsApp
          </DialogTitle>
          <DialogDescription>
            Conecte o chatbot ao WhatsApp para responder mensagens automaticamente
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {syncStep === 'initial' && (
            <div className="text-center space-y-6">
              <div className="rounded-lg border p-6 bg-gray-50">
                <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Integre seu WhatsApp com o chatbot</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Ao sincronizar, seu assistente virtual poderá responder às mensagens 
                  do WhatsApp automaticamente, seguindo o fluxo de atendimento criado.
                </p>
                <Button onClick={handleStartSync} className="gap-2 w-full">
                  <QrCode size={16} />
                  Iniciar Sincronização
                </Button>
              </div>
              
              <div className="text-sm text-gray-500">
                <h4 className="font-medium mb-2">Benefícios da integração:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Atendimento automático 24/7</li>
                  <li>Respostas rápidas e consistentes</li>
                  <li>Histórico de conversas centralizado</li>
                  <li>Transferência para atendimento humano quando necessário</li>
                </ul>
              </div>
            </div>
          )}
          
          {syncStep === 'connecting' && (
            <div className="text-center space-y-6">
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-lg font-medium mb-4">Escaneie o QR code com seu WhatsApp</h3>
                
                {qrCodeUrl ? (
                  <div className="border-2 border-green-500 p-2 rounded-lg mb-4">
                    <img 
                      src={qrCodeUrl} 
                      alt="WhatsApp QR Code" 
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 w-48 border-2 border-dashed border-gray-300 rounded-lg mb-4">
                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-2" />
                    <p className="text-sm text-gray-500">Gerando QR code...</p>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 max-w-xs">
                  1. Abra o WhatsApp no seu celular
                  <br />
                  2. Toque em Menu ou Configurações
                  <br />
                  3. Selecione Dispositivos conectados
                  <br />
                  4. Escaneie este código
                </p>
              </div>
              
              <Button variant="outline" onClick={() => setSyncStep('initial')} className="gap-2">
                <X size={16} />
                Cancelar
              </Button>
            </div>
          )}
          
          {syncStep === 'connected' && (
            <div className="text-center space-y-6">
              <div className="rounded-lg border border-green-200 p-6 bg-green-50">
                <div className="bg-green-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-green-700">WhatsApp conectado com sucesso!</h3>
                <p className="text-sm text-green-600 mb-4">
                  Seu chatbot agora está respondendo a mensagens no WhatsApp.
                </p>
                
                <div className="bg-white rounded p-4 mb-4">
                  <h4 className="font-medium text-sm mb-2">Detalhes da conexão:</h4>
                  <div className="text-xs text-left text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Dispositivo:</span>
                      <span className="font-medium">WhatsApp Web</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium text-green-600">Ativo</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span>Mensagens processadas:</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tempo de conexão:</span>
                      <span className="font-medium">Agora mesmo</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="destructive" 
                  onClick={handleDisconnect} 
                  className="gap-2 w-full"
                >
                  <X size={16} />
                  Desconectar WhatsApp
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-start">
          <div className="w-full text-xs text-gray-500 text-center">
            Os dados são processados localmente. Sua privacidade e a de seus clientes está protegida.
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppSync;
