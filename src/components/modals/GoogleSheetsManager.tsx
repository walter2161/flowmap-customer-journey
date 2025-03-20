import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { GoogleSheetsConfig, GoogleSheetFlow, GoogleAuthResponse, } from '@/utils/googleSheetsTypes';
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Save,
  RefreshCw,
  Upload,
  Download,
  Plus,
  Trash
} from 'lucide-react';
import { FlowData } from '@/utils/flowTypes';
import { cn } from "@/lib/utils"

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
  onFlowLoad
}) => {
  const [apiKey, setApiKey] = useState('');
  const [clientId, setClientId] = useState('');
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [flows, setFlows] = useState<GoogleSheetFlow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<GoogleSheetFlow | null>(null);
  const [newFlowName, setNewFlowName] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredFlows, setFilteredFlows] = useState<GoogleSheetFlow[]>([]);
  const { toast } = useToast();

  const config: GoogleSheetsConfig = {
    apiKey: apiKey,
    clientId: clientId,
    spreadsheetId: spreadsheetId,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  };

  useEffect(() => {
    // Load config from localStorage on component mount
    const storedConfig = localStorage.getItem('googleSheetsConfig');
    if (storedConfig) {
      const parsedConfig = JSON.parse(storedConfig);
      setApiKey(parsedConfig.apiKey || '');
      setClientId(parsedConfig.clientId || '');
      setSpreadsheetId(parsedConfig.spreadsheetId || '');
    }
  }, []);

  useEffect(() => {
    // Save config to localStorage whenever it changes
    const configToStore = { apiKey, clientId, spreadsheetId };
    localStorage.setItem('googleSheetsConfig', JSON.stringify(configToStore));
  }, [apiKey, clientId, spreadsheetId]);

  useEffect(() => {
    // Initialize Google API and load flows when the component mounts
    if (apiKey && clientId && spreadsheetId) {
      handleGoogleApiInit();
    }
  }, [apiKey, clientId, spreadsheetId]);

  useEffect(() => {
    // Filter flows based on searchText
    const filtered = flows.filter(flow =>
      flow.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredFlows(filtered);
  }, [flows, searchText]);

  const handleGoogleApiInit = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          window.gapi.load('client:auth2', () => {
            window.gapi.client.init(config)
              .then(() => {
                setIsAuthorized(window.gapi.auth2.getAuthInstance().isSignedIn.get());
                resolve();
              })
              .catch(error => {
                console.error("Error initializing Google API client:", error);
                reject(error);
              });
          });
        };
        script.onerror = (error) => {
          console.error("Error loading Google API script:", error);
          reject(error);
        };
        document.body.appendChild(script);
      });
      await loadFlowsFromSheet();
    } catch (error) {
      console.error("Failed to initialize Google API or load flows:", error);
      toast({
        title: "Erro ao inicializar o Google Sheets",
        description: "Verifique as configurações e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [config, toast]);

  const handleAuthClick = () => {
    window.gapi.auth2.getAuthInstance().signIn()
      .then(() => {
        setIsAuthorized(true);
        toast({
          title: "Autenticado com sucesso!",
          description: "Agora você pode salvar e carregar fluxos do Google Sheets.",
        });
      })
      .catch(error => {
        console.error("Error signing in:", error);
        toast({
          title: "Erro ao autenticar",
          description: "Não foi possível autenticar com o Google Sheets. Verifique as configurações e tente novamente.",
          variant: "destructive",
        });
      });
  };

  const handleSignOutClick = () => {
    window.gapi.auth2.getAuthInstance().signOut()
      .then(() => {
        setIsAuthorized(false);
        toast({
          title: "Desconectado com sucesso!",
          description: "Você foi desconectado do Google Sheets.",
        });
      })
      .catch(error => {
        console.error("Error signing out:", error);
        toast({
          title: "Erro ao desconectar",
          description: "Não foi possível desconectar do Google Sheets. Tente novamente.",
          variant: "destructive",
        });
      });
  };

  const loadFlowsFromSheet = useCallback(async () => {
    if (!isAuthorized) {
      toast({
        title: "Não autenticado",
        description: "Autentique-se com o Google Sheets para carregar os fluxos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: config.spreadsheetId,
        range: 'Flows!A:C',
      });

      const values = response.result.values || [];
      const loadedFlows: GoogleSheetFlow[] = values.slice(1).map((row: any, index: number) => ({
        id: row[0],
        name: row[1],
        lastModified: row[2],
        data: row[3],
      }));

      setFlows(loadedFlows);
      toast({
        title: "Fluxos carregados",
        description: "Os fluxos foram carregados com sucesso do Google Sheets.",
      });
    } catch (error) {
      console.error("Error loading flows from sheet:", error);
      toast({
        title: "Erro ao carregar fluxos",
        description: "Não foi possível carregar os fluxos do Google Sheets. Verifique as configurações e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [config.spreadsheetId, isAuthorized, toast]);

  const saveFlowToSheet = async (flowData: FlowData, flowName: string) => {
    if (!isAuthorized) {
      toast({
        title: "Não autenticado",
        description: "Autentique-se com o Google Sheets para salvar o fluxo.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const flowId = `flow-${Date.now()}`;
      const timestamp = new Date().toISOString();
      const flowDataString = JSON.stringify(flowData);

      const values = [[flowId, flowName, timestamp, flowDataString]];

      const response = await window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: config.spreadsheetId,
        range: 'Flows!A:D',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: { values },
      });

      if (response.status === 200) {
        setFlows(prevFlows => [...prevFlows, {
          id: flowId,
          name: flowName,
          lastModified: timestamp,
          data: flowDataString,
        }]);
        toast({
          title: "Fluxo salvo",
          description: "O fluxo foi salvo com sucesso no Google Sheets.",
        });
      } else {
        toast({
          title: "Erro ao salvar fluxo",
          description: "Não foi possível salvar o fluxo no Google Sheets. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving flow to sheet:", error);
      toast({
        title: "Erro ao salvar fluxo",
        description: "Não foi possível salvar o fluxo no Google Sheets. Verifique as configurações e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateFlowInSheet = async (flowId: string, flowData: FlowData, flowName: string) => {
    if (!isAuthorized) {
      toast({
        title: "Não autenticado",
        description: "Autentique-se com o Google Sheets para atualizar o fluxo.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const timestamp = new Date().toISOString();
      const flowDataString = JSON.stringify(flowData);

      // Find the row to update
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: config.spreadsheetId,
        range: 'Flows!A:D',
      });

      const values = response.result.values || [];
      const rowIndex = values.findIndex((row: any) => row[0] === flowId);

      if (rowIndex <= 0) {
        toast({
          title: "Fluxo não encontrado",
          description: "Não foi possível encontrar o fluxo no Google Sheets.",
          variant: "destructive",
        });
        return;
      }

      const range = `Flows!A${rowIndex + 1}:D${rowIndex + 1}`;
      const updateValues = [[flowId, flowName, timestamp, flowDataString]];

      const updateResponse = await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: config.spreadsheetId,
        range: range,
        valueInputOption: 'USER_ENTERED',
        resource: { values: updateValues },
      });

      if (updateResponse.status === 200) {
        setFlows(prevFlows =>
          prevFlows.map(flow =>
            flow.id === flowId ? { ...flow, name: flowName, lastModified: timestamp, data: flowDataString } : flow
          )
        );
        toast({
          title: "Fluxo atualizado",
          description: "O fluxo foi atualizado com sucesso no Google Sheets.",
        });
      } else {
        toast({
          title: "Erro ao atualizar fluxo",
          description: "Não foi possível atualizar o fluxo no Google Sheets. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating flow in sheet:", error);
      toast({
        title: "Erro ao atualizar fluxo",
        description: "Não foi possível atualizar o fluxo no Google Sheets. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteFlowFromSheet = async (flowId: string) => {
    if (!isAuthorized) {
      toast({
        title: "Não autenticado",
        description: "Autentique-se com o Google Sheets para deletar o fluxo.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      // Find the row to delete
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: config.spreadsheetId,
        range: 'Flows!A:A',
      });

      const values = response.result.values || [];
      const rowIndex = values.findIndex((row: any) => row[0] === flowId);

      if (rowIndex <= 0) {
        toast({
          title: "Fluxo não encontrado",
          description: "Não foi possível encontrar o fluxo no Google Sheets.",
          variant: "destructive",
        });
        return;
      }

      const deleteRequest = {
        "requests": [
          {
            "deleteDimension": {
              "range": {
                "sheetId": getSheetIdByName('Flows'),
                "dimension": "ROWS",
                "startIndex": rowIndex,
                "endIndex": rowIndex + 1
              }
            }
          }
        ]
      };

      const deleteResponse = await window.gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: config.spreadsheetId,
        resource: deleteRequest,
      });

      if (deleteResponse.status === 200) {
        setFlows(prevFlows => prevFlows.filter(flow => flow.id !== flowId));
        toast({
          title: "Fluxo deletado",
          description: "O fluxo foi deletado com sucesso do Google Sheets.",
        });
      } else {
        toast({
          title: "Erro ao deletar fluxo",
          description: "Não foi possível deletar o fluxo do Google Sheets. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting flow from sheet:", error);
      toast({
        title: "Erro ao deletar fluxo",
        description: "Não foi possível deletar o fluxo do Google Sheets. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getSheetIdByName = (sheetName: string) => {
    // Implement logic to get sheet ID by name
    // This requires fetching spreadsheet metadata
    return 0; // Placeholder
  };

  const handleFlowSelect = (flow: GoogleSheetFlow) => {
    setSelectedFlow(flow);
  };

  const handleFlowLoad = () => {
    if (selectedFlow) {
      try {
        const flowData = JSON.parse(selectedFlow.data);
        onFlowLoad(flowData);
        toast({
          title: "Fluxo carregado",
          description: "O fluxo foi carregado com sucesso.",
        });
        onOpenChange(false); // Close the modal after loading
      } catch (error) {
        console.error("Error parsing flow data:", error);
        toast({
          title: "Erro ao carregar fluxo",
          description: "Não foi possível carregar o fluxo. Os dados podem estar corrompidos.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveCurrentFlow = () => {
    if (newFlowName.trim() === '') {
      toast({
        title: "Nome inválido",
        description: "Por favor, insira um nome para o fluxo.",
        variant: "destructive",
      });
      return;
    }

    saveFlowToSheet(currentFlowData, newFlowName);
    setNewFlowName('');
  };

  const handleUpdateSelectedFlow = () => {
    if (!selectedFlow) {
      toast({
        title: "Nenhum fluxo selecionado",
        description: "Por favor, selecione um fluxo para atualizar.",
        variant: "destructive",
      });
      return;
    }

    updateFlowInSheet(selectedFlow.id, currentFlowData, selectedFlow.name);
  };

  const handleDeleteSelectedFlow = () => {
    if (!selectedFlow) {
      toast({
        title: "Nenhum fluxo selecionado",
        description: "Por favor, selecione um fluxo para deletar.",
        variant: "destructive",
      });
      return;
    }

    deleteFlowFromSheet(selectedFlow.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Fluxos no Google Sheets</DialogTitle>
          <DialogDescription>
            Conecte-se ao Google Sheets para salvar e carregar seus fluxos de atendimento.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <Input
              type="text"
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client-id" className="text-right">
              Client ID
            </Label>
            <Input
              type="text"
              id="client-id"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="spreadsheet-id" className="text-right">
              Spreadsheet ID
            </Label>
            <Input
              type="text"
              id="spreadsheet-id"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <div className="flex justify-center mt-4">
          {!isAuthorized ? (
            <Button variant="outline" onClick={handleAuthClick} disabled={isLoading}>
              {isLoading ? "Conectando..." : "Conectar ao Google Sheets"}
            </Button>
          ) : (
            <Button variant="outline" onClick={handleSignOutClick} disabled={isLoading}>
              Desconectar do Google Sheets
            </Button>
          )}
          <Button variant="outline" onClick={handleGoogleApiInit} disabled={isLoading} className="ml-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Seus Fluxos</h2>
            <div className="flex items-center space-x-2">
              <Input
                type="search"
                placeholder="Buscar fluxo..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="max-w-xs"
              />
              <Button variant="outline" size="icon" onClick={loadFlowsFromSheet} disabled={isLoading}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Table>
            <TableCaption>
              Lista de fluxos salvos no Google Sheets.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Ultima Modificação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                    </TableRow>
                  ))}
                </>
              ) : filteredFlows.length > 0 ? (
                filteredFlows.map((flow) => (
                  <TableRow key={flow.id} onClick={() => handleFlowSelect(flow)} className={cn(selectedFlow?.id === flow.id ? "bg-muted/50" : "hover:bg-muted/50", "cursor-pointer")}>
                    <TableCell className="font-medium">{flow.id}</TableCell>
                    <TableCell>{flow.name}</TableCell>
                    <TableCell>{flow.lastModified}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">Nenhum fluxo encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex justify-between">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Nome do novo fluxo"
              value={newFlowName}
              onChange={(e) => setNewFlowName(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={handleSaveCurrentFlow} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar Fluxo"}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button onClick={handleFlowLoad} disabled={!selectedFlow || isLoading}>
              Carregar Fluxo
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Ações <Plus className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Opções</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleUpdateSelectedFlow} disabled={!selectedFlow || isSaving}>
                  {isSaving ? "Atualizando..." : "Atualizar Fluxo"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteSelectedFlow} disabled={!selectedFlow || isDeleting}>
                  {isDeleting ? "Deletando..." : "Deletar Fluxo"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleSheetsManager;
