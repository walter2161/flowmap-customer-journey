
// Define types for flow cards and connections
export type CardType = 
  | 'initial' 
  | 'regular' 
  | 'end' 
  | 'imovel' 
  | 'servico' 
  | 'produto' 
  | 'multipla-escolha' 
  | 'pergunta-respostas' 
  | 'contatos' 
  | 'agendar' 
  | 'ordem-servico' 
  | 'briefing' 
  | 'acao' 
  | 'html' 
  | 'imovel-lancamento' 
  | 'imovel-usado' 
  | 'imovel-comercial' 
  | 'agendar-visita' 
  | 'agendar-reuniao'
  | 'confirmacao'
  | 'documentacao'
  | 'duvidas'
  | 'detalhes'
  | 'orcamento'
  | 'carrinho'
  | 'checkout'
  | 'pedido'
  | 'problema'
  | 'solucoes'
  | 'chamado'
  | 'faq'
  | 'arquivo'
  | 'profile';  // Added 'profile' as a card type

export type ConnectionType = 'positive' | 'negative' | 'neutral' | 'custom';

// Type for output ports
export interface OutputPort {
  id: string;
  label: string;
}

// Type for the position
export interface Position {
  x: number;
  y: number;
}

// Type for the assistant profile
export interface AssistantProfile {
  name: string;
  profession: string;
  company: string;
  contacts: string;
  avatar: string;
  guidelines: string;
  scriptGuidelines?: string[]; // Array of guidelines specifically for script generation
}

// Type for flow cards
export interface FlowCard {
  id: string;
  title: string;
  description: string;
  content: string;
  position: Position;
  type: CardType;
  outputPorts?: OutputPort[];
  fields?: Record<string, any>;
  files?: any[]; // For the arquivo card type
}

// Type for flow connections
export interface FlowConnection {
  id: string;
  start: string;
  end: string;
  type: ConnectionType;
  sourceHandle?: string;
  sourcePortLabel?: string;
}

// Type for flow data
export interface FlowData {
  cards: FlowCard[];
  connections: FlowConnection[];
  profile?: AssistantProfile;
}

// Add compatibility with new edge type for ReactFlow
export interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

// Add compatibility with new CardData type
export interface CardData {
  id: string;
  type: CardType;
  position: Position;
  title: string;
  description?: string;
  content?: string;
  fields?: Record<string, any>;
}
