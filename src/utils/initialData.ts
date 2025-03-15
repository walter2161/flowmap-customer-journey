
import { FlowData } from './flowTypes';
import { nanoid } from 'nanoid';

// Standardized grid positioning constants
const GRID_X_START = 100;
const GRID_Y_START = 100;
const GRID_COLUMN_WIDTH = 300;
const GRID_ROW_HEIGHT = 200;

// Helper function to calculate grid positions
const gridPosition = (col: number, row: number) => {
  return {
    x: GRID_X_START + (col * GRID_COLUMN_WIDTH),
    y: GRID_Y_START + (row * GRID_ROW_HEIGHT)
  };
};

// Default assistant profile
const defaultProfile = {
  name: 'Assistente Virtual',
  profession: 'Atendente',
  company: 'Sua Empresa',
  contacts: 'contato@suaempresa.com',
  guidelines: 'Seja cordial e ajude o cliente da melhor forma possível.',
  avatar: '/placeholder.svg'
};

// Initial data for a new flow
export const initialFlowData: FlowData = {
  cards: [
    {
      id: `card-${nanoid(6)}`,
      type: 'initial',
      title: 'Início do Atendimento',
      description: 'Mensagem de boas-vindas',
      content: 'Olá! Como posso ajudar você hoje?',
      position: gridPosition(1, 0),
      fields: {},
      outputPorts: [
        { id: `port-${nanoid(6)}`, label: 'Informações' },
        { id: `port-${nanoid(6)}`, label: 'Dúvidas' },
        { id: `port-${nanoid(6)}`, label: 'Contato' }
      ]
    },
    {
      id: `card-${nanoid(6)}`,
      type: 'message',
      title: 'Informações do Produto',
      description: 'Detalhes sobre nossos produtos',
      content: 'Temos diversos produtos que podem atender suas necessidades. Gostaria de conhecer mais sobre algum específico?',
      position: gridPosition(0, 1),
      fields: {},
      outputPorts: [
        { id: `port-${nanoid(6)}`, label: 'Produto A' },
        { id: `port-${nanoid(6)}`, label: 'Produto B' }
      ]
    },
    {
      id: `card-${nanoid(6)}`,
      type: 'message',
      title: 'FAQ',
      description: 'Perguntas frequentes',
      content: 'Aqui estão as respostas para as dúvidas mais comuns:',
      position: gridPosition(1, 1),
      fields: {
        pergunta1: 'Como funciona o serviço?',
        resposta1: 'Nosso serviço é baseado em assinatura mensal com suporte 24/7.',
        pergunta2: 'Qual o prazo de entrega?',
        resposta2: 'O prazo de entrega é de 3 a 5 dias úteis para todo o Brasil.'
      },
      outputPorts: [
        { id: `port-${nanoid(6)}`, label: 'Mais Dúvidas' }
      ]
    },
    {
      id: `card-${nanoid(6)}`,
      type: 'contact',
      title: 'Fale Conosco',
      description: 'Canais de contato',
      content: 'Entre em contato conosco pelos seguintes canais:',
      position: gridPosition(2, 1),
      fields: {
        email: 'atendimento@empresa.com',
        telefone: '(11) 9999-9999',
        whatsapp: '(11) 9999-9999'
      },
      outputPorts: [
        { id: `port-${nanoid(6)}`, label: 'Voltar ao Início' }
      ]
    },
    {
      id: `card-${nanoid(6)}`,
      type: 'product',
      title: 'Produto A',
      description: 'Detalhes do Produto A',
      content: 'O Produto A é ideal para quem busca qualidade e durabilidade.',
      position: gridPosition(0, 2),
      fields: {
        preco: 'R$ 299,90',
        estoque: '15 unidades',
        codigo: 'PROD-A-123'
      },
      outputPorts: [
        { id: `port-${nanoid(6)}`, label: 'Comprar' },
        { id: `port-${nanoid(6)}`, label: 'Mais Informações' }
      ]
    },
    {
      id: `card-${nanoid(6)}`,
      type: 'product',
      title: 'Produto B',
      description: 'Detalhes do Produto B',
      content: 'O Produto B oferece o melhor custo-benefício do mercado.',
      position: gridPosition(1, 2),
      fields: {
        preco: 'R$ 199,90',
        estoque: '8 unidades',
        codigo: 'PROD-B-456'
      },
      outputPorts: [
        { id: `port-${nanoid(6)}`, label: 'Comprar' },
        { id: `port-${nanoid(6)}`, label: 'Mais Informações' }
      ]
    },
    {
      id: `card-${nanoid(6)}`,
      type: 'action',
      title: 'Finalizar Compra',
      description: 'Processo de checkout',
      content: 'Preencha os dados abaixo para finalizar sua compra:',
      position: gridPosition(2, 2),
      fields: {
        formaPagamento: '',
        parcelamento: '',
        endereco: ''
      },
      outputPorts: [
        { id: `port-${nanoid(6)}`, label: 'Confirmar' },
        { id: `port-${nanoid(6)}`, label: 'Cancelar' }
      ]
    }
  ],
  connections: [
    {
      id: `conn-${nanoid(6)}`,
      start: '0', // Will be replaced by actual IDs in FlowEditor.tsx
      end: '1',
      type: 'positive',
      sourceHandle: '0',
      sourcePortLabel: 'Informações'
    },
    {
      id: `conn-${nanoid(6)}`,
      start: '0',
      end: '2',
      type: 'positive',
      sourceHandle: '1',
      sourcePortLabel: 'Dúvidas'
    },
    {
      id: `conn-${nanoid(6)}`,
      start: '0',
      end: '3',
      type: 'positive',
      sourceHandle: '2',
      sourcePortLabel: 'Contato'
    },
    {
      id: `conn-${nanoid(6)}`,
      start: '1',
      end: '4',
      type: 'positive',
      sourceHandle: '0',
      sourcePortLabel: 'Produto A'
    },
    {
      id: `conn-${nanoid(6)}`,
      start: '1',
      end: '5',
      type: 'positive',
      sourceHandle: '1',
      sourcePortLabel: 'Produto B'
    },
    {
      id: `conn-${nanoid(6)}`,
      start: '4',
      end: '6',
      type: 'positive',
      sourceHandle: '0',
      sourcePortLabel: 'Comprar'
    },
    {
      id: `conn-${nanoid(6)}`,
      start: '5',
      end: '6',
      type: 'positive',
      sourceHandle: '0',
      sourcePortLabel: 'Comprar'
    }
  ],
  profile: defaultProfile
};
