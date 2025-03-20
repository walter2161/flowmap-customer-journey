
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
  const [wahaUrl, setWahaUrl] = useState<string>(localStorage.getItem('wahaUrl') || '');
  const [wahaToken, setWahaToken] = useState<string>(localStorage.getItem('wahaToken') || '');
  const [sessionId, setSessionId] = useState<string>(localStorage.getItem('wahaSessionId') || 'default');
  const [lastStatus, setLastStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusCheckInterval, setStatusCheckInterval] = useState<number | null>(null);
  
  const handleStartSync = async () => {
    if (!wahaUrl) {
      toast({
        title: "Erro",
        description: "Por favor, informe a URL do servidor WAHA",
        variant: "destructive",
      });
      return;
    }
    
    // Salvar URL, token e sessão no localStorage
    localStorage.setItem('wahaUrl', wahaUrl);
    localStorage.setItem('wahaToken', wahaToken);
    localStorage.setItem('wahaSessionId', sessionId);
    
    setIsLoading(true);
    setSyncStep('connecting');
    
    try {
      // Verificar se o servidor está online
      const baseUrl = wahaUrl.endsWith('/') ? wahaUrl.slice(0, -1) : wahaUrl;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (wahaToken) {
        headers['Authorization'] = `Bearer ${wahaToken}`;
      }
      
      // Verificar status da sessão
      const statusResponse = await fetch(`${baseUrl}/api/sessions/${sessionId}/status`, {
        headers
      });
      
      if (!statusResponse.ok) {
        // Se a sessão não existir, tentar criar uma nova
        if (statusResponse.status === 404) {
          const createSessionResponse = await fetch(`${baseUrl}/api/sessions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              name: sessionId,
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
        description: "Não foi possível conectar ao servidor WAHA. Verifique a URL e token.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchQRCode = async () => {
    try {
      const baseUrl = wahaUrl.endsWith('/') ? wahaUrl.slice(0, -1) : wahaUrl;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (wahaToken) {
        headers['Authorization'] = `Bearer ${wahaToken}`;
      }
      
      // Gerar o QR Code para a sessão
      const qrResponse = await fetch(`${baseUrl}/api/sessions/${sessionId}/qr`, {
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
      const baseUrl = wahaUrl.endsWith('/') ? wahaUrl.slice(0, -1) : wahaUrl;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (wahaToken) {
        headers['Authorization'] = `Bearer ${wahaToken}`;
      }
      
      const statusResponse = await fetch(`${baseUrl}/api/sessions/${sessionId}/status`, {
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
      const baseUrl = wahaUrl.endsWith('/') ? wahaUrl.slice(0, -1) : wahaUrl;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (wahaToken) {
        headers['Authorization'] = `Bearer ${wahaToken}`;
      }
      
      // Desconectar/excluir a sessão
      const logoutResponse = await fetch(`${baseUrl}/api/sessions/${sessionId}/stop`, {
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            Sincronização com WhatsApp (WAHA)
          </DialogTitle>
          <DialogDescription>
            Conecte o chatbot ao WhatsApp para responder mensagens automaticamente usando o WAHA
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {syncStep === 'initial' && (
            <div className="text-center space-y-6">
              <div className="rounded-lg border p-6 bg-gray-50">
                <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Configure a integração WAHA</h3>
                
                <div className="space-y-4 text-left mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="waha-url">URL do Servidor WAHA</Label>
                    <Input 
                      id="waha-url"
                      placeholder="http://seu-servidor-waha:3000"
                      value={wahaUrl}
                      onChange={(e) => setWahaUrl(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Informe a URL completa do seu servidor WAHA
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="waha-token">Token API (opcional)</Label>
                    <Input 
                      id="waha-token"
                      placeholder="seu-token-secreto"
                      value={wahaToken}
                      onChange={(e) => setWahaToken(e.target.value)}
                      type="password"
                    />
                    <p className="text-xs text-gray-500">
                      Se seu servidor WAHA usa autenticação, informe o token
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="session-id">ID da Sessão</Label>
                    <Input 
                      id="session-id"
                      placeholder="default"
                      value={sessionId}
                      onChange={(e) => setSessionId(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Identificador para esta sessão do WhatsApp
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
                  <li>Você precisa ter um servidor WAHA rodando</li>
                  <li>A URL deve ser acessível por esta aplicação</li>
                  <li>Cada sessão pode ter apenas um WhatsApp conectado</li>
                  <li>Para mais informações, consulte a documentação do <a href="https://github.com/devlikeapro/whatsapp-http-api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">WAHA</a></li>
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
                      <span className="font-medium">{wahaUrl}</span>
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
                  Não foi possível conectar ao servidor WAHA.
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
            Esta integração utiliza WAHA (WhatsApp HTTP API) para conectar ao WhatsApp. 
            <a href="https://github.com/devlikeapro/whatsapp-http-api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
              Saiba mais
            </a>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppSync;
