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
import { FlowCard, FlowConnection, FlowData, CardType, OutputPort, ConnectionType } from '@/utils/flowTypes';
import FlowCardComponent from './FlowCard';
import FlowConnector from './FlowConnector';
import FlowControls from './FlowControls';
import { initialFlowData } from '@/utils/initialData';
import { nanoid } from 'nanoid';
import CardTypeSelector, { cardTypeLabels } from './CardTypeSelector';

import 'reactflow/dist/style.css';

// Template data
const templates = {
  imobiliaria: {
    cards: [
      {
        id: "imob-1",
        title: "Boas-vindas Imobiliária",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo à Imobiliária Exemplo. Como posso ajudar você hoje? Está procurando imóveis para compra, venda ou aluguel?",
        position: { x: 71, y: 32 },
        type: "initial" as const,
        outputPorts: [
          { id: "port-imob1-1", label: "Procurando imóvel para compra" },
          { id: "port-imob1-2", label: "Procurando imóvel para aluguel" },
          { id: "port-imob1-3", label: "Quero vender/alugar meu imóvel" }
        ]
      },
      {
        id: "imob-2",
        title: "Compra de Imóvel",
        description: "Cliente quer comprar imóvel",
        content: "Ótimo! Temos diversas opções para compra. Qual tipo de imóvel você está procurando? Apartamento, casa, terreno?",
        position: { x: 433, y: 63 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-imob2-1", label: "Apartamento" },
          { id: "port-imob2-2", label: "Casa" },
          { id: "port-imob2-3", label: "Terreno" }
        ]
      },
      {
        id: "imob-3",
        title: "Aluguel de Imóvel",
        description: "Cliente quer alugar imóvel",
        content: "Temos ótimas opções para locação. Qual tipo de imóvel você está procurando para alugar?",
        position: { x: 483, y: 300 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-imob3-1", label: "Residencial" },
          { id: "port-imob3-2", label: "Comercial" }
        ]
      },
      {
        id: "imob-4",
        title: "Vender/Alugar Imóvel",
        description: "Cliente quer anunciar imóvel",
        content: "Podemos ajudá-lo a vender ou alugar seu imóvel. Por favor, me diga qual seu interesse.",
        position: { x: 483, y: 491 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-imob4-1", label: "Vender meu imóvel" },
          { id: "port-imob4-2", label: "Colocar para aluguel" }
        ]
      },
      {
        id: "imob-5",
        title: "Finalização",
        description: "Encerramento do atendimento",
        content: "Obrigado pelo seu interesse. Um de nossos corretores entrará em contato em breve para dar continuidade ao seu atendimento.",
        position: { x: 789, y: 250 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "imob-conn-1", start: "imob-1", end: "imob-2", type: "custom" as const, sourceHandle: "port-imob1-1", sourcePortLabel: "Procurando imóvel para compra" },
      { id: "imob-conn-2", start: "imob-1", end: "imob-3", type: "custom" as const, sourceHandle: "port-imob1-2", sourcePortLabel: "Procurando imóvel para aluguel" },
      { id: "imob-conn-3", start: "imob-1", end: "imob-4", type: "custom" as const, sourceHandle: "port-imob1-3", sourcePortLabel: "Quero vender/alugar meu imóvel" },
      { id: "imob-conn-4", start: "imob-2", end: "imob-5", type: "custom" as const, sourceHandle: "port-imob2-1", sourcePortLabel: "Apartamento" },
      { id: "imob-conn-5", start: "imob-3", end: "imob-5", type: "custom" as const, sourceHandle: "port-imob3-1", sourcePortLabel: "Residencial" },
      { id: "imob-conn-6", start: "imob-4", end: "imob-5", type: "custom" as const, sourceHandle: "port-imob4-1", sourcePortLabel: "Vender meu imóvel" }
    ]
  },
  coworking: {
    cards: [
      {
        id: "cowork-1",
        title: "Boas-vindas Coworking",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo ao Espaço Colaborativo. Como posso ajudar você hoje? Está interessado em conhecer nossos planos ou agendar uma visita?",
        position: { x: 71, y: 32 },
        type: "initial" as const,
        outputPorts: [
          { id: "port-cowork1-1", label: "Quero conhecer os planos" },
          { id: "port-cowork1-2", label: "Quero agendar uma visita" }
        ]
      },
      {
        id: "cowork-2",
        title: "Interesse em Planos",
        description: "Cliente interessado nos planos",
        content: "Temos diversos planos para atender suas necessidades. Temos plano diário, semanal e mensal. Qual deles melhor atende sua necessidade?",
        position: { x: 433, y: 63 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-cowork2-1", label: "Plano diário" },
          { id: "port-cowork2-2", label: "Plano semanal" },
          { id: "port-cowork2-3", label: "Plano mensal" }
        ]
      },
      {
        id: "cowork-3",
        title: "Agendamento de Visita",
        description: "Cliente quer conhecer o espaço",
        content: "Ficaremos felizes em recebê-lo para conhecer nosso espaço. Temos disponibilidade nos seguintes horários: [lista de horários]. Qual seria melhor para você?",
        position: { x: 483, y: 491 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-cowork3-1", label: "Manhã" },
          { id: "port-cowork3-2", label: "Tarde" }
        ]
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
      { id: "cowork-conn-1", start: "cowork-1", end: "cowork-2", type: "custom" as const, sourceHandle: "port-cowork1-1", sourcePortLabel: "Quero conhecer os planos" },
      { id: "cowork-conn-2", start: "cowork-1", end: "cowork-3", type: "custom" as const, sourceHandle: "port-cowork1-2", sourcePortLabel: "Quero agendar uma visita" },
      { id: "cowork-conn-3", start: "cowork-2", end: "cowork-4", type: "custom" as const, sourceHandle: "port-cowork2-1", sourcePortLabel: "Plano diário" },
      { id: "cowork-conn-4", start: "cowork-3", end: "cowork-4", type: "custom" as const, sourceHandle: "port-cowork3-1", sourcePortLabel: "Manhã" }
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
        type: "initial" as const,
        outputPorts: [
          { id: "port-clinic1-1", label: "Agendar consulta" },
          { id: "port-clinic1-2", label: "Dúvidas sobre serviços" }
        ]
      },
      {
        id: "clinic-2",
        title: "Agendamento de Consulta",
        description: "Paciente deseja agendar consulta",
        content: "Para agendar sua consulta, preciso de algumas informações: 1) Qual especialidade médica você procura? 2) Tem preferência de data e horário? 3) Já é paciente da clínica?",
        position: { x: 433, y: 63 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-clinic2-1", label: "Cardiologia" },
          { id: "port-clinic2-2", label: "Dermatologia" },
          { id: "port-clinic2-3", label: "Ortopedia" }
        ]
      },
      {
        id: "clinic-3",
        title: "Informações sobre Serviços",
        description: "Paciente com dúvidas",
        content: "Nossa clínica oferece diversas especialidades médicas, incluindo: cardiologia, dermatologia, ortopedia, e muitas outras. Qual serviço específico você gostaria de saber mais?",
        position: { x: 483, y: 491 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-clinic3-1", label: "Exames laboratoriais" },
          { id: "port-clinic3-2", label: "Cirurgias" },
          { id: "port-clinic3-3", label: "Planos de saúde" }
        ]
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
      { id: "clinic-conn-1", start: "clinic-1", end: "clinic-2", type: "custom" as const, sourceHandle: "port-clinic1-1", sourcePortLabel: "Agendar consulta" },
      { id: "clinic-conn-2", start: "clinic-1", end: "clinic-3", type: "custom" as const, sourceHandle: "port-clinic1-2", sourcePortLabel: "Dúvidas sobre serviços" },
      { id: "clinic-conn-3", start: "clinic-2", end: "clinic-4", type: "custom" as const, sourceHandle: "port-clinic2-1", sourcePortLabel: "Cardiologia" },
      { id: "clinic-conn-4", start: "clinic-3", end: "clinic-4", type: "custom" as const, sourceHandle: "port-clinic3-1", sourcePortLabel: "Exames laboratoriais" }
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
        type: "initial" as const,
        outputPorts: [
          { id: "port-mkt1-1", label: "Presença online" },
          { id: "port-mkt1-2", label: "Campanha específica" }
        ]
      },
      {
        id: "mkt-2",
        title: "Presença Online",
        description: "Cliente interessado em presença digital",
        content: "Para melhorar sua presença online, oferecemos serviços de otimização de SEO, gestão de redes sociais e marketing de conteúdo. Qual aspecto é mais urgente para seu negócio?",
        position: { x: 433, y: 63 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-mkt2-1", label: "SEO" },
          { id: "port-mkt2-2", label: "Redes sociais" },
          { id: "port-mkt2-3", label: "Marketing de conteúdo" }
        ]
      },
      {
        id: "mkt-3",
        title: "Campanhas Específicas",
        description: "Cliente interessado em campanhas",
        content: "Desenvolvemos campanhas personalizadas para diversos objetivos: lançamento de produtos, aumento de vendas, reconhecimento de marca. Qual é o principal objetivo da sua campanha?",
        position: { x: 483, y: 491 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-mkt3-1", label: "Lançamento de produto" },
          { id: "port-mkt3-2", label: "Aumento de vendas" },
          { id: "port-mkt3-3", label: "Reconhecimento de marca" }
        ]
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
      { id: "mkt-conn-1", start: "mkt-1", end: "mkt-2", type: "custom" as const, sourceHandle: "port-mkt1-1", sourcePortLabel: "Presença online" },
      { id: "mkt-conn-2", start: "mkt-1", end: "mkt-3", type: "custom" as const, sourceHandle: "port-mkt1-2", sourcePortLabel: "Campanha específica" },
      { id: "mkt-conn-3", start: "mkt-2", end: "mkt-4", type: "custom" as const, sourceHandle: "port-mkt2-1", sourcePortLabel: "SEO" },
      { id: "mkt-conn-4", start: "mkt-3", end: "mkt-4", type: "custom" as const, sourceHandle: "port-mkt3-1", sourcePortLabel: "Lançamento de produto" }
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
    sourceHandle: connection.sourceHandle || connection.type, // Use source handle or connection type
    data: { 
      type: connection.type,
      portLabel: connection.sourcePortLabel // Include the port label
    },
    style: {
      strokeWidth: 3,
      stroke: connection.type === 'positive' ? '#10B981' : 
              connection.type === 'negative' ? '#EF4444' : 
              connection.type === 'custom' ? '#3B82F6' : '#6B7280',
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
      let connectionType: ConnectionType = 'custom'; // Default to custom for new system
      let portLabel: string | undefined;
      
      // For backward compatibility
      if (sourceHandleId === 'positive') {
        connectionType = 'positive';
      } else if (sourceHandleId === 'negative') {
        connectionType = 'negative';
      } else if (sourceHandleId) {
        // Find the source node and get the port label
        const sourceNode = nodes.find(node => node.id === connection.source);
        if (sourceNode && sourceNode.data.outputPorts) {
          const port = sourceNode.data.outputPorts.find((p: OutputPort) => p.id === sourceHandleId);
          if (port) {
            portLabel = port.label;
          }
        }
      }
      
      const newEdge: Edge = {
        ...connection,
        id: `edge-${nanoid(6)}`,
        type: 'flowConnector',
        sourceHandle: sourceHandleId,
        data: { 
          type: connectionType,
          portLabel 
        },
        style: {
          strokeWidth: 3,
          stroke: connectionType === 'positive' ? '#10B981' : 
                  connectionType === 'negative' ? '#EF4444' : 
                  connectionType === 'custom' ? '#3B82F6' : '#6B7280',
        },
      };
      
      setEdges((eds) => addEdge(newEdge, eds));
      
      toast({
        title: 'Conexão Criada',
        description: portLabel 
          ? `Conexão "${portLabel}" adicionada ao fluxo.`
          : `Conexão adicionada ao fluxo.`,
        duration: 2000,
      });
    },
    [setEdges, toast, nodes]
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
      outputPorts: node.data.outputPorts, // Include output ports
      fields: { ...node.data.fields }
    }));

    // Convert edges back to connections
    const connections: FlowConnection[] = edges.map((edge) => ({
      id: edge.id,
      start: edge.source,
      end: edge.target,
      type: (edge.data?.type || 'custom') as ConnectionType,
      sourceHandle: edge.sourceHandle,
      sourcePortLabel: edge.data?.portLabel,
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

      // Convert connections to edges with sourceHandle and port labels
      const newEdges: Edge[] = parsedData.connections.map((connection: FlowConnection) => ({
        id: connection.id,
        source: connection.start,
        target: connection.end,
        type: 'flowConnector',
        sourceHandle: connection.sourceHandle || connection.type, // Use source handle or connection type
        data: { 
          type: connection.type,
          portLabel: connection.sourcePortLabel 
        },
        style: {
          strokeWidth: 3,
          stroke: connection.type === 'positive' ? '#10B981' : 
                  connection.type === 'negative' ? '#EF4444' : 
                  connection.type === 'custom' ? '#3B82F6' : '#6B7280',
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
      outputPorts: node.data.outputPorts,
      fields: { ...node.data.fields }
    }));

    // Convert edges back to connections
    const connections: FlowConnection[] = edges.map((edge) => ({
      id: edge.id,
      start: edge.source,
      end: edge.target,
      type: (edge.data?.type || 'custom') as ConnectionType,
      sourceHandle: edge.sourceHandle,
      sourcePortLabel: edge.data?.portLabel,
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

  // Generate script with output port labels
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
        // Get all connections with their target and port labels
        nodeConnections.forEach(connection => {
          const targetNode = nodes.find(n => n.id === connection.target);
          const targetId = idMap.get(connection.target) || '00';
          const portLabel = connection.data?.portLabel || 'Opção não especificada';
          
          if (targetNode) {
            script += `🔹 **Se o usuário ${portLabel}** → Seguir para **ID: ${targetId}**\n`;
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
      sourceHandle: connection.sourceHandle || connection.type, // Set sourceHandle to connection type
      data: { 
        type: connection.type,
        portLabel: connection.sourcePortLabel 
      },
      style: {
        strokeWidth: 3,
        // Using a function to handle the type comparison safely
        stroke: (() => {
          if (connection.type === 'positive') return '#10B981';
          if (connection.type === 'negative') return '#EF4444';
          if (connection.type === 'custom') return '#3B82F6';
          return '#6B7280'; // default for neutral or any other type
        })(),
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
        outputPorts: type !== 'end' ? [
          { id: `port-${nanoid(6)}`, label: "Opção 1" },
          { id: `port-${nanoid(6)}`, label: "Opção 2" }
        ] : [],
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
