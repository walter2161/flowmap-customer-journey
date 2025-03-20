
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, QrCode, Loader2, Check, X, RefreshCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

// Configuração padrão do servidor WAHA
const DEFAULT_WAHA_CONFIG = {
  url: "https://waha-service.onrender.com", // URL do servidor WAHA público
  sessionId: "default",                     // ID de sessão padrão
  apiKey: ""                                // Sem chave API para servidor público
};

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
  const [lastStatus, setLastStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusCheckInterval, setStatusCheckInterval] = useState<number | null>(null);
  
  const handleStartSync = async () => {
    setIsLoading(true);
    setSyncStep('connecting');
    
    try {
      // Verificar se o servidor está online
      const baseUrl = DEFAULT_WAHA_CONFIG.url.endsWith('/') 
        ? DEFAULT_WAHA_CONFIG.url.slice(0, -1) 
        : DEFAULT_WAHA_CONFIG.url;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (DEFAULT_WAHA_CONFIG.apiKey) {
        headers['Authorization'] = `Bearer ${DEFAULT_WAHA_CONFIG.apiKey}`;
      }
      
      // Verificar status da sessão
      const statusResponse = await fetch(`${baseUrl}/api/sessions/${DEFAULT_WAHA_CONFIG.sessionId}/status`, {
        headers
      });
      
      if (!statusResponse.ok) {
        // Se a sessão não existir, tentar criar uma nova
        if (statusResponse.status === 404) {
          const createSessionResponse = await fetch(`${baseUrl}/api/sessions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              name: DEFAULT_WAHA_CONFIG.sessionId,
              config: {
                restartOnAuthFailure: true,
              }
            }),
          });
          
          if (!createSessionResponse.ok) {
            throw new Error(`Erro ao criar sessão: ${createSessionResponse.statusText}`);
          }
          
          const sessionData = await createSessionResponse.json();
          console.log('Sessão criada:', sessionData);
        } else {
          throw new Error(`Erro ao verificar status: ${statusResponse.statusText}`);
        }
      } else {
        const statusData = await statusResponse.json();
        console.log('Status da sessão:', statusData);
        setLastStatus(statusData.state || 'unknown');
        
        // Se já estiver conectado, atualizar estado
        if (statusData.state === 'CONNECTED') {
          setSyncStep('connected');
          toast({
            title: "WhatsApp Conectado",
            description: "Seu WhatsApp já está conectado!",
          });
          setIsLoading(false);
          return;
        }
      }
      
      // Solicitar QR Code
      await fetchQRCode();
      
      // Inicia verificação periódica de status
      const intervalId = window.setInterval(() => {
        checkConnectionStatus();
      }, 5000);
      setStatusCheckInterval(intervalId);
    } catch (error) {
      console.error('Erro ao iniciar sincronização:', error);
      setSyncStep('error');
      setLastStatus(`Erro: ${error instanceof Error ? error.message : String(error)}`);
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar ao servidor WAHA. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchQRCode = async () => {
    try {
      const baseUrl = DEFAULT_WAHA_CONFIG.url.endsWith('/') 
        ? DEFAULT_WAHA_CONFIG.url.slice(0, -1) 
        : DEFAULT_WAHA_CONFIG.url;
        
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (DEFAULT_WAHA_CONFIG.apiKey) {
        headers['Authorization'] = `Bearer ${DEFAULT_WAHA_CONFIG.apiKey}`;
      }
      
      // Gerar o QR Code para a sessão
      const qrResponse = await fetch(`${baseUrl}/api/sessions/${DEFAULT_WAHA_CONFIG.sessionId}/qr`, {
        headers,
      });
      
      if (!qrResponse.ok) {
        throw new Error(`Erro ao obter QR code: ${qrResponse.statusText}`);
      }
      
      const qrData = await qrResponse.json();
      console.log('Resposta do QR code:', qrData);
      
      if (qrData.qr) {
        setQrCodeUrl(`data:image/png;base64,${qrData.qr}`);
      } else {
        throw new Error('QR Code não disponível');
      }
    } catch (error) {
      console.error('Erro ao obter QR code:', error);
      toast({
        title: "Erro",
        description: "Não foi possível obter o QR code. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const checkConnectionStatus = async () => {
    try {
      const baseUrl = DEFAULT_WAHA_CONFIG.url.endsWith('/') 
        ? DEFAULT_WAHA_CONFIG.url.slice(0, -1) 
        : DEFAULT_WAHA_CONFIG.url;
        
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (DEFAULT_WAHA_CONFIG.apiKey) {
        headers['Authorization'] = `Bearer ${DEFAULT_WAHA_CONFIG.apiKey}`;
      }
      
      const statusResponse = await fetch(`${baseUrl}/api/sessions/${DEFAULT_WAHA_CONFIG.sessionId}/status`, {
        headers,
      });
      
      if (!statusResponse.ok) {
        throw new Error(`Erro ao verificar status: ${statusResponse.statusText}`);
      }
      
      const statusData = await statusResponse.json();
      console.log('Status da conexão:', statusData);
      
      setLastStatus(statusData.state || 'unknown');
      
      if (statusData.state === 'CONNECTED') {
        setSyncStep('connected');
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval);
          setStatusCheckInterval(null);
        }
        
        toast({
          title: "WhatsApp Conectado",
          description: "Seu WhatsApp foi conectado com sucesso ao chatbot!",
        });
      } else if (statusData.state === 'DISCONNECTED' || statusData.state === 'STARTING') {
        // Se desconectado, tentar obter novo QR code
        await fetchQRCode();
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
  };
  
  const handleDisconnect = async () => {
    setIsLoading(true);
    
    try {
      const baseUrl = DEFAULT_WAHA_CONFIG.url.endsWith('/') 
        ? DEFAULT_WAHA_CONFIG.url.slice(0, -1) 
        : DEFAULT_WAHA_CONFIG.url;
        
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (DEFAULT_WAHA_CONFIG.apiKey) {
        headers['Authorization'] = `Bearer ${DEFAULT_WAHA_CONFIG.apiKey}`;
      }
      
      // Desconectar/excluir a sessão
      const logoutResponse = await fetch(`${baseUrl}/api/sessions/${DEFAULT_WAHA_CONFIG.sessionId}/stop`, {
        method: 'POST',
        headers,
      });
      
      if (!logoutResponse.ok) {
        throw new Error(`Erro ao desconectar: ${logoutResponse.statusText}`);
      }
      
      toast({
        title: "WhatsApp Desconectado",
        description: "O chatbot foi desconectado do WhatsApp com sucesso.",
      });
      
      setSyncStep('initial');
      setQrCodeUrl(null);
      
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        setStatusCheckInterval(null);
      }
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao desconectar o WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Limpar intervalos quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);
  
  // Limpar intervalos quando o modal é fechado
  useEffect(() => {
    if (!isOpen && statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
  }, [isOpen, statusCheckInterval]);
  
  // Iniciar sincronização automaticamente quando o modal abrir
  useEffect(() => {
    if (isOpen && syncStep === 'initial') {
      handleStartSync();
    }
  }, [isOpen]);
  
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
                
                <p className="text-sm text-gray-500 max-w-xs mb-4">
                  1. Abra o WhatsApp no seu celular
                  <br />
                  2. Toque em Menu ou Configurações
                  <br />
                  3. Selecione Dispositivos conectados
                  <br />
                  4. Escaneie este código
                </p>
                
                <p className="text-xs text-gray-600">
                  Status atual: <span className="font-semibold">{lastStatus || 'Aguardando'}</span>
                </p>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchQRCode} 
                    disabled={isLoading}
                    className="gap-1"
                  >
                    <RefreshCcw size={14} />
                    Atualizar QR
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      if (statusCheckInterval) {
                        clearInterval(statusCheckInterval);
                        setStatusCheckInterval(null);
                      }
                      setSyncStep('initial');
                    }} 
                    className="gap-1"
                  >
                    <X size={14} />
                    Cancelar
                  </Button>
                </div>
              </div>
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
                      <span>Status:</span>
                      <span className="font-medium text-green-600">{lastStatus}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={checkConnectionStatus} 
                    className="gap-2 w-full"
                  >
                    <RefreshCcw size={16} />
                    Verificar Status
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    onClick={handleDisconnect} 
                    className="gap-2 w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X size={16} />}
                    Desconectar WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {syncStep === 'error' && (
            <div className="text-center space-y-6">
              <div className="rounded-lg border border-red-200 p-6 bg-red-50">
                <div className="bg-red-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-red-700">Erro de Conexão</h3>
                <p className="text-sm text-red-600 mb-4">
                  Não foi possível conectar ao servidor WAHA.
                </p>
                
                <div className="bg-white rounded p-4 mb-4">
                  <h4 className="font-medium text-sm mb-2">Detalhes do erro:</h4>
                  <p className="text-xs text-red-500">{lastStatus}</p>
                </div>
                
                <Button 
                  onClick={handleStartSync} 
                  className="gap-2 w-full"
                >
                  <RefreshCcw size={16} />
                  Tentar Novamente
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-start">
          <div className="w-full text-xs text-gray-500 text-center">
            Esta integração conecta seu chatbot diretamente ao WhatsApp para atendimento automático.
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppSync;
