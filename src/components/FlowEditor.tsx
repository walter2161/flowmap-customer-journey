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

  // Generate AI script from flow with detailed pathways
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
        script += `### Tipo de Cartão: ${startNode.data.type}\n\n`;
        
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
              script += `* **Conteúdo**: ${targetNode.data.content}\n`;
              script += `* **Tipo de Cartão**: ${targetNode.data.type}\n`;
              script += `* **ID da Conexão**: ${connection.id}\n`;
              script += `* **Tipo da Conexão**: ${connection.data?.type || 'neutral'}\n\n`;
              
              // Process target node (next level)\n              processNodeConnections(targetNode, 2, script, [startNode.id]);
            }
          });
        }
      });
    }
    
    // Function to recursively process node connections
    function processNodeConnections(node, level, scriptText, visitedNodes = []) {
      if (visitedNodes.includes(node.id)) {
        return "* **Ciclo detectado**\n\n";
      }
      
      const newVisitedNodes = [...visitedNodes, node.id];
      const nodeConnections = edges.filter(edge => edge.source === node.id);
      let pathText = "";
      
      if (nodeConnections.length > 0) {
        pathText += `${"#".repeat(level + 2)} Próximos passos a partir de ${node.data.title}\n\n`;
        
        nodeConnections.forEach(connection => {
          const targetNode = nodes.find(n => n.id === connection.target);
          const responseType = connection.data?.type === 'positive' ? 'Positiva' : 
                              connection.data?.type === 'negative' ? 'Negativa' : 'Neutra';
          
          if (targetNode) {
            pathText += `* **Caminho ${responseType}**: ${targetNode.data.title}\n`;
            pathText += `  * **Descrição**: ${targetNode.data.description}\n`;
            pathText += `  * **Conteúdo**: ${targetNode.data.content}\n`;
            pathText += `  * **Tipo de Cartão**: ${targetNode.data.type}\n`;
            pathText += `  * **ID da Conexão**: ${connection.id}\n`;
            pathText += `  * **Tipo da Conexão**: ${connection.data?.type || 'neutral'}\n\n`;
            
            // Only go deeper if level is not too high
            if (level < 5) {
              pathText += processNodeConnections(targetNode, level + 1, "", newVisitedNodes);
            }
          }
        });
      } else if (node.data.type === 'end') {
        pathText += "* **Finalização do Atendimento**\n\n";
      }
      
      return pathText;
    }
    
    script += "\n## Mapa Completo de Conexões\n\n";
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        script += `* **${sourceNode.data.title}** (${sourceNode.data.type}) → **${targetNode.data.title}** (${targetNode.data.type})\n`;
        script += `  * **Tipo de Conexão**: ${edge.data?.type || 'neutral'}\n`;
        script += `  * **ID da Conexão**: ${edge.id}\n\n`;
      }
    });
    
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

  // Update the backup generation function to include all necessary files
  const onGenerateBackup = useCallback(async () => {
    const zip = new JSZip();
    
    // Create project structure folders
    const srcFolder = zip.folder("src");
    const componentsFolder = srcFolder.folder("components");
    const utilsFolder = srcFolder.folder("utils");
    const pagesFolder = srcFolder.folder("pages");
    const libFolder = srcFolder.folder("lib");
    const publicFolder = zip.folder("public");
    
    // Add the package.json
    const packageJsonContent = {
      "name": "flow-editor-backup",
      "version": "1.0.0",
      "description": "Backup of Flow Editor project",
      "type": "module",
      "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview"
      },
      "dependencies": {
        "@radix-ui/react-dialog": "^1.1.2",
        "jszip": "^3.10.1",
        "nanoid": "^5.0.1",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.15.0",
        "reactflow": "^11.8.3"
      },
      "devDependencies": {
        "@types/react": "^18.2.15",
        "@types/react-dom": "^18.2.7",
        "@vitejs/plugin-react": "^4.0.3",
        "autoprefixer": "^10.4.14",
        "postcss": "^8.4.27",
        "tailwindcss": "^3.3.3",
        "typescript": "^5.0.2",
        "vite": "^4.4.5"
      }
    };
    
    // Convert current flow data to JSON for saving
    const flowData = {
      cards: nodes.map(node => ({
        id: node.id,
        title: node.data.title,
        description: node.data.description,
        content: node.data.content,
        position: node.position,
        type: node.data.type,
      })),
      connections: edges.map(edge => ({
        id: edge.id,
        start: edge.source,
        end: edge.target,
        type: (edge.data?.type || 'neutral'),
      }))
    };
    
    // Index.html
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Editor de Fluxo de Atendimento</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
    
    // Main.tsx
    const mainTsxContent = `
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)`;
    
    // App.tsx
    const appTsxContent = `
import { Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import { Toaster } from './components/ui/toaster'
import { ReactFlowProvider } from 'reactflow'
import './App.css'

function App() {
  return (
    <>
      <ReactFlowProvider>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </ReactFlowProvider>
      <Toaster />
    </>
  )
}

export default App`;
    
    // App.css
    const appCssContent = `
.react-flow__handle {
  width: 10px;
  height: 10px;
}

.react-flow__handle-right {
  right: -5px;
}

.react-flow__handle-left {
  left: -5px;
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}

@keyframes scale-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.flow-connection-delete-btn {
  opacity: 0;
  transition: opacity 0.2s;
}

.react-flow__edge:hover .flow-connection-delete-btn {
  opacity: 1;
}`;
    
    // Index.css
    const indexCssContent = `
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#root {
  height: 100%;
  width: 100%;
}`;
    
    // Utils.ts
    const utilsContent = `
export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}`;
    
    // Vite config
    const viteConfigContent = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`;
    
    // Tailwind config
    const tailwindConfigContent = `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
    
    // Postcss config
    const postcssConfigContent = `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
    
    // TSConfig
    const tsConfigContent = `
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`;
    
    const tsConfigNodeContent = `
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`;

    // Add all files to the ZIP
    zip.file("package.json", JSON.stringify(packageJsonContent, null, 2));
    zip.file("index.html", htmlContent);
    zip.file("vite.config.ts", viteConfigContent);
    zip.file("tailwind.config.js", tailwindConfigContent);
    zip.file("postcss.config.js", postcssConfigContent);
    zip.file("tsconfig.json", tsConfigContent);
    zip.file("tsconfig.node.json", tsConfigNodeContent);
    zip.file("flow-data.json", JSON.stringify(flowData, null, 2));

    srcFolder.file("main.tsx", mainTsxContent);
    srcFolder.file("App.tsx", appTsxContent);
    srcFolder.file("App.css", appCssContent);
    srcFolder.file("index.css", indexCssContent);
    libFolder.file("utils.ts", utilsContent
