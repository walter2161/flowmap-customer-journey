
import { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, addEdge, Connection, Edge } from 'reactflow';
import { FlowData, FlowCard, AssistantProfile } from '@/utils/flowTypes';
import { nanoid } from 'nanoid';
import { useToast } from "@/components/ui/use-toast";

export const useFlowData = (initialData: FlowData) => {
  const { toast } = useToast();
  
  // State for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // State for assistant profile
  const [currentProfile, setCurrentProfile] = useState<AssistantProfile | undefined>(initialData.profile);
  
  // Initialize flow data
  useEffect(() => {
    if (initialData) {
      // Convert cards to nodes, ensuring each card has a distinct position
      const flowNodes = initialData.cards.map(card => ({
        id: card.id,
        type: 'flowCard',
        // Ensure position exists and is not zero
        position: card.position && card.position.x !== 0 && card.position.y !== 0 
          ? card.position 
          : { x: 0, y: 0 }, // This will be replaced by distributeNodes
        data: {
          ...card,
          // Make sure the position is included in the data
          position: card.position && card.position.x !== 0 && card.position.y !== 0 
            ? card.position 
            : { x: 0, y: 0 } // This will be replaced
        }
      }));
      
      // Always distribute nodes to ensure proper layout and prevent stacking
      const positionedNodes = distributeNodes(flowNodes);
      
      setNodes(positionedNodes);
      setEdges(initialData.connections.map(conn => ({
        id: conn.id,
        source: conn.start,
        target: conn.end,
        type: 'flowConnector',
        sourceHandle: conn.sourceHandle,
        data: {
          type: conn.type,
          sourcePortLabel: conn.sourcePortLabel
        }
      })));
      
      // Set the profile if it exists in the initialData
      if (initialData.profile) {
        setCurrentProfile(initialData.profile);
      }
    }
  }, [initialData, setNodes, setEdges]);
  
  // Completely rewritten function to distribute nodes with proper spacing and collision detection
  const distributeNodes = (nodes) => {
    // Define base positions for different node types with more spacing between them
    const typePositions = {
      'initial': { x: -339, y: -77 },         // Boas-vindas
      'servico': { x: 90, y: -176 },          // Services (like Corte de Cabelo)
      'agendar': { x: 1244, y: 88 },          // Agendar Horário
      'confirmacao': { x: 1783, y: 56 },      // Agendamento Confirmado
      'promocao': { x: 154, y: 242 },         // Promoções
      'produto': { x: 938, y: 418 }           // Produtos Profissionais
    };
    
    // Specific service positions for common services - with wider spacing
    const specificServicePositions = {
      'Corte de Cabelo': { x: 90, y: -176 },
      'Coloração': { x: 552, y: -300 },
      'Manicure e Pedicure': { x: 1056, y: -399 },
    };
    
    // Track occupied positions to avoid overlaps
    const occupiedPositions = [];
    
    // Minimum distance between nodes - increased to 150px for better visibility
    const minDistance = 150;
    
    // Create a copy of the nodes with valid positions
    const nodesWithValidPositions = [];
    const nodesWithoutPositions = [];
    
    // First, separate nodes into those with valid positions and those without
    for (const node of nodes) {
      if (
        node.position && 
        typeof node.position.x === 'number' && 
        typeof node.position.y === 'number' && 
        (Math.abs(node.position.x) > 10 || Math.abs(node.position.y) > 10)
      ) {
        nodesWithValidPositions.push(node);
      } else {
        nodesWithoutPositions.push(node);
      }
    }
    
    // Function to check if a position is too close to any occupied position
    const isTooClose = (pos) => {
      return occupiedPositions.some(occupiedPos => {
        const distance = Math.sqrt(
          Math.pow(occupiedPos.x - pos.x, 2) + 
          Math.pow(occupiedPos.y - pos.y, 2)
        );
        return distance < minDistance;
      });
    };
    
    // Function to find a safe position that doesn't overlap with others
    const findSafePosition = (basePos, attempts = 0) => {
      // If this is a valid position, return it
      if (!isTooClose(basePos)) {
        return basePos;
      }
      
      // If we've tried too many times, add some random offset
      if (attempts > 15) {
        const randomOffset = 150 + Math.random() * 300;
        const randomAngle = Math.random() * Math.PI * 2;
        return {
          x: basePos.x + Math.cos(randomAngle) * randomOffset,
          y: basePos.y + Math.sin(randomAngle) * randomOffset
        };
      }
      
      // Try shifting the position in a spiral pattern
      const angle = (Math.PI * 2 * attempts) / 8; // 8 directions
      const radius = minDistance * (1 + Math.floor(attempts / 8)); // Increase radius after going around once
      
      const newPos = {
        x: basePos.x + Math.cos(angle) * radius,
        y: basePos.y + Math.sin(angle) * radius
      };
      
      return findSafePosition(newPos, attempts + 1);
    };
    
    // First process nodes with valid positions
    for (const node of nodesWithValidPositions) {
      const safePosition = findSafePosition(node.position);
      occupiedPositions.push(safePosition);
      
      node.position = safePosition;
      node.data.position = safePosition;
    }
    
    // Track counts for different types
    let typeCounts = {
      servico: 0,
      promocao: 0,
      produto: 0,
      default: 0
    };
    
    // Process nodes without positions
    for (const node of nodesWithoutPositions) {
      const nodeType = node.data.type || 'default';
      const nodeTitle = node.data.title || '';
      
      // Determine the base position based on node type and title
      let basePosition;
      
      if (specificServicePositions[nodeTitle]) {
        // If this is a known service with a specific position
        basePosition = { ...specificServicePositions[nodeTitle] };
      } else if (nodeType === 'servico') {
        // Position services with consistent offset
        basePosition = {
          x: typePositions.servico.x + (typeCounts.servico * 180),
          y: typePositions.servico.y - (typeCounts.servico * 120)
        };
        typeCounts.servico++;
      } else if (typePositions[nodeType]) {
        // For other known types, offset from the base position
        const basePos = typePositions[nodeType];
        basePosition = {
          x: basePos.x + (typeCounts[nodeType] || 0) * 180,
          y: basePos.y + (typeCounts[nodeType] || 0) * 100
        };
        typeCounts[nodeType] = (typeCounts[nodeType] || 0) + 1;
      } else {
        // Default positioning for unknown types
        basePosition = {
          x: 200 + (typeCounts.default * 220),
          y: 100 + (typeCounts.default * 150)
        };
        typeCounts.default++;
      }
      
      // Find a safe position that doesn't overlap with others
      const safePosition = findSafePosition(basePosition);
      occupiedPositions.push(safePosition);
      
      // Update both node position and the position in the data
      node.position = safePosition;
      node.data.position = safePosition;
    }
    
    // Return all nodes with their updated positions
    return [...nodesWithValidPositions, ...nodesWithoutPositions];
  };
  
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
  
  // Save flow function
  const saveFlow = useCallback(() => {
    if (nodes.length === 0) return;
    
    // Convert nodes to cards, ensuring positions are saved
    const cards = nodes.map(node => ({
      ...node.data,
      position: node.position // Ensure we use the latest position from the node
    }));
    
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

    return flowData;
  }, [nodes, edges, currentProfile, toast]);
  
  // Prepare export data
  const prepareExportData = useCallback(() => {
    if (nodes.length === 0) return null;
    
    // Convert nodes to cards, ensuring positions are saved
    const cards = nodes.map(node => ({
      ...node.data,
      position: node.position // Ensure we use the latest position from the node
    }));
    
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
  
  // Process imported data
  const processImportedData = useCallback((jsonData: FlowData) => {
    // Convert cards to nodes, ensuring positions are preserved
    const flowNodes = jsonData.cards.map(card => {
      // Make sure position exists and is valid
      const position = card.position && typeof card.position.x === 'number' && typeof card.position.y === 'number'
        ? card.position
        : { x: 0, y: 0 };
      
      return {
        id: card.id,
        type: 'flowCard',
        position: position,
        data: {
          ...card,
          position: position // Ensure position is in data too
        }
      };
    });
    
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
    
    // Apply the improved distribution algorithm
    const positionedNodes = distributeNodes(flowNodes);
    
    setNodes(positionedNodes);
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
    
    return true;
  }, [setNodes, setEdges]);
  
  // Generate script
  const generateScript = useCallback(() => {
    if (nodes.length === 0) return null;
    
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
      
      // Process files for arquivo card type
      if (card.type === 'arquivo' && card.files && card.files.length > 0) {
        script += `**Arquivos:**  \n`;
        
        card.files.forEach((file, index) => {
          script += `- **Arquivo ${index + 1}:** ${file.name}  \n`;
          
          if (file.type.startsWith('image/')) {
            script += `  - **Tipo:** Imagem (${file.type})  \n`;
            script += `  - **URL:** ${file.url || 'Não disponível'}  \n`;
          } else {
            script += `  - **Tipo:** Texto (${file.type})  \n`;
            if (file.content) {
              // Format text content as a markdown block
              script += `  - **Conteúdo:**  \n\`\`\`\n${file.content}\n\`\`\`  \n`;
            }
          }
        });
        
        script += '\n';
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
    
    return script;
  }, [nodes, edges, currentProfile]);
  
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
  
  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
    setEdges,
    currentProfile,
    setCurrentProfile,
    saveFlow,
    prepareExportData,
    processImportedData,
    generateScript
  };
};
