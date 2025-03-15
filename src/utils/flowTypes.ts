
import { CSSProperties } from 'react';

export interface Position {
  x: number;
  y: number;
}

export type CardType = 
  | 'initial' 
  | 'message' 
  | 'question' 
  | 'condition' 
  | 'action' 
  | 'product' 
  | 'service' 
  | 'contact' 
  | 'imovel' 
  | 'servico' 
  | 'agendar-visita' 
  | 'confirmacao' 
  | 'documentacao' 
  | 'duvidas' 
  | 'contatos' 
  | 'detalhes' 
  | 'ordem-servico' 
  | 'orcamento' 
  | 'produto' 
  | 'carrinho' 
  | 'checkout' 
  | 'pedido' 
  | 'problema' 
  | 'solucoes' 
  | 'chamado' 
  | 'faq'
  | 'regular'
  | 'end'
  | 'imovel-lancamento'
  | 'imovel-usado'
  | 'imovel-comercial'
  | 'agendar-reuniao'
  | 'multipla-escolha'
  | 'pergunta-respostas'
  | 'agendar'
  | 'briefing'
  | 'acao'
  | 'html';

export interface Port {
  id: string;
  label: string;
}

// Define OutputPort as alias to Port for better semantic meaning
export type OutputPort = Port;

export interface FlowCardFields {
  [key: string]: string | number | boolean | string[];
}

export interface FlowCard {
  id: string;
  type: CardType;
  title: string;
  description: string;
  content: string;
  position: Position;
  fields: FlowCardFields;
  outputPorts: OutputPort[];
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
