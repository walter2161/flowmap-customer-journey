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
import { FlowCard, FlowConnection, FlowData } from '@/utils/flowTypes';
import FlowCardComponent from './FlowCard';
import FlowConnector from './FlowConnector';
import FlowControls from './FlowControls';
import { initialFlowData } from '@/utils/initialData';
import { nanoid } from 'nanoid';
import JSZip from 'jszip';

import 'reactflow/dist/style.css';
import CardTypeSelector, { CardType } from './CardTypeSelector';

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
  const [jsonInput, setJsonInput] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [cardTypeSelectorOpen, setCardTypeSelectorOpen] = useState(false);

  // Convert cards to nodes
  const initialNodes: Node[] = initialData.cards.map((card) => ({
    id: card.id,
    type: 'flowCard',
    position: card.position,
    data: card,
  }));

  // Convert connections to edges with no markers
  const initialEdges: Edge[] = initialData.connections.map((connection) => ({
    id: connection.id,
    source: connection.start,
    target: connection.end,
    type: 'flowConnector',
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

  // Create connections with custom styling
  const onConnect: OnConnect = useCallback(
    (connection) => {
      const sourceHandleId = connection.sourceHandle;
      const connectionType = sourceHandleId === 'positive' ? 'positive' : 
                           sourceHandleId === 'negative' ? 'negative' : 'neutral';
      
      const newEdge: Edge = {
        ...connection,
        id: `edge-${nanoid(6)}`,
        type: 'flowConnector',
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

  // Handle JSON import
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

      // Convert connections to edges without markers
      const newEdges: Edge[] = parsedData.connections.map((connection: FlowConnection) => ({
        id: connection.id,
        source: connection.start,
        target: connection.end,
        type: 'flowConnector',
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

  // Generate AI script from flow
  const onGenerateScript = useCallback(() => {
    // Convert nodes to a readable script
    let script = "# Script de Atendimento Detalhado\n\n";
    
    // Find initial nodes
    const initialNodes = nodes.filter(node => node.data.type === 'initial');
    
    if (initialNodes.length === 0) {
      script += "Este fluxo não possui um ponto de início definido.\n\n";
    } else {
      // Process each initial node
      initialNodes.forEach(startNode => {
        script += `## Início: ${startNode.data.title}\n\n`;
        script += `### Descrição\n${startNode.data.description}\n\n`;
        script += `### Mensagem Inicial\n${startNode.data.content}\n\n`;
        
        // Find connections from this node
        const nodeConnections = edges.filter(edge => edge.source === startNode.id);
        
        if (nodeConnections.length > 0) {
          script += "### Possíveis Caminhos\n\n";
          
          // Process each connection
          nodeConnections.forEach(connection => {
            const targetNode = nodes.find(node => node.id === connection.target);
            const responseType = connection.data?.type === 'positive' ? 'Positiva' : 
                                connection.data?.type === 'negative' ? 'Negativa' : 'Neutra';
            
            if (targetNode) {
              script += `#### Resposta ${responseType}: ${targetNode.data.title}\n\n`;
              script += `* **Descrição**: ${targetNode.data.description}\n`;
              script += `* **Conteúdo**: ${targetNode.data.content}\n\n`;
              
              // Recursively process next nodes (simplified, doesn't handle loops)
              const nextConnections = edges.filter(edge => edge.source === targetNode.id);
              if (nextConnections.length > 0) {
                script += "* **Próximos Passos**:\n";
                nextConnections.forEach(nextConn => {
                  const nextNode = nodes.find(node => node.id === nextConn.target);
                  if (nextNode) {
                    script += `  * ${nextNode.data.title}\n`;
                  }
                });
                script += "\n";
              } else if (targetNode.data.type === 'end') {
                script += "* **Finalização do Atendimento**\n\n";
              }
            }
          });
        }
      });
    }
    
    // Add general guidelines for AI
    script += "## Diretrizes Gerais para Assistente AI\n\n";
    script += "1. **Saudação**: Sempre inicie a conversa de forma educada e amigável.\n";
    script += "2. **Personalização**: Use o nome do cliente quando disponível.\n";
    script += "3. **Clareza**: Seja objetivo e claro em todas as respostas.\n";
    script += "4. **Empatia**: Demonstre compreensão às necessidades do cliente.\n";
    script += "5. **Flexibilidade**: Adapte-se às perguntas fora do fluxo principal.\n";
    script += "6. **Conclusão**: Sempre finalize verificando se há mais alguma dúvida.\n\n";
    
    script += "## Respostas para Perguntas Frequentes\n\n";
    
    // Generate some generic FAQs based on the node contents
    const topics = nodes.map(node => node.data.title.toLowerCase());
    const uniqueTopics = [...new Set(topics)];
    
    uniqueTopics.slice(0, 5).forEach(topic => {
      script += `### Sobre ${topic.charAt(0).toUpperCase() + topic.slice(1)}\n`;
      script += `Q: Quais são os detalhes sobre ${topic}?\n`;
      script += `A: Base sua resposta no conteúdo dos cartões relacionados a este tópico.\n\n`;
    });
    
    setGeneratedScript(script);
    setScriptModalOpen(true);
  }, [nodes, edges]);

  // Load template
  const onLoadTemplate = useCallback((templateName: keyof typeof templates) => {
    const templateData = templates[templateName];
    
    // Convert template cards to nodes
    const newNodes: Node[] = templateData.cards.map((card) => ({
      id: card.id,
      type: 'flowCard',
      position: card.position,
      data: card,
    }));

    // Convert template connections to edges
    const newEdges: Edge[] = templateData.connections.map((connection) => ({
      id: connection.id,
      source: connection.start,
      target: connection.end,
      type: 'flowConnector',
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

  // Add this new function to handle new card creation
  const handleNewCard = () => {
    setCardTypeSelectorOpen(true);
  };

  // Add this function to handle card type selection
  const handleCardTypeSelect = (type: CardType) => {
    const newNode = {
      id: `node-${nanoid(6)}`,
      type: 'flowCard',
      position: { x: 100, y: 100 },
      data: {
        id: `card-${nanoid(6)}`,
        title: 'Novo Cartão',
        description: 'Descrição do cartão',
        content: 'Conteúdo do cartão',
        type: type
      }
    };

    setNodes(nodes => [...nodes, newNode]);
    setCardTypeSelectorOpen(false);
  };

  // Update the backup generation function
  const onGenerateBackup = useCallback(async () => {
    const zip = new JSZip();

    // Add the HTML file
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Backup do Fluxo de Atendimento</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/reactflow@11/dist/style.css"></script>
    <script src="https://unpkg.com/reactflow@11/dist/umd/index.min.js"></script>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="root"></div>
    <script src="app.js"></script>
</body>
</html>`;

    // Add the CSS file
    const cssContent = `
body { margin: 0; font-family: sans-serif; }
.flow-container { width: 100vw; height: 100vh; }
.react-flow__node { background: white; padding: 10px; border-radius: 3px; }
.react-flow__edge-path { stroke: #333; stroke-width: 2; }
.flow-connection-delete-btn { display: none; }
.react-flow__edge:hover .flow-connection-delete-btn { display: block; }`;

    // Add the JS file with the flow data
    const jsContent = `
const flowData = ${JSON.stringify({ nodes, edges }, null, 2)};

// Initialize React Flow
const { ReactFlow, Background, Controls, MiniMap } = ReactFlow;

function Flow() {
    return (
        <ReactFlow
            nodes={flowData.nodes}
            edges={flowData.edges}
            fitView
        >
            <Background />
            <Controls />
            <MiniMap />
        </ReactFlow>
    );
}

ReactDOM.render(
    <Flow />,
    document.getElementById('root')
);`;

    // Add files to the zip
    zip.file('index.html', htmlContent);
    zip.file('styles.css', cssContent);
    zip.file('app.js', jsContent);
    zip.file('flow-data.json', JSON.stringify({ nodes, edges }, null, 2));

    // Generate the zip file
    const content = await zip.generateAsync({ type: 'blob' });
    
    // Create download link
    const url = window.URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flow-backup.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: 'Backup Gerado',
      description: 'Arquivo ZIP de backup do fluxo foi gerado com sucesso.',
      duration: 2000,
    });
  }, [nodes, edges, toast]);

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
          onBackup={onGenerateBackup}
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
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors
