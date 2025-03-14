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
import { FlowCard, FlowConnection, FlowData, CardType, OutputPort, ConnectionType } from '@/utils/flowTypes';
import FlowCardComponent from './FlowCard';
import FlowConnector from './FlowConnector';
import FlowControls from './FlowControls';
import { initialFlowData } from '@/utils/initialData';
import { nanoid } from 'nanoid';
import CardTypeSelector, { cardTypeLabels } from './CardTypeSelector';

import 'reactflow/dist/style.css';

// Template data
const templates = {
  imobiliaria: {
    cards: [
      {
        id: "imob-1",
        title: "Boas-vindas Imobiliária",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo à Imobiliária Exemplo. Como posso ajudar você hoje? Está procurando imóveis para compra, venda ou aluguel?",
        position: { x: 71, y: 32 },
        type: "initial" as const,
        outputPorts: [
          { id: "port-imob1-1", label: "Procurando imóvel para compra" },
          { id: "port-imob1-2", label: "Procurando imóvel para aluguel" },
          { id: "port-imob1-3", label: "Quero vender/alugar meu imóvel" }
        ]
      },
      {
        id: "imob-2",
        title: "Compra de Imóvel",
        description: "Cliente quer comprar imóvel",
        content: "Ótimo! Temos diversas opções para compra. Qual tipo de imóvel você está procurando? Apartamento, casa, terreno?",
        position: { x: 433, y: 63 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-imob2-1", label: "Apartamento" },
          { id: "port-imob2-2", label: "Casa" },
          { id: "port-imob2-3", label: "Terreno" }
        ]
      },
      {
        id: "imob-3",
        title: "Aluguel de Imóvel",
        description: "Cliente quer alugar imóvel",
        content: "Temos ótimas opções para locação. Qual tipo de imóvel você está procurando para alugar?",
        position: { x: 483, y: 300 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-imob3-1", label: "Residencial" },
          { id: "port-imob3-2", label: "Comercial" }
        ]
      },
      {
        id: "imob-4",
        title: "Vender/Alugar Imóvel",
        description: "Cliente quer anunciar imóvel",
        content: "Podemos ajudá-lo a vender ou alugar seu imóvel. Por favor, me diga qual seu interesse.",
        position: { x: 483, y: 491 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-imob4-1", label: "Vender meu imóvel" },
          { id: "port-imob4-2", label: "Colocar para aluguel" }
        ]
      },
      {
        id: "imob-5",
        title: "Finalização",
        description: "Encerramento do atendimento",
        content: "Obrigado pelo seu interesse. Um de nossos corretores entrará em contato em breve para dar continuidade ao seu atendimento.",
        position: { x: 789, y: 250 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "imob-conn-1", start: "imob-1", end: "imob-2", type: "custom" as const, sourceHandle: "port-imob1-1", sourcePortLabel: "Procurando imóvel para compra" },
      { id: "imob-conn-2", start: "imob-1", end: "imob-3", type: "custom" as const, sourceHandle: "port-imob1-2", sourcePortLabel: "Procurando imóvel para aluguel" },
      { id: "imob-conn-3", start: "imob-1", end: "imob-4", type: "custom" as const, sourceHandle: "port-imob1-3", sourcePortLabel: "Quero vender/alugar meu imóvel" },
      { id: "imob-conn-4", start: "imob-2", end: "imob-5", type: "custom" as const, sourceHandle: "port-imob2-1", sourcePortLabel: "Apartamento" },
      { id: "imob-conn-5", start: "imob-3", end: "imob-5", type: "custom" as const, sourceHandle: "port-imob3-1", sourcePortLabel: "Residencial" },
      { id: "imob-conn-6", start: "imob-4", end: "imob-5", type: "custom" as const, sourceHandle: "port-imob4-1", sourcePortLabel: "Vender meu imóvel" }
    ]
  },
  coworking: {
    cards: [
      {
        id: "cowork-1",
        title: "Boas-vindas Coworking Kennedy",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo ao Coworking Kennedy. Uma nova forma de trabalhar com toda a estrutura necessária para receber seus clientes. Como posso ajudar você hoje?",
        position: { x: 50, y: 50 },
        type: "initial" as const,
        outputPorts: [
          { id: "port-cowork1-1", label: "Quero conhecer os planos" },
          { id: "port-cowork1-2", label: "Quero agendar uma visita" },
          { id: "port-cowork1-3", label: "Quero saber sobre endereço comercial" },
          { id: "port-cowork1-4", label: "Preciso de mais informações" }
        ]
      },
      {
        id: "cowork-2",
        title: "Planos Disponíveis",
        description: "Informações sobre planos oferecidos",
        content: "Oferecemos diversas opções para atender suas necessidades. Temos planos mensais para estações de trabalho a partir de R$750/mês, além de opções avulsas por hora ou diária. Qual modalidade melhor atende sua necessidade?",
        position: { x: 350, y: 30 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-cowork2-1", label: "Planos mensais" },
          { id: "port-cowork2-2", label: "Valores avulsos" },
          { id: "port-cowork2-3", label: "Endereço comercial" }
        ]
      },
      {
        id: "cowork-3",
        title: "Agendar Visita",
        description: "Cliente quer conhecer o espaço",
        content: "Ficaremos felizes em recebê-lo para conhecer nosso espaço. Nosso horário de atendimento é de segunda a sexta, das 9h às 17h. Quando seria melhor para você?",
        position: { x: 350, y: 200 },
        type: "agendar" as const,
        outputPorts: [
          { id: "port-cowork3-1", label: "Manhã" },
          { id: "port-cowork3-2", label: "Tarde" },
          { id: "port-cowork3-3", label: "Outro horário" }
        ]
      },
      {
        id: "cowork-4",
        title: "Endereço Comercial",
        description: "Informações sobre endereço comercial",
        content: "Nosso endereço comercial está disponível por apenas R$99/mês no plano trimestral, incluindo 10h mensais de uso do espaço compartilhado. Você pode utilizar este endereço em materiais promocionais, correspondências e cartões de visita. Importante: não fornecemos endereço fiscal.",
        position: { x: 350, y: 370 },
        type: "servico" as const,
        outputPorts: [
          { id: "port-cowork4-1", label: "Quero contratar" },
          { id: "port-cowork4-2", label: "Tenho dúvidas" }
        ]
      },
      {
        id: "cowork-5",
        title: "Mais Informações",
        description: "Informações institucionais",
        content: "O Coworking Kennedy oferece infraestrutura de qualidade em um ambiente projetado para inspirar. Idealizado pelo Grupo R. Duarte, estamos localizados no 5º andar do Ed. Comercial Duarte, na Av. Presidente Kennedy, 2191, com acesso pela Rua Honduras, em Praia Grande – SP. Deseja saber sobre algo específico?",
        position: { x: 350, y: 540 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-cowork5-1", label: "Público-alvo" },
          { id: "port-cowork5-2", label: "Localização" },
          { id: "port-cowork5-3", label: "Contato" }
        ]
      },
      {
        id: "cowork-6",
        title: "Planos Mensais",
        description: "Detalhes dos planos mensais",
        content: "Nosso plano mensal para Estação de Trabalho (mesa individual reservada) custa R$750,00/mês para uma pessoa. Também oferecemos Endereço Comercial por R$99,00/mês. Gostaria de mais detalhes sobre algum desses planos?",
        position: { x: 650, y: 30 },
        type: "servico" as const,
        outputPorts: [
          { id: "port-cowork6-1", label: "Estação de Trabalho" },
          { id: "port-cowork6-2", label: "Endereço Comercial" },
          { id: "port-cowork6-3", label: "Agendar visita" }
        ]
      },
      {
        id: "cowork-7",
        title: "Valores Avulsos",
        description: "Informações sobre valores avulsos",
        content: "Oferecemos opções avulsas para uso do espaço. Estação de Trabalho: Diária R$99 (8h) ou R$19/hora. Sala Privativa: Diária R$149 (8h) ou R$39/hora. Sala de Reunião: Primeira hora R$99, demais horas R$49. Importante: se o valor das horas exceder o da diária, cobraremos apenas a diária.",
        position: { x: 650, y: 180 },
        type: "servico" as const,
        outputPorts: [
          { id: "port-cowork7-1", label: "Quero reservar" },
          { id: "port-cowork7-2", label: "Tenho dúvidas" }
        ]
      },
      {
        id: "cowork-8",
        title: "Público-Alvo",
        description: "Para quem é ideal",
        content: "O Coworking Kennedy é ideal para: Corretores de Imóveis, Advogados Autônomos, Contadores Autônomos, Representantes Comerciais, Designers Gráficos, Desenvolvedores Autônomos, Psicólogos e Consultores de Negócios. Você se identifica com algum desses perfis?",
        position: { x: 650, y: 350 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-cowork8-1", label: "Sim, me identifico" },
          { id: "port-cowork8-2", label: "Não, tenho outro perfil" }
        ]
      },
      {
        id: "cowork-9",
        title: "Localização",
        description: "Endereço e acesso",
        content: "Estamos localizados na Av. Presidente Kennedy, 2191, com acesso pela Rua Honduras, 855 - Sala 51, bairro Guilhermina, Praia Grande - SP. Nosso horário de atendimento é de segunda a sexta das 9h às 17h, com tolerância de 30 minutos antes e depois. Não funcionamos aos fins de semana e feriados.",
        position: { x: 650, y: 500 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-cowork9-1", label: "Como chegar" },
          { id: "port-cowork9-2", label: "Quero agendar visita" }
        ]
      },
      {
        id: "cowork-10",
        title: "Contato",
        description: "Canais de atendimento",
        content: "Entre em contato conosco: Telefone: (13) 9.9203.7957, E-mail: contato@cwkennedy.com.br. Redes Sociais: Instagram @coworkingkennedy, WhatsApp (13) 9.9203.7957, YouTube youtube.com/coworkingkennedy. Nossa equipe: Mel (Secretária), Walter (Marketing), Mariana (Comercial) e Rubens (Diretor).",
        position: { x: 650, y: 650 },
        type: "contatos" as const,
        outputPorts: [
          { id: "port-cowork10-1", label: "Ligar agora" },
          { id: "port-cowork10-2", label: "Enviar mensagem" }
        ]
      },
      {
        id: "cowork-11",
        title: "Estação de Trabalho",
        description: "Detalhes sobre a estação",
        content: "Nossa Estação de Trabalho (também conhecida como Espaço Compartilhado, Baias ou Escritório Compartilhado) oferece uma mesa individual reservada em ambiente compartilhado. O plano mensal custa R$750/mês e inclui toda infraestrutura necessária para seu trabalho.",
        position: { x: 950, y: 30 },
        type: "servico" as const,
        outputPorts: [
          { id: "port-cowork11-1", label: "Quero contratar" },
          { id: "port-cowork11-2", label: "Agendar visita" }
        ]
      },
      {
        id: "cowork-12",
        title: "Sala Privativa",
        description: "Informações sobre sala privativa",
        content: "Nossa Sala Privativa (também chamada de Sala de Atendimento ou Espaço Privado) é ideal para receber seus clientes com privacidade. Disponível por R$149/dia (8h) ou R$39/hora. Também temos planos mensais disponíveis.",
        position: { x: 950, y: 180 },
        type: "servico" as const,
        outputPorts: [
          { id: "port-cowork12-1", label: "Quero reservar" },
          { id: "port-cowork12-2", label: "Ver plano mensal" }
        ]
      },
      {
        id: "cowork-13",
        title: "Agradecimento",
        description: "Finalização do atendimento",
        content: "Obrigado pelo seu interesse no Coworking Kennedy! Nossa equipe entrará em contato em breve para dar continuidade ao seu atendimento. Estamos ansiosos para recebê-lo em nosso espaço e mostrar como podemos contribuir para o sucesso do seu negócio.",
        position: { x: 950, y: 350 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "cowork-conn-1", start: "cowork-1", end: "cowork-2", type: "custom" as const, sourceHandle: "port-cowork1-1", sourcePortLabel: "Quero conhecer os planos" },
      { id: "cowork-conn-2", start: "cowork-1", end: "cowork-3", type: "custom" as const, sourceHandle: "port-cowork1-2", sourcePortLabel: "Quero agendar uma visita" },
      { id: "cowork-conn-3", start: "cowork-1", end: "cowork-4", type: "custom" as const, sourceHandle: "port-cowork1-3", sourcePortLabel: "Quero saber sobre endereço comercial" },
      { id: "cowork-conn-4", start: "cowork-1", end: "cowork-5", type: "custom" as const, sourceHandle: "port-cowork1-4", sourcePortLabel: "Preciso de mais informações" },
      { id: "cowork-conn-5", start: "cowork-2", end: "cowork-6", type: "custom" as const, sourceHandle: "port-cowork2-1", sourcePortLabel: "Planos mensais" },
      { id: "cowork-conn-6", start: "cowork-2", end: "cowork-7", type: "custom" as const, sourceHandle: "port-cowork2-2", sourcePortLabel: "Valores avulsos" },
      { id: "cowork-conn-7", start: "cowork-2", end: "cowork-4", type: "custom" as const, sourceHandle: "port-cowork2-3", sourcePortLabel: "Endereço comercial" },
      { id: "cowork-conn-8", start: "cowork-3", end: "cowork-13", type: "custom" as const, sourceHandle: "port-cowork3-1", sourcePortLabel: "Manhã" },
      { id: "cowork-conn-9", start: "cowork-5", end: "cowork-8", type: "custom" as const, sourceHandle: "port-cowork5-1", sourcePortLabel: "Público-alvo" },
      { id: "cowork-conn-10", start: "cowork-5", end: "cowork-9", type: "custom" as const, sourceHandle: "port-cowork5-2", sourcePortLabel: "Localização" },
      { id: "cowork-conn-11", start: "cowork-5", end: "cowork-10", type: "custom" as const, sourceHandle: "port-cowork5-3", sourcePortLabel: "Contato" },
      { id: "cowork-conn-12", start: "cowork-6", end: "cowork-11", type: "custom" as const, sourceHandle: "port-cowork6-1", sourcePortLabel: "Estação de Trabalho" },
      { id: "cowork-conn-13", start: "cowork-6", end: "cowork-4", type: "custom" as const, sourceHandle: "port-cowork6-2", sourcePortLabel: "Endereço Comercial" },
      { id: "cowork-conn-14", start: "cowork-6", end: "cowork-3", type: "custom" as const, sourceHandle: "port-cowork6-3", sourcePortLabel: "Agendar visita" },
      { id: "cowork-conn-15", start: "cowork-7", end: "cowork-12", type: "custom" as const, sourceHandle: "port-cowork7-1", sourcePortLabel: "Quero reservar" },
      { id: "cowork-conn-16", start: "cowork-4", end: "cowork-13", type: "custom" as const, sourceHandle: "port-cowork4-1", sourcePortLabel: "Quero contratar" },
      { id: "cowork-conn-17", start: "cowork-8", end: "cowork-13", type: "custom" as const, sourceHandle: "port-cowork8-1", sourcePortLabel: "Sim, me identifico" },
      { id: "cowork-conn-18", start: "cowork-9", end: "cowork-3", type: "custom" as const, sourceHandle: "port-cowork9-2", sourcePortLabel: "Quero agendar visita" },
      { id: "cowork-conn-19", start: "cowork-11", end: "cowork-13", type: "custom" as const, sourceHandle: "port-cowork11-1", sourcePortLabel: "Quero contratar" },
      { id: "cowork-conn-20", start: "cowork-12", end: "cowork-13", type: "custom" as const, sourceHandle: "port-cowork12-1", sourcePortLabel: "Quero reservar" }
    ]
  },
  clinica: {
    cards: [
      {
        id: "clinic-1",
        title: "Boas-vindas Clínica",
        description: "Primeiro contato com paciente",
        content: "Olá! Bem-vindo à Clínica Saúde Total. Como posso ajudar você hoje? Deseja agendar uma consulta ou tirar dúvidas sobre nossos serviços?",
        position: { x: 71, y: 32 },
        type: "initial" as const,
        outputPorts: [
          { id: "port-clinic1-1", label: "Agendar consulta" },
          { id: "port-clinic1-2", label: "Dúvidas sobre serviços" }
        ]
      },
      {
        id: "clinic-2",
        title: "Agendamento de Consulta",
        description: "Paciente deseja agendar consulta",
        content: "Para agendar sua consulta, preciso de algumas informações: 1) Qual especialidade médica você procura? 2) Tem preferência de data e horário? 3) Já é paciente da clínica?",
        position: { x: 433, y: 63 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-clinic2-1", label: "Cardiologia" },
          { id: "port-clinic2-2", label: "Dermatologia" },
          { id: "port-clinic2-3", label: "Ortopedia" }
        ]
      },
      {
        id: "clinic-3",
        title: "Informações sobre Serviços",
        description: "Paciente com dúvidas",
        content: "Nossa clínica oferece diversas especialidades médicas, incluindo: cardiologia, dermatologia, ortopedia, e muitas outras. Qual serviço específico você gostaria de saber mais?",
        position: { x: 483, y: 491 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-clinic3-1", label: "Exames laboratoriais" },
          { id: "port-clinic3-2", label: "Cirurgias" },
          { id: "port-clinic3-3", label: "Planos de saúde" }
        ]
      },
      {
        id: "clinic-4",
        title: "Confirmação",
        description: "Finalização do atendimento",
        content: "Sua consulta foi agendada com sucesso! Enviaremos um lembrete 24h antes. Lembre-se de trazer seus documentos e chegar 15 minutos antes do horário marcado.",
        position: { x: 789, y: 167 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "clinic-conn-1", start: "clinic-1", end: "clinic-2", type: "custom" as const, sourceHandle: "port-clinic1-1", sourcePortLabel: "Agendar consulta" },
      { id: "clinic-conn-2", start: "clinic-1", end: "clinic-3", type: "custom" as const, sourceHandle: "port-clinic1-2", sourcePortLabel: "Dúvidas sobre serviços" },
      { id: "clinic-conn-3", start: "clinic-2", end: "clinic-4", type: "custom" as const, sourceHandle: "port-clinic2-1", sourcePortLabel: "Cardiologia" },
      { id: "clinic-conn-4", start: "clinic-3", end: "clinic-4", type: "custom" as const, sourceHandle: "port-clinic3-1", sourcePortLabel: "Exames laboratoriais" }
    ]
  },
  marketing: {
    cards: [
      {
        id: "mkt-1",
        title: "Boas-vindas Marketing",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo à Agência Impacto Digital. Como posso ajudar sua empresa hoje? Está interessado em melhorar sua presença online ou em uma campanha específica?",
        position: { x: 71, y: 32 },
        type: "initial" as const,
        outputPorts: [
          { id: "port-mkt1-1", label: "Presença online" },
          { id: "port-mkt1-2", label: "Campanha específica" }
        ]
      },
      {
        id: "mkt-2",
        title: "Presença Online",
        description: "Cliente interessado em presença digital",
        content: "Para melhorar sua presença online, oferecemos serviços de otimização de SEO, gestão de redes sociais e marketing de conteúdo. Qual aspecto é mais urgente para seu negócio?",
        position: { x: 433, y: 63 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-mkt2-1", label: "SEO" },
          { id: "port-mkt2-2", label: "Redes sociais" },
          { id: "port-mkt2-3", label: "Marketing de conteúdo" }
        ]
      },
      {
        id: "mkt-3",
        title: "Campanhas Específicas",
        description: "Cliente interessado em campanhas",
        content: "Desenvolvemos campanhas personalizadas para diversos objetivos: lançamento de produtos, aumento de vendas, reconhecimento de marca. Qual é o principal objetivo da sua campanha?",
        position: { x: 483, y: 491 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-mkt3-1", label: "Lançamento de produto" },
          { id: "port-mkt3-2", label: "Aumento de vendas" },
          { id: "port-mkt3-3", label: "Reconhecimento de marca" }
        ]
      },
      {
        id: "mkt-4",
        title: "Proposta Comercial",
        description: "Envio de proposta",
        content: "Baseado em suas necessidades, prepararemos uma proposta detalhada. Precisamos agendar uma reunião para discutir mais detalhes sobre seu negócio. Qual seria o melhor horário?",
        position: { x: 789, y: 167 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "mkt-conn-1", start: "mkt-1", end: "mkt-2", type: "custom" as const, sourceHandle: "port-mkt1-1", sourcePortLabel: "Presença online" },
      { id: "mkt-conn-2", start: "mkt-1", end: "mkt-3", type: "custom" as const, sourceHandle: "port-mkt1-2", sourcePortLabel: "Campanha específica" },
      { id: "mkt-conn-3", start: "mkt-2", end: "mkt-4", type: "custom" as const, sourceHandle: "port-mkt2-1", sourcePortLabel: "SEO" },
      { id: "mkt-conn-4", start: "mkt-3", end: "mkt-4", type: "custom" as const, sourceHandle: "port-mkt3-1", sourcePortLabel: "Lançamento de produto" }
    ]
  },
  servicos: {
    cards: [
      {
        id: "serv-1",
        title: "Boas-vindas",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo à Empresa de Serviços ABC. Como podemos ajudar você hoje?",
        position: { x: 50, y: 50 },
        type: "initial" as const,
        outputPorts: [
          { id: "port-serv1-1", label: "Conhecer serviços" },
          { id: "port-serv1-2", label: "Orçamento" },
          { id: "port-serv1-3", label: "Agendar visita" },
          { id: "port-serv1-4", label: "Suporte" }
        ]
      },
      {
        id: "serv-2",
        title: "Nossos Serviços",
        description: "Apresentação dos serviços",
        content: "Oferecemos uma variedade de serviços para atender suas necessidades. Em qual categoria você tem interesse?",
        position: { x: 350, y: 50 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-serv2-1", label: "Serviço A" },
          { id: "port-serv2-2", label: "Serviço B" },
          { id: "port-serv2-3", label: "Serviço C" }
        ]
      },
      {
        id: "serv-3",
        title: "Orçamento",
        description: "Solicitação de orçamento",
        content: "Para elaborarmos um orçamento personalizado, precisamos de algumas informações. Pode nos dizer qual serviço você deseja e seus requisitos específicos?",
        position: { x: 350, y: 200 },
        type: "briefing" as const,
        outputPorts: [
          { id: "port-serv3-1", label: "Enviar requisitos" },
          { id: "port-serv3-2", label: "Falar com consultor" }
        ]
      },
      {
        id: "serv-4",
        title: "Agendar Visita",
        description: "Cliente deseja visita técnica",
        content: "Ficaremos felizes em agendar uma visita. Quando seria um bom momento para você? Nossa equipe está disponível nos dias úteis das 8h às 18h.",
        position: { x: 350, y: 350 },
        type: "agendar" as const,
        outputPorts: [
          { id: "port-serv4-1", label: "Manhã" },
          { id: "port-serv4-2", label: "Tarde" }
        ]
      },
      {
        id: "serv-5",
        title: "Suporte",
        description: "Atendimento de suporte",
        content: "Nosso atendimento de suporte está pronto para ajudar. Qual o tipo de suporte você precisa?",
        position: { x: 350, y: 500 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-serv5-1", label: "Dúvidas" },
          { id: "port-serv5-2", label: "Problema técnico" },
          { id: "port-serv5-3", label: "Reclamação" }
        ]
      },
      {
        id: "serv-6",
        title: "Serviço A",
        description: "Detalhes do Serviço A",
        content: "O Serviço A inclui análise detalhada, implementação personalizada e suporte contínuo. Os preços começam em R$XXX,00 dependendo da sua necessidade específica.",
        position: { x: 650, y: 50 },
        type: "servico" as const,
        outputPorts: [
          { id: "port-serv6-1", label: "Solicitar orçamento" },
          { id: "port-serv6-2", label: "Ver casos de sucesso" }
        ]
      },
      {
        id: "serv-7",
        title: "Serviço B",
        description: "Detalhes do Serviço B",
        content: "Nosso Serviço B oferece soluções completas com atendimento prioritário e garantia de satisfação. Ideal para empresas que buscam crescimento rápido.",
        position: { x: 650, y: 200 },
        type: "servico" as const,
        outputPorts: [
          { id: "port-serv7-1", label: "Solicitar orçamento" },
          { id: "port-serv7-2", label: "Agendar demonstração" }
        ]
      },
      {
        id: "serv-8",
        title: "Serviço C",
        description: "Detalhes do Serviço C",
        content: "O Serviço C é nossa solução premium, com atendimento exclusivo e personalização completa. Perfeito para quem busca resultados superiores e atendimento VIP.",
        position: { x: 650, y: 350 },
        type: "servico" as const,
        outputPorts: [
          { id: "port-serv8-1", label:
