
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeTypes,
  OnConnect,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  EdgeTypes,
  ConnectionLineType,
  Panel
} from 'reactflow';
import { useToast } from '@/components/ui/use-toast';
import { FlowCard, FlowConnection, FlowData, CardType } from '@/utils/flowTypes';
import FlowCardComponent from './FlowCard';
import FlowConnector from './FlowConnector';
import FlowControls from './FlowControls';
import { initialFlowData } from '@/utils/initialData';
import { nanoid } from 'nanoid';
import CardTypeSelector, { cardTypeLabels } from './CardTypeSelector';

import 'reactflow/dist/style.css';

// Template data
const templates = {
  restaurante: {
    cards: [
      {
        id: "rest-1",
        title: "Boas-vindas Restaurante",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo ao Restaurante Sabor & Arte. Como posso ajudar você hoje? Gostaria de fazer uma reserva, consultar nosso cardápio ou tirar alguma dúvida?",
        position: { x: 50, y: 50 },
        type: "initial" as const
      },
      {
        id: "rest-2",
        title: "Reserva de Mesa",
        description: "Cliente deseja fazer reserva",
        content: "Ótimo! Para fazer sua reserva, preciso de algumas informações: Para qual data e horário? Quantas pessoas? Tem alguma preferência de ambiente (área externa, interna, próximo à janela)?",
        position: { x: 350, y: 50 },
        type: "agendar" as const,
        fields: {
          dateOptions: "Almoço (12h às 15h), Jantar (19h às 23h)"
        }
      },
      {
        id: "rest-3",
        title: "Informações do Cardápio",
        description: "Cliente pergunta sobre o menu",
        content: "Nosso cardápio oferece opções de entradas, pratos principais, sobremesas e bebidas. Temos especialidades em pratos mediterrâneos e opções vegetarianas e veganas. Gostaria de conhecer alguma seção específica?",
        position: { x: 350, y: 200 },
        type: "multipla-escolha" as const,
        fields: {
          options: ["Entradas", "Pratos Principais", "Sobremesas", "Bebidas", "Opções Vegetarianas"]
        }
      },
      {
        id: "rest-4",
        title: "Atendimento de Dúvidas",
        description: "Cliente com dúvidas gerais",
        content: "Estou à disposição para esclarecer suas dúvidas! Pergunte sobre nossos horários de funcionamento, formas de pagamento, estacionamento, ou qualquer outra informação que precise.",
        position: { x: 350, y: 350 },
        type: "pergunta-respostas" as const,
        fields: {
          faqs: [
            { pergunta: "Qual horário de funcionamento?", resposta: "Funcionamos de terça a domingo, das 12h às 15h para almoço e das 19h às 23h para jantar." },
            { pergunta: "Aceitam cartões?", resposta: "Sim, aceitamos todos os cartões de crédito e débito, além de Pix." },
            { pergunta: "Tem estacionamento?", resposta: "Oferecemos serviço de valet parking por R$20." }
          ]
        }
      },
      {
        id: "rest-5",
        title: "Confirmação de Reserva",
        description: "Finalização da reserva",
        content: "Perfeito! Sua reserva está confirmada para {data} às {horário} para {pessoas} pessoas. Recomendamos chegar com 10 minutos de antecedência. Será um prazer recebê-los!",
        position: { x: 650, y: 50 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "rest-conn-1", start: "rest-1", end: "rest-2", type: "positive", sourceHandle: "positive" },
      { id: "rest-conn-2", start: "rest-1", end: "rest-3", type: "neutral", sourceHandle: "neutral" },
      { id: "rest-conn-3", start: "rest-1", end: "rest-4", type: "negative", sourceHandle: "negative" },
      { id: "rest-conn-4", start: "rest-2", end: "rest-5", type: "positive", sourceHandle: "positive" }
    ]
  },
  salao: {
    cards: [
      {
        id: "salao-1",
        title: "Boas-vindas Salão de Beleza",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo ao Salão Beleza Radiante. Como posso ajudar você hoje? Deseja agendar um serviço, conhecer nossos pacotes ou saber mais sobre nossos profissionais?",
        position: { x: 50, y: 50 },
        type: "initial" as const
      },
      {
        id: "salao-2",
        title: "Agendamento de Serviço",
        description: "Cliente deseja agendar",
        content: "Para agendar seu horário, preciso saber qual serviço deseja (corte, coloração, manicure, etc), o profissional de preferência, e a data e horário desejados.",
        position: { x: 350, y: 50 },
        type: "agendar" as const,
        fields: {
          services: "Corte, Coloração, Hidratação, Manicure, Pedicure, Maquiagem"
        }
      },
      {
        id: "salao-3",
        title: "Pacotes e Promoções",
        description: "Informações sobre pacotes",
        content: "Temos diversos pacotes promocionais! O Pacote Noiva, Pacote Dia da Beleza Completo e também promoções semanais. Qual deles gostaria de conhecer em detalhes?",
        position: { x: 350, y: 200 },
        type: "produto" as const,
        fields: {
          products: [
            { name: "Pacote Noiva", price: "R$ 550,00", description: "Inclui prova de penteado, maquiagem, manicure e pedicure." },
            { name: "Dia da Beleza", price: "R$ 320,00", description: "Inclui hidratação, corte, escova, manicure e pedicure." },
            { name: "Terça Econômica", price: "R$ 150,00", description: "Corte e escova com 20% de desconto às terças." }
          ]
        }
      },
      {
        id: "salao-4", 
        title: "Nossos Profissionais",
        description: "Informações sobre a equipe",
        content: "Nossa equipe é formada por profissionais certificados e especializados em diversas áreas. Gostaria de conhecer algum especialista específico?",
        position: { x: 350, y: 350 },
        type: "contatos" as const,
        fields: {
          contacts: [
            { name: "Amanda", specialty: "Colorista", phone: "11 9xxxx-xxxx" },
            { name: "Ricardo", specialty: "Cortes", phone: "11 9xxxx-xxxx" },
            { name: "Patrícia", specialty: "Unhas", phone: "11 9xxxx-xxxx" }
          ]
        }
      },
      {
        id: "salao-5",
        title: "Confirmação de Agendamento",
        description: "Finalização do agendamento",
        content: "Pronto! Seu horário está agendado para {data} às {horário} com {profissional} para o serviço de {serviço}. Recomendamos chegar 10 minutos antes. Alguma dúvida adicional?",
        position: { x: 650, y: 50 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "salao-conn-1", start: "salao-1", end: "salao-2", type: "positive", sourceHandle: "positive" },
      { id: "salao-conn-2", start: "salao-1", end: "salao-3", type: "neutral", sourceHandle: "neutral" },
      { id: "salao-conn-3", start: "salao-1", end: "salao-4", type: "negative", sourceHandle: "negative" },
      { id: "salao-conn-4", start: "salao-2", end: "salao-5", type: "positive", sourceHandle: "positive" }
    ]
  },
  mei: {
    cards: [
      {
        id: "mei-1",
        title: "Consultoria MEI",
        description: "Primeiro contato com empreendedor",
        content: "Olá! Sou seu consultor de Microempreendedor Individual (MEI). Como posso ajudar hoje? Deseja abrir um MEI, regularizar sua situação ou tem dúvidas sobre obrigações fiscais?",
        position: { x: 50, y: 50 },
        type: "initial" as const
      },
      {
        id: "mei-2",
        title: "Abertura de MEI",
        description: "Processo de abertura",
        content: "Para abrir um MEI, precisamos verificar se sua atividade está na lista permitida, seu CPF está regular e você não é sócio de empresa. Podemos começar preenchendo um breve formulário?",
        position: { x: 350, y: 50 },
        type: "briefing" as const,
        fields: {
          questions: [
            "Qual atividade pretende exercer?",
            "Já possui empresa ou é sócio de alguma?",
            "Possui algum benefício do INSS?",
            "Qual será o nome fantasia do negócio?"
          ]
        }
      },
      {
        id: "mei-3",
        title: "Regularização Fiscal",
        description: "Empreendedor com pendências",
        content: "Para regularizar sua situação como MEI, precisamos verificar pendências de DAS (mensalidades) ou declarações anuais. Vamos consultar sua situação no Portal do Empreendedor.",
        position: { x: 350, y: 200 },
        type: "acao" as const,
        fields: {
          actions: [
            "Consultar situação cadastral no Portal do Empreendedor",
            "Verificar DAS (mensalidades) pendentes",
            "Emitir guias de pagamento",
            "Regularizar DASN-SIMEI (declaração anual)"
          ]
        }
      },
      {
        id: "mei-4",
        title: "Obrigações do MEI",
        description: "Informações sobre deveres",
        content: "Como MEI, você tem algumas obrigações: pagar DAS mensal (aprox. R$68), entregar declaração anual (DASN-SIMEI) e emitir notas fiscais para empresas. Gostaria de detalhar alguma delas?",
        position: { x: 350, y: 350 },
        type: "pergunta-respostas" as const,
        fields: {
          faqs: [
            { pergunta: "Qual o valor do DAS?", resposta: "Em 2023, aproximadamente R$68, dependendo da atividade." },
            { pergunta: "Quando enviar a DASN-SIMEI?", resposta: "Até 31 de maio do ano seguinte ao exercício." },
            { pergunta: "Posso ter funcionário?", resposta: "Sim, apenas um com salário mínimo ou piso da categoria." }
          ]
        }
      },
      {
        id: "mei-5",
        title: "Formalização Concluída",
        description: "Finalização do atendimento",
        content: "Parabéns! Sua formalização como MEI foi concluída com sucesso. Seu CNPJ é {numero_cnpj}. Em breve você receberá por email o CCMEI (Certificado do MEI). Posso ajudar com mais alguma coisa?",
        position: { x: 650, y: 50 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "mei-conn-1", start: "mei-1", end: "mei-2", type: "positive", sourceHandle: "positive" },
      { id: "mei-conn-2", start: "mei-1", end: "mei-3", type: "neutral", sourceHandle: "neutral" },
      { id: "mei-conn-3", start: "mei-1", end: "mei-4", type: "negative", sourceHandle: "negative" },
      { id: "mei-conn-4", start: "mei-2", end: "mei-5", type: "positive", sourceHandle: "positive" }
    ]
  },
  academia: {
    cards: [
      {
        id: "acad-1",
        title: "Boas-vindas Academia",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo à Academia Corpo em Movimento. Como posso ajudar? Gostaria de conhecer nossos planos, agendar uma aula experimental ou tirar dúvidas sobre nossas modalidades?",
        position: { x: 50, y: 50 },
        type: "initial" as const
      },
      {
        id: "acad-2",
        title: "Planos e Mensalidades",
        description: "Informações sobre preços",
        content: "Temos diversos planos para atender suas necessidades: Plano Básico (musculação), Plano Plus (musculação + 1 modalidade) e Plano Premium (acesso total). Qual deles gostaria de conhecer?",
        position: { x: 350, y: 50 },
        type: "servico" as const,
        fields: {
          services: [
            { name: "Plano Básico", price: "R$ 89,90/mês", description: "Acesso à área de musculação em horário comercial" },
            { name: "Plano Plus", price: "R$ 119,90/mês", description: "Musculação + 1 modalidade, horário livre" },
            { name: "Plano Premium", price: "R$ 169,90/mês", description: "Acesso total a todas as modalidades e horários" }
          ]
        }
      },
      {
        id: "acad-3",
        title: "Aula Experimental",
        description: "Agendamento de teste",
        content: "Ótimo! Você pode agendar uma aula experimental gratuita. Qual modalidade gostaria de experimentar (musculação, spinning, dança, pilates, etc.)? Qual o melhor dia e horário para você?",
        position: { x: 350, y: 200 },
        type: "agendar" as const,
        fields: {
          availableDays: "Segunda a Sábado",
          hours: "6h às 22h (Segunda a Sexta) | 8h às 14h (Sábados)"
        }
      },
      {
        id: "acad-4",
        title: "Modalidades Disponíveis",
        description: "Informações sobre aulas",
        content: "Oferecemos diversas modalidades: musculação, spinning, pilates, yoga, zumba, jump, funcional e muay thai. Qual modalidade específica você gostaria de conhecer?",
        position: { x: 350, y: 350 },
        type: "multipla-escolha" as const,
        fields: {
          options: ["Musculação", "Spinning", "Pilates", "Yoga", "Zumba", "Funcional", "Muay Thai", "Jump"]
        }
      },
      {
        id: "acad-5",
        title: "Matrícula Concluída",
        description: "Finalização da matrícula",
        content: "Parabéns! Sua matrícula foi realizada com sucesso no plano {plano}. Pode começar já amanhã! Na recepção, nossa equipe fará uma avaliação física inicial e apresentará as instalações.",
        position: { x: 650, y: 50 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "acad-conn-1", start: "acad-1", end: "acad-2", type: "positive", sourceHandle: "positive" },
      { id: "acad-conn-2", start: "acad-1", end: "acad-3", type: "neutral", sourceHandle: "neutral" },
      { id: "acad-conn-3", start: "acad-1", end: "acad-4", type: "negative", sourceHandle: "negative" },
      { id: "acad-conn-4", start: "acad-2", end: "acad-5", type: "positive", sourceHandle: "positive" }
    ]
  },
  escola: {
    cards: [
      {
        id: "esc-1",
        title: "Boas-vindas Escola de Idiomas",
        description: "Primeiro contato com aluno",
        content: "Olá! Bem-vindo à Escola de Idiomas Global. Como posso ajudar? Gostaria de informações sobre nossos cursos, fazer um teste de nivelamento ou conhecer nossos métodos de ensino?",
        position: { x: 50, y: 50 },
        type: "initial" as const
      },
      {
        id: "esc-2",
        title: "Informações sobre Cursos",
        description: "Detalhes dos cursos",
        content: "Oferecemos cursos de Inglês, Espanhol, Francês, Alemão e Italiano, com turmas para todos os níveis. Temos formatos presenciais, online e híbridos. Qual idioma interessa você?",
        position: { x: 350, y: 50 },
        type: "servico" as const,
        fields: {
          services: [
            { name: "Inglês Regular", price: "R$ 279/mês", description: "2x por semana, material incluso" },
            { name: "Espanhol Intensivo", price: "R$ 350/mês", description: "3x por semana, material incluso" },
            { name: "Francês Fins de Semana", price: "R$ 220/mês", description: "Sábados, 3h/aula" }
          ]
        }
      },
      {
        id: "esc-3",
        title: "Teste de Nivelamento",
        description: "Avaliação de conhecimento",
        content: "Ótimo! Nosso teste de nivelamento é gratuito e leva cerca de 30 minutos. Podemos agendar para você fazer presencialmente ou enviar um link para fazer online. Qual você prefere?",
        position: { x: 350, y: 200 },
        type: "multipla-escolha" as const,
        fields: {
          options: ["Teste Presencial", "Teste Online", "Teste Oral (via videoconferência)"]
        }
      },
      {
        id: "esc-4",
        title: "Metodologia de Ensino",
        description: "Informações pedagógicas",
        content: "Nossa metodologia é comunicativa e focada na prática desde a primeira aula. Trabalhamos as 4 habilidades (falar, ouvir, ler, escrever) com materiais atualizados e tecnologia. Quer saber mais sobre algum aspecto específico?",
        position: { x: 350, y: 350 },
        type: "html" as const,
        fields: {
          content: "<h3>Nossa Metodologia</h3><ul><li>Abordagem comunicativa</li><li>Turmas de até 12 alunos</li><li>Professores nativos ou certificados internacionalmente</li><li>Plataforma digital complementar</li><li>Clube de conversação semanal</li></ul>"
        }
      },
      {
        id: "esc-5",
        title: "Matrícula Realizada",
        description: "Finalização da matrícula",
        content: "Parabéns! Sua matrícula no curso de {idioma} - Nível {nivel} está confirmada! As aulas começam em {data_inicio}. O material didático será entregue na primeira aula. Bem-vindo à Global!",
        position: { x: 650, y: 50 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "esc-conn-1", start: "esc-1", end: "esc-2", type: "positive", sourceHandle: "positive" },
      { id: "esc-conn-2", start: "esc-1", end: "esc-3", type: "neutral", sourceHandle: "neutral" },
      { id: "esc-conn-3", start: "esc-1", end: "esc-4", type: "negative", sourceHandle: "negative" },
      { id: "esc-conn-4", start: "esc-2", end: "esc-5", type: "positive", sourceHandle: "positive" }
    ]
  },
  loja: {
    cards: [
      {
        id: "loja-1",
        title: "Boas-vindas Loja de Roupas",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo à Boutique Estilo Único. Como posso ajudar você hoje? Está procurando alguma peça específica, deseja conhecer nossas novidades ou informações sobre trocas e devoluções?",
        position: { x: 50, y: 50 },
        type: "initial" as const
      },
      {
        id: "loja-2",
        title: "Busca por Produtos",
        description: "Cliente buscando itens",
        content: "Temos diversas opções disponíveis. Você procura roupas masculinas, femininas ou infantis? Alguma peça específica como calças, blusas, vestidos ou acessórios?",
        position: { x: 350, y: 50 },
        type: "multipla-escolha" as const,
        fields: {
          options: ["Moda Feminina", "Moda Masculina", "Moda Infantil", "Acessórios", "Calçados"]
        }
      },
      {
        id: "loja-3",
        title: "Produtos em Destaque",
        description: "Novidades e promoções",
        content: "Nossas novidades desta semana incluem a coleção Verão 2024 com descontos de até 30%. Temos também o combo 'Leve 3, Pague 2' em camisetas básicas. O que mais te interessa?",
        position: { x: 350, y: 200 },
        type: "produto" as const,
        fields: {
          products: [
            { name: "Vestido Floral Verão", price: "R$ 159,90", description: "Disponível nos tamanhos P, M, G" },
            { name: "Calça Jeans Slim", price: "R$ 189,90", description: "Do 36 ao 48, em 3 lavagens" },
            { name: "Camisetas Básicas", price: "3 por R$ 99,90", description: "100% algodão, várias cores" }
          ]
        }
      },
      {
        id: "loja-4",
        title: "Política de Trocas",
        description: "Informações sobre trocas",
        content: "Nossa política de trocas permite substituições em até 30 dias para produtos sem uso, com etiqueta e nota fiscal. Para compras online, a troca pode ser solicitada através do nosso site ou WhatsApp.",
        position: { x: 350, y: 350 },
        type: "pergunta-respostas" as const,
        fields: {
          faqs: [
            { pergunta: "Qual prazo para troca?", resposta: "30 dias a partir da data da compra." },
            { pergunta: "Preciso da nota fiscal?", resposta: "Sim, é necessário apresentar a nota fiscal." },
            { pergunta: "Posso trocar em qualquer loja?", resposta: "Sim, em qualquer unidade da nossa rede." }
          ]
        }
      },
      {
        id: "loja-5",
        title: "Finalização de Compra",
        description: "Pedido confirmado",
        content: "Seu pedido foi realizado com sucesso! O número de rastreamento é {codigo_rastreio}. Você receberá seu pacote em até 7 dias úteis no endereço informado. Agradecemos pela preferência!",
        position: { x: 650, y: 50 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "loja-conn-1", start: "loja-1", end: "loja-2", type: "positive", sourceHandle: "positive" },
      { id: "loja-conn-2", start: "loja-1", end: "loja-3", type: "neutral", sourceHandle: "neutral" },
      { id: "loja-conn-3", start: "loja-1", end: "loja-4", type: "negative", sourceHandle: "negative" },
      { id: "loja-conn-4", start: "loja-2", end: "loja-5", type: "positive", sourceHandle: "positive" }
    ]
  },
  delivery: {
    cards: [
      {
        id: "del-1",
        title: "Boas-vindas Delivery",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo ao Delivery Sabor Express. Como posso ajudar? Gostaria de fazer um pedido, consultar nosso cardápio, verificar o status de uma entrega ou fazer uma reclamação?",
        position: { x: 50, y: 50 },
        type: "initial" as const
      },
      {
        id: "del-2",
        title: "Novo Pedido",
        description: "Cliente quer pedir",
        content: "Ótimo! Para fazer seu pedido, gostaria de conhecer nossas opções de lanches, pizzas, pratos executivos ou bebidas? Temos várias promoções disponíveis hoje!",
        position: { x: 350, y: 50 },
        type: "produto" as const,
        fields: {
          products: [
            { name: "Pizza Grande", price: "A partir de R$ 49,90", description: "Até 2 sabores, borda recheada opcional (+R$8)" },
            { name: "Combo Família", price: "R$ 89,90", description: "Pizza grande + refrigerante 2L + sobremesa" },
            { name: "Hambúrguer Artesanal", price: "R$ 32,90", description: "Acompanha batata frita e refrigerante lata" }
          ]
        }
      },
      {
        id: "del-3",
        title: "Status de Entrega",
        description: "Rastreamento de pedido",
        content: "Para consultar o status do seu pedido, preciso do número de rastreamento ou telefone usado no pedido. Com essas informações, posso verificar exatamente onde seu pedido está.",
        position: { x: 350, y: 200 },
        type: "ordem-servico" as const,
        fields: {
          orderStatuses: [
            "Pedido Recebido", 
            "Em Preparação", 
            "Saiu para Entrega", 
            "Entregue"
          ]
        }
      },
      {
        id: "del-4",
        title: "Reclamações e Problemas",
        description: "Cliente com problemas",
        content: "Lamento pelo inconveniente. Para resolver seu problema da melhor forma, preciso que me informe qual foi a situação (atraso, pedido incorreto, qualidade, etc) e o número do pedido para verificarmos.",
        position: { x: 350, y: 350 },
        type: "briefing" as const,
        fields: {
          questions: [
            "Qual o número do pedido?",
            "Quando foi realizado o pedido?",
            "Qual foi o problema encontrado?",
            "O que podemos fazer para resolver?"
          ]
        }
      },
      {
        id: "del-5",
        title: "Pedido Confirmado",
        description: "Confirmação de pedido",
        content: "Seu pedido #{numero_pedido} foi confirmado! O tempo estimado de entrega é de 40-50 minutos para o endereço {endereco}. Você pode acompanhar a entrega pelo nosso aplicativo. Bom apetite!",
        position: { x: 650, y: 50 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "del-conn-1", start: "del-1", end: "del-2", type: "positive", sourceHandle: "positive" },
      { id: "del-conn-2", start: "del-1", end: "del-3", type: "neutral", sourceHandle: "neutral" },
      { id: "del-conn-3", start: "del-1", end: "del-4", type: "negative", sourceHandle: "negative" },
      { id: "del-conn-4", start: "del-2", end: "del-5", type: "positive", sourceHandle: "positive" }
    ]
  },
  assistencia: {
    cards: [
      {
        id: "ass-1",
        title: "Boas-vindas Assistência Técnica",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo à Tecno Assistência. Como posso ajudar? Precisa agendar um reparo, consultar o status de um serviço em andamento ou obter um orçamento para conserto?",
        position: { x: 50, y: 50 },
        type: "initial" as const
      },
      {
        id: "ass-2",
        title: "Agendamento de Reparo",
        description: "Cliente precisa de conserto",
        content: "Para agendar seu reparo, preciso saber: qual o aparelho (marca/modelo), qual o problema identificado e qual o melhor dia e horário para você trazer o equipamento ou receber um técnico.",
        position: { x: 350, y: 50 },
        type: "agendar" as const,
        fields: {
          availableDays: "Segunda a Sábado",
          hours: "8h às 18h (Segunda a Sexta) | 9h às 14h (Sábados)"
        }
      },
      {
        id: "ass-3",
        title: "Consulta de Status",
        description: "Verificação de andamento",
        content: "Para consultar o status do seu reparo, preciso do número da ordem de serviço ou do CPF/CNPJ do cliente. Com essa informação, verificarei exatamente em qual etapa está seu equipamento.",
        position: { x: 350, y: 200 },
        type: "ordem-servico" as const,
        fields: {
          orderStatuses: [
            "Aguardando Recebimento", 
            "Em Análise Técnica", 
            "Aguardando Aprovação de Orçamento", 
            "Em Reparo",
            "Concluído - Aguardando Retirada"
          ]
        }
      },
      {
        id: "ass-4",
        title: "Solicitação de Orçamento",
        description: "Cliente quer previsão de custos",
        content: "Para fornecer um orçamento preliminar, preciso saber o modelo do aparelho e o problema apresentado. O orçamento detalhado só é possível após análise técnica, que tem custo de R$50 (descontado em caso de aprovação do serviço).",
        position: { x: 350, y: 350 },
        type: "briefing" as const,
        fields: {
          questions: [
            "Qual o modelo do aparelho?",
            "Qual o problema apresentado?",
            "O equipamento está na garantia?",
            "Há preferência entre peças originais ou alternativas?"
          ]
        }
      },
      {
        id: "ass-5",
        title: "Serviço Concluído",
        description: "Finalização do reparo",
        content: "Seu aparelho {modelo} está pronto! O reparo foi concluído conforme orçamento aprovado. Você pode retirar na loja ou agendar entrega. A garantia do serviço é de 90 dias. Ficamos à disposição!",
        position: { x: 650, y: 50 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "ass-conn-1", start: "ass-1", end: "ass-2", type: "positive", sourceHandle: "positive" },
      { id: "ass-conn-2", start: "ass-1", end: "ass-3", type: "neutral", sourceHandle: "neutral" },
      { id: "ass-conn-3", start: "ass-1", end: "ass-4", type: "negative", sourceHandle: "negative" },
      { id: "ass-conn-4", start: "ass-2", end: "ass-5", type: "positive", sourceHandle: "positive" }
    ]
  }
};

// Node types
const nodeTypes: NodeTypes = {
  flowCard: FlowCardComponent
};

// Edge types
const edgeTypes: EdgeTypes = {
  flowConnector: FlowConnector
};

interface FlowEditorProps {
  initialData?: FlowData;
}

const FlowEditor: React.FC<FlowEditorProps> = ({ initialData = initialFlowData }) => {
  const { toast } = useToast();
  const { fitView, zoomIn, zoomOut, setViewport } = useReactFlow();
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [scriptModalOpen, setScriptModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowCardNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowConnectionEdge>([]);
  const [selectedCard, setSelectedCard] = useState<FlowCard | null>(null);
  const [flowData, setFlowData] = useState<FlowData>(initialData);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Convert FlowCards to nodes
  const createNodesFromCards = useCallback((cards: FlowCard[]) => {
    return cards.map((card) => ({
      id: card.id,
      type: 'flowCard',
      position: card.position,
      data: card,
      draggable: true,
    }));
  }, []);

  // Convert FlowConnections to edges
  const createEdgesFromConnections = useCallback((connections: FlowConnection[]) => {
    return connections.map((connection) => ({
      id: connection.id,
      type: 'flowConnector',
      source: connection.start,
      target: connection.end,
      data: {
        type: connection.type,
      },
      sourceHandle: connection.sourceHandle,
    }));
  }, []);

  // Initialize the flow with data
  useEffect(() => {
    const newNodes = createNodesFromCards(flowData.cards);
    const newEdges = createEdgesFromConnections(flowData.connections);
    
    setNodes(newNodes);
    setEdges(newEdges);
    
    // Give time for nodes to render, then fit view
    const timer = setTimeout(() => {
      fitView({ padding: 0.2 });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [flowData, createNodesFromCards, createEdgesFromConnections, setNodes, setEdges, fitView]);

  // Handle node add
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle adding new cards
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      
      const type = event.dataTransfer.getData('application/reactflow/type') as CardType;
      
      if (!type || !reactFlowInstance) {
        return;
      }
      
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const id = nanoid(6);
      const title = `${cardTypeLabels[type] || 'Novo'} Card`;
      
      const newCard: FlowCard = {
        id,
        title,
        description: 'Descrição do cartão',
        type,
        content: 'Conteúdo do cartão',
        position,
        fields: {}, // Initialize with empty fields
      };
      
      // Update flowData with the new card
      const updatedFlowData = {
        ...flowData,
        cards: [...flowData.cards, newCard],
      };
      
      setFlowData(updatedFlowData);
      setSelectedCard(newCard); // Automatically select the new card
      
      toast({
        title: 'Cartão adicionado',
        description: `Um novo cartão do tipo "${cardTypeLabels[type]}" foi adicionado.`,
      });
    },
    [reactFlowInstance, flowData, toast]
  );

  // Handle connections between nodes
  const onConnect: OnConnect = useCallback(
    (params) => {
      // Create a new connection
      const id = nanoid(6);
      const type: ConnectionType = 'neutral'; // Default to neutral
      
      const newConnection: FlowConnection = {
        id,
        start: params.source,
        end: params.target,
        type,
        sourceHandle: params.sourceHandle,
      };
      
      // Update flowData with the new connection
      const updatedFlowData = {
        ...flowData,
        connections: [...flowData.connections, newConnection],
      };
      
      setFlowData(updatedFlowData);
      
      // Also update the edges in the React Flow state
      setEdges((eds) => 
        addEdge(
          { 
            ...params, 
            id, 
            type: 'flowConnector',
            data: { type },
          }, 
          eds
        )
      );
    },
    [flowData, setEdges]
  );

  // Handle card selection
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const card = flowData.cards.find((c) => c.id === node.id);
      if (card) {
        setSelectedCard(card);
      }
    },
    [flowData.cards]
  );

  // Update card data
  const updateCard = useCallback(
    (updatedCard: FlowCard) => {
      const updatedCards = flowData.cards.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      );
      
      setFlowData({
        ...flowData,
        cards: updatedCards,
      });
      
      setSelectedCard(updatedCard);
      
      toast({
        title: 'Cartão atualizado',
        description: `O cartão "${updatedCard.title}" foi atualizado.`,
      });
    },
    [flowData, toast]
  );

  // Delete a card
  const deleteCard = useCallback(
    (cardId: string) => {
      // Remove the card
      const updatedCards = flowData.cards.filter((card) => card.id !== cardId);
      
      // Also remove any connections involving this card
      const updatedConnections = flowData.connections.filter(
        (conn) => conn.start !== cardId && conn.end !== cardId
      );
      
      setFlowData({
        cards: updatedCards,
        connections: updatedConnections,
      });
      
      setSelectedCard(null);
      
      toast({
        title: 'Cartão removido',
        description: 'O cartão foi removido com sucesso.',
      });
    },
    [flowData, toast]
  );

  // Handle node position change
  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const updatedCards = flowData.cards.map((card) =>
        card.id === node.id
          ? { ...card, position: { x: node.position.x, y: node.position.y } }
          : card
      );
      
      setFlowData({
        ...flowData,
        cards: updatedCards,
      });
    },
    [flowData]
  );

  // Export flow as JSON
  const exportJson = useCallback(() => {
    const jsonString = JSON.stringify(flowData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flow-export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setJsonModalOpen(false);
  }, [flowData]);

  // Load flow from JSON
  const importJson = useCallback((jsonData: string) => {
    try {
      const importedData = JSON.parse(jsonData) as FlowData;
      
      if (!importedData.cards || !importedData.connections) {
        throw new Error('Invalid JSON format');
      }
      
      setFlowData(importedData);
      setJsonModalOpen(false);
      
      toast({
        title: 'Fluxo importado',
        description: 'O fluxo foi importado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro na importação',
        description: 'O formato do JSON é inválido.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Generate a script from the flow
  const generateScript = useCallback(() => {
    // This is a simple example - in a real app, you'd have more sophisticated logic here
    let script = '# Script de Atendimento\n\n';
    
    // Sort cards by their position from top to bottom and left to right
    const sortedCards = [...flowData.cards].sort((a, b) => {
      const yDiff = a.position.y - b.position.y;
      return yDiff !== 0 ? yDiff : a.position.x - b.position.x;
    });
    
    sortedCards.forEach((card) => {
      script += `## ${card.title}\n`;
      script += `${card.description}\n\n`;
      script += `"${card.content}"\n\n`;
      
      // Add possible responses based on connections
      const outgoingConnections = flowData.connections.filter((conn) => conn.start === card.id);
      
      if (outgoingConnections.length > 0) {
        script += 'Respostas possíveis:\n';
        
        outgoingConnections.forEach((conn) => {
          const targetCard = flowData.cards.find((c) => c.id === conn.end);
          if (targetCard) {
            script += `- ${conn.type.toUpperCase()}: → ${targetCard.title}\n`;
          }
        });
        
        script += '\n';
      }
    });
    
    return script;
  }, [flowData]);

  // Apply a template
  const applyTemplate = useCallback((templateName: keyof typeof templates) => {
    if (templates[templateName]) {
      setFlowData(templates[templateName]);
      setTemplateModalOpen(false);
      toast({
        title: 'Template aplicado',
        description: `O template "${templateName}" foi aplicado com sucesso.`,
      });
    }
  }, [toast]);

  return (
    <div className="h-full w-full flex flex-col">
      <ReactFlowProvider>
        <div className="flex-grow" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            deleteKeyCode="Delete"
            multiSelectionKeyCode="Control"
            connectionLineType={ConnectionLineType.Bezier}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            minZoom={0.2}
            maxZoom={4}
            fitView
          >
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                switch (node.data.type) {
                  case 'initial':
                    return '#10B981'; // Green for initial
                  case 'end':
                    return '#EF4444'; // Red for end
                  default:
                    return '#6B7280'; // Gray for others
                }
              }} 
              zoomable 
              pannable 
            />
            <Background color="#aaa" gap={16} />
            
            <Panel position="top-right" className="bg-white px-4 py-3 rounded-lg shadow">
              <FlowControls 
                onZoomIn={zoomIn} 
                onZoomOut={zoomOut} 
                onFitView={() => fitView({ padding: 0.2 })}
                onExportJson={() => setJsonModalOpen(true)}
                onGenerateScript={() => setScriptModalOpen(true)}
                onLoadTemplate={() => setTemplateModalOpen(true)}
              />
            </Panel>
            
            <Panel position="top-left" className="bg-white px-4 py-3 rounded-lg shadow">
              <CardTypeSelector />
            </Panel>
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowEditor;

