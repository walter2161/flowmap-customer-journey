
import { FlowData } from "./flowTypes";

export const initialFlowData: FlowData = {
  "cards": [
    {
      "id": "imob-1",
      "title": "Boas-vindas Imobiliária",
      "description": "Primeiro contato com cliente",
      "content": "Olá! Bem-vindo à Imobiliária Horizonte. Como posso ajudar você hoje? Está procurando um imóvel para alugar ou comprar?",
      "position": {
        "x": 71,
        "y": 32
      },
      "type": "initial"
    },
    {
      "id": "imob-2",
      "title": "Interesse em Compra",
      "description": "Cliente interessado em comprar",
      "content": "Ótimo! Para ajudar na busca do imóvel ideal para compra, poderia me informar: 1) Qual região de interesse? 2) Quantos quartos precisa? 3) Qual seu orçamento aproximado?",
      "position": {
        "x": 433,
        "y": 63
      },
      "type": "regular"
    },
    {
      "id": "imob-3",
      "title": "Interesse em Aluguel",
      "description": "Cliente interessado em alugar",
      "content": "Perfeito! Para encontrarmos o imóvel ideal para locação, poderia me informar: 1) Qual bairro de interesse? 2) Tamanho do imóvel necessário? 3) Valor máximo do aluguel?",
      "position": {
        "x": 483,
        "y": 491
      },
      "type": "regular"
    },
    {
      "id": "imob-4",
      "title": "Agendamento de Visita",
      "description": "Agendar visita ao imóvel",
      "content": "Encontrei algumas opções que podem te interessar! Gostaria de agendar uma visita? Temos disponibilidade nos seguintes horários: [lista de horários]. Qual seria melhor para você?",
      "position": {
        "x": 789,
        "y": 167
      },
      "type": "regular"
    },
    {
      "id": "imob-5",
      "title": "Finalização",
      "description": "Encerramento do atendimento",
      "content": "Perfeito! Sua visita está agendada. Um de nossos corretores entrará em contato para confirmar. Obrigado pelo interesse em nossa imobiliária!",
      "position": {
        "x": 1094,
        "y": 221
      },
      "type": "end"
    }
  ],
  "connections": [
    {
      "id": "imob-conn-1",
      "start": "imob-1",
      "end": "imob-2",
      "type": "positive"
    },
    {
      "id": "imob-conn-2",
      "start": "imob-1",
      "end": "imob-3",
      "type": "negative"
    },
    {
      "id": "imob-conn-3",
      "start": "imob-2",
      "end": "imob-4",
      "type": "positive"
    },
    {
      "id": "imob-conn-4",
      "start": "imob-3",
      "end": "imob-4",
      "type": "positive"
    },
    {
      "id": "imob-conn-5",
      "start": "imob-4",
      "end": "imob-5",
      "type": "positive"
    }
  ]
};
