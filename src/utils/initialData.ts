
import { FlowData } from './flowTypes';
import { nanoid } from 'nanoid';

// Generate some unique IDs for ports
const port1 = `port-${nanoid(6)}`;
const port2 = `port-${nanoid(6)}`;
const port3 = `port-${nanoid(6)}`;
const port4 = `port-${nanoid(6)}`;

export const initialFlowData: FlowData = {
  cards: [
    {
      id: 'card-1',
      title: 'Início da Conversa',
      description: 'Primeiro contato com o cliente',
      content: 'Olá! Como posso te ajudar hoje?',
      position: { x: 250, y: 50 },
      type: 'initial',
      outputPorts: [
        { id: port1, label: "Informações sobre imóveis" },
        { id: port2, label: "Falar com um corretor" }
      ]
    },
    {
      id: 'card-2',
      title: 'Informações sobre Imóveis',
      description: 'Fornece detalhes sobre os imóveis disponíveis',
      content: 'Temos diversos imóveis disponíveis. Em qual região você está interessado?',
      position: { x: 100, y: 250 },
      type: 'regular',
      outputPorts: [
        { id: port3, label: "Quero ver opções" }
      ]
    },
    {
      id: 'card-3',
      title: 'Falar com Corretor',
      description: 'Encaminhar para um corretor',
      content: 'Vou te conectar com um de nossos corretores. Por favor, informe seu nome e telefone.',
      position: { x: 400, y: 250 },
      type: 'regular',
      outputPorts: [
        { id: port4, label: "Finalizar atendimento" }
      ]
    },
    {
      id: 'card-4',
      title: 'Finalização',
      description: 'Encerramento da conversa',
      content: 'Obrigado pelo seu contato! Estamos à disposição para ajudar.',
      position: { x: 250, y: 450 },
      type: 'end'
    }
  ],
  connections: [
    {
      id: 'conn-1',
      start: 'card-1',
      end: 'card-2',
      type: 'custom',
      sourceHandle: port1
    },
    {
      id: 'conn-2',
      start: 'card-1',
      end: 'card-3',
      type: 'custom',
      sourceHandle: port2
    },
    {
      id: 'conn-3',
      start: 'card-2',
      end: 'card-4',
      type: 'custom',
      sourceHandle: port3
    },
    {
      id: 'conn-4',
      start: 'card-3',
      end: 'card-4',
      type: 'custom',
      sourceHandle: port4
    }
  ]
};
