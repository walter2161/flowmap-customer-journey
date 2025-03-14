
import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, { MiniMap, Controls, Background, ReactFlowProvider, useNodesState, useEdgesState, addEdge, Connection, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { FlowData, FlowCard, AssistantProfile } from '@/utils/flowTypes';
import FlowCardComponent from './FlowCard';
import FlowConnector from './FlowConnector';
import CardTypeSelector from './CardTypeSelector';
import { nanoid } from 'nanoid';
import FlowControls from './FlowControls';

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
  // State for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // State for selected card type and showing card selector
  const [isCardSelectorOpen, setIsCardSelectorOpen] = useState(false);
  const [newCardPosition, setNewCardPosition] = useState({ x: 0, y: 0 });
  
  // State for template modal
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
  
  // State for assistant profile
  const [currentProfile, setCurrentProfile] = useState<AssistantProfile | undefined>(initialData.profile);
  
  // ReactFlow instance ref
  const reactFlowInstance = useRef(null);
  
  // Initialize flow data
  useCallback(() => {
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
    alert('Flow saved successfully!');
  }, [nodes, edges, currentProfile]);
  
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
        alert('Flow loaded successfully!');
      } catch (error) {
        console.error('Error loading flow:', error);
        alert('Error loading flow!');
      }
    } else {
      alert('No saved flow found!');
    }
  }, [setNodes, setEdges]);
  
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
  }, [nodes, edges, currentProfile]);
  
  // Generate script function
  const onGenerateScript = useCallback(() => {
    if (nodes.length === 0) return;
    
    // Convert flow to script text
    let script = '';
    
    // Add assistant profile information if available
    if (currentProfile) {
      script += `# Bot Profile\n`;
      script += `Name: ${currentProfile.name}\n`;
      script += `Profession: ${currentProfile.profession}\n`;
      script += `Company: ${currentProfile.company}\n`;
      script += `Contacts: ${currentProfile.contacts}\n\n`;
      script += `Guidelines:\n${currentProfile.guidelines}\n\n`;
    }
    
    script += `# Flow Script\n\n`;
    
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
    
    // Create a text file and download it
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(script);
    
    const exportFileDefaultName = 'flow-script.txt';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataStr);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [nodes, edges, currentProfile]);
  
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
  }, [newCardPosition, setNodes]);

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
          onInit={instance => { reactFlowInstance.current = instance; }}
        >
          <Controls />
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
            onTemplate={() => setTemplateModalOpen(true)}
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
      </div>
    </ReactFlowProvider>
  );
};

export default FlowEditor;
