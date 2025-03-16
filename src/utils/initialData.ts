import { FlowData } from './flowTypes';
import { nanoid } from 'nanoid';

// Generate some unique IDs for ports
const port1 = `port-${nanoid(6)}`;
const port2 = `port-${nanoid(6)}`;
const port3 = `port-${nanoid(6)}`;
const port4 = `port-${nanoid(6)}`;

// Default flow data - will also serve as a "generic" template
export const initialFlowData: FlowData = {
  cards: [
    {
      id: 'card-1',
      title: 'Início da Conversa',
      description: 'Primeiro contato com o cliente',
      content: 'Olá! Como posso te ajudar hoje?',
      position: { x: -339.02, y: -77.6 },
      type: 'initial',
      outputPorts: [
        { id: port1, label: "Informações sobre serviços" },
        { id: port2, label: "Agendar atendimento" },
        { id: `port-${nanoid(6)}`, label: "Orçamento" }
      ]
    },
    {
      id: 'card-2',
      title: 'Informações sobre Serviços',
      description: 'Fornece detalhes sobre os serviços disponíveis',
      content: 'Oferecemos diversos serviços. Qual deles você tem interesse?',
      position: { x: 90.80, y: -176.10 },
      type: 'servico',
      outputPorts: [
        { id: port3, label: "Serviço A" },
        { id: `port-${nanoid(6)}`, label: "Serviço B" },
        { id: `port-${nanoid(6)}`, label: "Serviço C" }
      ]
    },
    {
      id: 'card-3',
      title: 'Agendar Atendimento',
      description: 'Opções de agendamento',
      content: 'Podemos agendar um atendimento. Qual horário seria melhor para você?',
      position: { x: 552.00, y: -300.00 },
      type: 'agendar',
      outputPorts: [
        { id: port4, label: "Manhã" },
        { id: `port-${nanoid(6)}`, label: "Tarde" }
      ]
    },
    {
      id: 'card-4',
      title: 'Finalização',
      description: 'Encerramento da conversa',
      content: 'Obrigado pelo seu contato! Estamos à disposição para ajudar.',
      position: { x: 1056.00, y: -399.60 },
      type: 'end'
    },
    {
      id: 'card-5',
      title: 'Orçamento',
      description: 'Solicitação de orçamento',
      content: 'Para elaborarmos um orçamento, precisamos de algumas informações. Qual serviço você deseja?',
      position: { x: 1244.42, y: 88.86 },
      type: 'ordem-servico',
      outputPorts: [
        { id: `port-${nanoid(6)}`, label: "Prosseguir" }
      ]
    },
    {
      id: 'card-6',
      title: 'Contatos',
      description: 'Coleta de informações de contato',
      content: 'Para dar continuidade, poderia me informar seu nome e telefone para contato?',
      position: { x: 154.00, y: 242.00 },
      type: 'contatos',
      outputPorts: [
        { id: `port-${nanoid(6)}`, label: "Finalizar" }
      ]
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
      end: 'card-6',
      type: 'custom',
      sourceHandle: port4
    },
    {
      id: 'conn-5',
      start: 'card-1',
      end: 'card-5',
      type: 'custom',
      sourceHandle: `port-${nanoid(6)}`
    },
    {
      id: 'conn-6',
      start: 'card-6',
      end: 'card-4',
      type: 'custom',
      sourceHandle: `port-${nanoid(6)}`
    }
  ]
};

// Now let's update the positions in the template data too
export const templates = {
  imobiliaria: {
    cards: [
      {
        id: "imob-1",
        title: "Boas-vindas Imobiliária",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo à Imobiliária Exemplo. Como posso ajudar você hoje? Está procurando imóveis para compra, venda ou aluguel?",
        position: { x: -339.02, y: -77.6 },
        type: "initial",
        outputPorts: [
          { id: "port-imob1-1", label: "Procurando imóvel para compra" },
          { id: "port-imob1-2", label: "Procurando imóvel para aluguel" },
          { id: "port-imob1-3", label: "Quero vender/alugar meu imóvel" },
          { id: "port-imob1-4", label: "Informações sobre financiamento" }
        ]
      },
      {
        id: "imob-2",
        title: "Compra de Imóvel",
        description: "Cliente quer comprar imóvel",
        content: "Ótimo! Temos diversas opções para compra. Qual tipo de imóvel você está procurando? Apartamento, casa, terreno?",
        position: { x: 90.80, y: -176.10 },
        type: "imovel",
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
        position: { x: 552.00, y: -300.00 },
        type: "imovel-usado",
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
        position: { x: 1056.00, y: -399.60 },
        type: "multipla-escolha",
        outputPorts: [
          { id: "port-imob4-1", label: "Vender meu imóvel" },
          { id: "port-imob4-2", label: "Colocar para aluguel" }
        ]
      },
      {
        id: "imob-5",
        title: "Lançamentos",
        description: "Informações sobre lançamentos",
        content: "Temos diversos empreendimentos em lançamento! Está interessado em qual região da cidade?",
        position: { x: 1244.42, y: 88.86 },
        type: "imovel-lancamento",
        outputPorts: [
          { id: "port-imob5-1", label: "Zona Sul" },
          { id: "port-imob5-2", label: "Zona Norte" },
          { id: "port-imob5-3", label: "Centro" }
        ]
      },
      {
        id: "imob-6",
        title: "Agendamento de Visitas",
        description: "Cliente quer visitar imóveis",
        content: "Ótimo! Vamos agendar uma visita ao imóvel. Qual seria o melhor dia e horário para você?",
        position: { x: 154.00, y: 242.00 },
        type: "agendar-visita",
        outputPorts: [
          { id: "port-imob6-1", label: "Próximos dias" },
          { id: "port-imob6-2", label: "Próxima semana" }
        ]
      },
      {
        id: "imob-7",
        title: "Coleta de Dados",
        description: "Receber informações do cliente",
        content: "Para dar continuidade ao atendimento, por favor, informe seu nome completo, telefone e e-mail.",
        position: { x: 1783.07, y: 56.31 },
        type: "contatos",
        outputPorts: [
          { id: "port-imob7-1", label: "Informações enviadas" }
        ]
      },
      {
        id: "imob-8",
        title: "Financiamento",
        description: "Informações sobre financiamento",
        content: "Trabalhamos com diversas opções de financiamento. Você já tem pré-aprovação de algum banco ou gostaria de uma simulação?",
        position: { x: 938.00, y: 418.00 },
        type: "pergunta-respostas",
        outputPorts: [
          { id: "port-imob8-1", label: "Quero uma simulação" },
          { id: "port-imob8-2", label: "Já tenho pré-aprovação" }
        ]
      },
      {
        id: "imob-9",
        title: "Simulação de Financiamento",
        description: "Calcular financiamento",
        content: "Para realizarmos uma simulação de financiamento, preciso de algumas informações: valor aproximado do imóvel, entrada disponível e sua renda mensal.",
        position: { x: 750, y: 750 },
        type: "briefing",
        outputPorts: [
          { id: "port-imob9-1", label: "Continuar" }
        ]
      },
      {
        id: "imob-10",
        title: "Documentação",
        description: "Documentos necessários",
        content: "Para avançarmos no processo, serão necessários alguns documentos: RG, CPF, comprovante de renda e comprovante de residência.",
        position: { x: 750, y: 600 },
        type: "html",
        outputPorts: [
          { id: "port-imob10-1", label: "Entendi" }
        ]
      },
      {
        id: "imob-11",
        title: "Imóveis Comerciais",
        description: "Opções comerciais",
        content: "Temos diversas opções de imóveis comerciais: salas, lojas, galpões, etc. Qual tipo você procura?",
        position: { x: 750, y: 100 },
        type: "imovel-comercial",
        outputPorts: [
          { id: "port-imob11-1", label: "Salas" },
          { id: "port-imob11-2", label: "Lojas" },
          { id: "port-imob11-3", label: "Galpões" }
        ]
      },
      {
        id: "imob-12",
        title: "Finalização",
        description: "Encerramento do atendimento",
        content: "Obrigado pelo seu interesse. Um de nossos corretores entrará em contato em breve para dar continuidade ao seu atendimento.",
        position: { x: 1050, y: 400 },
        type: "end"
      }
    ],
    connections: [
      { id: "imob-conn-1", start: "imob-1", end: "imob-2", type: "custom", sourceHandle: "port-imob1-1", sourcePortLabel: "Procurando imóvel para compra" },
      { id: "imob-conn-2", start: "imob-1", end: "imob-3", type: "custom", sourceHandle: "port-imob1-2", sourcePortLabel: "Procurando imóvel para aluguel" },
      { id: "imob-conn-3", start: "imob-1", end: "imob-4", type: "custom", sourceHandle: "port-imob1-3", sourcePortLabel: "Quero vender/alugar meu imóvel" },
      { id: "imob-conn-4", start: "imob-1", end: "imob-8", type: "custom", sourceHandle: "port-imob1-4", sourcePortLabel: "Informações sobre financiamento" },
      { id: "imob-conn-5", start: "imob-2", end: "imob-6", type: "custom", sourceHandle: "port-imob2-1", sourcePortLabel: "Apartamento" },
      { id: "imob-conn-6", start: "imob-3", end: "imob-6", type: "custom", sourceHandle: "port-imob3-1", sourcePortLabel: "Residencial" },
      { id: "imob-conn-7", start: "imob-3", end: "imob-11", type: "custom", sourceHandle: "port-imob3-2", sourcePortLabel: "Comercial" },
      { id: "imob-conn-8", start: "imob-4", end: "imob-7", type: "custom", sourceHandle: "port-imob4-1", sourcePortLabel: "Vender meu imóvel" },
      { id: "imob-conn-9", start: "imob-6", end: "imob-7", type: "custom", sourceHandle: "port-imob6-1", sourcePortLabel: "Próximos dias" },
      { id: "imob-conn-10", start: "imob-7", end: "imob-12", type: "custom", sourceHandle: "port-imob7-1", sourcePortLabel: "Informações enviadas" },
      { id: "imob-conn-11", start: "imob-8", end: "imob-9", type: "custom", sourceHandle: "port-imob8-1", sourcePortLabel: "Quero uma simulação" },
      { id: "imob-conn-12", start: "imob-8", end: "imob-10", type: "custom", sourceHandle: "port-imob8-2", sourcePortLabel: "Já tenho pré-aprovação" },
      { id: "imob-conn-13", start: "imob-9", end: "imob-7", type: "custom", sourceHandle: "port-imob9-1", sourcePortLabel: "Continuar" },
      { id: "imob-conn-14", start: "imob-10", end: "imob-7", type: "custom", sourceHandle: "port-imob10-1", sourcePortLabel: "Entendi" },
      { id: "imob-conn-15", start: "imob-11", end: "imob-6", type: "custom", sourceHandle: "port-imob11-1", sourcePortLabel: "Salas" }
    ]
  },
  coworking: {
    cards: [
      {
        id: "cowork-1",
        title: "Boas-vindas Coworking",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo ao Espaço Colaborativo. Como posso ajudar você hoje? Está interessado em conhecer nossos planos ou agendar uma visita?",
        position: { x: -339.02, y: -77.6 },
        type: "initial",
        outputPorts: [
          { id: "port-cowork1-1", label: "Quero conhecer os planos" },
          { id: "port-cowork1-2", label: "Quero agendar uma visita" },
          { id: "port-cowork1-3", label: "Eventos e workshops" },
          { id: "port-cowork1-4", label: "Salas para reuniões" }
        ]
      },
      {
        id: "cowork-2",
        title: "Interesse em Planos",
        description: "Cliente interessado nos planos",
        content: "Temos diversos planos para atender suas necessidades. Temos plano diário, semanal e mensal. Qual deles melhor atende sua necessidade?",
        position: { x: 90.80, y: -176.10 },
        type: "servico",
        outputPorts: [
          { id: "port-cowork2-1", label: "Plano diário" },
          { id: "port-cowork2-2", label: "Plano semanal" },
          { id: "port-cowork2-3", label: "Plano mensal" },
          { id: "port-cowork2-4", label: "Plano para equipes" }
        ]
      },
      {
        id: "cowork-3",
        title: "Agendamento de Visita",
        description: "Cliente quer conhecer o espaço",
        content: "Ficaremos felizes em recebê-lo para conhecer nosso espaço. Temos disponibilidade nos seguintes horários: [lista de horários]. Qual seria melhor para você?",
        position: { x: 552.00, y: -300.00 },
        type: "agendar",
        outputPorts: [
          { id: "port-cowork3-1", label: "Manhã" },
          { id: "port-cowork3-2", label: "Tarde" }
        ]
      },
      {
        id: "cowork-4",
        title: "Eventos e Workshops",
        description: "Informações sobre eventos",
        content: "Organizamos diversos eventos e workshops em nosso espaço. Temos eventos de networking, palestras temáticas e workshops de capacitação. Qual tipo te interessa?",
        position: { x: 1056.00, y: -399.60 },
        type: "multipla-escolha",
        outputPorts: [
          { id: "port-cowork4-1", label: "Networking" },
          { id: "port-cowork4-2", label: "Palestras" },
          { id: "port-cowork4-3", label: "Workshops" }
        ]
      },
      {
        id: "cowork-5",
        title: "Salas para Reuniões",
        description: "Reserva de salas",
        content: "Nossas salas de reunião são equipadas com tela, projetor e videoconferência. Temos opções para 4, 8 e 16 pessoas. Qual tamanho você precisa?",
        position: { x: 1244.42, y: 88.86 },
        type: "agendar-reuniao",
        outputPorts: [
          { id: "port-cowork5-1", label: "Sala pequena (4 pessoas)" },
          { id: "port-cowork5-2", label: "Sala média (8 pessoas)" },
          { id: "port-cowork5-3", label: "Sala grande (16 pessoas)" }
        ]
      },
      {
        id: "cowork-6",
        title: "Detalhes do Plano Diário",
        description: "Informações sobre plano diário",
        content: "Nosso plano diário dá acesso ao espaço por um dia inteiro, com direito a internet, café e uso da copa. O valor é R$ 70,00 por dia. Deseja contratar?",
        position: { x: 154.00, y: 242.00 },
        type: "produto",
        outputPorts: [
          { id: "port-cowork6-1", label: "Contratar" },
          { id: "port-cowork6-2", label: "Ver outros planos" }
        ]
      },
      {
        id: "cowork-7",
        title: "Detalhes do Plano Mensal",
        description: "Informações sobre plano mensal",
        content: "Nosso plano mensal oferece acesso ilimitado ao espaço, com estação fixa, armário e 4 horas de sala de reunião inclusas. O valor é R$ 750,00 por mês.",
        position: { x: 1783.07, y: 56.31 },
        type: "produto",
        outputPorts: [
          { id: "port-cowork7-1", label: "Contratar" },
          { id: "port-cowork7-2", label: "Ver outros planos" }
        ]
      },
      {
        id: "cowork-8",
        title: "Formulário de Contrato",
        description: "Coleta de dados para contrato",
        content: "Para finalizarmos a contratação, precisamos de seus dados. Por favor, informe nome completo, CPF, telefone e email.",
        position: { x: 938.00, y: 418.00 },
        type: "contatos",
        outputPorts: [
          { id: "port-cowork8-1", label: "Dados enviados" }
        ]
      },
      {
        id: "cowork-9",
        title: "Confirmação de Visita",
        description: "Visita agendada",
        content: "Sua visita está agendada! Aguardamos você em nosso endereço: Rua Exemplo, 123. Por favor, chegue com 10 minutos de antecedência.",
        position: { x: 600, y: 550 },
        type: "briefing",
        outputPorts: [
          { id: "port-cowork9-1", label: "Confirmar" }
        ]
      },
      {
        id: "cowork-10",
        title: "Tour Virtual",
        description: "Visita online ao espaço",
        content: "Conheça nosso espaço através de um tour virtual! Clique no link para visualizar todas as nossas instalações: [link do tour]",
        position: { x: 600, y: 700 },
        type: "html",
        outputPorts: [
          { id: "port-cowork10-1", label: "Já vi o tour" }
        ]
      },
      {
        id: "cowork-11",
        title: "Planos para Equipes",
        description: "Planos corporativos",
        content: "Para equipes, oferecemos salas privativas com 4 a 12 posições, acesso 24/7, endereço fiscal e recepcionista. Preços a partir de R$ 2.500,00.",
        position: { x: 900, y: 150 },
        type: "produto",
        outputPorts: [
          { id: "port-cowork11-1", label: "Quero um orçamento" },
          { id: "port-cowork11-2", label: "Agendar visita" }
        ]
      },
      {
        id: "cowork-12",
        title: "Finalização",
        description: "Encerramento do atendimento",
        content: "Perfeito! Nossa equipe entrará em contato em breve para confirmar. Agradecemos seu interesse em nosso espaço de coworking!",
        position: { x: 900, y: 400 },
        type: "end"
      }
    ],
    connections: [
      { id: "cowork-conn-1", start: "cowork-1", end: "cowork-2", type: "custom", sourceHandle: "port-cowork1-1", sourcePortLabel: "Quero conhecer os planos" },
      { id: "cowork-conn-2", start: "cowork-1", end: "cowork-3", type: "custom", sourceHandle: "port-cowork1-2", sourcePortLabel: "Quero agendar uma visita" },
      { id: "cowork-conn-3", start: "cowork-1", end: "cowork-4", type: "custom", sourceHandle: "port-cowork1-3", sourcePortLabel: "Eventos e workshops" },
      { id: "cowork-conn-4", start: "cowork-1", end: "cowork-5", type: "custom", sourceHandle: "port-cowork1-4", sourcePortLabel: "Salas para reuniões" },
      { id: "cowork-conn-5", start: "cowork-2", end: "cowork-6", type: "custom", sourceHandle: "port-cowork2-1", sourcePortLabel: "Plano diário" },
      { id: "cowork-conn-6", start: "cowork-2", end: "cowork-7", type: "custom", sourceHandle: "port-cowork2-3", sourcePortLabel: "Plano mensal" },
      { id: "cowork-conn-7", start: "cowork-2", end: "cowork-11", type: "custom", sourceHandle: "port-cowork2-4", sourcePortLabel: "Plano para equipes" },
      { id: "cowork-conn-8", start: "cowork-3", end: "cowork-9", type: "custom", sourceHandle: "port-cowork3-1", sourcePortLabel: "Manhã" },
      { id: "cowork-conn-9", start: "cowork-6", end: "cowork-8", type: "custom", sourceHandle: "port-cowork6-1", sourcePortLabel: "Contratar" },
      { id: "cowork-conn-10", start: "cowork-7", end: "cowork-8", type: "custom", sourceHandle: "port-cowork7-1", sourcePortLabel: "Contratar" },
      { id: "cowork-conn-11", start: "cowork-8", end: "cowork-12", type: "custom", sourceHandle: "port-cowork8-1", sourcePortLabel: "Dados enviados" },
      { id: "cowork-conn-12", start: "cowork-9", end: "cowork-12", type: "custom", sourceHandle: "port-cowork9-1", sourcePortLabel: "Confirmar" },
      { id: "cowork-conn-13", start: "cowork-5", end: "cowork-8", type: "custom", sourceHandle: "port-cowork5-1", sourcePortLabel: "Sala pequena (4 pessoas)" },
      { id: "cowork-conn-14", start: "cowork-11", end: "cowork-3", type: "custom", sourceHandle: "port-cowork11-2", sourcePortLabel: "Agendar visita" },
      { id: "cowork-conn-15", start: "cowork-4", end: "cowork-10", type: "custom", sourceHandle: "port-cowork4-2", sourcePortLabel: "Palestras" }
    ]
  },
  clinica: {
    cards: [
      {
        id: "clinic-1",
        title: "Boas-vindas Clínica",
        description: "Primeiro contato com paciente",
        content: "Olá! Bem-vindo à Clínica Saúde Total. Como posso ajudar você hoje? Deseja agendar uma consulta ou tirar dúvidas sobre nossos serviços?",
        position: { x: -339.02, y: -77.6 },
        type: "initial",
        outputPorts: [
          { id: "port-clinic1-1", label: "Agendar consulta" },
          { id: "port-clinic1-2", label: "Dúvidas sobre serviços" },
          { id: "port-clinic1-3", label: "Resultados de exames" },
          { id: "port-clinic1-4", label: "Informações sobre convênios" }
        ]
      },
      {
        id: "clinic-2",
        title: "Agendamento de Consulta",
        description: "Paciente deseja agendar consulta",
        content: "Para agendar sua consulta, preciso de algumas informações: 1) Qual especialidade médica você procura? 2) Tem preferência de data e horário? 3) Já é paciente da clínica?",
        position: { x: 90.80, y: -176.10 },
        type: "agendar",
        outputPorts: [
          { id: "port-clinic2-1", label: "Cardiologia" },
          { id: "port-clinic2-2", label: "Dermatologia" },
          { id: "port-clinic2-3", label: "Ortopedia" },
          { id: "port-clinic2-4", label: "Outras especialidades" }
        ]
      },
      {
        id: "clinic-3",
        title: "Informações sobre Serviços",
        description: "Paciente com dúvidas",
        content: "Nossa clínica oferece diversas especialidades médicas, incluindo: cardiologia, dermatologia, ortopedia, e muitas outras. Qual serviço específico você gostaria de saber mais?",
        position: { x: 552.00, y: -300.00 },
        type: "servico",
        outputPorts: [
          { id: "port-clinic3-1", label: "Exames laboratoriais" },
          { id: "port-clinic3-2", label: "Cirurgias" },
          { id: "port-clinic3-3", label: "Tratamentos estéticos" },
          { id: "port-clinic3-4", label: "Fisioterapia" }
        ]
      },
      {
        id: "clinic-4",
        title: "Resultados de Exames",
        description: "Acesso a resultados",
        content: "Para acessar seus resultados de exames, precisamos confirmar seus dados. Por favor, informe seu CPF e data de nascimento.",
        position: { x: 1056.00, y: -399.60 },
        type: "contatos",
        outputPorts: [
          { id: "port-clinic4-1", label: "Dados confirmados" }
        ]
      },
      {
        id: "clinic-5",
        title: "Informações sobre Convênios",
        description: "Convênios aceitos",
        content: "Trabalhamos com diversos convênios médicos, incluindo: Unimed, Bradesco Saúde, Amil, SulAmérica, entre outros. Qual convênio você utiliza?",
        position: { x: 1244.42, y: 88.86 },
        type: "multipla-escolha",
        outputPorts: [
          { id: "port-clinic5-1", label: "Unimed" },
          { id: "port-clinic5-2", label: "Bradesco Saúde" },
          { id: "port-clinic5-3", label: "Outros convênios" },
          { id: "port-clinic5-4", label: "Não tenho convênio" }
        ]
      },
      {
        id: "clinic-6",
        title: "Cardiologia",
        description: "Especialidade médica",
        content: "Na nossa clínica, o departamento de Cardiologia realiza consultas, exames cardiológicos como eletrocardiograma, teste ergométrico e holter. Deseja agendar?",
        position: { x: 154.00, y: 242.00 },
        type: "servico",
        outputPorts: [
          { id: "port-clinic6-1", label: "Agendar consulta" },
          { id: "port-clinic6-2", label: "Agendar exame" }
        ]
      },
      {
        id: "clinic-7",
        title: "Exames Laboratoriais",
        description: "Informações sobre exames",
        content: "Realizamos todos os tipos de exames laboratoriais, com coleta a partir das 6h da manhã até às 16h. É necessário jejum para alguns exames.",
        position: { x: 1783.07, y: 56.31 },
        type: "produto",
        outputPorts: [
          { id: "port-clinic7-1", label: "Agendar coleta" },
          { id: "port-clinic7-2", label: "Tirar dúvidas sobre preparo" }
        ]
      },
      {
        id: "clinic-8",
        title: "Cadastro de Paciente",
        description: "Coleta de dados",
        content: "Para finalizar o agendamento, preciso registrar ou atualizar seu cadastro. Por favor, informe: nome completo, CPF, data de nascimento, endereço, telefone e email.",
        position: { x: 938.00, y: 418.00 },
        type: "briefing",
        outputPorts
