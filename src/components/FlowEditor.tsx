
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

import 'reactflow/dist/style.css';

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
  const [jsonInput, setJsonInput] = useState('');

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
