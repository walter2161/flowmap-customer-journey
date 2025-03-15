
import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FlowData, FlowCard, AssistantProfile } from '@/utils/flowTypes';
import FlowCardComponent from './FlowCard';
import FlowConnector from './FlowConnector';
import CardTypeSelector from './CardTypeSelector';
import { nanoid } from 'nanoid';
import FlowControls from './FlowControls';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { templateOptions, getTemplateData } from '@/utils/templateData';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define node types
const nodeTypes = {
  flowCard: FlowCardComponent
};

// Define edge types
const edgeTypes = {
  flowConnector: FlowConnector
};

interface FlowEditorProps {
  initialData: FlowData;
}

const FlowEditor: React.FC<FlowEditorProps> = ({ initialData }) => {
  // Toast notification
  const { toast } = useToast();
  
  // State for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // State for selected card type and showing card selector
  const [isCardSelectorOpen, setIsCardSelectorOpen] = useState(false);
  const [newCardPosition, setNewCardPosition] = useState({ x: 0, y: 0 });
  
  // State for template modal
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templatePreviewData, setTemplatePreviewData] = useState<FlowData | null>(null);
  
  // State for script modal
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [scriptContent, setScriptContent] = useState("");
  
  // State for import modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [jsonImportContent, setJsonImportContent] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for export modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFileName, setExportFileName] = useState("flow-data.json");
  const [exportFileRef, setExportFileRef] = useState<HTMLAnchorElement | null>(null);
  const [exportJsonData, setExportJsonData] = useState("");
  const exportFileInputRef = useRef<HTMLInputElement>(null);
  const [isExportFileSelected, setIsExportFileSelected] = useState(false);
  const [selectedExportFile, setSelectedExportFile] = useState<File | null>(null);
  
  // State for assistant profile
  const [currentProfile, setCurrentProfile] = useState<AssistantProfile | undefined>(initialData.profile);
  
  // ReactFlow instance ref
  const reactFlowInstance = useRef(null);
  
  // Initialize flow data
  useEffect(() => {
    if (initialData) {
      // Convert cards to nodes
      const flowNodes = initialData.cards.map(card => ({
        id: card.id,
        type: 'flowCard',
        position: card.position,
        data: card
      }));
      
      // Convert connections to edges
      const flowEdges = initialData.connections.map(conn => ({
        id: conn.id,
        source: conn.start,
        target: conn.end,
        type: 'flowConnector',
        sourceHandle: conn.sourceHandle,
        data: {
          type: conn.type,
          sourcePortLabel: conn.sourcePortLabel
        }
      }));
      
      setNodes(flowNodes);
      setEdges(flowEdges);
      
      // Set the profile if it exists in the initialData
      if (initialData.profile) {
        setCurrentProfile(initialData.profile);
      }
    }
  }, [initialData, setNodes, setEdges]);
  
  // Handle connection between nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = {
        ...connection,
        id: `edge-${nanoid(6)}`,
        type: 'flowConnector',
        data: {
          type: 'positive' as const
        }
      };
      setEdges(edges => addEdge(newEdge, edges));
    },
    [setEdges]
  );
  
  // Zoom functions
  const zoomIn = useCallback(() => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.zoomIn();
    }
  }, []);
  
  const zoomOut = useCallback(() => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.zoomOut();
    }
  }, []);
  
  const onResetView = useCallback(() => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.fitView();
    }
  }, []);

  // Save flow function
  const onSaveFlow = useCallback(() => {
    if (nodes.length === 0) return;
    
    // Convert nodes to cards
    const cards = nodes.map(node => node.data);
    
    // Convert edges to connections
    const connections = edges.map(edge => ({
      id: edge.id,
      start: edge.source,
      end: edge.target,
      type: edge.data?.type || 'positive',
      sourceHandle: edge.sourceHandle,
      sourcePortLabel: edge.data?.sourcePortLabel
    }));
    
    // Get the most up-to-date profile from localStorage if available
    let profileToSave = currentProfile;
    const savedProfileStr = localStorage.getItem('assistantProfile');
    if (savedProfileStr) {
      try {
        const savedProfile = JSON.parse(savedProfileStr);
        profileToSave = savedProfile;
      } catch (e) {
        console.error('Error parsing saved profile:', e);
      }
    }
    
    // Create flow data object with the current profile
    const flowData: FlowData = {
      cards,
      connections,
      profile: profileToSave
    };
    
    // Save flow data to localStorage
    localStorage.setItem('flowData', JSON.stringify(flowData));
    
    console.log('Flow saved:', flowData);
    toast({
      title: "Fluxo salvo",
      description: "Seu fluxo de atendimento foi salvo com sucesso!",
    });
  }, [nodes, edges, currentProfile, toast]);
  
  // Import JSON function
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setJsonImportContent(content);
      } catch (error) {
        console.error('Error reading file:', error);
        setImportError('Erro ao ler o arquivo. Verifique se é um arquivo válido.');
      }
    };
    reader.readAsText(file);
  };
  
  const processImportedJson = () => {
    try {
      setImportError(null);
      let jsonData: FlowData;
      
      try {
        jsonData = JSON.parse(jsonImportContent) as FlowData;
      } catch (e) {
        setImportError('JSON inválido. Verifique o formato e tente novamente.');
        return;
      }
      
      if (!jsonData.cards || !Array.isArray(jsonData.cards)) {
        setImportError('Formato de dados inválido. O JSON deve conter um array "cards".');
        return;
      }
      
      // Convert cards to nodes
      const flowNodes = jsonData.cards.map(card => ({
        id: card.id,
        type: 'flowCard',
        position: card.position,
        data: card
      }));
      
      // Convert connections to edges
      const flowEdges = (jsonData.connections || []).map(conn => ({
        id: conn.id,
        source: conn.start,
        target: conn.end,
        type: 'flowConnector',
        sourceHandle: conn.sourceHandle,
        data: {
          type: conn.type,
          sourcePortLabel: conn.sourcePortLabel
        }
      }));
      
      setNodes(flowNodes);
      setEdges(flowEdges);
      
      // Import the profile data if it exists
      if (jsonData.profile) {
        // Update the current profile state
        setCurrentProfile(jsonData.profile);
        
        // Also update the profile in localStorage
        localStorage.setItem('assistantProfile', JSON.stringify(jsonData.profile));
        
        // Dispatch custom event to notify other components about profile update
        const event = new CustomEvent('profileUpdated', { detail: jsonData.profile });
        window.dispatchEvent(event);
      }
      
      setIsImportModalOpen(false);
      setJsonImportContent("");
      
      toast({
        title: "Fluxo importado",
        description: "Seu fluxo de atendimento foi importado com sucesso!",
      });
    } catch (error) {
      console.error('Error processing imported JSON:', error);
      setImportError('Erro ao processar o JSON. Verifique o formato e tente novamente.');
    }
  };
  
  // Load flow function
  const onLoad = useCallback(() => {
    setIsImportModalOpen(true);
    setJsonImportContent("");
    setImportError(null);
  }, []);
  
  // Prepare Export Flow Data
  const prepareExportData = useCallback(() => {
    if (nodes.length === 0) return null;
    
    // Convert nodes to cards
    const cards = nodes.map(node => node.data);
    
    // Convert edges to connections
    const connections = edges.map(edge => ({
      id: edge.id,
      start: edge.source,
      end: edge.target,
      type: edge.data?.type || 'positive',
      sourceHandle: edge.sourceHandle,
      sourcePortLabel: edge.data?.sourcePortLabel
    }));
    
    // Get the most up-to-date profile from localStorage if available
    let profileToExport = currentProfile;
    const savedProfileStr = localStorage.getItem('assistantProfile');
    if (savedProfileStr) {
      try {
        const savedProfile = JSON.parse(savedProfileStr);
        profileToExport = savedProfile;
      } catch (e) {
        console.error('Error parsing saved profile:', e);
      }
    }
    
    // Create flow data object with the current profile
    const flowData: FlowData = {
      cards,
      connections,
      profile: profileToExport
    };
    
    return flowData;
  }, [nodes, edges, currentProfile]);
  
  // Export flow function - now opens the export dialog
  const onExportFlow = useCallback(() => {
    const flowData = prepareExportData();
    if (!flowData) {
      toast({
        title: "Sem conteúdo",
        description: "Adicione cartões ao fluxo antes de exportar.",
        variant: "destructive",
      });
      return;
    }
    
    // Set the export data and open the modal
    setExportJsonData(JSON.stringify(flowData, null, 2));
    setIsExportModalOpen(true);
    
  }, [prepareExportData, toast]);
  
  // Handle export file selection
  const handleExportFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setIsExportFileSelected(false);
      setSelectedExportFile(null);
      return;
    }
    
    setSelectedExportFile(file);
    setIsExportFileSelected(true);
    setExportFileName(file.name);
  };
  
  // Handle direct download export
  const handleDirectDownload = () => {
    // Create a JSON file and download it
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(exportJsonData);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    setIsExportModalOpen(false);
    
    toast({
      title: "Fluxo exportado",
      description: "Seu fluxo de atendimento foi exportado com sucesso!",
    });
  };
  
  // Handle update existing file export
  const handleUpdateExistingFile = async () => {
    if (!selectedExportFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Selecione um arquivo para atualizar.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create a new file with the same name
      const file = new File([exportJsonData], selectedExportFile.name, {
        type: 'application/json',
      });
      
      // Use the File System Access API if available
      if ('showSaveFilePicker' in window) {
        try {
          const options = {
            suggestedName: selectedExportFile.name,
            types: [{
              description: 'JSON Files',
              accept: {'application/json': ['.json']},
            }],
          };
          
          const fileHandle = await window.showSaveFilePicker(options);
          const writable = await fileHandle.createWritable();
          await writable.write(file);
          await writable.close();
          
          toast({
            title: "Arquivo atualizado",
            description: "O arquivo foi atualizado com sucesso!",
          });
        } catch (err) {
          console.error('Error with File System Access API:', err);
          // Fall back to regular download if the File System API fails
          handleDirectDownload();
        }
      } else {
        // Fall back to regular download for browsers without File System Access API
        handleDirectDownload();
      }
    } catch (error) {
      console.error('Error exporting file:', error);
      toast({
        title: "Erro ao exportar",
        description: "Ocorreu um erro ao exportar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    }
    
    setIsExportModalOpen(false);
  };
  
  // Generate script function
  const onGenerateScript = useCallback(() => {
    if (nodes.length === 0) {
      toast({
        title: "Sem conteúdo",
        description: "Adicione cartões ao fluxo antes de gerar o script.",
        variant: "destructive",
      });
      return;
    }
    
    // Convert flow to script text
    let script = '';
    
    // Add title
    script += `# Roteiro de Atendimento\n\n`;
    
    // Get profile from state or localStorage
    let profileToUse: AssistantProfile | null = null;
    
    if (currentProfile) {
      profileToUse = currentProfile;
    } else {
      // Try to get profile from localStorage
      const savedProfile = localStorage.getItem('assistantProfile');
      if (savedProfile) {
        profileToUse = JSON.parse(savedProfile) as AssistantProfile;
      }
    }
    
    // Add assistant profile information if available
    if (profileToUse) {
      script += `## Perfil do Assistente\n\n`;
      script += `**Nome:** ${profileToUse.name}  \n`;
      script += `**Profissão:** ${profileToUse.profession}  \n`;
      script += `**Empresa:** ${profileToUse.company}  \n`;
      script += `**Contatos:** ${profileToUse.contacts}  \n\n`;
      
      script += `### Diretrizes Gerais do Assistente\n`;
      // Format guidelines as bullet points
      const guidelineLines = profileToUse.guidelines.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => `- ${line.trim()}`);
      
      script += guidelineLines.join('\n') + '\n\n';
    }
    
    // Add interpretation section with custom guidelines from profile
    script += `## Interpretação do Fluxo\n`;
    
    // Get the assistant name from profile
    const assistantName = profileToUse?.name || 'o assistente';
    
    script += `### Como ${assistantName} deve interpretar o roteiro de atendimento:\n`;
    
    // Use script guidelines from profile if available
    if (profileToUse?.scriptGuidelines && profileToUse.scriptGuidelines.length > 0) {
      profileToUse.scriptGuidelines.forEach(guideline => {
        script += `- ${guideline}\n`;
      });
    } else {
      // Default guidelines if none are specified
      script += `- Sempre entender a intenção do cliente antes de responder, adaptando o fluxo conforme necessário.\n`;
      script += `- Navegar entre os cartões de maneira lógica, seguindo as conexões definidas no fluxo.\n`;
      script += `- Se o cliente fornecer uma resposta inesperada, reformular a pergunta ou redirecioná-lo para uma opção próxima.\n`;
      script += `- Voltar para etapas anteriores, se necessário, garantindo que o cliente tenha todas as informações antes de finalizar uma interação.\n`;
      script += `- Confirmar sempre que possível as escolhas do cliente para evitar erros.\n`;
      script += `- Encerrar a conversa de forma educada, sempre deixando um canal aberto para contato futuro.\n`;
    }
    script += '\n';
    
    // Find initial cards (entry points for the flow)
    const initialCards = nodes.filter(node => node.data.type === 'initial');
    
    if (initialCards.length === 0) {
      script += `> Nota: Este fluxo não possui cartões iniciais definidos! Considere adicionar um cartão do tipo 'initial' para marcar o início do fluxo.\n\n`;
      // If no initial cards, just use any card as a starting point
      if (nodes.length > 0) {
        script += `## Pontos de Entrada (1)\n\n`;
        script += `### Entrada 1: ${nodes[0].data.title}\n\n`;
        processNode(nodes[0], 0, new Set());
      }
    } else {
      script += `## Pontos de Entrada (${initialCards.length})\n\n`;
      // Process each initial card and its connections
      initialCards.forEach((initialNode, index) => {
        script += `### Entrada ${index + 1}: ${initialNode.data.title}\n\n`;
        processNode(initialNode, 0, new Set());
      });
    }
    
    // A set to keep track of processed nodes to avoid infinite loops
    function processNode(node, depth, visited) {
      // Avoid infinite loops in cyclical graphs
      if (visited.has(node.id)) {
        script += `**Nota:** Este nó já foi processado anteriormente (referência cíclica).\n\n`;
        return;
      }
      visited.add(node.id);
      
      const card = node.data;
      
      script += `## ${card.title}  \n`;
      script += `**Tipo de Cartão:** ${card.type}  \n`;
      script += `**ID:** ${card.id}  \n\n`;
      
      if (card.description) {
        script += `**Descrição:**  \n${card.description}  \n\n`;
      }
      
      if (card.content) {
        script += `**Conteúdo/Script:**  \n${card.content}  \n\n`;
      }
      
      // Add specific fields based on card type
      if (card.fields && Object.keys(card.fields).length > 0) {
        let hasNonStandardFields = false;
        
        for (const [key, value] of Object.entries(card.fields)) {
          // Skip empty values or title/description/content that are already shown
          if (value && key !== 'title' && key !== 'description' && key !== 'content') {
            hasNonStandardFields = true;
            break;
          }
        }
        
        if (hasNonStandardFields) {
          script += `**Campos Específicos:**  \n`;
          
          for (const [key, value] of Object.entries(card.fields)) {
            // Skip empty values or title/description/content that are already shown
            if (value && key !== 'title' && key !== 'description' && key !== 'content') {
              script += `- **${key}:** ${value}  \n`;
            }
          }
          script += '\n';
        }
      }
      
      // Find outgoing connections
      const outgoingEdges = edges.filter(edge => edge.source === node.id);
      
      if (outgoingEdges.length > 0) {
        script += `**Possíveis Intenções do Usuário:**  \n`;
        
        // Process each connection
        outgoingEdges.forEach((edge) => {
          const targetNode = nodes.find(n => n.id === edge.target);
          if (targetNode) {
            // Obter o rótulo da porta de saída que representa a intenção do usuário
            const portLabel = edge.data?.sourcePortLabel || 'Resposta não especificada';
            
            // Formatar a informação da conexão destacando a intenção do usuário
            script += `- Se o usuário expressar a intenção "${portLabel}", direcionar para o cartão "${targetNode.data.title}" (ID: ${targetNode.id})  \n`;
          }
        });
        
        script += '\n';
        
        // Agora processar cada nó filho mostrando o caminho do fluxo
        outgoingEdges.forEach((edge) => {
          const targetNode = nodes.find(n => n.id === edge.target);
          if (targetNode) {
            // Obter a informação da conexão
            const portLabel = edge.data?.sourcePortLabel || 'Resposta não especificada';
            
            script += `### Fluxo para intenção "${portLabel}":\n\n`;
            processNode(targetNode, depth + 1, new Set([...visited]));
          }
        });
      } else {
        script += `**Nota:** Este é um nó terminal (sem conexões de saída).  \n\n`;
      }
    }
    
    // Add a footer with generation information
    script += `---\n\n`;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString() + ', ' + currentDate.toLocaleTimeString();
    script += `Roteiro gerado em: ${formattedDate}  \n`;
    script += `Total de nós: ${nodes.length}  \n`;
    script += `Total de conexões: ${edges.length}  \n`;
    
    // Set script content and open modal
    setScriptContent(script);
    setIsScriptModalOpen(true);
  }, [nodes, edges, currentProfile, toast]);

  // Handle new card
  const handleNewCard = useCallback(() => {
    if (reactFlowInstance.current) {
      const position = reactFlowInstance.current.project({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });
      setNewCardPosition(position);
      setIsCardSelectorOpen(true);
    }
  }, []);
  
  // Handle card selection
  const handleCardSelect = useCallback((type, formData) => {
    const newCard: FlowCard = {
      id: `card-${nanoid(6)}`,
      type,
      title: formData.title || `New ${type} Card`,
      description: formData.description || '',
      content: formData.content || '',
      position: newCardPosition,
      fields: { ...formData },
      outputPorts: []
    };
    
    const newNode = {
      id: newCard.id,
      type: 'flowCard',
      position: newCard.position,
      data: newCard
    };
    
    setNodes(nodes => [...nodes, newNode]);
    setIsCardSelectorOpen(false);
  }, [newCardPosition, setNodes]);
  
  // Load template preview
  const handleTemplatePreview = useCallback((templateId: string) => {
    setSelectedTemplateId(templateId);
    // Get template data based on ID
    const templateData = getTemplateData(templateId);
    setTemplatePreviewData(templateData);
  }, []);
  
  // Apply selected template 
  const applySelectedTemplate = useCallback(() => {
    if (!templatePreviewData) return;
    
    // Convert template cards to nodes
    const flowNodes = templatePreviewData.cards.map(card => ({
      id: card.id,
      type: 'flowCard',
      position: card.position,
      data: card
    }));
    
    // Convert template connections to edges
    const flowEdges = templatePreviewData.connections.map(conn => ({
      id: conn.id,
      source: conn.start,
      target: conn.end,
      type: 'flowConnector',
      sourceHandle: conn.sourceHandle,
      data: {
        type: conn.type,
        sourcePortLabel: conn.sourcePortLabel
      }
    }));
    
    // Apply the template data to the flow
    setNodes(flowNodes);
    setEdges(flowEdges);
    setCurrentProfile(templatePreviewData.profile);
    
    // Close the template modal
    setIsTemplateModalOpen(false);
    
    toast({
      title: "Template aplicado",
      description: `O template foi aplicado com sucesso ao seu fluxo!`,
    });
  }, [templatePreviewData, setNodes, setEdges, toast]);

  // Listen for profile update events
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      setCurrentProfile(event.detail);
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
    };
  }, []);

  return (
    <ReactFlowProvider>
      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          attributionPosition="bottom-right"
          onInit={(instance) => { reactFlowInstance.current = instance; }}
        >
          <MiniMap />
          <Background gap={16} size={1} />
          
          <FlowControls
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onReset={onResetView}
            onSave={onSaveFlow}
            onLoad={onLoad}
            onExport={onExportFlow}
            onScript={onGenerateScript}
            onTemplate={() => setIsTemplateModalOpen(true)}
            onNewCard={handleNewCard}
            currentProfile={currentProfile}
          />
        </ReactFlow>
        
        {isCardSelectorOpen && (
          <CardTypeSelector
            onSelect={handleCardSelect}
            onClose={() => setIsCardSelectorOpen(false)}
          />
        )}
        
        {/* Template Selection Modal with Preview */}
        <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Selecione um Template</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="gallery" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="gallery">Galeria</TabsTrigger>
                <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
              </TabsList>
              
              <TabsContent value="gallery" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {templateOptions.map((template) => (
                    <div 
                      key={template.id} 
                      className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedTemplateId === template.id ? 'border-blue-500 bg-blue-50' : ''}`}
                      onClick={() => handleTemplatePreview(template.id)}
                    >
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.description}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="preview">
                {templatePreviewData ? (
                  <div className="border rounded-lg p-4 h-[300px] overflow-y-auto">
                    <h3 className="font-medium mb-2">Perfil do Assistente</h3>
                    <p><strong>Nome:</strong> {templatePreviewData.profile?.name}</p>
                    <p><strong>Profissão:</strong> {templatePreviewData.profile?.profession}</p>
                    <p><strong>Empresa:</strong> {templatePreviewData.profile?.company}</p>
                    
                    <h3 className="font-medium mt-4 mb-2">Cartões ({templatePreviewData.cards.length})</h3>
                    <ul className="space-y-2">
                      {templatePreviewData.cards.map(card => (
                        <li key={card.id} className="border-l-2 border-blue-500 pl-2">
                          <p><strong>{card.title}</strong></p>
                          <p className="text-sm text-gray-500">Tipo: {card.type}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    Selecione um template para visualizar detalhes
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTemplateModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={applySelectedTemplate}
                disabled={!templatePreviewData}
              >
                Aplicar Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Import JSON Modal */}
        <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Importar Fluxo</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="paste" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="paste">Colar JSON</TabsTrigger>
                <TabsTrigger value="upload">Carregar Arquivo</TabsTrigger>
              </TabsList>
              
              <TabsContent value="paste" className="space-y-4">
                <Textarea
                  placeholder="Cole o conteúdo JSON aqui..."
                  value={jsonImportContent}
                  onChange={(e) => setJsonImportContent(e.target.value)}
                  className="h-[300px] font-mono text-sm"
                />
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="mb-4">
                    <p className="text-gray-600 mb-2">Selecione um arquivo JSON para importar</p>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Escolher Arquivo
                    </Button>
                  </div>
                  {jsonImportContent && (
                    <div className="text-sm text-gray-500 truncate max-w-full">
                      Arquivo carregado com sucesso!
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            {importError && (
              <div className="text-red-500 text-sm border border-red-200 bg-red-50 p-3 rounded">
                {importError}
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={processImportedJson}
                disabled={!jsonImportContent}
              >
                Importar Fluxo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Script Content Modal */}
        <Dialog open={isScriptModalOpen} onOpenChange={setIsScriptModalOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Roteiro de Atendimento</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[60vh]">
              <pre className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">{scriptContent}</pre>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => {
                  // Create a text file and download it
                  const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(scriptContent);
                  const exportFileDefaultName = 'flow-script.md';
                  
                  const downloadLink = document.createElement('a');
                  downloadLink.setAttribute('href', dataStr);
                  downloadLink.setAttribute('download', exportFileDefaultName);
                  downloadLink.click();
                }}
              >
                Baixar Script
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Export Modal */}
        <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Exportar Fluxo</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="download" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="download">Download</TabsTrigger>
                <TabsTrigger value="update">Atualizar Arquivo</TabsTrigger>
              </TabsList>
              
              <TabsContent value="download" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fileName">Nome do arquivo</Label>
                    <Input
                      id="fileName"
                      value={exportFileName}
                      onChange={(e) => setExportFileName(e.target.value)}
                    />
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Conteúdo do arquivo:</p>
                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto max-h-[200px] overflow-y-auto">
                      {exportJsonData.substring(0, 500)}
                      {exportJsonData.length > 500 ? '...' : ''}
                    </pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="update" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Input
                    ref={exportFileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleExportFileSelect}
                    className="hidden"
                  />
                  <div className="mb-4">
                    <p className="text-gray-600 mb-2">Selecione um arquivo JSON existente para atualizar</p>
                    <Button
                      variant="outline"
                      onClick={() => exportFileInputRef.current?.click()}
                    >
                      Escolher Arquivo
                    </Button>
                  </div>
                  {isExportFileSelected && (
                    <div className="text-sm text-gray-500 truncate max-w-full">
                      Arquivo selecionado: {selectedExportFile?.name}
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded-lg">
                  <p>Ao atualizar um arquivo existente, seu conteúdo será substituído pelo fluxo atual.</p>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsExportModalOpen(false)}>
                Cancelar
              </Button>
              
              <Tabs.Consumer>
                {(value) => (
                  <>
                    {value === 'download' ? (
                      <Button
                        onClick={handleDirectDownload}
                      >
                        Baixar Arquivo
                      </Button>
                    ) : (
                      <Button
                        onClick={handleUpdateExistingFile}
                        disabled={!isExportFileSelected}
                      >
                        Atualizar Arquivo
                      </Button>
                    )}
                  </>
                )}
              </Tabs.Consumer>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowEditor;
