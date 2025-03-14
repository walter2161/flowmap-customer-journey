
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
      position: { x: 250, y: 50 },
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
      position: { x: 100, y: 250 },
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
      position: { x: 400, y: 250 },
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
      position: { x: 250, y: 450 },
      type: 'end'
    },
    {
      id: 'card-5',
      title: 'Orçamento',
      description: 'Solicitação de orçamento',
      content: 'Para elaborarmos um orçamento, precisamos de algumas informações. Qual serviço você deseja?',
      position: { x: 600, y: 250 },
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
      position: { x: 400, y: 450 },
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

// Templates data
export const templates = {
  imobiliaria: {
    cards: [
      {
        id: "imob-1",
        title: "Boas-vindas Imobiliária",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo à Imobiliária Exemplo. Como posso ajudar você hoje? Está procurando imóveis para compra, venda ou aluguel?",
        position: { x: 71, y: 32 },
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
        position: { x: 400, y: 150 },
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
        position: { x: 400, y: 300 },
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
        position: { x: 400, y: 450 },
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
        position: { x: 400, y: 600 },
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
        position: { x: 750, y: 250 },
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
        position: { x: 750, y: 400 },
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
        position: { x: 400, y: 750 },
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
        position: { x: 71, y: 32 },
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
        position: { x: 300, y: 150 },
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
        position: { x: 300, y: 300 },
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
        position: { x: 300, y: 450 },
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
        position: { x: 300, y: 600 },
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
        position: { x: 600, y: 100 },
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
        position: { x: 600, y: 250 },
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
        position: { x: 600, y: 400 },
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
        position: { x: 71, y: 32 },
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
        position: { x: 300, y: 150 },
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
        position: { x: 300, y: 300 },
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
        position: { x: 300, y: 450 },
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
        position: { x: 300, y: 600 },
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
        position: { x: 600, y: 100 },
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
        position: { x: 600, y: 250 },
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
        position: { x: 600, y: 400 },
        type: "briefing",
        outputPorts: [
          { id: "port-clinic8-1", label: "Dados enviados" }
        ]
      },
      {
        id: "clinic-9",
        title: "Portal do Paciente",
        description: "Acesso online",
        content: "Você pode acessar seus resultados de exames através do nosso Portal do Paciente. Acesse: www.clinicasaudetotal.com.br/portal e faça login com seu CPF e data de nascimento.",
        position: { x: 600, y: 550 },
        type: "html",
        outputPorts: [
          { id: "port-clinic9-1", label: "Entendi" }
        ]
      },
      {
        id: "clinic-10",
        title: "Tratamentos Estéticos",
        description: "Procedimentos estéticos",
        content: "Nosso departamento de estética oferece diversos tratamentos: botox, preenchimento, peeling, tratamentos para manchas e rejuvenescimento facial e corporal.",
        position: { x: 600, y: 700 },
        type: "produto",
        outputPorts: [
          { id: "port-clinic10-1", label: "Quero uma avaliação" },
          { id: "port-clinic10-2", label: "Preços" }
        ]
      },
      {
        id: "clinic-11",
        title: "Preparo para Exames",
        description: "Instruções pré-exame",
        content: "Para a maioria dos exames de sangue é necessário jejum de 8 a 12 horas. Evite atividades físicas intensas no dia anterior e informe sobre medicamentos em uso.",
        position: { x: 900, y: 250 },
        type: "pergunta-respostas",
        outputPorts: [
          { id: "port-clinic11-1", label: "Entendi" }
        ]
      },
      {
        id: "clinic-12",
        title: "Confirmação",
        description: "Finalização do atendimento",
        content: "Sua consulta foi agendada com sucesso! Enviaremos um lembrete 24h antes. Lembre-se de trazer seus documentos e chegar 15 minutos antes do horário marcado.",
        position: { x: 900, y: 400 },
        type: "end"
      }
    ],
    connections: [
      { id: "clinic-conn-1", start: "clinic-1", end: "clinic-2", type: "custom", sourceHandle: "port-clinic1-1", sourcePortLabel: "Agendar consulta" },
      { id: "clinic-conn-2", start: "clinic-1", end: "clinic-3", type: "custom", sourceHandle: "port-clinic1-2", sourcePortLabel: "Dúvidas sobre serviços" },
      { id: "clinic-conn-3", start: "clinic-1", end: "clinic-4", type: "custom", sourceHandle: "port-clinic1-3", sourcePortLabel: "Resultados de exames" },
      { id: "clinic-conn-4", start: "clinic-1", end: "clinic-5", type: "custom", sourceHandle: "port-clinic1-4", sourcePortLabel: "Informações sobre convênios" },
      { id: "clinic-conn-5", start: "clinic-2", end: "clinic-6", type: "custom", sourceHandle: "port-clinic2-1", sourcePortLabel: "Cardiologia" },
      { id: "clinic-conn-6", start: "clinic-3", end: "clinic-7", type: "custom", sourceHandle: "port-clinic3-1", sourcePortLabel: "Exames laboratoriais" },
      { id: "clinic-conn-7", start: "clinic-3", end: "clinic-10", type: "custom", sourceHandle: "port-clinic3-3", sourcePortLabel: "Tratamentos estéticos" },
      { id: "clinic-conn-8", start: "clinic-4", end: "clinic-9", type: "custom", sourceHandle: "port-clinic4-1", sourcePortLabel: "Dados confirmados" },
      { id: "clinic-conn-9", start: "clinic-6", end: "clinic-8", type: "custom", sourceHandle: "port-clinic6-1", sourcePortLabel: "Agendar consulta" },
      { id: "clinic-conn-10", start: "clinic-7", end: "clinic-11", type: "custom", sourceHandle: "port-clinic7-2", sourcePortLabel: "Tirar dúvidas sobre preparo" },
      { id: "clinic-conn-11", start: "clinic-7", end: "clinic-8", type: "custom", sourceHandle: "port-clinic7-1", sourcePortLabel: "Agendar coleta" },
      { id: "clinic-conn-12", start: "clinic-8", end: "clinic-12", type: "custom", sourceHandle: "port-clinic8-1", sourcePortLabel: "Dados enviados" },
      { id: "clinic-conn-13", start: "clinic-9", end: "clinic-12", type: "custom", sourceHandle: "port-clinic9-1", sourcePortLabel: "Entendi" },
      { id: "clinic-conn-14", start: "clinic-10", end: "clinic-8", type: "custom", sourceHandle: "port-clinic10-1", sourcePortLabel: "Quero uma avaliação" },
      { id: "clinic-conn-15", start: "clinic-11", end: "clinic-12", type: "custom", sourceHandle: "port-clinic11-1", sourcePortLabel: "Entendi" }
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
        type: "initial",
        outputPorts: [
          { id: "port-mkt1-1", label: "Presença online" },
          { id: "port-mkt1-2", label: "Campanha específica" },
          { id: "port-mkt1-3", label: "Gestão de redes sociais" },
          { id: "port-mkt1-4", label: "Desenvolvimento de site" }
        ]
      },
      {
        id: "mkt-2",
        title: "Presença Online",
        description: "Cliente interessado em presença digital",
        content: "Para melhorar sua presença online, oferecemos serviços de otimização de SEO, gestão de redes sociais e marketing de conteúdo. Qual aspecto é mais urgente para seu negócio?",
        position: { x: 300, y: 150 },
        type: "servico",
        outputPorts: [
          { id: "port-mkt2-1", label: "SEO" },
          { id: "port-mkt2-2", label: "Redes sociais" },
          { id: "port-mkt2-3", label: "Marketing de conteúdo" },
          { id: "port-mkt2-4", label: "Consultoria completa" }
        ]
      },
      {
        id: "mkt-3",
        title: "Campanhas Específicas",
        description: "Cliente interessado em campanhas",
        content: "Desenvolvemos campanhas personalizadas para diversos objetivos: lançamento de produtos, aumento de vendas, reconhecimento de marca. Qual é o principal objetivo da sua campanha?",
        position: { x: 300, y: 300 },
        type: "acao",
        outputPorts: [
          { id: "port-mkt3-1", label: "Lançamento de produto" },
          { id: "port-mkt3-2", label: "Aumento de vendas" },
          { id: "port-mkt3-3", label: "Reconhecimento de marca" },
          { id: "port-mkt3-4", label: "Geração de leads" }
        ]
      },
      {
        id: "mkt-4",
        title: "Gestão de Redes Sociais",
        description: "Serviços para redes sociais",
        content: "Nossa equipe pode cuidar integralmente das suas redes sociais, incluindo criação de conteúdo, planejamento editorial, design de posts e interação com seguidores.",
        position: { x: 300, y: 450 },
        type: "produto",
        outputPorts: [
          { id: "port-mkt4-1", label: "Instagram e Facebook" },
          { id: "port-mkt4-2", label: "LinkedIn" },
          { id: "port-mkt4-3", label: "TikTok e YouTube" },
          { id: "port-mkt4-4", label: "Todas as redes" }
        ]
      },
      {
        id: "mkt-5",
        title: "Desenvolvimento de Site",
        description: "Criação de website",
        content: "Desenvolvemos sites responsivos, otimizados para SEO e com foco em conversão. Temos opções desde landing pages até e-commerces complexos. O que você procura?",
        position: { x: 300, y: 600 },
        type: "produto",
        outputPorts: [
          { id: "port-mkt5-1", label: "Site institucional" },
          { id: "port-mkt5-2", label: "E-commerce" },
          { id: "port-mkt5-3", label: "Landing page" },
          { id: "port-mkt5-4", label: "Blog" }
        ]
      },
      {
        id: "mkt-6",
        title: "SEO",
        description: "Otimização para buscadores",
        content: "Nossos serviços de SEO incluem análise técnica, otimização on-page, construção de backlinks e geração de conteúdo otimizado para palavras-chave relevantes.",
        position: { x: 600, y: 100 },
        type: "servico",
        outputPorts: [
          { id: "port-mkt6-1", label: "Quero uma análise gratuita" },
          { id: "port-mkt6-2", label: "Contratar pacote mensal" }
        ]
      },
      {
        id: "mkt-7",
        title: "Campanha de Lançamento",
        description: "Lançamento de produtos/serviços",
        content: "Nossa estratégia de lançamento cria expectativa, engajamento e conversões, com ações integradas em diversos canais digitais e físicos.",
        position: { x: 600, y: 250 },
        type: "briefing",
        outputPorts: [
          { id: "port-mkt7-1", label: "Quero saber mais" },
          { id: "port-mkt7-2", label: "Solicitar orçamento" }
        ]
      },
      {
        id: "mkt-8",
        title: "Briefing do Projeto",
        description: "Coleta de informações",
        content: "Para elaborarmos uma proposta sob medida, precisamos entender melhor seu negócio. Por favor, informe área de atuação, público-alvo, objetivos e concorrentes principais.",
        position: { x: 600, y: 400 },
        type: "briefing",
        outputPorts: [
          { id: "port-mkt8-1", label: "Preencher briefing" }
        ]
      },
      {
        id: "mkt-9",
        title: "E-commerce",
        description: "Desenvolvimento de loja virtual",
        content: "Desenvolvemos lojas virtuais completas, com integração de pagamento, gestão de estoque, múltiplos canais de venda e experiência mobile otimizada.",
        position: { x: 600, y: 550 },
        type: "ordem-servico",
        outputPorts: [
          { id: "port-mkt9-1", label: "Ver portfolio" },
          { id: "port-mkt9-2", label: "Solicitar orçamento" }
        ]
      },
      {
        id: "mkt-10",
        title: "Portfolio da Agência",
        description: "Exemplos de trabalhos",
        content: "Veja alguns dos nossos cases de sucesso em: www.impactodigital.com.br/portfolio. Trabalhamos com empresas de diversos portes e segmentos.",
        position: { x: 600, y: 700 },
        type: "html",
        outputPorts: [
          { id: "port-mkt10-1", label: "Já vi o portfolio" }
        ]
      },
      {
        id: "mkt-11",
        title: "Dados para Contato",
        description: "Coleta de informações",
        content: "Para darmos continuidade, precisamos de seus dados para contato. Por favor, informe nome, empresa, telefone e email.",
        position: { x: 900, y: 400 },
        type: "contatos",
        outputPorts: [
          { id: "port-mkt11-1", label: "Dados enviados" }
        ]
      },
      {
        id: "mkt-12",
        title: "Proposta Comercial",
        description: "Envio de proposta",
        content: "Baseado em suas necessidades, prepararemos uma proposta detalhada. Nossa equipe entrará em contato em até 24 horas úteis para apresentá-la.",
        position: { x: 900, y: 550 },
        type: "end"
      }
    ],
    connections: [
      { id: "mkt-conn-1", start: "mkt-1", end: "mkt-2", type: "custom", sourceHandle: "port-mkt1-1", sourcePortLabel: "Presença online" },
      { id: "mkt-conn-2", start: "mkt-1", end: "mkt-3", type: "custom", sourceHandle: "port-mkt1-2", sourcePortLabel: "Campanha específica" },
      { id: "mkt-conn-3", start: "mkt-1", end: "mkt-4", type: "custom", sourceHandle: "port-mkt1-3", sourcePortLabel: "Gestão de redes sociais" },
      { id: "mkt-conn-4", start: "mkt-1", end: "mkt-5", type: "custom", sourceHandle: "port-mkt1-4", sourcePortLabel: "Desenvolvimento de site" },
      { id: "mkt-conn-5", start: "mkt-2", end: "mkt-6", type: "custom", sourceHandle: "port-mkt2-1", sourcePortLabel: "SEO" },
      { id: "mkt-conn-6", start: "mkt-3", end: "mkt-7", type: "custom", sourceHandle: "port-mkt3-1", sourcePortLabel: "Lançamento de produto" },
      { id: "mkt-conn-7", start: "mkt-4", end: "mkt-8", type: "custom", sourceHandle: "port-mkt4-4", sourcePortLabel: "Todas as redes" },
      { id: "mkt-conn-8", start: "mkt-5", end: "mkt-9", type: "custom", sourceHandle: "port-mkt5-2", sourcePortLabel: "E-commerce" },
      { id: "mkt-conn-9", start: "mkt-6", end: "mkt-8", type: "custom", sourceHandle: "port-mkt6-1", sourcePortLabel: "Quero uma análise gratuita" },
      { id: "mkt-conn-10", start: "mkt-7", end: "mkt-8", type: "custom", sourceHandle: "port-mkt7-2", sourcePortLabel: "Solicitar orçamento" },
      { id: "mkt-conn-11", start: "mkt-8", end: "mkt-11", type: "custom", sourceHandle: "port-mkt8-1", sourcePortLabel: "Preencher briefing" },
      { id: "mkt-conn-12", start: "mkt-9", end: "mkt-10", type: "custom", sourceHandle: "port-mkt9-1", sourcePortLabel: "Ver portfolio" },
      { id: "mkt-conn-13", start: "mkt-9", end: "mkt-11", type: "custom", sourceHandle: "port-mkt9-2", sourcePortLabel: "Solicitar orçamento" },
      { id: "mkt-conn-14", start: "mkt-10", end: "mkt-11", type: "custom", sourceHandle: "port-mkt10-1", sourcePortLabel: "Já vi o portfolio" },
      { id: "mkt-conn-15", start: "mkt-11", end: "mkt-12", type: "custom", sourceHandle: "port-mkt11-1", sourcePortLabel: "Dados enviados" }
    ]
  },
  servicos: {
    cards: [
      {
        id: "serv-1",
        title: "Boas-vindas Empresa de Serviços",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo à Empresa de Serviços ABC. Como podemos ajudar você hoje? Estamos à disposição para orçamentos, agendamentos ou informações sobre nossos serviços.",
        position: { x: 71, y: 32 },
        type: "initial",
        outputPorts: [
          { id: "port-serv1-1", label: "Conhecer serviços" },
          { id: "port-serv1-2", label: "Solicitar orçamento" },
          { id: "port-serv1-3", label: "Agendar visita técnica" },
          { id: "port-serv1-4", label: "Suporte técnico" }
        ]
      },
      {
        id: "serv-2",
        title: "Nossos Serviços",
        description: "Informações sobre serviços",
        content: "Oferecemos uma variedade de serviços para atender suas necessidades. Nossos principais serviços incluem instalação, manutenção, consultoria e projetos personalizados.",
        position: { x: 300, y: 150 },
        type: "servico",
        outputPorts: [
          { id: "port-serv2-1", label: "Serviço de Instalação" },
          { id: "port-serv2-2", label: "Serviço de Manutenção" },
          { id: "port-serv2-3", label: "Consultoria" },
          { id: "port-serv2-4", label: "Projetos Personalizados" }
        ]
      },
      {
        id: "serv-3",
        title: "Solicitação de Orçamento",
        description: "Pedido de orçamento",
        content: "Para elaborarmos um orçamento preciso, precisamos de algumas informações sobre o serviço desejado. Qual tipo de serviço você está procurando?",
        position: { x: 300, y: 300 },
        type: "ordem-servico",
        outputPorts: [
          { id: "port-serv3-1", label: "Instalação" },
          { id: "port-serv3-2", label: "Manutenção" },
          { id: "port-serv3-3", label: "Projeto novo" }
        ]
      },
      {
        id: "serv-4",
        title: "Agendamento de Visita",
        description: "Visita técnica",
        content: "Para agendar uma visita técnica, precisamos de algumas informações. Por favor, indique o melhor dia e horário para realizarmos a visita ao local.",
        position: { x: 300, y: 450 },
        type: "agendar",
        outputPorts: [
          { id: "port-serv4-1", label: "Próximos dias" },
          { id: "port-serv4-2", label: "Próxima semana" },
          { id: "port-serv4-3", label: "Data específica" }
        ]
      },
      {
        id: "serv-5",
        title: "Suporte Técnico",
        description: "Ajuda para problemas",
        content: "Nosso suporte técnico está aqui para ajudar. Por favor, descreva o problema que está enfrentando para que possamos orientá-lo da melhor forma possível.",
        position: { x: 300, y: 600 },
        type: "pergunta-respostas",
        outputPorts: [
          { id: "port-serv5-1", label: "Problema com instalação" },
          { id: "port-serv5-2", label: "Equipamento com defeito" },
          { id: "port-serv5-3", label: "Dúvidas de operação" }
        ]
      },
      {
        id: "serv-6",
        title: "Serviço de Instalação",
        description: "Detalhes de instalação",
        content: "Nosso serviço de instalação inclui avaliação do local, projeto básico, fornecimento de materiais e execução por técnicos especializados com garantia de 3 meses.",
        position: { x: 600, y: 100 },
        type: "produto",
        outputPorts: [
          { id: "port-serv6-1", label: "Solicitar orçamento" },
          { id: "port-serv6-2", label: "Agendar visita" }
        ]
      },
      {
        id: "serv-7",
        title: "Projeto Personalizado",
        description: "Projetos sob medida",
        content: "Desenvolvemos projetos personalizados de acordo com suas necessidades específicas, combinando nossa experiência técnica com soluções inovadoras.",
        position: { x: 600, y: 250 },
        type: "briefing",
        outputPorts: [
          { id: "port-serv7-1", label: "Iniciar briefing" },
          { id: "port-serv7-2", label: "Ver exemplos" }
        ]
      },
      {
        id: "serv-8",
        title: "Formulário de Orçamento",
        description: "Coleta de informações",
        content: "Por favor, forneça detalhes sobre o serviço desejado: local, dimensões aproximadas, requisitos específicos e prazo desejado para conclusão.",
        position: { x: 600, y: 400 },
        type: "contatos",
        outputPorts: [
          { id: "port-serv8-1", label: "Enviar informações" }
        ]
      },
      {
        id: "serv-9",
        title: "Confirmação de Agendamento",
        description: "Visita agendada",
        content: "Sua visita técnica foi agendada! Um de nossos técnicos irá até o local na data e horário combinados. Por favor, garanta que alguém estará presente para recebê-lo.",
        position: { x: 600, y: 550 },
        type: "agendar-visita",
        outputPorts: [
          { id: "port-serv9-1", label: "Confirmar" }
        ]
      },
      {
        id: "serv-10",
        title: "Soluções Comuns",
        description: "Respostas para problemas frequentes",
        content: "Para problemas de instalação, verifique: 1) Se todos os cabos estão conectados corretamente; 2) Se há energia no local; 3) Se o disjuntor não está desarmado.",
        position: { x: 600, y: 700 },
        type: "html",
        outputPorts: [
          { id: "port-serv10-1", label: "Problema resolvido" },
          { id: "port-serv10-2", label: "Ainda com problemas" }
        ]
      },
      {
        id: "serv-11",
        title: "Dados para Contato",
        description: "Informações do cliente",
        content: "Para finalizar, precisamos de seus dados para contato. Por favor, informe nome completo, telefone, email e endereço completo do local de atendimento.",
        position: { x: 900, y: 400 },
        type: "contatos",
        outputPorts: [
          { id: "port-serv11-1", label: "Dados enviados" }
        ]
      },
      {
        id: "serv-12",
        title: "Finalização",
        description: "Encerramento do atendimento",
        content: "Agradecemos pelo seu contato! Nossa equipe entrará em contato em até 24 horas úteis para dar continuidade ao seu atendimento.",
        position: { x: 900, y: 550 },
        type: "end"
      }
    ],
    connections: [
      { id: "serv-conn-1", start: "serv-1", end: "serv-2", type: "custom", sourceHandle: "port-serv1-1", sourcePortLabel: "Conhecer serviços" },
      { id: "serv-conn-2", start: "serv-1", end: "serv-3", type: "custom", sourceHandle: "port-serv1-2", sourcePortLabel: "Solicitar orçamento" },
      { id: "serv-conn-3", start: "serv-1", end: "serv-4", type: "custom", sourceHandle: "port-serv1-3", sourcePortLabel: "Agendar visita técnica" },
      { id: "serv-conn-4", start: "serv-1", end: "serv-5", type: "custom", sourceHandle: "port-serv1-4", sourcePortLabel: "Suporte técnico" },
      { id: "serv-conn-5", start: "serv-2", end: "serv-6", type: "custom", sourceHandle: "port-serv2-1", sourcePortLabel: "Serviço de Instalação" },
      { id: "serv-conn-6", start: "serv-2", end: "serv-7", type: "custom", sourceHandle: "port-serv2-4", sourcePortLabel: "Projetos Personalizados" },
      { id: "serv-conn-7", start: "serv-3", end: "serv-8", type: "custom", sourceHandle: "port-serv3-1", sourcePortLabel: "Instalação" },
      { id: "serv-conn-8", start: "serv-4", end: "serv-9", type: "custom", sourceHandle: "port-serv4-1", sourcePortLabel: "Próximos dias" },
      { id: "serv-conn-9", start: "serv-5", end: "serv-10", type: "custom", sourceHandle: "port-serv5-1", sourcePortLabel: "Problema com instalação" },
      { id: "serv-conn-10", start: "serv-6", end: "serv-8", type: "custom", sourceHandle: "port-serv6-1", sourcePortLabel: "Solicitar orçamento" },
      { id: "serv-conn-11", start: "serv-7", end: "serv-8", type: "custom", sourceHandle: "port-serv7-1", sourcePortLabel: "Iniciar briefing" },
      { id: "serv-conn-12", start: "serv-8", end: "serv-11", type: "custom", sourceHandle: "port-serv8-1", sourcePortLabel: "Enviar informações" },
      { id: "serv-conn-13", start: "serv-9", end: "serv-11", type: "custom", sourceHandle: "port-serv9-1", sourcePortLabel: "Confirmar" },
      { id: "serv-conn-14", start: "serv-10", end: "serv-4", type: "custom", sourceHandle: "port-serv10-2", sourcePortLabel: "Ainda com problemas" },
      { id: "serv-conn-15", start: "serv-11", end: "serv-12", type: "custom", sourceHandle: "port-serv11-1", sourcePortLabel: "Dados enviados" }
    ]
  }
};
