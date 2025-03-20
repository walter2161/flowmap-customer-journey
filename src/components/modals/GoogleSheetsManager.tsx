
import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  initGoogleSheetsApi, 
  isAuthenticated, 
  authenticateUser, 
  signOutUser, 
  setupSpreadsheet, 
  loadFlowsList, 
  loadFlowById, 
  saveFlow, 
  deleteFlow, 
  GOOGLE_SHEETS_CONFIG 
} from '@/utils/googleSheetsService';
import { GoogleSheetFlow } from '@/utils/googleSheetsTypes';
import { FileText, Save, Trash, Check, GoogleSheets, RefreshCcw, LogIn, LogOut } from 'lucide-react';
import { FlowData } from '@/utils/flowTypes';

interface GoogleSheetsManagerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentFlowData: FlowData;
  onFlowLoad: (flowData: FlowData) => void;
}

const GoogleSheetsManager: React.FC<GoogleSheetsManagerProps> = ({
  isOpen,
  onOpenChange,
  currentFlowData,
  onFlowLoad,
}) => {
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [flows, setFlows] = useState<GoogleSheetFlow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [flowToDelete, setFlowToDelete] = useState<string | null>(null);
  const [newFlowName, setNewFlowName] = useState('');
  const [apiKey, setApiKey] = useState(GOOGLE_SHEETS_CONFIG.apiKey);
  const [clientId, setClientId] = useState(GOOGLE_SHEETS_CONFIG.clientId);
  const [spreadsheetId, setSpreadsheetId] = useState(GOOGLE_SHEETS_CONFIG.spreadsheetId);
  const [isConfiguring, setIsConfiguring] = useState(
    GOOGLE_SHEETS_CONFIG.apiKey === 'YOUR_API_KEY' || 
    GOOGLE_SHEETS_CONFIG.clientId === 'YOUR_CLIENT_ID' || 
    GOOGLE_SHEETS_CONFIG.spreadsheetId === 'YOUR_SPREADSHEET_ID'
  );

  useEffect(() => {
    const init = async () => {
      if (!isConfiguring) {
        const initialized = await initGoogleSheetsApi();
        setIsInitialized(initialized);
        if (initialized) {
          setIsUserAuthenticated(isAuthenticated());
        }
      }
    };
    
    if (isOpen) {
      init();
    }
  }, [isOpen, isConfiguring]);

  useEffect(() => {
    const loadFlows = async () => {
      if (isUserAuthenticated) {
        setIsLoading(true);
        await setupSpreadsheet();
        const flowsList = await loadFlowsList();
        setFlows(flowsList);
        setIsLoading(false);
      }
    };
    
    if (isUserAuthenticated) {
      loadFlows();
    }
  }, [isUserAuthenticated]);

  const handleSaveConfig = async () => {
    // Atualizar a configuração
    GOOGLE_SHEETS_CONFIG.apiKey = apiKey;
    GOOGLE_SHEETS_CONFIG.clientId = clientId;
    GOOGLE_SHEETS_CONFIG.spreadsheetId = spreadsheetId;
    
    setIsConfiguring(false);
    
    // Inicializar a API com as novas configurações
    const initialized = await initGoogleSheetsApi();
    setIsInitialized(initialized);
    
    if (initialized) {
      toast({
        title: "Configuração salva",
        description: "As configurações da API do Google Sheets foram atualizadas com sucesso.",
      });
    } else {
      toast({
        title: "Erro na configuração",
        description: "Não foi possível inicializar a API do Google Sheets com as configurações fornecidas.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const success = await authenticateUser();
    setIsUserAuthenticated(success);
    
    if (success) {
      toast({
        title: "Autenticação bem-sucedida",
        description: "Você foi autenticado com sucesso no Google Sheets.",
      });
      
      // Configurar a planilha e carregar os flows
      await setupSpreadsheet();
      const flowsList = await loadFlowsList();
      setFlows(flowsList);
    } else {
      toast({
        title: "Erro de autenticação",
        description: "Não foi possível autenticar no Google Sheets. Verifique suas credenciais.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await signOutUser();
    setIsUserAuthenticated(false);
    setFlows([]);
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do Google Sheets com sucesso.",
    });
  };

  const handleRefreshFlows = async () => {
    setIsLoading(true);
    const flowsList = await loadFlowsList();
    setFlows(flowsList);
    setIsLoading(false);
    
    toast({
      title: "Lista atualizada",
      description: "A lista de flows foi atualizada com sucesso.",
    });
  };

  const handleSaveCurrentFlow = async () => {
    if (!newFlowName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe um nome para o flow.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    const flowId = selectedFlowId || `flow-${nanoid(6)}`;
    const success = await saveFlow(flowId, newFlowName, currentFlowData);
    
    if (success) {
      toast({
        title: "Flow salvo",
        description: `O flow "${newFlowName}" foi salvo com sucesso.`,
      });
      
      // Atualizar a lista de flows
      const flowsList = await loadFlowsList();
      setFlows(flowsList);
      setNewFlowName('');
      setSelectedFlowId(null);
    } else {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o flow. Verifique sua conexão e tente novamente.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleLoadFlow = async (flowId: string) => {
    setIsLoading(true);
    const flowData = await loadFlowById(flowId);
    
    if (flowData) {
      onFlowLoad(flowData);
      toast({
        title: "Flow carregado",
        description: "O flow foi carregado com sucesso.",
      });
      
      // Fechar o modal após carregar o flow
      onOpenChange(false);
    } else {
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar o flow. Verifique sua conexão e tente novamente.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleDeleteClick = (flowId: string) => {
    setFlowToDelete(flowId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!flowToDelete) return;
    
    setIsLoading(true);
    const success = await deleteFlow(flowToDelete);
    
    if (success) {
      toast({
        title: "Flow excluído",
        description: "O flow foi excluído com sucesso.",
      });
      
      // Atualizar a lista de flows
      const flowsList = await loadFlowsList();
      setFlows(flowsList);
    } else {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o flow. Verifique sua conexão e tente novamente.",
        variant: "destructive",
      });
    }
    
    setShowDeleteConfirm(false);
    setFlowToDelete(null);
    setIsLoading(false);
  };

  const handleSelectFlow = (flowId: string, flowName: string) => {
    setSelectedFlowId(flowId);
    setNewFlowName(flowName);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Google Sheets - Gerenciador de Flows</DialogTitle>
            <DialogDescription>
              Salve e carregue seus flows usando o Google Sheets como banco de dados.
            </DialogDescription>
          </DialogHeader>
          
          {isConfiguring ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key do Google</Label>
                <Input
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSyA..."
                />
                <p className="text-xs text-gray-500">
                  Encontre sua API Key no Console do Google Cloud Platform.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID do Google</Label>
                <Input
                  id="clientId"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="123456789-abc..."
                />
                <p className="text-xs text-gray-500">
                  Encontre seu Client ID no Console do Google Cloud Platform.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="spreadsheetId">ID da Planilha</Label>
                <Input
                  id="spreadsheetId"
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                />
                <p className="text-xs text-gray-500">
                  O ID da planilha está na URL: https://docs.google.com/spreadsheets/d/[ID_DA_PLANILHA]/edit
                </p>
              </div>
              
              <Button
                onClick={handleSaveConfig}
                className="w-full"
                disabled={!apiKey || !clientId || !spreadsheetId}
              >
                Salvar configuração
              </Button>
            </div>
          ) : !isInitialized ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-center text-gray-500 mb-4">
                Erro ao inicializar a API do Google Sheets. Verifique suas configurações.
              </p>
              <Button onClick={() => setIsConfiguring(true)}>
                Configurar novamente
              </Button>
            </div>
          ) : !isUserAuthenticated ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-center text-gray-500 mb-4">
                Você precisa fazer login com sua conta do Google para acessar o Google Sheets.
              </p>
              <Button onClick={handleLogin} disabled={isLoading}>
                <LogIn className="mr-2 h-4 w-4" />
                Fazer login com Google
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Button variant="outline" size="sm" onClick={handleRefreshFlows} disabled={isLoading}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Atualizar lista
                  </Button>
                </div>
                
                <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoading}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="flowName">Nome do Flow</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="flowName"
                      value={newFlowName}
                      onChange={(e) => setNewFlowName(e.target.value)}
                      placeholder="Meu Flow de Atendimento"
                      disabled={isLoading}
                    />
                    <Button onClick={handleSaveCurrentFlow} disabled={isLoading || !newFlowName.trim()}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Flows Salvos</Label>
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <p className="text-gray-500">Carregando...</p>
                    </div>
                  ) : flows.length === 0 ? (
                    <div className="border rounded-md p-4">
                      <p className="text-center text-gray-500">
                        Nenhum flow encontrado. Salve um flow para começar.
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[200px] rounded-md border">
                      <div className="p-4 space-y-2">
                        {flows.map((flow) => (
                          <div
                            key={flow.id}
                            className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-100 ${
                              selectedFlowId === flow.id ? 'bg-blue-50 border border-blue-200' : ''
                            }`}
                          >
                            <div 
                              className="flex items-center flex-1 cursor-pointer"
                              onClick={() => handleSelectFlow(flow.id, flow.name)}
                            >
                              <FileText className="h-4 w-4 mr-2 text-blue-500" />
                              <div>
                                <p className="font-medium">{flow.name}</p>
                                <p className="text-xs text-gray-500">
                                  Modificado: {new Date(flow.lastModified).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLoadFlow(flow.id)}
                                disabled={isLoading}
                              >
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(flow.id)}
                                disabled={isLoading}
                              >
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </div>
            </>
          )}
          
          <DialogFooter>
            {!isConfiguring && (
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este flow? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GoogleSheetsManager;
