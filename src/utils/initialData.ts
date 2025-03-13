
import { FlowData } from './flowTypes';
import { nanoid } from 'nanoid';

// Generate some unique IDs for ports
const generatePorts = (count: number, prefix: string) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `port-${prefix}-${nanoid(4)}`,
    label: `Opção ${i + 1}`
  }));
};

export const initialFlowData: FlowData = {
  cards: [
    {
      id: 'card-1',
      title: 'Boas-vindas ao Atendimento',
      description: 'Primeiro contato com o cliente',
      content: 'Olá! Bem-vindo à Nossa Empresa de Serviços. Como posso ajudar você hoje?',
      position: { x: 250, y: 50 },
      type: 'initial',
      outputPorts: [
        { id: `port-init-${nanoid(4)}`, label: "Informações sobre serviços" },
        { id: `port-init-${nanoid(4)}`, label: "Agendar serviço" },
        { id: `port-init-${nanoid(4)}`, label: "Suporte técnico" }
      ]
    },
    {
      id: 'card-2',
      title: 'Informações sobre Serviços',
      description: 'Apresenta os serviços disponíveis',
      content: 'Oferecemos diversos serviços especializados. Em qual você tem interesse?',
      position: { x: 100, y: 200 },
      type: 'regular',
      outputPorts: [
        { id: `port-info-${nanoid(4)}`, label: "Manutenção" },
        { id: `port-info-${nanoid(4)}`, label: "Instalação" },
        { id: `port-info-${nanoid(4)}`, label: "Consultoria" }
      ]
    },
    {
      id: 'card-3',
      title: 'Agendamento',
      description: 'Processo de agendamento de serviço',
      content: 'Vamos agendar seu serviço. Por favor, informe a data e horário de sua preferência.',
      position: { x: 400, y: 200 },
      type: 'agendar',
      outputPorts: [
        { id: `port-agend-${nanoid(4)}`, label: "Confirmar agendamento" },
        { id: `port-agend-${nanoid(4)}`, label: "Solicitar outro horário" }
      ]
    },
    {
      id: 'card-4',
      title: 'Suporte Técnico',
      description: 'Atendimento para suporte técnico',
      content: 'Nosso suporte técnico está à disposição. Qual problema você está enfrentando?',
      position: { x: 700, y: 200 },
      type: 'servico',
      outputPorts: [
        { id: `port-supp-${nanoid(4)}`, label: "Problema de software" },
        { id: `port-supp-${nanoid(4)}`, label: "Problema de hardware" },
        { id: `port-supp-${nanoid(4)}`, label: "Dúvidas gerais" }
      ]
    },
    {
      id: 'card-5',
      title: 'Manutenção',
      description: 'Detalhes sobre serviços de manutenção',
      content: 'Nossos serviços de manutenção incluem verificação preventiva e corretiva. Gostaria de saber valores ou agendar?',
      position: { x: 100, y: 350 },
      type: 'multipla-escolha',
      outputPorts: [
        { id: `port-maint-${nanoid(4)}`, label: "Saber valores" },
        { id: `port-maint-${nanoid(4)}`, label: "Agendar agora" }
      ]
    },
    {
      id: 'card-6',
      title: 'Instalação',
      description: 'Detalhes sobre serviços de instalação',
      content: 'Realizamos instalação profissional com garantia de serviço. Deseja um orçamento?',
      position: { x: 300, y: 350 },
      type: 'pergunta-respostas',
      outputPorts: [
        { id: `port-inst-${nanoid(4)}`, label: "Solicitar orçamento" },
        { id: `port-inst-${nanoid(4)}`, label: "Mais informações" }
      ]
    },
    {
      id: 'card-7',
      title: 'Consultoria',
      description: 'Serviços de consultoria especializada',
      content: 'Nossa consultoria é personalizada para cada cliente. Conte-nos mais sobre suas necessidades.',
      position: { x: 500, y: 350 },
      type: 'briefing',
      outputPorts: [
        { id: `port-cons-${nanoid(4)}`, label: "Agendar consultoria inicial" },
        { id: `port-cons-${nanoid(4)}`, label: "Enviar detalhes por e-mail" }
      ]
    },
    {
      id: 'card-8',
      title: 'Coleta de Dados',
      description: 'Coleta de informações de contato',
      content: 'Para prosseguir, precisamos de algumas informações. Poderia informar seu nome e telefone para contato?',
      position: { x: 400, y: 500 },
      type: 'contatos',
      outputPorts: [
        { id: `port-data-${nanoid(4)}`, label: "Dados fornecidos" },
        { id: `port-data-${nanoid(4)}`, label: "Prefere não informar" }
      ]
    },
    {
      id: 'card-9',
      title: 'Ordem de Serviço',
      description: 'Geração de ordem de serviço',
      content: 'Sua ordem de serviço foi gerada com sucesso! O número é #OS12345.',
      position: { x: 200, y: 500 },
      type: 'ordem-servico',
      outputPorts: [
        { id: `port-os-${nanoid(4)}`, label: "Confirmar recebimento" }
      ]
    },
    {
      id: 'card-10',
      title: 'Finalização',
      description: 'Encerramento do atendimento',
      content: 'Agradecemos seu contato! Estamos à disposição para qualquer outra necessidade.',
      position: { x: 300, y: 650 },
      type: 'end'
    }
  ],
  connections: [
    {
      id: 'conn-1',
      start: 'card-1',
      end: 'card-2',
      type: 'custom',
      sourceHandle: `port-init-${nanoid(4)}`,
      sourcePortLabel: "Informações sobre serviços"
    },
    {
      id: 'conn-2',
      start: 'card-1',
      end: 'card-3',
      type: 'custom',
      sourceHandle: `port-init-${nanoid(4)}`,
      sourcePortLabel: "Agendar serviço"
    },
    {
      id: 'conn-3',
      start: 'card-1',
      end: 'card-4',
      type: 'custom',
      sourceHandle: `port-init-${nanoid(4)}`,
      sourcePortLabel: "Suporte técnico"
    },
    {
      id: 'conn-4',
      start: 'card-2',
      end: 'card-5',
      type: 'custom',
      sourceHandle: `port-info-${nanoid(4)}`,
      sourcePortLabel: "Manutenção"
    },
    {
      id: 'conn-5',
      start: 'card-2',
      end: 'card-6',
      type: 'custom',
      sourceHandle: `port-info-${nanoid(4)}`,
      sourcePortLabel: "Instalação"
    },
    {
      id: 'conn-6',
      start: 'card-2',
      end: 'card-7',
      type: 'custom',
      sourceHandle: `port-info-${nanoid(4)}`,
      sourcePortLabel: "Consultoria"
    },
    {
      id: 'conn-7',
      start: 'card-3',
      end: 'card-9',
      type: 'custom',
      sourceHandle: `port-agend-${nanoid(4)}`,
      sourcePortLabel: "Confirmar agendamento"
    },
    {
      id: 'conn-8',
      start: 'card-7',
      end: 'card-8',
      type: 'custom',
      sourceHandle: `port-cons-${nanoid(4)}`,
      sourcePortLabel: "Agendar consultoria inicial"
    },
    {
      id: 'conn-9',
      start: 'card-8',
      end: 'card-10',
      type: 'custom',
      sourceHandle: `port-data-${nanoid(4)}`,
      sourcePortLabel: "Dados fornecidos"
    },
    {
      id: 'conn-10',
      start: 'card-9',
      end: 'card-10',
      type: 'custom',
      sourceHandle: `port-os-${nanoid(4)}`,
      sourcePortLabel: "Confirmar recebimento"
    }
  ]
};

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
        position: { x: 71, y: 200 },
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
        position: { x: 71, y: 350 },
        type: "regular" as const,
        outputPorts: [
          { id: "port-imob4-1", label: "Vender meu imóvel" },
          { id: "port-imob4-2", label: "Colocar para aluguel" }
        ]
      },
      {
        id: "imob-5",
        title: "Informações de Apartamento",
        description: "Detalhes sobre apartamentos",
        content: "Temos diversos apartamentos disponíveis. Em qual região você tem interesse e qual seu orçamento aproximado?",
        position: { x: 433, y: 200 },
        type: "imovel" as const,
        outputPorts: [
          { id: "port-imob5-1", label: "Ver opções na Zona Sul" },
          { id: "port-imob5-2", label: "Ver opções na Zona Norte" },
          { id: "port-imob5-3", label: "Ver opções no Centro" }
        ]
      },
      {
        id: "imob-6",
        title: "Informações de Casas",
        description: "Detalhes sobre casas disponíveis",
        content: "Temos casas em diversos bairros e condomínios. Está buscando algo em região específica?",
        position: { x: 433, y: 350 },
        type: "imovel-usado" as const,
        outputPorts: [
          { id: "port-imob6-1", label: "Casa em condomínio" },
          { id: "port-imob6-2", label: "Casa na cidade" }
        ]
      },
      {
        id: "imob-7",
        title: "Imóveis Comerciais",
        description: "Opções para locação comercial",
        content: "Para imóveis comerciais, temos salas, lojas e galpões. Qual seria o uso do imóvel?",
        position: { x: 433, y: 500 },
        type: "imovel-comercial" as const,
        outputPorts: [
          { id: "port-imob7-1", label: "Escritório" },
          { id: "port-imob7-2", label: "Loja/Comércio" },
          { id: "port-imob7-3", label: "Galpão/Indústria" }
        ]
      },
      {
        id: "imob-8",
        title: "Agendamento de Visita",
        description: "Agendar visita ao imóvel",
        content: "Vamos agendar uma visita para você conhecer o imóvel. Qual seria o melhor dia e horário?",
        position: { x: 800, y: 200 },
        type: "agendar-visita" as const,
        outputPorts: [
          { id: "port-imob8-1", label: "Manhã" },
          { id: "port-imob8-2", label: "Tarde" },
          { id: "port-imob8-3", label: "Noite" }
        ]
      },
      {
        id: "imob-9",
        title: "Avaliação de Imóvel",
        description: "Avaliação para venda/aluguel",
        content: "Para avaliarmos seu imóvel, precisamos de algumas informações como endereço, área, número de cômodos e fotos se possível.",
        position: { x: 800, y: 350 },
        type: "briefing" as const,
        outputPorts: [
          { id: "port-imob9-1", label: "Fornecer informações agora" },
          { id: "port-imob9-2", label: "Agendar visita de avaliador" }
        ]
      },
      {
        id: "imob-10",
        title: "Coleta de Dados",
        description: "Informações de contato",
        content: "Para prosseguir, precisamos dos seus dados de contato. Poderia informar seu nome completo, telefone e e-mail?",
        position: { x: 800, y: 500 },
        type: "contatos" as const,
        outputPorts: [
          { id: "port-imob10-1", label: "Dados fornecidos" }
        ]
      },
      {
        id: "imob-11",
        title: "Finalização",
        description: "Encerramento do atendimento",
        content: "Perfeito! Um de nossos corretores entrará em contato em breve para dar continuidade ao seu atendimento. Agradecemos seu interesse!",
        position: { x: 1100, y: 350 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "imob-conn-1", start: "imob-1", end: "imob-2", type: "custom" as const, sourceHandle: "port-imob1-1", sourcePortLabel: "Procurando imóvel para compra" },
      { id: "imob-conn-2", start: "imob-1", end: "imob-3", type: "custom" as const, sourceHandle: "port-imob1-2", sourcePortLabel: "Procurando imóvel para aluguel" },
      { id: "imob-conn-3", start: "imob-1", end: "imob-4", type: "custom" as const, sourceHandle: "port-imob1-3", sourcePortLabel: "Quero vender/alugar meu imóvel" },
      { id: "imob-conn-4", start: "imob-2", end: "imob-5", type: "custom" as const, sourceHandle: "port-imob2-1", sourcePortLabel: "Apartamento" },
      { id: "imob-conn-5", start: "imob-2", end: "imob-6", type: "custom" as const, sourceHandle: "port-imob2-2", sourcePortLabel: "Casa" },
      { id: "imob-conn-6", start: "imob-3", end: "imob-7", type: "custom" as const, sourceHandle: "port-imob3-2", sourcePortLabel: "Comercial" },
      { id: "imob-conn-7", start: "imob-5", end: "imob-8", type: "custom" as const, sourceHandle: "port-imob5-1", sourcePortLabel: "Ver opções na Zona Sul" },
      { id: "imob-conn-8", start: "imob-4", end: "imob-9", type: "custom" as const, sourceHandle: "port-imob4-1", sourcePortLabel: "Vender meu imóvel" },
      { id: "imob-conn-9", start: "imob-8", end: "imob-10", type: "custom" as const, sourceHandle: "port-imob8-1", sourcePortLabel: "Manhã" },
      { id: "imob-conn-10", start: "imob-9", end: "imob-10", type: "custom" as const, sourceHandle: "port-imob9-1", sourcePortLabel: "Fornecer informações agora" },
      { id: "imob-conn-11", start: "imob-10", end: "imob-11", type: "custom" as const, sourceHandle: "port-imob10-1", sourcePortLabel: "Dados fornecidos" }
    ]
  },
  coworking: {
    cards: [
      {
        id: "cowork-1",
        title: "Boas-vindas Coworking",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo ao Espaço Colaborativo. Como posso ajudar você hoje? Está interessado em conhecer nossos planos ou agendar uma visita?",
        position: { x: 71, y: 32 },
        type: "initial" as const,
        outputPorts: [
          { id: "port-cowork1-1", label: "Quero conhecer os planos" },
          { id: "port-cowork1-2", label: "Quero agendar uma visita" },
          { id: "port-cowork1-3", label: "Informações sobre eventos" }
        ]
      },
      {
        id: "cowork-2",
        title: "Interesse em Planos",
        description: "Cliente interessado nos planos",
        content: "Temos diversos planos para atender suas necessidades. Temos plano diário, semanal e mensal. Qual deles melhor atende sua necessidade?",
        position: { x: 433, y: 63 },
        type: "multipla-escolha" as const,
        outputPorts: [
          { id: "port-cowork2-1", label: "Plano diário" },
          { id: "port-cowork2-2", label: "Plano semanal" },
          { id: "port-cowork2-3", label: "Plano mensal" }
        ]
      },
      {
        id: "cowork-3",
        title: "Agendamento de Visita",
        description: "Cliente quer conhecer o espaço",
        content: "Ficaremos felizes em recebê-lo para conhecer nosso espaço. Temos disponibilidade nos seguintes horários: [lista de horários]. Qual seria melhor para você?",
        position: { x: 433, y: 200 },
        type: "agendar" as const,
        outputPorts: [
          { id: "port-cowork3-1", label: "Manhã" },
          { id: "port-cowork3-2", label: "Tarde" }
        ]
      },
      {
        id: "cowork-4",
        title: "Eventos e Workshops",
        description: "Informações sobre eventos",
        content: "Promovemos diversos eventos e workshops mensalmente. Gostaria de saber sobre os próximos eventos ou sobre aluguel de espaço para seu próprio evento?",
        position: { x: 433, y: 350 },
        type: "servico" as const,
        outputPorts: [
          { id: "port-cowork4-1", label: "Próximos eventos" },
          { id: "port-cowork4-2", label: "Alugar espaço para evento" }
        ]
      },
      {
        id: "cowork-5",
        title: "Detalhes Plano Diário",
        description: "Informações sobre plano diário",
        content: "O plano diário custa R$50 e inclui acesso a todas as áreas comuns, internet de alta velocidade, café e água. Gostaria de reservar?",
        position: { x: 800, y: 63 },
        type: "servico" as const,
        outputPorts: [
          { id: "port-cowork5-1", label: "Reservar agora" },
          { id: "port-cowork5-2", label: "Ver outros planos" }
        ]
      },
      {
        id: "cowork-6",
        title: "Detalhes Plano Semanal",
        description: "Informações sobre plano semanal",
        content: "O plano semanal custa R$200 e inclui acesso a todas as áreas comuns, internet de alta velocidade, sala de reunião (2h/semana), café e água. Gostaria de reservar?",
        position: { x: 800, y: 200 },
        type: "servico" as const,
        outputPorts: [
          { id: "port-cowork6-1", label: "Reservar agora" },
          { id: "port-cowork6-2", label: "Ver outros planos" }
        ]
      },
      {
        id: "cowork-7",
        title: "Detalhes Plano Mensal",
        description: "Informações sobre plano mensal",
        content: "O plano mensal custa R$600 e inclui acesso 24/7, estação de trabalho fixa, sala de reunião (8h/mês), armário pessoal, impressões (100/mês) e café ilimitado. Gostaria de reservar?",
        position: { x: 800, y: 350 },
        type: "servico" as const,
        outputPorts: [
          { id: "port-cowork7-1", label: "Reservar agora" },
          { id: "port-cowork7-2", label: "Agendar visita antes" }
        ]
      },
      {
        id: "cowork-8",
        title: "Próximos Eventos",
        description: "Lista de eventos programados",
        content: "Temos os seguintes eventos programados: 1) Workshop de Marketing Digital (15/06), 2) Meetup de Desenvolvedores (22/06), 3) Palestra sobre Vendas (30/06). Gostaria de se inscrever em algum?",
        position: { x: 800, y: 500 },
        type: "pergunta-respostas" as const,
        outputPorts: [
          { id: "port-cowork8-1", label: "Inscrever em evento" },
          { id: "port-cowork8-2", label: "Mais informações" }
        ]
      },
      {
        id: "cowork-9",
        title: "Reserva de Espaço",
        description: "Aluguel para eventos",
        content: "Temos salas para eventos com capacidade de 20 a 100 pessoas. Inclui projetor, som e internet. Podemos montar um orçamento personalizado. Qual seria a data e número de participantes?",
        position: { x: 1150, y: 350 },
        type: "briefing" as const,
        outputPorts: [
          { id: "port-cowork9-1", label: "Fornecer informações" },
          { id: "port-cowork9-2", label: "Solicitar visita técnica" }
        ]
      },
      {
        id: "cowork-10",
        title: "Coleta de Dados",
        description: "Informações de contato",
        content: "Para finalizar, precisamos de seus dados. Poderia informar seu nome, e-mail e telefone?",
        position: { x: 1150, y: 200 },
        type: "contatos" as const,
        outputPorts: [
          { id: "port-cowork10-1", label: "Dados fornecidos" }
        ]
      },
      {
        id: "cowork-11",
        title: "Confirmação",
        description: "Finalização do atendimento",
        content: "Perfeito! Sua solicitação foi registrada com sucesso. Nossa equipe entrará em contato em breve para confirmar os detalhes. Agradecemos seu interesse!",
        position: { x: 1500, y: 200 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "cowork-conn-1", start: "cowork-1", end: "cowork-2", type: "custom" as const, sourceHandle: "port-cowork1-1", sourcePortLabel: "Quero conhecer os planos" },
      { id: "cowork-conn-2", start: "cowork-1", end: "cowork-3", type: "custom" as const, sourceHandle: "port-cowork1-2", sourcePortLabel: "Quero agendar uma visita" },
      { id: "cowork-conn-3", start: "cowork-1", end: "cowork-4", type: "custom" as const, sourceHandle: "port-cowork1-3", sourcePortLabel: "Informações sobre eventos" },
      { id: "cowork-conn-4", start: "cowork-2", end: "cowork-5", type: "custom" as const, sourceHandle: "port-cowork2-1", sourcePortLabel: "Plano diário" },
      { id: "cowork-conn-5", start: "cowork-2", end: "cowork-6", type: "custom" as const, sourceHandle: "port-cowork2-2", sourcePortLabel: "Plano semanal" },
      { id: "cowork-conn-6", start: "cowork-2", end: "cowork-7", type: "custom" as const, sourceHandle: "port-cowork2-3", sourcePortLabel: "Plano mensal" },
      { id: "cowork-conn-7", start: "cowork-3", end: "cowork-10", type: "custom" as const, sourceHandle: "port-cowork3-1", sourcePortLabel: "Manhã" },
      { id: "cowork-conn-8", start: "cowork-4", end: "cowork-8", type: "custom" as const, sourceHandle: "port-cowork4-1", sourcePortLabel: "Próximos eventos" },
      { id: "cowork-conn-9", start: "cowork-4", end: "cowork-9", type: "custom" as const, sourceHandle: "port-cowork4-2", sourcePortLabel: "Alugar espaço para evento" },
      { id: "cowork-conn-10", start: "cowork-5", end: "cowork-10", type: "custom" as const, sourceHandle: "port-cowork5-1", sourcePortLabel: "Reservar agora" },
      { id: "cowork-conn-11", start: "cowork-9", end: "cowork-10", type: "custom" as const, sourceHandle: "port-cowork9-1", sourcePortLabel: "Fornecer informações" },
      { id: "cowork-conn-12", start: "cowork-10", end: "cowork-11", type: "custom" as const, sourceHandle: "port-cowork10-1", sourcePortLabel: "Dados fornecidos" }
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
          { id: "port-clinic1-2", label: "Dúvidas sobre serviços" },
          { id: "port-clinic1-3", label: "Resultados de exames" }
        ]
      },
      {
        id: "clinic-2",
        title: "Agendamento de Consulta",
        description: "Paciente deseja agendar consulta",
        content: "Para agendar sua consulta, preciso de algumas informações: 1) Qual especialidade médica você procura? 2) Tem preferência de data e horário? 3) Já é paciente da clínica?",
        position: { x: 433, y: 63 },
        type: "agendar" as const,
        outputPorts: [
          { id: "port-clinic2-1", label: "Cardiologia" },
          { id: "port-clinic2-2", label: "Dermatologia" },
          { id: "port-clinic2-3", label: "Ortopedia" },
          { id: "port-clinic2-4", label: "Outra especialidade" }
        ]
      },
      {
        id: "clinic-3",
        title: "Informações sobre Serviços",
        description: "Paciente com dúvidas",
        content: "Nossa clínica oferece diversas especialidades médicas, incluindo: cardiologia, dermatologia, ortopedia, e muitas outras. Qual serviço específico você gostaria de saber mais?",
        position: { x: 433, y: 200 },
        type: "servico" as const,
        outputPorts: [
          { id: "port-clinic3-1", label: "Exames laboratoriais" },
          { id: "port-clinic3-2", label: "Cirurgias" },
          { id: "port-clinic3-3", label: "Planos de saúde" }
        ]
      },
      {
        id: "clinic-4",
        title: "Resultados de Exames",
        description: "Acesso a resultados",
        content: "Para acessar seus resultados de exames, precisamos confirmar alguns dados. Você já possui cadastro em nosso portal?",
        position: { x: 433, y: 350 },
        type: "pergunta-respostas" as const,
        outputPorts: [
          { id: "port-clinic4-1", label: "Sim, já tenho cadastro" },
          { id: "port-clinic4-2", label: "Não, preciso fazer cadastro" }
        ]
      },
      {
        id: "clinic-5",
        title: "Agendamento Cardiologia",
        description: "Consulta com cardiologista",
        content: "Temos disponibilidade com o Dr. Carlos Silva nas segundas e quartas-feiras, das 8h às 12h. Qual data seria melhor para você?",
        position: { x: 800, y: 63 },
        type: "agendar" as const,
        outputPorts: [
          { id: "port-clinic5-1", label: "Segunda-feira" },
          { id: "port-clinic5-2", label: "Quarta-feira" }
        ]
      },
      {
        id: "clinic-6",
        title: "Agendamento Dermatologia",
        description: "Consulta com dermatologista",
        content: "Temos disponibilidade com a Dra. Ana Oliveira nas terças e quintas-feiras, das 13h às 17h. Qual data seria melhor para você?",
        position: { x: 800, y: 200 },
        type: "agendar" as const,
        outputPorts: [
          { id: "port-clinic6-1", label: "Terça-feira" },
          { id: "port-clinic6-2", label: "Quinta-feira" }
        ]
      },
      {
        id: "clinic-7",
        title: "Exames Laboratoriais",
        description: "Informações sobre exames",
        content: "Realizamos diversos exames laboratoriais como hemograma, colesterol, glicemia, entre outros. Você precisa de uma requisição médica para realizá-los. Gostaria de agendar?",
        position: { x: 800, y: 350 },
        type: "servico" as const,
        outputPorts: [
          { id: "port-clinic7-1", label: "Agendar exames" },
          { id: "port-clinic7-2", label: "Mais informações" }
        ]
      },
      {
        id: "clinic-8",
        title: "Convênios e Planos",
        description: "Informações sobre convênios",
        content: "Aceitamos os seguintes convênios: Amil, Bradesco Saúde, SulAmérica, Unimed e outros. Gostaria de confirmar se seu plano tem cobertura para algum procedimento específico?",
        position: { x: 800, y: 500 },
        type: "multipla-escolha" as const,
        outputPorts: [
          { id: "port-clinic8-1", label: "Verificar cobertura" },
          { id: "port-clinic8-2", label: "Atendimento particular" }
        ]
      },
      {
        id: "clinic-9",
        title: "Cadastro de Paciente",
        description: "Coleta de informações",
        content: "Para finalizar seu agendamento, precisamos de seus dados. Poderia informar seu nome completo, data de nascimento, telefone e e-mail?",
        position: { x: 1150, y: 200 },
        type: "contatos" as const,
        outputPorts: [
          { id: "port-clinic9-1", label: "Dados fornecidos" }
        ]
      },
      {
        id: "clinic-10",
        title: "Portal do Paciente",
        description: "Acesso ao portal",
        content: "Para acessar o portal do paciente, use seu CPF como login e sua data de nascimento como senha no formato DD/MM/AAAA. Lá você encontrará todos os seus resultados de exames.",
        position: { x: 1150, y: 350 },
        type: "acao" as const,
        outputPorts: [
          { id: "port-clinic10-1", label: "Acessar portal" },
          { id: "port-clinic10-2", label: "Preciso de ajuda" }
        ]
      },
      {
        id: "clinic-11",
        title: "Confirmação",
        description: "Finalização do atendimento",
        content: "Sua consulta foi agendada com sucesso! Enviaremos um lembrete 24h antes. Lembre-se de trazer seus documentos e chegar 15 minutos antes do horário marcado.",
        position: { x: 1500, y: 200 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "clinic-conn-1", start: "clinic-1", end: "clinic-2", type: "custom" as const, sourceHandle: "port-clinic1-1", sourcePortLabel: "Agendar consulta" },
      { id: "clinic-conn-2", start: "clinic-1", end: "clinic-3", type: "custom" as const, sourceHandle: "port-clinic1-2", sourcePortLabel: "Dúvidas sobre serviços" },
      { id: "clinic-conn-3", start: "clinic-1", end: "clinic-4", type: "custom" as const, sourceHandle: "port-clinic1-3", sourcePortLabel: "Resultados de exames" },
      { id: "clinic-conn-4", start: "clinic-2", end: "clinic-5", type: "custom" as const, sourceHandle: "port-clinic2-1", sourcePortLabel: "Cardiologia" },
      { id: "clinic-conn-5", start: "clinic-2", end: "clinic-6", type: "custom" as const, sourceHandle: "port-clinic2-2", sourcePortLabel: "Dermatologia" },
      { id: "clinic-conn-6", start: "clinic-3", end: "clinic-7", type: "custom" as const, sourceHandle: "port-clinic3-1", sourcePortLabel: "Exames laboratoriais" },
      { id: "clinic-conn-7", start: "clinic-3", end: "clinic-8", type: "custom" as const, sourceHandle: "port-clinic3-3", sourcePortLabel: "Planos de saúde" },
      { id: "clinic-conn-8", start: "clinic-4", end: "clinic-10", type: "custom" as const, sourceHandle: "port-clinic4-1", sourcePortLabel: "Sim, já tenho cadastro" },
      { id: "clinic-conn-9", start: "clinic-5", end: "clinic-9", type: "custom" as const, sourceHandle: "port-clinic5-1", sourcePortLabel: "Segunda-feira" },
      { id: "clinic-conn-10", start: "clinic-6", end: "clinic-9", type: "custom" as const, sourceHandle: "port-clinic6-1", sourcePortLabel: "Terça-feira" },
      { id: "clinic-conn-11", start: "clinic-9", end: "clinic-11", type: "custom" as const, sourceHandle: "port-clinic9-1", sourcePortLabel: "Dados fornecidos" }
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
          { id: "port-mkt1-2", label: "Campanha específica" },
          { id: "port-mkt1-3", label: "Consultoria de marketing" }
        ]
      },
      {
        id: "mkt-2",
        title: "Presença Online",
        description: "Cliente interessado em presença digital",
        content: "Para melhorar sua presença online, oferecemos serviços de otimização de SEO, gestão de redes sociais e marketing de conteúdo. Qual aspecto é mais urgente para seu negócio?",
        position: { x: 433, y: 63 },
        type: "servico" as const,
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
        position: { x: 433, y: 200 },
        type: "servico" as const,
        outputPorts: [
          { id: "port-mkt3-1", label: "Lançamento de produto" },
          { id: "port-mkt3-2", label: "Aumento de vendas" },
          { id: "port-mkt3-3", label: "Reconhecimento de marca" }
        ]
      },
      {
        id: "mkt-4",
        title: "Consultoria de Marketing",
        description: "Orientação estratégica",
        content: "Nossa consultoria ajuda a identificar oportunidades e criar estratégias eficientes para seu negócio. Podemos começar com uma análise da situação atual. Qual é o seu segmento de mercado?",
        position: { x: 433, y: 350 },
        type: "briefing" as const,
        outputPorts: [
          { id: "port-mkt4-1", label: "E-commerce" },
          { id: "port-mkt4-2", label: "Serviços locais" },
          { id: "port-mkt4-3", label: "B2B" }
        ]
      },
      {
        id: "mkt-5",
        title: "Otimização de SEO",
        description: "Melhorar posicionamento em buscas",
        content: "Nosso serviço de SEO inclui análise de palavras-chave, otimização on-page, construção de links e relatórios mensais de desempenho. Você já possui um site ou precisa de um novo?",
        position: { x: 800, y: 63 },
        type: "multipla-escolha" as const,
        outputPorts: [
          { id: "port-mkt5-1", label: "Já tenho um site" },
          { id: "port-mkt5-2", label: "Preciso de um novo site" }
        ]
      },
      {
        id: "mkt-6",
        title: "Gestão de Redes Sociais",
        description: "Estratégia para mídias sociais",
        content: "Gerenciamos suas redes sociais com planejamento de conteúdo, criação de posts, monitoramento e resposta a comentários. Quais plataformas são mais relevantes para seu negócio?",
        position: { x: 800, y: 200 },
        type: "multipla-escolha" as const,
        outputPorts: [
          { id: "port-mkt6-1", label: "Instagram/Facebook" },
          { id: "port-mkt6-2", label: "LinkedIn" },
          { id: "port-mkt6-3", label: "TikTok/YouTube" }
        ]
      },
      {
        id: "mkt-7",
        title: "Marketing de Conteúdo",
        description: "Estratégia de blog e conteúdo",
        content: "Desenvolvemos artigos, e-books, infográficos e outros conteúdos para atrair e engajar seu público-alvo. Você já tem uma estratégia de conteúdo definida?",
        position: { x: 800, y: 350 },
        type: "pergunta-respostas" as const,
        outputPorts: [
          { id: "port-mkt7-1", label: "Sim, mas precisa melhorar" },
          { id: "port-mkt7-2", label: "Não, preciso começar do zero" }
        ]
      },
      {
        id: "mkt-8",
        title: "Campanha para Lançamento",
        description: "Estratégia para novos produtos",
        content: "Para lançamentos, criamos um plano completo incluindo anúncios, e-mail marketing, landing pages e conteúdo para redes sociais. Quando está previsto o lançamento?",
        position: { x: 800, y: 500 },
        type: "agendar" as const,
        outputPorts: [
          { id: "port-mkt8-1", label: "Próximo mês" },
          { id: "port-mkt8-2", label: "Próximo trimestre" }
        ]
      },
      {
        id: "mkt-9",
        title: "Briefing de Projeto",
        description: "Coleta de informações do cliente",
        content: "Para preparar uma proposta personalizada, precisamos entender melhor seu negócio. Poderia compartilhar informações sobre sua empresa, objetivos e público-alvo?",
        position: { x: 1150, y: 200 },
        type: "briefing" as const,
        outputPorts: [
          { id: "port-mkt9-1", label: "Preencher briefing agora" },
          { id: "port-mkt9-2", label: "Agendar reunião para briefing" }
        ]
      },
      {
        id: "mkt-10",
        title: "Coleta de Dados",
        description: "Informações de contato",
        content: "Para finalizarmos, precisamos de seus dados para envio da proposta. Poderia informar nome, e-mail, telefone e cargo na empresa?",
        position: { x: 1150, y: 350 },
        type: "contatos" as const,
        outputPorts: [
          { id: "port-mkt10-1", label: "Dados fornecidos" }
        ]
      },
      {
        id: "mkt-11",
        title: "Proposta Comercial",
        description: "Envio de proposta",
        content: "Baseado em suas necessidades, prepararemos uma proposta detalhada que será enviada em até 48 horas. Nossa equipe entrará em contato para agendar uma apresentação. Obrigado pelo interesse!",
        position: { x: 1500, y: 250 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "mkt-conn-1", start: "mkt-1", end: "mkt-2", type: "custom" as const, sourceHandle: "port-mkt1-1", sourcePortLabel: "Presença online" },
      { id: "mkt-conn-2", start: "mkt-1", end: "mkt-3", type: "custom" as const, sourceHandle: "port-mkt1-2", sourcePortLabel: "Campanha específica" },
      { id: "mkt-conn-3", start: "mkt-1", end: "mkt-4", type: "custom" as const, sourceHandle: "port-mkt1-3", sourcePortLabel: "Consultoria de marketing" },
      { id: "mkt-conn-4", start: "mkt-2", end: "mkt-5", type: "custom" as const, sourceHandle: "port-mkt2-1", sourcePortLabel: "SEO" },
      { id: "mkt-conn-5", start: "mkt-2", end: "mkt-6", type: "custom" as const, sourceHandle: "port-mkt2-2", sourcePortLabel: "Redes sociais" },
      { id: "mkt-conn-6", start: "mkt-2", end: "mkt-7", type: "custom" as const, sourceHandle: "port-mkt2-3", sourcePortLabel: "Marketing de conteúdo" },
      { id: "mkt-conn-7", start: "mkt-3", end: "mkt-8", type: "custom" as const, sourceHandle: "port-mkt3-1", sourcePortLabel: "Lançamento de produto" },
      { id: "mkt-conn-8", start: "mkt-5", end: "mkt-9", type: "custom" as const, sourceHandle: "port-mkt5-1", sourcePortLabel: "Já tenho um site" },
      { id: "mkt-conn-9", start: "mkt-8", end: "mkt-9", type: "custom" as const, sourceHandle: "port-mkt8-1", sourcePortLabel: "Próximo mês" },
      { id: "mkt-conn-10", start: "mkt-9", end: "mkt-10", type: "custom" as const, sourceHandle: "port-mkt9-1", sourcePortLabel: "Preencher briefing agora" },
      { id: "mkt-conn-11", start: "mkt-10", end: "mkt-11", type: "custom" as const, sourceHandle: "port-mkt10-1", sourcePortLabel: "Dados fornecidos" }
    ]
  }
};

export { templates };
