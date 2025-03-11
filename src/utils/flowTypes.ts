
export type CardType = 'initial' | 'regular' | 'end' | 'property' | 'service' | 'product' | 'action' | 'multiple' | 'payment' | 'scheduling' | 'qa' | 'contact';
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
}

export interface FlowConnection {
  id: string;
  start: string;
  end: string;
  type: ConnectionType;
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
  };
}
