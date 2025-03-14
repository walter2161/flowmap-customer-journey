
export type CardType = 'initial' | 'regular' | 'end' | 'imovel' | 'servico' | 'produto' | 'multipla-escolha' | 'pergunta-respostas' | 'contatos' | 'agendar' | 'ordem-servico' | 'briefing' | 'acao' | 'html' | 'imovel-lancamento' | 'imovel-usado' | 'imovel-comercial' | 'agendar-visita' | 'agendar-reuniao';
export type ConnectionType = 'positive' | 'negative' | 'neutral' | 'custom';

export interface Position {
  x: number;
  y: number;
}

export interface OutputPort {
  id: string;
  label: string;
}

export interface FlowCard {
  id: string;
  title: string;
  description: string;
  content: string;
  position: Position;
  type: CardType;
  outputPorts?: OutputPort[]; // Adding output ports array
  fields?: any; // Additional fields specific to the card type
}

export interface FlowConnection {
  id: string;
  start: string;
  end: string;
  type: ConnectionType;
  sourceHandle?: string; // Used for the port ID
  sourcePortLabel?: string; // Used for displaying the port label
}

export interface FlowData {
  cards: FlowCard[];
  connections: FlowConnection[];
}

export interface FlowCardNode extends FlowCard {
  data: FlowCard;
  position: Position;
}

export interface FlowConnectionEdge extends FlowConnection {
  source: string;
  target: string;
  type: ConnectionType;
  data?: {
    type: ConnectionType;
    portLabel?: string;
  };
}
