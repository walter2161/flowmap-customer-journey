
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
  | 'arquivo';

export type ConnectionType = 'positive' | 'negative' | 'neutral' | 'custom';

// Type for output ports
export interface OutputPort {
  id: string;
  label: string;
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
  position: { x: number; y: number };
  type: CardType;
  outputPorts?: OutputPort[];
  fields?: Record<string, any>;
  files?: {
    id: string;
    name: string;
    type: string;
    content?: string;
    url?: string;
  }[];
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
