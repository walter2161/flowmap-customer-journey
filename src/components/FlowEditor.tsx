
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

// Define node types
const nodeTypes = {
  flowCard: FlowCardComponent
};

// Define edge types
const edgeTypes = {
  flowConnector: FlowConnector
};

// Define template options
const templateOptions = [
  { id: 'imobiliaria', name: 'Imobiliária', description: 'Template para atendimento imobiliário' },
  { id: 'servicos', name: 'Serviços', description: 'Template para empresas de serviços' },
  { id: 'ecommerce', name: 'E-commerce', description: 'Template para lojas online' },
  { id: 'suporte', name: 'Suporte', description: 'Template para atendimento de suporte' },
];

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
    
    // Add assistant profile information if available
    if (currentProfile) {
      script += `# Bot Profile\n`;
      script += `Nome: ${currentProfile.name}\n`;
      script += `Profissão: ${currentProfile.profession}\n`;
      script += `Empresa: ${currentProfile.company}\n`;
      script += `Contatos: ${currentProfile.contacts}\n\n`;
      script += `Diretrizes:\n${currentProfile.guidelines}\n\n`;
    }
    
    script += `# Roteiro de Atendimento\n\n`;
    
    // Find initial cards
    const initialCards = nodes.filter(node => node.data.type === 'initial');
    
    // Process each initial card and its connections
    initialCards.forEach(initialNode => {
      processNode(initialNode, 0);
    });
    
    function processNode(node, depth) {
      const indent = '  '.repeat(depth);
      const card = node.data;
      
      script += `${indent}## ${card.title}\n`;
      if (card.description) {
        script += `${indent}${card.description}\n`;
      }
      if (card.content) {
        script += `${indent}${card.content}\n`;
      }
      
      // Add specific fields based on card type
      if (card.fields) {
        const fields = card.fields;
        switch (card.type) {
          case 'imovel':
            if (fields.endereco) script += `${indent}Endereço: ${fields.endereco}\n`;
            if (fields.preco) script += `${indent}Preço: ${fields.preco}\n`;
            if (fields.area) script += `${indent}Área: ${fields.area}m²\n`;
            if (fields.quartos) script += `${indent}Quartos: ${fields.quartos}\n`;
            break;
          case 'servico':
            if (fields.nome) script += `${indent}Nome: ${fields.nome}\n`;
            if (fields.preco) script += `${indent}Preço: ${fields.preco}\n`;
            if (fields.duracao) script += `${indent}Duração: ${fields.duracao}\n`;
            break;
          // Add other card types as needed
        }
      }
      
      script += '\n';
      
      // Find outgoing connections
      const outgoingEdges = edges.filter(edge => edge.source === node.id);
      
      // Process each connection
      outgoingEdges.forEach(edge => {
        const targetNode = nodes.find(n => n.id === edge.target);
        if (targetNode) {
          const portLabel = edge.data?.sourcePortLabel || '';
          if (portLabel) {
            script += `${indent}-> ${portLabel}:\n`;
          }
          processNode(targetNode, depth + 1);
        }
      });
    }
    
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
  
  // Handle template selection
  const handleTemplateSelect = useCallback((templateId: string) => {
    // In a real implementation, you would fetch a template from an API or load it from a predefined set
    // For this example, we'll just show a notification
    toast({
      title: "Template selecionado",
      description: `Template "${templateId}" foi selecionado.`,
    });
    
    // Here you would actually load the template and set it as the current flow
    // For now, we'll just close the modal
    setIsTemplateModalOpen(false);
    
    // Update profile based on template
    const newProfile: AssistantProfile = {
      ...currentProfile,
      name: templateId === 'imobiliaria' ? 'Ana Imóveis' : 
            templateId === 'servicos' ? 'Carlos Serviços' : 
            templateId === 'ecommerce' ? 'Loja Virtual' : 'Suporte Técnico',
      profession: templateId === 'imobiliaria' ? 'Corretora de Imóveis' : 
                 templateId === 'servicos' ? 'Prestador de Serviços' : 
                 templateId === 'ecommerce' ? 'Atendente de E-commerce' : 'Atendente de Suporte',
      company: templateId === 'imobiliaria' ? 'Imobiliária Exemplo' : 
              templateId === 'servicos' ? 'Serviços Gerais' : 
              templateId === 'ecommerce' ? 'Loja Online' : 'Suporte Técnico',
      contacts: templateId === 'imobiliaria' ? 'contato@imobiliaria.com | (11) 99999-9999' : 
               templateId === 'servicos' ? 'contato@servicos.com | (11) 88888-8888' : 
               templateId === 'ecommerce' ? 'vendas@loja.com | (11) 77777-7777' : 'suporte@empresa.com | (11) 66666-6666',
      guidelines: templateId === 'imobiliaria' ? 'Seja cordial e ajude o cliente a encontrar o imóvel ideal para suas necessidades.' : 
                 templateId === 'servicos' ? 'Explique detalhadamente os serviços e dê orçamentos precisos.' : 
                 templateId === 'ecommerce' ? 'Ajude o cliente a escolher produtos e facilite o processo de compra.' : 'Resolva os problemas técnicos do cliente de maneira clara e objetiva.'
    };
    
    setCurrentProfile(newProfile);
  }, [currentProfile, toast]);

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
        
        {/* Template Selection Modal */}
        <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Selecione um Template</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {templateOptions.map((template) => (
                <div 
                  key={template.id} 
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.description}</p>
                </div>
              ))}
            </div>
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
            <div className="flex justify-end">
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowEditor;
