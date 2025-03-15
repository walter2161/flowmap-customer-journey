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
    
    // Create flow data object
    const flowData: FlowData = {
      cards,
      connections,
      profile: currentProfile
    };
    
    // Save flow data (e.g., to localStorage or backend)
    localStorage.setItem('flowData', JSON.stringify(flowData));
    
    console.log('Flow saved:', flowData);
    toast({
      title: "Fluxo salvo",
      description: "Seu fluxo de atendimento foi salvo com sucesso!",
    });
  }, [nodes, edges, currentProfile, toast]);
  
  // Load flow function
  const onLoad = useCallback(() => {
    const savedFlow = localStorage.getItem('flowData');
    if (savedFlow) {
      try {
        const flowData = JSON.parse(savedFlow) as FlowData;
        
        // Convert cards to nodes
        const flowNodes = flowData.cards.map(card => ({
          id: card.id,
          type: 'flowCard',
          position: card.position,
          data: card
        }));
        
        // Convert connections to edges
        const flowEdges = flowData.connections.map(conn => ({
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
        setCurrentProfile(flowData.profile);
        
        console.log('Flow loaded:', flowData);
        toast({
          title: "Fluxo carregado",
          description: "Seu fluxo de atendimento foi carregado com sucesso!",
        });
      } catch (error) {
        console.error('Error loading flow:', error);
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível carregar o fluxo salvo.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Nenhum fluxo encontrado",
        description: "Não há fluxos salvos para carregar.",
        variant: "destructive",
      });
    }
  }, [setNodes, setEdges, toast]);
  
  // Export flow function
  const onExportFlow = useCallback(() => {
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
    
    // Create flow data object
    const flowData: FlowData = {
      cards,
      connections,
      profile: currentProfile
    };
    
    // Create a JSON file and download it
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'flow-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Fluxo exportado",
      description: "Seu fluxo de atendimento foi exportado com sucesso!",
    });
  }, [nodes, edges, currentProfile, toast]);
  
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
    
    // Add assistant profile information if available
    if (currentProfile) {
      script += `## Perfil do Assistente\n\n`;
      script += `**Nome:** ${currentProfile.name}  \n`;
      script += `**Profissão:** ${currentProfile.profession}  \n`;
      script += `**Empresa:** ${currentProfile.company}  \n`;
      script += `**Contatos:** ${currentProfile.contacts}  \n\n`;
      
      script += `### Diretrizes do Assistente\n`;
      // Format guidelines as bullet points
      const guidelineLines = currentProfile.guidelines.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => `- ${line.trim()}`);
      
      script += guidelineLines.join('\n') + '\n\n';
    } else {
      // Se não há um perfil definido, buscar do localStorage
      const savedProfile = localStorage.getItem('assistantProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile) as AssistantProfile;
        script += `## Perfil do Assistente\n\n`;
        script += `**Nome:** ${profile.name}  \n`;
        script += `**Profissão:** ${profile.profession}  \n`;
        script += `**Empresa:** ${profile.company}  \n`;
        script += `**Contatos:** ${profile.contacts}  \n\n`;
        
        script += `### Diretrizes do Assistente\n`;
        // Format guidelines as bullet points
        const guidelineLines = profile.guidelines.split('\n')
          .filter(line => line.trim().length > 0)
          .map(line => `- ${line.trim()}`);
        
        script += guidelineLines.join('\n') + '\n\n';
      }
    }
    
    // Add fixed interpretation section with guidance on how to use the script
    script += `## Interpretação do Fluxo\n`;
    
    // Get the assistant name from profile or use generic term
    const assistantName = currentProfile?.name || 
                         (localStorage.getItem('assistantProfile') ? 
                           JSON.parse(localStorage.getItem('assistantProfile')).name : 
                           'o assistente');
    
    script += `### Como ${assistantName} deve interpretar o roteiro de atendimento:\n`;
    script += `- **Sempre entender a intenção do cliente** antes de responder, adaptando o fluxo conforme necessário.\n`;
    script += `- **Navegar entre os cartões de maneira lógica**, seguindo as conexões definidas no fluxo.\n`;
    script += `- **Se o cliente fornecer uma resposta inesperada**, reformular a pergunta ou redirecioná-lo para uma opção próxima.\n`;
    script += `- **Voltar para etapas anteriores, se necessário**, garantindo que o cliente tenha todas as informações antes de finalizar uma interação.\n`;
    script += `- **Confirmar sempre que possível** as escolhas do cliente para evitar erros.\n`;
    script += `- **Encerrar a conversa de forma educada**, sempre deixando um canal aberto para contato futuro.\n\n`;
    
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
        script += `**Opções de Resposta:**  \n`;
        
        // Process each connection
        outgoingEdges.forEach((edge, idx) => {
          const targetNode = nodes.find(n => n.id === edge.target);
          if (targetNode) {
            const connectionType = edge.data?.type || 'custom';
            // Get the user-defined port label if available
            let portLabel = edge.data?.sourcePortLabel || '';
            
            // Use the user-defined port label if available, otherwise use a generic label
            let responseLabel = portLabel 
              ? portLabel 
              : `Resposta ${idx + 1}`;
            
            // Select appropriate emoji based on connection type
            let typeEmoji = '';
            switch (connectionType) {
              case 'positive':
                typeEmoji = '✅';
                break;
              case 'negative':
                typeEmoji = '❌';
                break;
              case 'neutral':
                typeEmoji = '⚪';
                break;
              case 'custom':
              default:
                typeEmoji = '🔶';
                break;
            }
            
            // Format connection information with the new format
            script += `- Se a resposta do usuário for '${responseLabel}' leve a conversa para a etapa do cartão '${targetNode.data.title}' (ID: ${targetNode.id})  \n`;
          }
        });
        
        script += '\n';
        
        // Now process each child node with a title showing the flow path
        outgoingEdges.forEach((edge, idx) => {
          const targetNode = nodes.find(n => n.id === edge.target);
          if (targetNode) {
            // Get connection information
            const connectionType = edge.data?.type || 'custom';
            // Use the port label if available, otherwise use generic "Resposta X"
            let portLabel = edge.data?.sourcePortLabel || `Resposta ${idx + 1}`;
            
            // Format connection type for display
            let displayType = connectionType === 'custom' ? 'custom' : connectionType;
            
            script += `### Fluxo para "${portLabel}" (🔶 ${displayType}):\n\n`;
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
                  const exportFileDefaultName = 'flow-script.txt';
                  
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataStr);
                  linkElement.setAttribute('download', exportFileDefaultName);
                  linkElement.click();
                }}
              >
                Baixar Roteiro
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowEditor;
