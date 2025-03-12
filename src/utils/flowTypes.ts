
export type CardType = 'initial' | 'regular' | 'end' | 'imovel' | 'servico' | 'produto' | 'multipla-escolha' | 'pergunta-respostas' | 'contatos' | 'agendar' | 'ordem-servico' | 'briefing' | 'acao' | 'html';
export type ConnectionType = 'positive' | 'negative' | 'neutral';

export interface Position {
  x: number;
  y: number;
}

export interface FlowCard {
  id: string;
  title: string;
  description: string;
  content: string;
  position: Position;
  type: CardType;
  fields?: any; // Additional fields specific to the card type
}

export interface FlowConnection {
  id: string;
  start: string;
  end: string;
  type: ConnectionType;
  sourceHandle?: string; // Adding the sourceHandle property as optional
}

export interface FlowData {
  cards: FlowCard[];
  connections: FlowConnection[];
}

// ReactFlow specific interfaces
export interface FlowCardNode {
  id: string;
  type: string;
  position: Position;
  data: FlowCard;
  draggable?: boolean;
}

export interface FlowConnectionEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  sourceHandle?: string;
  data?: {
    type: ConnectionType;
  };
}
