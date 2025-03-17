
// Add 'profile' to the CardType union type
export type CardType = 
  'initial' | 'regular' | 'end' | 
  'multipla-escolha' | 'pergunta-respostas' | 'confirmacao' | 'acao' | 'duvidas' |
  'pessoa' | 'empresa' | 'contato' |
  'produto' | 'servico' | 'ordem-servico' |
  'imovel' | 'imovel-lancamento' | 'imovel-usado' | 'imovel-comercial' |
  'agendamento' | 'calendario' | 'hora' |
  'localizacao' | 'mapa' |
  'pagamento' | 'preco' | 'financiamento' |
  'documento' | 'formulario' | 'feedback' |
  'integracao' | 'api' |
  'solucoes' | 'chamado' | 'faq' | 'arquivo' |
  'profile'; // Added 'profile' as a card type

export interface Position {
  x: number;
  y: number;
}

export interface CardData {
  id: string;
  type: CardType;
  position: Position;
  title: string;
  description?: string;
  content?: string;
  fields?: Record<string, any>;
}

export interface FlowData {
  cards: CardData[];
  edges: Edge[];
  profile?: {
    name?: string;
    profession?: string;
    company?: string;
    contacts?: string;
    avatar?: string;
    guidelines?: string;
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
}
