
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, QrCode, Loader2, Check, X, RefreshCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [myZapUrl, setMyZapUrl] = useState<string>(localStorage.getItem('myZapUrl') || '');
  const [sessionId, setSessionId] = useState<string>(localStorage.getItem('myZapSessionId') || 'chatbot-session');
  const [lastStatus, setLastStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusCheckInterval, setStatusCheckInterval] = useState<number | null>(null);
  
  const handleStartSync = async () => {
    if (!myZapUrl) {
      toast({
        title: "Erro",
        description: "Por favor, informe a URL do servidor MyZap",
        variant: "destructive",
      });
      return;
    }
    
    // Salvar URL e sessão no localStorage
    localStorage.setItem('myZapUrl', myZapUrl);
    localStorage.setItem('myZapSessionId', sessionId);
    
    setIsLoading(true);
    setSyncStep('connecting');
    
    try {
      // Iniciando a sessão no MyZap
      const startSessionResponse = await fetch(`${myZapUrl}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session: sessionId,
          wh_status: window.location.origin + '/webhook/status',
          wh_message: window.location.origin + '/webhook/message',
          wh_qrcode: window.location.origin + '/webhook/qrcode',
          wh_connect: window.location.origin + '/webhook/connect',
        }),
      });
      
      if (!startSessionResponse.ok) {
        throw new Error(`Erro ao iniciar sessão: ${startSessionResponse.statusText}`);
      }
      
      const startSessionData = await startSessionResponse.json();
      console.log('Resposta de inicialização de sessão:', startSessionData);
      
      if (startSessionData.status === 'success') {
        // Solicita o QR Code
        await fetchQRCode();
        // Inicia verificação periódica de status
        const intervalId = window.setInterval(() => {
          checkConnectionStatus();
        }, 5000);
        setStatusCheckInterval(intervalId);
      } else {
        throw new Error('Não foi possível iniciar a sessão');
      }
    } catch (error) {
      console.error('Erro ao iniciar sincronização:', error);
      setSyncStep('error');
      setLastStatus(`Erro: ${error instanceof Error ? error.message : String(error)}`);
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar ao servidor MyZap. Verifique a URL e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchQRCode = async () => {
    try {
      const qrResponse = await fetch(`${myZapUrl}/qrcode?session=${sessionId}`);
      
      if (!qrResponse.ok) {
        throw new Error(`Erro ao obter QR code: ${qrResponse.statusText}`);
      }
      
      const qrData = await qrResponse.json();
      console.log('Resposta do QR code:', qrData);
      
      if (qrData.status === 'success' && qrData.qrcode) {
        // O myzap retorna o QR code como base64 ou como URL, verificamos ambos
        if (qrData.qrcode.startsWith('data:image')) {
          setQrCodeUrl(qrData.qrcode);
        } else if (qrData.qrcode_url) {
          setQrCodeUrl(qrData.qrcode_url);
        } else {
          // Converter para base64 se necessário
          setQrCodeUrl(`data:image/png;base64,${qrData.qrcode}`);
        }
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
      const statusResponse = await fetch(`${myZapUrl}/status?session=${sessionId}`);
      
      if (!statusResponse.ok) {
        throw new Error(`Erro ao verificar status: ${statusResponse.statusText}`);
      }
      
      const statusData = await statusResponse.json();
      console.log('Status da conexão:', statusData);
      
      setLastStatus(statusData.status || 'unknown');
      
      if (statusData.status === 'CONNECTED' || statusData.status === 'connected') {
        setSyncStep('connected');
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval);
          setStatusCheckInterval(null);
        }
        
        toast({
          title: "WhatsApp Conectado",
          description: "Seu WhatsApp foi conectado com sucesso ao chatbot!",
        });
      } else if (statusData.status === 'DISCONNECTED' || statusData.status === 'disconnected') {
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
      const logoutResponse = await fetch(`${myZapUrl}/logout?session=${sessionId}`, {
        method: 'POST',
      });
      
      if (!logoutResponse.ok) {
        throw new Error(`Erro ao desconectar: ${logoutResponse.statusText}`);
      }
      
      const logoutData = await logoutResponse.json();
      console.log('Resposta de logout:', logoutData);
      
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            Sincronização com WhatsApp (MyZap)
          </DialogTitle>
          <DialogDescription>
            Conecte o chatbot ao WhatsApp para responder mensagens automaticamente usando o MyZap
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {syncStep === 'initial' && (
            <div className="text-center space-y-6">
              <div className="rounded-lg border p-6 bg-gray-50">
                <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Configure a integração MyZap</h3>
                
                <div className="space-y-4 text-left mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="myzap-url">URL do Servidor MyZap</Label>
                    <Input 
                      id="myzap-url"
                      placeholder="http://seu-servidor-myzap:3000"
                      value={myZapUrl}
                      onChange={(e) => setMyZapUrl(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Informe a URL completa do seu servidor MyZap
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="session-id">ID da Sessão</Label>
                    <Input 
                      id="session-id"
                      placeholder="chatbot-session"
                      value={sessionId}
                      onChange={(e) => setSessionId(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Identificador único para esta instância do WhatsApp
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleStartSync} 
                  className="gap-2 w-full"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <QrCode size={16} />}
                  Iniciar Sincronização
                </Button>
              </div>
              
              <div className="text-sm text-gray-500">
                <h4 className="font-medium mb-2">Importante:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Você precisa ter um servidor MyZap rodando</li>
                  <li>A URL deve ser acessível por esta aplicação</li>
                  <li>Cada sessão pode ter apenas um WhatsApp conectado</li>
                  <li>Para mais informações, consulte a documentação do <a href="https://github.com/billbarsch/myzap" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">MyZap</a></li>
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
                      <span>Servidor:</span>
                      <span className="font-medium">{myZapUrl}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sessão:</span>
                      <span className="font-medium">{sessionId}</span>
                    </div>
                    <Separator className="my-2" />
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
                  Não foi possível conectar ao servidor MyZap.
                </p>
                
                <div className="bg-white rounded p-4 mb-4">
                  <h4 className="font-medium text-sm mb-2">Detalhes do erro:</h4>
                  <p className="text-xs text-red-500">{lastStatus}</p>
                </div>
                
                <Button 
                  onClick={() => setSyncStep('initial')} 
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
            Esta integração utiliza o MyZap para conectar ao WhatsApp. 
            <a href="https://github.com/billbarsch/myzap" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
              Saiba mais
            </a>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppSync;
