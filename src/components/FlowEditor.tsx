import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeTypes,
  OnConnect,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  EdgeTypes,
  ConnectionLineType,
  Panel
} from 'reactflow';
import { useToast } from '@/components/ui/use-toast';
import { FlowCard, FlowConnection, FlowData, CardType } from '@/utils/flowTypes';
import FlowCardComponent from './FlowCard';
import FlowConnector from './FlowConnector';
import FlowControls from './FlowControls';
import { initialFlowData } from '@/utils/initialData';
import { nanoid } from 'nanoid';
import CardTypeSelector, { cardTypeLabels } from './CardTypeSelector';

import 'reactflow/dist/style.css';

// Template data
const templates = {
  imobiliaria: initialFlowData, // Using initial data as the real estate template
  coworking: {
    cards: [
      {
        id: "cowork-1",
        title: "Boas-vindas Coworking",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo ao Espaço Colaborativo. Como posso ajudar você hoje? Está interessado em conhecer nossos planos ou agendar uma visita?",
        position: { x: 71, y: 32 },
        type: "initial" as const
      },
      {
        id: "cowork-2",
        title: "Interesse em Planos",
        description: "Cliente interessado nos planos",
        content: "Temos diversos planos para atender suas necessidades. Temos plano diário, semanal e mensal. Qual deles melhor atende sua necessidade?",
        position: { x: 433, y: 63 },
        type: "regular" as const
      },
      {
        id: "cowork-3",
        title: "Agendamento de Visita",
        description: "Cliente quer conhecer o espaço",
        content: "Ficaremos felizes em recebê-lo para conhecer nosso espaço. Temos disponibilidade nos seguintes horários: [lista de horários]. Qual seria melhor para você?",
        position: { x: 483, y: 491 },
        type: "regular" as const
      },
      {
        id: "cowork-4",
        title: "Finalização",
        description: "Encerramento do atendimento",
        content: "Perfeito! Sua visita está agendada. Nossa equipe entrará em contato para confirmar. Agradecemos seu interesse em nosso espaço de coworking!",
        position: { x: 789, y: 167 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "cowork-conn-1", start: "cowork-1", end: "cowork-2", type: "positive" as const },
      { id: "cowork-conn-2", start: "cowork-1", end: "cowork-3", type: "negative" as const },
      { id: "cowork-conn-3", start: "cowork-2", end: "cowork-4", type: "positive" as const },
      { id: "cowork-conn-4", start: "cowork-3", end: "cowork-4", type: "positive" as const }
    ]
  },
  clinica: {
    cards: [
      {
        id: "clinic-1",
        title: "Boas-vindas Clínica",
        description: "Primeiro contato com paciente",
        content: "Olá! Bem-vindo à Clínica Saúde Total. Como posso ajudar você hoje? Deseja agendar uma consulta ou tirar dúvidas sobre nossos serviços?",
        position: { x: 71, y: 32 },
        type: "initial" as const
      },
      {
        id: "clinic-2",
        title: "Agendamento de Consulta",
        description: "Paciente deseja agendar consulta",
        content: "Para agendar sua consulta, preciso de algumas informações: 1) Qual especialidade médica você procura? 2) Tem preferência de data e horário? 3) Já é paciente da clínica?",
        position: { x: 433, y: 63 },
        type: "regular" as const
      },
      {
        id: "clinic-3",
        title: "Informações sobre Serviços",
        description: "Paciente com dúvidas",
        content: "Nossa clínica oferece diversas especialidades médicas, incluindo: cardiologia, dermatologia, ortopedia, e muitas outras. Qual serviço específico você gostaria de saber mais?",
        position: { x: 483, y: 491 },
        type: "regular" as const
      },
      {
        id: "clinic-4",
        title: "Confirmação",
        description: "Finalização do atendimento",
        content: "Sua consulta foi agendada com sucesso! Enviaremos um lembrete 24h antes. Lembre-se de trazer seus documentos e chegar 15 minutos antes do horário marcado.",
        position: { x: 789, y: 167 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "clinic-conn-1", start: "clinic-1", end: "clinic-2", type: "positive" as const },
      { id: "clinic-conn-2", start: "clinic-1", end: "clinic-3", type: "negative" as const },
      { id: "clinic-conn-3", start: "clinic-2", end: "clinic-4", type: "positive" as const },
      { id: "clinic-conn-4", start: "clinic-3", end: "clinic-4", type: "positive" as const }
    ]
  },
  marketing: {
    cards: [
      {
        id: "mkt-1",
        title: "Boas-vindas Marketing",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo à Agência Impacto Digital. Como posso ajudar sua empresa hoje? Está interessado em melhorar sua presença online ou em uma campanha específica?",
        position: { x: 71, y: 32 },
        type: "initial" as const
      },
      {
        id: "mkt-2",
        title: "Presença Online",
        description: "Cliente interessado em presença digital",
        content: "Para melhorar sua presença online, oferecemos serviços de otimização de SEO, gestão de redes sociais e marketing de conteúdo. Qual aspecto é mais urgente para seu negócio?",
        position: { x: 433, y: 63 },
        type: "regular" as const
      },
      {
        id: "mkt-3",
        title: "Campanhas Específicas",
        description: "Cliente interessado em campanhas",
        content: "Desenvolvemos campanhas personalizadas para diversos objetivos: lançamento de produtos, aumento de vendas, reconhecimento de marca. Qual é o principal objetivo da sua campanha?",
        position: { x: 483, y: 491 },
        type: "regular" as const
      },
      {
        id: "mkt-4",
        title: "Proposta Comercial",
        description: "Envio de proposta",
        content: "Baseado em suas necessidades, prepararemos uma proposta detalhada. Precisamos agendar uma reunião para discutir mais detalhes sobre seu negócio. Qual seria o melhor horário?",
        position: { x: 789, y: 167 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "mkt-conn-1", start: "mkt-1", end: "mkt-2", type: "positive" as const },
      { id: "mkt-conn-2", start: "mkt-1", end: "mkt-3", type: "negative" as const },
      { id: "mkt-conn-3", start: "mkt-2", end: "mkt-4", type: "positive" as const },
      { id: "mkt-conn-4", start: "mkt-3", end: "mkt-4", type: "positive" as const }
    ]
  }
};

// Node types
const nodeTypes: NodeTypes = {
  flowCard: FlowCardComponent
};

// Edge types
const edgeTypes: EdgeTypes = {
  flowConnector: FlowConnector
};

interface FlowEditorProps {
  initialData?: FlowData;
}

const FlowEditor: React.FC<FlowEditorProps> = ({ initialData = initialFlowData }) => {
  const { toast } = useToast();
  const { fitView, zoomIn, zoomOut, setViewport } = useReactFlow();
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [scriptModalOpen, setScriptModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [cardTypeSelectorOpen, setCardTypeSelectorOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');

  // Convert cards to nodes
  const initialNodes: Node[] = initialData.cards.map((card) => ({
    id: card.id,
    type: 'flowCard',
    position: card.position,
    data: card,
  }));

  // Convert connections to edges with source handles based on connection type
  const initialEdges: Edge[] = initialData.connections.map((connection) => ({
    id: connection.id,
    source: connection.start,
    target: connection.end,
    type: 'flowConnector',
    sourceHandle: connection.type, // Use connection type as sourceHandle
    data: { type: connection.type },
    style: {
      strokeWidth: 3,
      stroke: connection.type === 'positive' ? '#10B981' : 
              connection.type === 'negative' ? '#EF4444' : '#6B7280',
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();

  // Create connections with custom styling and correct handle
  const onConnect: OnConnect = useCallback(
    (connection) => {
      const sourceHandleId = connection.sourceHandle;
      const connectionType = sourceHandleId === 'positive' ? 'positive' : 
                           sourceHandleId === 'negative' ? 'negative' : 'neutral';
      
      const newEdge: Edge = {
        ...connection,
        id: `edge-${nanoid(6)}`,
        type: 'flowConnector',
        sourceHandle: connectionType, // Set sourceHandle to match the connection type
        data: { type: connectionType },
        style: {
          strokeWidth: 3,
          stroke: connectionType === 'positive' ? '#10B981' : 
                  connectionType === 'negative' ? '#EF4444' : '#6B7280',
        },
      };
      
      setEdges((eds) => addEdge(newEdge, eds));
      
      toast({
        title: 'Conexão Criada',
        description: `Conexão ${connectionType} adicionada ao fluxo.`,
        duration: 2000,
      });
    },
    [setEdges, toast]
  );

  // Reset view
  const onResetView = useCallback(() => {
    fitView({ padding: 0.2, duration: 800 });
  }, [fitView]);

  // Save flow
  const onSaveFlow = useCallback(() => {
    // Convert nodes back to cards
    const cards: FlowCard[] = nodes.map((node) => ({
      id: node.id,
      title: node.data.title,
      description: node.data.description,
      content: node.data.content,
      position: node.position,
      type: node.data.type,
      fields: { ...node.data.fields }
    }));

    // Convert edges back to connections
    const connections: FlowConnection[] = edges.map((edge) => ({
      id: edge.id,
      start: edge.source,
      end: edge.target,
      type: (edge.data?.type || 'neutral') as 'positive' | 'negative' | 'neutral',
    }));

    // Create flow data
    const flowData: FlowData = {
      cards,
      connections,
    };

    // Save to localStorage
    localStorage.setItem('flowData', JSON.stringify(flowData));
    
    toast({
      title: 'Fluxo Salvo',
      description: 'Seu fluxo foi salvo com sucesso.',
      duration: 2000,
    });
  }, [nodes, edges, toast]);

  // Load flow
  const onLoadFlow = useCallback(() => {
    setJsonModalOpen(true);
  }, []);

  // Handle JSON import - ensure connections use proper sourceHandle
  const handleJsonImport = useCallback(() => {
    try {
      const parsedData = JSON.parse(jsonInput);
      
      if (!parsedData.cards || !parsedData.connections) {
        throw new Error('JSON inválido: deve conter cards e connections');
      }
      
      // Convert cards to nodes
      const newNodes: Node[] = parsedData.cards.map((card: FlowCard) => ({
        id: card.id,
        type: 'flowCard',
        position: card.position,
        data: card,
      }));

      // Convert connections to edges with sourceHandle matching connection type
      const newEdges: Edge[] = parsedData.connections.map((connection: FlowConnection) => ({
        id: connection.id,
        source: connection.start,
        target: connection.end,
        type: 'flowConnector',
        sourceHandle: connection.type, // Set sourceHandle to connection type
        data: { type: connection.type },
        style: {
          strokeWidth: 3,
          stroke: connection.type === 'positive' ? '#10B981' : 
                  connection.type === 'negative' ? '#EF4444' : '#6B7280',
        },
      }));
      
      setNodes(newNodes);
      setEdges(newEdges);
      setJsonModalOpen(false);
      setJsonInput('');
      
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 800 });
      }, 100);
      
      toast({
        title: 'Fluxo Carregado',
        description: 'Seu fluxo foi carregado com sucesso.',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao Carregar',
        description: (error as Error).message || 'Erro ao carregar o JSON.',
        variant: 'destructive',
        duration: 3000,
      });
    }
  }, [jsonInput, setNodes, setEdges, fitView, toast]);

  // Export flow
  const onExportFlow = useCallback(() => {
    // Convert nodes back to cards
    const cards: FlowCard[] = nodes.map((node) => ({
      id: node.id,
      title: node.data.title,
      description: node.data.description,
      content: node.data.content,
      position: node.position,
      type: node.data.type,
      fields: { ...node.data.fields }
    }));

    // Convert edges back to connections
    const connections: FlowConnection[] = edges.map((edge) => ({
      id: edge.id,
      start: edge.source,
      end: edge.target,
      type: (edge.data?.type || 'neutral') as 'positive' | 'negative' | 'neutral',
    }));

    // Create flow data
    const flowData: FlowData = {
      cards,
      connections,
    };

    // Create file
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    // Create download link
    const exportFileDefaultName = 'flow-map.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: 'Fluxo Exportado',
      description: 'Seu fluxo foi exportado como JSON.',
      duration: 2000,
    });
  }, [nodes, edges, toast]);

  const onGenerateScript = useCallback(() => {
    // Create a map of existing IDs to sequential numbers
    const idMap = new Map<string, string>();
    let currentId = 1;
    
    // First, map all node IDs to sequential numbers
    nodes.forEach(node => {
      if (!idMap.has(node.id)) {
        // Format numbers to always have 2 digits (01, 02, etc)
        const formattedId = currentId.toString().padStart(2, '0');
        idMap.set(node.id, formattedId);
        currentId++;
      }
    });

    let script = "### **SCRIPT DE ATENDIMENTO ESTRUTURADO - FLUXO HUMANIZADO**\n\n";
    
    // Process nodes in order of their assigned IDs
    const sortedNodes = [...nodes].sort((a, b) => {
      const idA = parseInt(idMap.get(a.id) || '99');
      const idB = parseInt(idMap.get(b.id) || '99');
      return idA - idB;
    });

    // Process each node and its connections
    sortedNodes.forEach(node => {
      const nodeId = idMap.get(node.id) || '00';
      
      script += `#### **ID: ${nodeId} - ${node.data.title.toUpperCase()}**\n`;
      script += `"${node.data.content}"\n\n`;
      
      // Find outgoing connections
      const nodeConnections = edges.filter(edge => edge.source === node.id);
      
      if (nodeConnections.length > 0) {
        // Sort connections by type (positive first, then negative, then neutral)
        const sortedConnections = nodeConnections.sort((a, b) => {
          if (a.data?.type === 'positive' && b.data?.type !== 'positive') return -1;
          if (a.data?.type !== 'positive' && b.data?.type === 'positive') return 1;
          if (a.data?.type === 'negative' && b.data?.type !== 'negative') return -1;
          if (a.data?.type !== 'negative' && b.data?.type === 'negative') return 1;
          return 0;
        });
        
        sortedConnections.forEach(connection => {
          const targetNode = nodes.find(n => n.id === connection.target);
          const targetId = idMap.get(connection.target) || '00';
          const connectionType = connection.data?.type || 'neutral';
          
          let conditionText = '';
          if (connectionType === 'positive') {
            conditionText = `**Se o usuário mencionar interesse ou responder positivamente**`;
          } else if (connectionType === 'negative') {
            conditionText = `**Se o usuário demonstrar desinteresse ou responder negativamente**`;
          } else {
            conditionText = `**Se o usuário estiver indeciso ou fizer perguntas adicionais**`;
          }
          
          if (targetNode) {
            script += `🔹 ${conditionText} → Seguir para **ID: ${targetId}**\n`;
          }
        });
        
        script += '\n---\n\n';
      } else if (node.data.type === 'end') {
        // For end nodes without connections
        script += "Este é um nó final. A conversa pode ser encerrada aqui.\n\n---\n\n";
      } else {
        script += "Sem fluxos de saída definidos.\n\n---\n\n";
      }
    });
  
    // Add guide section at the end
    script += `\n### **POR QUE ESSA VERSÃO É MAIS HUMANIZADA?**\n`;
    script += `✅ O assistente **não apresenta opções fechadas**, mas conduz a conversa naturalmente.\n`;
    script += `✅ As respostas são **flexíveis e abertas**, permitindo que o usuário fale livremente.\n`;
    script += `✅ Há **perguntas exploratórias**, ajudando o usuário a refletir e tomar decisões.\n`;
    script += `✅ O fluxo se adapta ao usuário, respeitando seu nível de interesse e necessidade.\n\n`;
    
    // Add node reference
    script += "### **REFERÊNCIA DE IDs**\n\n";
    sortedNodes.forEach(node => {
      const nodeId = idMap.get(node.id) || '00';
      script += `${nodeId}: ${node.data.title}\n`;
    });
  
    setGeneratedScript(script);
    setScriptModalOpen(true);
  }, [nodes, edges]);

  // Load template - ensure proper sourceHandle
  const onLoadTemplate = useCallback((templateName: keyof typeof templates) => {
    const templateData = templates[templateName];
    
    // Convert template cards to nodes
    const newNodes: Node[] = templateData.cards.map((card) => ({
      id: card.id,
      type: 'flowCard',
      position: card.position,
      data: card,
    }));

    // Convert template connections to edges with sourceHandle matching connection type
    const newEdges: Edge[] = templateData.connections.map((connection) => ({
      id: connection.id,
      source: connection.start,
      target: connection.end,
      type: 'flowConnector',
      sourceHandle: connection.type, // Set sourceHandle to connection type
      data: { type: connection.type },
      style: {
        strokeWidth: 3,
        stroke: connection.type === 'positive' ? '#10B981' : 
                connection.type === 'negative' ? '#EF4444' : '#6B7280',
      },
    }));
    
    setNodes(newNodes);
    setEdges(newEdges);
    setTemplateModalOpen(false);
    
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 800 });
    }, 100);
    
    toast({
      title: 'Template Carregado',
      description: `Template de ${templateName} carregado com sucesso.`,
      duration: 2000,
    });
  }, [setNodes, setEdges, fitView, toast]);

  // Handle creating a new card
  const handleNewCard = useCallback(() => {
    setCardTypeSelectorOpen(true);
  }, []);

  // Handle card type selection
  const handleCardTypeSelect = useCallback((type: CardType, formData: any) => {
    const { x, y, zoom } = reactFlowInstance.getViewport();
    
    // Calculate position in the center of the current view
    const position = {
      x: (window.innerWidth / 2 - x) / zoom,
      y: (window.innerHeight / 2 - 100 - y) / zoom
    };
    
    const newNode = {
      id: `node-${nanoid(6)}`,
      type: 'flowCard',
      position,
      data: {
        id: `card-${nanoid(6)}`,
        title: formData.title || `Novo Cartão ${cardTypeLabels[type]}`,
        description: formData.description || 'Descrição do cartão',
        content: formData.content || 'Conteúdo do cartão',
        type: type,
        fields: { ...formData }
      }
    };

    setNodes(nodes => [...nodes, newNode]);
    setCardTypeSelectorOpen(false);
    
    toast({
      title: 'Cartão Criado',
      description: `Um novo cartão do tipo ${cardTypeLabels[type]} foi adicionado ao fluxo.`,
      duration: 2000,
    });
  }, [setNodes, reactFlowInstance, toast]);

  // Initialize
  useEffect(() => {
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 800 });
    }, 100);
  }, [fitView]);

  return (
    <div className="w-full h-screen" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineType={ConnectionLineType.Straight}
        connectionLineStyle={{
          stroke: '#6B7280',
          strokeWidth: 3,
          strokeLinecap: 'round',
        }}
        defaultEdgeOptions={{
          type: 'flowConnector',
          style: {
            strokeWidth: 3,
          },
        }}
        fitView
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Controls className="m-4" showInteractive={false} />
        <MiniMap 
          nodeColor={(node) => {
            const type = node.data?.type || 'regular';
            return type === 'initial' ? '#10B981' : 
                   type === 'end' ? '#EF4444' : '#6B7280';
          }}
          maskColor="rgba(255, 255, 255, 0.7)"
          className="m-4 bg-white/90 backdrop-blur-md"
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={15} 
          size={1} 
          color="#CCCCCC" 
          className="bg-gradient-to-br from-gray-50 to-blue-50"
        />
        
        <FlowControls
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={onResetView}
          onSave={onSaveFlow}
          onLoad={onLoadFlow}
          onExport={onExportFlow}
          onScript={onGenerateScript}
          onTemplate={() => setTemplateModalOpen(true)}
          onNewCard={handleNewCard}
        />
        
        {/* JSON Import Modal */}
        {jsonModalOpen && (
          <Panel position="top-left" className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            <div className="bg-white rounded-xl shadow-2xl w-[600px] p-6 animate-scale-in">
              <h2 className="text-xl font-bold mb-4">Importar Fluxo (JSON)</h2>
              <textarea
                className="w-full h-[300px] p-3 border border-gray-300 rounded-lg font-mono text-sm"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"cards": [...], "connections": [...]}'
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                  onClick={() => setJsonModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  onClick={handleJsonImport}
                >
                  Importar
                </button>
              </div>
            </div>
          </Panel>
        )}
        
        {/* Script Generator Modal */}
        {scriptModalOpen && (
          <Panel position="top-left" className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            <div className="bg-white rounded-xl shadow-2xl w-[800px] p-6 animate-scale-in max-h-[90vh] flex flex-col">
              <h2 className="text-xl font-bold mb-4">Script Detalhado para IA</h2>
              <div className="flex-1 overflow-auto">
                <pre className="w-full h-full p-3 border border-gray-300 rounded-lg font-mono text-sm whitespace-pre-wrap">
                  {generatedScript}
                </pre>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                  onClick={() => setScriptModalOpen(false)}
                >
                  Fechar
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    // Copy to clipboard
                    navigator.clipboard.writeText(generatedScript);
                    toast({
                      title: 'Script Copiado',
                      description: 'O script foi copiado para a área de transferência.',
                      duration: 2000,
                    });
                  }}
                >
                  Copiar Script
                </button>
              </div>
            </div>
          </Panel>
        )}
        
        {/* Template Selection Modal */}
        {templateModalOpen && (
          <Panel position="top-left" className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            <div className="bg-white rounded-xl shadow-2xl w-[800px] p-6 animate-scale-in">
              <h2 className="text-xl font-bold mb-4">Escolher Template</h2>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => onLoadTemplate('imobiliaria')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <h3 className="text-lg font-semibold mb-2">Imobiliária</h3>
                  <p className="text-sm text-gray-600">Template para atendimento de imobiliária com fluxos para compra e aluguel de imóveis.</p>
                </div>
                <div 
                  onClick={() => onLoadTemplate('coworking')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <h3 className="text-lg font-semibold mb-2">Coworking</h3>
                  <p className="text-sm text-gray-600">Template para espaços de coworking com fluxos para informações sobre planos e visitas.</p>
                </div>
                <div 
                  onClick={() => onLoadTemplate('clinica')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <h3 className="text-lg font-semibold mb-2">Clínica</h3>
                  <p className="text-sm text-gray-600">Template para clínicas médicas com fluxos para agendamento de consultas e informações.</p>
                </div>
                <div 
                  onClick={() => onLoadTemplate('marketing')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <h3 className="text-lg font-semibold mb-2">Agência de Marketing</h3>
                  <p className="text-sm text-gray-600">Template para agências de marketing digital com fluxos para diversos serviços.</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                  onClick={() => setTemplateModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </Panel>
        )}

        {/* Card Type Selector Modal */}
        {cardTypeSelectorOpen && (
          <CardTypeSelector 
            onSelect={handleCardTypeSelect}
            onClose={() => setCardTypeSelectorOpen(false)}
          />
        )}
      </ReactFlow>
    </div>
  );
};

const FlowEditorWithProvider: React.FC<FlowEditorProps> = (props) => {
  return (
    <ReactFlowProvider>
      <FlowEditor {...props} />
    </ReactFlowProvider>
  );
};

export default FlowEditorWithProvider;
