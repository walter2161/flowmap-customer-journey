
import { CSSProperties } from 'react';

export interface Position {
  x: number;
  y: number;
}

export type CardType = 'initial' | 'message' | 'question' | 'condition' | 'action' | 'product' | 'service' | 'contact' | 'imovel' | 'servico' | 'agendar-visita' | 'confirmacao' | 'documentacao' | 'duvidas' | 'contatos' | 'detalhes' | 'ordem-servico' | 'orcamento' | 'produto' | 'carrinho' | 'checkout' | 'pedido' | 'problema' | 'solucoes' | 'chamado' | 'faq';

export interface Port {
  id: string;
  label: string;
}

export interface FlowCardFields {
  [key: string]: string | number;
}

export interface FlowCard {
  id: string;
  type: CardType;
  title: string;
  description: string;
  content: string;
  position: Position;
  fields: FlowCardFields;
  outputPorts: Port[];
  style?: CSSProperties;
}

export interface FlowConnection {
  id: string;
  start: string;
  end: string;
  type: ConnectionType;
  sourceHandle?: string;
  sourcePortLabel?: string;
}

export type ConnectionType = 'positive' | 'negative' | 'neutral' | 'custom';

export interface AssistantProfile {
  name: string;
  profession: string;
  company: string;
  contacts: string;
  guidelines: string;
  avatar: string;
}

export interface FlowData {
  cards: FlowCard[];
  connections: FlowConnection[];
  profile?: AssistantProfile;
}
