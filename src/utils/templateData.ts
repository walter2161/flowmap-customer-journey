
import { nanoid } from 'nanoid';
import { AssistantProfile, CardType, FlowCard, FlowData } from './flowTypes';

// Template options for the dropdown
export const templateOptions = [
  { id: 'salao', label: 'Salão de Beleza' },
  { id: 'imobiliaria', label: 'Imobiliária' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'clinica', label: 'Clínica' },
  { id: 'marketing', label: 'Marketing Digital' }
];

// Create default profiles for each template
const createProfile = (type: string): AssistantProfile => {
  switch (type) {
    case 'salao':
      return {
        name: 'Ana',
        profession: 'Atendente de Salão de Beleza',
        company: 'Beleza Natural',
        contacts: 'WhatsApp: (11) 99999-9999 | Email: contato@belezanatural.com',
        guidelines: 'Seja sempre cordial e atenciosa.\nOfereça todas as opções de serviços disponíveis.\nVerifique a disponibilidade na agenda antes de confirmar horários.\nExplique os procedimentos e produtos utilizados.\nOriente sobre cuidados pós-atendimento.',
        scriptGuidelines: [
          'Cumprimentar o cliente de forma calorosa e personalizada.',
          'Identificar as necessidades do cliente com perguntas específicas.',
          'Apresentar os serviços e produtos relevantes para o cliente.',
          'Explicar preços e promoções disponíveis.',
          'Confirmar agendamentos sempre verificando a disponibilidade real.',
          'Finalizar o atendimento com dicas de cuidados e manutenção.'
        ]
      };
    case 'imobiliaria':
      return {
        name: 'Carlos',
        profession: 'Corretor de Imóveis',
        company: 'Imobiliária Lar Feliz',
        contacts: 'WhatsApp: (11) 98888-8888 | Email: contato@larfeliz.com',
        guidelines: 'Atenda com profissionalismo e cordialidade.\nIdentifique as necessidades do cliente (compra, venda, aluguel).\nApresente opções que se encaixem no perfil e orçamento.\nExplique detalhes dos imóveis e condições de negociação.\nOriente sobre documentação necessária e processo de aquisição.',
        scriptGuidelines: [
          'Iniciar identificando se o cliente busca comprar, vender ou alugar um imóvel.',
          'Coletar informações específicas sobre localização, tamanho, valor e características desejadas.',
          'Apresentar opções disponíveis no catálogo que correspondam às necessidades.',
          'Explicar detalhadamente as condições de pagamento, financiamento ou aluguel.',
          'Oferecer agendamento de visitas aos imóveis selecionados.',
          'Orientar sobre documentação necessária e próximos passos.'
        ]
      };
    case 'ecommerce':
      return {
        name: 'Fernanda',
        profession: 'Atendente de E-commerce',
        company: 'Tech Store',
        contacts: 'WhatsApp: (11) 97777-7777 | Email: atendimento@techstore.com',
        guidelines: 'Seja cordial e prestativa em todas as interações.\nAjude o cliente a encontrar o produto ideal para suas necessidades.\nForneça informações detalhadas sobre especificações técnicas.\nExplique condições de pagamento, frete e prazos de entrega.\nOriente sobre políticas de troca e garantia.',
        scriptGuidelines: [
          'Identificar rapidamente o tipo de produto que o cliente procura.',
          'Fornecer detalhes técnicos precisos e comparações entre modelos quando solicitado.',
          'Explicar as opções de pagamento disponíveis e possíveis descontos.',
          'Detalhar prazos de entrega e opções de frete para a região do cliente.',
          'Informar sobre garantias, suporte técnico e políticas de devolução.',
          'Acompanhar pedidos e auxiliar em caso de problemas com entregas.'
        ]
      };
    case 'clinica':
      return {
        name: 'Renata',
        profession: 'Secretária de Clínica Médica',
        company: 'Clínica Saúde Total',
        contacts: 'WhatsApp: (11) 96666-6666 | Email: agendamento@saudetotal.com',
        guidelines: 'Atenda com empatia e profissionalismo.\nVerifique a necessidade de consulta ou procedimento específico.\nConfirme se o paciente já tem cadastro e atualize os dados se necessário.\nVerifique disponibilidade de horários e convênios aceitos.\nOriente sobre preparos necessários para consultas e exames.',
        scriptGuidelines: [
          'Acolher o paciente com empatia, respeitando sua privacidade e necessidades.',
          'Verificar se é o primeiro atendimento ou retorno e acessar histórico quando possível.',
          'Confirmar qual especialidade médica é necessária e indicar os profissionais disponíveis.',
          'Checar cobertura de convênios ou valores de consultas particulares.',
          'Explicar detalhadamente preparos necessários para exames ou procedimentos.',
          'Enviar lembretes de consultas e orientações prévias quando necessário.'
        ]
      };
    case 'marketing':
      return {
        name: 'Lucas',
        profession: 'Consultor de Marketing Digital',
        company: 'Agência Conecta',
        contacts: 'WhatsApp: (11) 95555-5555 | Email: contato@conectamarketing.com',
        guidelines: 'Seja consultivo e demonstre conhecimento técnico.\nEntenda o negócio do cliente e seus objetivos de marketing.\nApresente as soluções mais adequadas para o perfil da empresa.\nExplique métricas, resultados esperados e prazos.\nEsclareça dúvidas sobre estratégias e implementações.',
        scriptGuidelines: [
          'Iniciar entendendo o segmento de atuação do cliente e seus objetivos de negócio.',
          'Identificar os canais de marketing digital mais adequados para o caso específico.',
          'Apresentar cases de sucesso similares ao segmento do cliente.',
          'Explicar detalhadamente as métricas que serão acompanhadas e resultados esperados.',
          'Detalhar investimentos necessários e retorno esperado (ROI).',
          'Estabelecer cronograma de implementação e acompanhamento de resultados.'
        ]
      };
    default:
      return {
        name: 'Assistente',
        profession: 'Atendente Virtual',
        company: 'Empresa',
        contacts: 'contato@empresa.com',
        guidelines: 'Seja cordial e prestativo.\nResponda às perguntas com clareza.\nOfereça soluções para os problemas apresentados.',
        scriptGuidelines: [
          'Cumprimentar de forma amigável e profissional.',
          'Identificar a necessidade principal do cliente.',
          'Oferecer soluções personalizadas para cada situação.',
          'Esclarecer dúvidas com linguagem simples e direta.',
          'Finalizar verificando se todas as necessidades foram atendidas.'
        ]
      };
  }
};

// Function to calculate coordinates based on flow position
const calculatePosition = (flowIndex: number, level: number, count: number, totalInLevel: number) => {
  const MARGIN = 50; // Safety margin between cards
  const CARD_WIDTH = 250; // Average card width
  const CARD_HEIGHT = 150; // Average card height
  
  // Horizontal positioning based on level (depth in the flow)
  const x = 100 + (level * (CARD_WIDTH + MARGIN));
  
  // Vertical positioning distributes cards in the same level
  // Center the cards vertically in their level
  const levelHeight = totalInLevel * (CARD_HEIGHT + MARGIN);
  const startY = 100 + (level * 50); // Slight diagonal progression
  
  // Calculate y position based on position in level and total cards in level
  let y = startY + (count * (CARD_HEIGHT + MARGIN));
  
  // If this is a special flow index like initial or terminal nodes
  if (flowIndex === 0) { // Initial node
    y = 100; // Always at the top
  } else if (flowIndex === -100) { // Terminal node
    y = 100 + levelHeight; // Always at the bottom of its level
  }
  
  return { x, y };
};

// Generate template data based on the selected template
export const getTemplateData = (templateId: string): FlowData => {
  // Create the profile based on the template
  const profile = createProfile(templateId);
  
  // Default cards and connections arrays
  let cards: FlowCard[] = [];
  let connections: any[] = [];
  
  // Create flow data based on the selected template
  switch (templateId) {
    case 'salao':
      // Create cards for beauty salon
      cards = [
        // Initial card - welcome message (level 0)
        {
          id: `card-${nanoid(6)}`,
          type: 'initial',
          title: 'Boas-vindas',
          description: 'Mensagem de boas-vindas para o cliente',
          content: 'Olá! Seja bem-vindo(a) ao Salão Beleza Natural. Meu nome é Ana, como posso ajudar você hoje?',
          position: calculatePosition(0, 0, 0, 1),
          fields: {},
          outputPorts: ['Serviços', 'Produtos', 'Agendamento', 'Promoções', 'Dúvidas']
        },
        
        // Services card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'service',
          title: 'Serviços',
          description: 'Informações sobre os serviços oferecidos',
          content: 'Oferecemos diversos serviços de beleza, incluindo:\n- Corte de cabelo\n- Coloração\n- Tratamentos capilares\n- Manicure e pedicure\n- Maquiagem\n- Depilação\n- Estética facial\n\nQual serviço você gostaria de conhecer melhor?',
          position: calculatePosition(1, 1, 0, 5),
          fields: { 
            services: 'Corte, Coloração, Tratamentos, Manicure, Maquiagem, Depilação, Estética'
          },
          outputPorts: ['Ver preços', 'Agendar', 'Outros serviços']
        },
        
        // Products card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'product',
          title: 'Produtos',
          description: 'Informações sobre os produtos vendidos',
          content: 'Temos uma linha completa de produtos profissionais para cuidados em casa:\n- Shampoos e condicionadores\n- Máscaras de tratamento\n- Finalizadores\n- Produtos para unhas\n- Maquiagens\n\nDeseja informações sobre algum produto específico?',
          position: calculatePosition(2, 1, 1, 5),
          fields: {
            products: 'Shampoos, Condicionadores, Máscaras, Finalizadores, Esmaltes, Maquiagens'
          },
          outputPorts: ['Ver preços', 'Comprar', 'Recomendações']
        },
        
        // Scheduling card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'appointment',
          title: 'Agendamento',
          description: 'Processo de agendamento de serviços',
          content: 'Para agendar um horário, preciso de algumas informações:\n1. Qual serviço você deseja agendar?\n2. Qual seria o melhor dia para você?\n3. Preferência de horário (manhã, tarde ou noite)?\n4. Preferência de profissional?',
          position: calculatePosition(3, 1, 2, 5),
          fields: {
            availableDays: 'Segunda a Sábado',
            availableHours: '9h às 20h'
          },
          outputPorts: ['Confirmar', 'Reagendar', 'Cancelar']
        },
        
        // Promotions card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'promotion',
          title: 'Promoções',
          description: 'Informações sobre promoções atuais',
          content: 'Nossas promoções do mês:\n- Terça e quarta: 20% off em colorações\n- Pacote Noiva: Cabelo, make e unhas com 15% de desconto\n- Traga uma amiga e ganhe 10% de desconto no seu próximo serviço\n- Aniversariante do mês: 25% de desconto em qualquer serviço',
          position: calculatePosition(4, 1, 3, 5),
          fields: {
            validUntil: 'Final do mês atual'
          },
          outputPorts: ['Agendar', 'Mais informações']
        },
        
        // Questions card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'faq',
          title: 'Dúvidas',
          description: 'Perguntas frequentes',
          content: 'Como posso ajudar?\n- Horário de funcionamento: Segunda a Sábado, 9h às 20h\n- Formas de pagamento: Dinheiro, PIX, cartões de crédito/débito\n- Estacionamento: Convênio com estacionamento ao lado\n- Cancelamentos: Avisar com 4h de antecedência para evitar cobrança',
          position: calculatePosition(5, 1, 4, 5),
          fields: {},
          outputPorts: ['Agendar', 'Falar com atendente']
        },
        
        // Price information card (level 2)
        {
          id: `card-${nanoid(6)}`,
          type: 'info',
          title: 'Preços',
          description: 'Informações sobre preços dos serviços',
          content: 'Tabela de preços:\n- Corte feminino: R$ 80,00\n- Corte masculino: R$ 50,00\n- Coloração: a partir de R$ 150,00\n- Hidratação: a partir de R$ 100,00\n- Manicure: R$ 40,00\n- Pedicure: R$ 45,00\n- Maquiagem: a partir de R$ 120,00\n\nOs preços podem variar conforme comprimento e volume do cabelo.',
          position: calculatePosition(6, 2, 0, 3),
          fields: {},
          outputPorts: ['Agendar', 'Voltar']
        },
        
        // Confirm scheduling card (level 2)
        {
          id: `card-${nanoid(6)}`,
          type: 'confirmation',
          title: 'Confirmação',
          description: 'Confirmação de agendamento',
          content: 'Perfeito! Vou confirmar seu agendamento:\n- Serviço: [serviço selecionado]\n- Data: [data selecionada]\n- Horário: [horário selecionado]\n- Profissional: [profissional selecionado]\n\nEstá correto? Preciso confirmar seu nome e telefone para contato.',
          position: calculatePosition(7, 2, 1, 3),
          fields: {
            sendConfirmation: 'WhatsApp, Email'
          },
          outputPorts: ['Confirmar', 'Modificar']
        },
        
        // Product recommendation card (level 2)
        {
          id: `card-${nanoid(6)}`,
          type: 'recommendation',
          title: 'Recomendações',
          description: 'Recomendações personalizadas de produtos',
          content: 'Com base no seu tipo de cabelo/pele, recomendamos:\n- [Produto recomendado 1]\n- [Produto recomendado 2]\n- [Produto recomendado 3]\n\nTodos estes produtos estão disponíveis em nossa loja física e podem ser reservados para retirada.',
          position: calculatePosition(8, 2, 2, 3),
          fields: {},
          outputPorts: ['Comprar', 'Mais informações', 'Voltar']
        },
        
        // Final confirmation card (level 3)
        {
          id: `card-${nanoid(6)}`,
          type: 'final',
          title: 'Finalização',
          description: 'Mensagem de finalização do atendimento',
          content: 'Obrigada por escolher o Salão Beleza Natural! Seu agendamento foi confirmado e você receberá uma confirmação por WhatsApp. Estamos ansiosos para recebê-lo(a)!\n\nPrecisa de mais alguma informação?',
          position: calculatePosition(-100, 3, 0, 1),
          fields: {},
          outputPorts: ['Nova consulta', 'Encerrar']
        }
      ];
      
      // Create connections between cards for beauty salon
      connections = [
        // Connections from welcome card (index 0)
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[1].id, type: 'positive', sourceHandle: 'Serviços', sourcePortLabel: 'Serviços' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[2].id, type: 'positive', sourceHandle: 'Produtos', sourcePortLabel: 'Produtos' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[3].id, type: 'positive', sourceHandle: 'Agendamento', sourcePortLabel: 'Agendamento' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[4].id, type: 'positive', sourceHandle: 'Promoções', sourcePortLabel: 'Promoções' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[5].id, type: 'positive', sourceHandle: 'Dúvidas', sourcePortLabel: 'Dúvidas' },
        
        // Connections from services card (index 1)
        { id: `conn-${nanoid(6)}`, start: cards[1].id, end: cards[6].id, type: 'positive', sourceHandle: 'Ver preços', sourcePortLabel: 'Ver preços' },
        { id: `conn-${nanoid(6)}`, start: cards[1].id, end: cards[7].id, type: 'positive', sourceHandle: 'Agendar', sourcePortLabel: 'Agendar' },
        
        // Connections from products card (index 2)
        { id: `conn-${nanoid(6)}`, start: cards[2].id, end: cards[8].id, type: 'positive', sourceHandle: 'Recomendações', sourcePortLabel: 'Recomendações' },
        
        // Connections from scheduling card (index 3)
        { id: `conn-${nanoid(6)}`, start: cards[3].id, end: cards[7].id, type: 'positive', sourceHandle: 'Confirmar', sourcePortLabel: 'Confirmar' },
        
        // Connections from promotions card (index 4)
        { id: `conn-${nanoid(6)}`, start: cards[4].id, end: cards[3].id, type: 'positive', sourceHandle: 'Agendar', sourcePortLabel: 'Agendar' },
        
        // Connections from FAQ card (index 5)
        { id: `conn-${nanoid(6)}`, start: cards[5].id, end: cards[3].id, type: 'positive', sourceHandle: 'Agendar', sourcePortLabel: 'Agendar' },
        
        // Connections from prices card (index 6)
        { id: `conn-${nanoid(6)}`, start: cards[6].id, end: cards[3].id, type: 'positive', sourceHandle: 'Agendar', sourcePortLabel: 'Agendar' },
        
        // Connections from confirmation card (index 7)
        { id: `conn-${nanoid(6)}`, start: cards[7].id, end: cards[9].id, type: 'positive', sourceHandle: 'Confirmar', sourcePortLabel: 'Confirmar' },
        
        // Connections from recommendations card (index 8)
        { id: `conn-${nanoid(6)}`, start: cards[8].id, end: cards[7].id, type: 'positive', sourceHandle: 'Comprar', sourcePortLabel: 'Comprar' }
      ];
      break;
      
    case 'imobiliaria':
      // Create cards for real estate
      cards = [
        // Initial card - welcome message (level 0)
        {
          id: `card-${nanoid(6)}`,
          type: 'initial',
          title: 'Boas-vindas',
          description: 'Mensagem de boas-vindas para o cliente',
          content: 'Olá! Seja bem-vindo(a) à Imobiliária Lar Feliz. Meu nome é Carlos, como posso ajudar você hoje?',
          position: calculatePosition(0, 0, 0, 1),
          fields: {},
          outputPorts: ['Comprar', 'Alugar', 'Vender', 'Financiamento', 'Dúvidas']
        },
        
        // Buy property card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'service',
          title: 'Comprar Imóvel',
          description: 'Opções para compra de imóveis',
          content: 'Que tipo de imóvel você está procurando?\n- Apartamento\n- Casa\n- Terreno\n- Imóvel comercial\n\nQual região é do seu interesse? Qual o valor aproximado que busca investir?',
          position: calculatePosition(1, 1, 0, 5),
          fields: {
            regions: 'Centro, Zona Sul, Zona Norte, Zona Leste, Zona Oeste',
            priceRange: 'R$ 200 mil a R$ 2 milhões'
          },
          outputPorts: ['Ver opções', 'Agendar visita', 'Simular financiamento']
        },
        
        // Rent property card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'service',
          title: 'Alugar Imóvel',
          description: 'Opções para aluguel de imóveis',
          content: 'Que tipo de imóvel você busca para alugar?\n- Apartamento\n- Casa\n- Imóvel comercial\n\nQual região é do seu interesse? Qual o valor aproximado de aluguel que procura?',
          position: calculatePosition(2, 1, 1, 5),
          fields: {
            regions: 'Centro, Zona Sul, Zona Norte, Zona Leste, Zona Oeste',
            priceRange: 'R$ 800 a R$ 10 mil'
          },
          outputPorts: ['Ver opções', 'Agendar visita', 'Documentação']
        },
        
        // Sell property card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'service',
          title: 'Vender Imóvel',
          description: 'Processo para venda de imóveis',
          content: 'Para anunciar seu imóvel conosco, precisamos de algumas informações:\n1. Tipo do imóvel (casa, apartamento, etc.)\n2. Endereço completo\n3. Tamanho (m²) e quantidade de cômodos\n4. Valor pretendido\n5. Fotos do imóvel',
          position: calculatePosition(3, 1, 2, 5),
          fields: {
            commission: '5% do valor da venda'
          },
          outputPorts: ['Agendar avaliação', 'Documentação', 'Dúvidas']
        },
        
        // Financing card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'financing',
          title: 'Financiamento',
          description: 'Informações sobre financiamento imobiliário',
          content: 'Trabalhamos com as seguintes opções de financiamento:\n- Financiamento bancário (diversos bancos)\n- Financiamento direto com a construtora\n- Consórcio imobiliário\n\nGostaria de simular um financiamento ou saber mais sobre alguma dessas opções?',
          position: calculatePosition(4, 1, 3, 5),
          fields: {
            partners: 'Banco do Brasil, Caixa, Itaú, Bradesco, Santander'
          },
          outputPorts: ['Simular financiamento', 'Documentação', 'Falar com especialista']
        },
        
        // FAQ card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'faq',
          title: 'Dúvidas',
          description: 'Perguntas frequentes',
          content: 'Como posso ajudar?\n- Horário de atendimento: Segunda a Sexta, 9h às 18h; Sábado, 9h às 13h\n- Documentação necessária para compra/aluguel\n- Processo de compra/venda\n- Comissões e taxas\n- Avaliação de imóveis',
          position: calculatePosition(5, 1, 4, 5),
          fields: {},
          outputPorts: ['Comprar', 'Alugar', 'Vender', 'Financiamento', 'Falar com corretor']
        },
        
        // Property options card (level 2)
        {
          id: `card-${nanoid(6)}`,
          type: 'info',
          title: 'Opções de Imóveis',
          description: 'Lista de imóveis disponíveis',
          content: 'Baseado nos seus critérios, temos estas opções:\n1. [Descrição imóvel 1] - R$ [valor]\n2. [Descrição imóvel 2] - R$ [valor]\n3. [Descrição imóvel 3] - R$ [valor]\n\nGostaria de mais detalhes sobre algum desses imóveis?',
          position: calculatePosition(6, 2, 0, 3),
          fields: {},
          outputPorts: ['Mais detalhes', 'Agendar visita', 'Outras opções']
        },
        
        // Visit scheduling card (level 2)
        {
          id: `card-${nanoid(6)}`,
          type: 'appointment',
          title: 'Agendar Visita',
          description: 'Agendamento de visita ao imóvel',
          content: 'Para agendar uma visita, preciso de algumas informações:\n1. Qual imóvel deseja visitar?\n2. Qual seria o melhor dia para você?\n3. Preferência de horário (manhã ou tarde)?\n4. Nome completo e telefone para contato',
          position: calculatePosition(7, 2, 1, 3),
          fields: {
            availableDays: 'Segunda a Sábado',
            availableHours: 'Seg-Sex: 9h às 18h, Sáb: 9h às 13h'
          },
          outputPorts: ['Confirmar', 'Cancelar', 'Adiar']
        },
        
        // Financing simulation card (level 2)
        {
          id: `card-${nanoid(6)}`,
          type: 'simulation',
          title: 'Simulação de Financiamento',
          description: 'Simulação de financiamento imobiliário',
          content: 'Para simular seu financiamento, preciso das seguintes informações:\n1. Valor do imóvel\n2. Valor da entrada (mínimo 20%)\n3. Prazo desejado (até 35 anos)\n4. Sua renda mensal\n5. Banco de preferência',
          position: calculatePosition(8, 2, 2, 3),
          fields: {
            interestRates: '6% a 9% ao ano, dependendo do banco e perfil'
          },
          outputPorts: ['Calcular', 'Documentação', 'Falar com especialista']
        },
        
        // Final confirmation card (level 3)
        {
          id: `card-${nanoid(6)}`,
          type: 'final',
          title: 'Finalização',
          description: 'Mensagem de finalização do atendimento',
          content: 'Obrigado por escolher a Imobiliária Lar Feliz! Sua solicitação foi registrada e um de nossos corretores entrará em contato em breve para dar continuidade ao atendimento.\n\nPrecisa de mais alguma informação?',
          position: calculatePosition(-100, 3, 0, 1),
          fields: {},
          outputPorts: ['Nova consulta', 'Encerrar']
        }
      ];
      
      // Create connections between cards for real estate
      connections = [
        // Connections from welcome card (index 0)
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[1].id, type: 'positive', sourceHandle: 'Comprar', sourcePortLabel: 'Comprar' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[2].id, type: 'positive', sourceHandle: 'Alugar', sourcePortLabel: 'Alugar' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[3].id, type: 'positive', sourceHandle: 'Vender', sourcePortLabel: 'Vender' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[4].id, type: 'positive', sourceHandle: 'Financiamento', sourcePortLabel: 'Financiamento' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[5].id, type: 'positive', sourceHandle: 'Dúvidas', sourcePortLabel: 'Dúvidas' },
        
        // Connections from buy property card (index 1)
        { id: `conn-${nanoid(6)}`, start: cards[1].id, end: cards[6].id, type: 'positive', sourceHandle: 'Ver opções', sourcePortLabel: 'Ver opções' },
        { id: `conn-${nanoid(6)}`, start: cards[1].id, end: cards[7].id, type: 'positive', sourceHandle: 'Agendar visita', sourcePortLabel: 'Agendar visita' },
        { id: `conn-${nanoid(6)}`, start: cards[1].id, end: cards[8].id, type: 'positive', sourceHandle: 'Simular financiamento', sourcePortLabel: 'Simular financiamento' },
        
        // Connections from rent property card (index 2)
        { id: `conn-${nanoid(6)}`, start: cards[2].id, end: cards[6].id, type: 'positive', sourceHandle: 'Ver opções', sourcePortLabel: 'Ver opções' },
        { id: `conn-${nanoid(6)}`, start: cards[2].id, end: cards[7].id, type: 'positive', sourceHandle: 'Agendar visita', sourcePortLabel: 'Agendar visita' },
        
        // Connections from financing card (index 4)
        { id: `conn-${nanoid(6)}`, start: cards[4].id, end: cards[8].id, type: 'positive', sourceHandle: 'Simular financiamento', sourcePortLabel: 'Simular financiamento' },
        
        // Connections from property options card (index 6)
        { id: `conn-${nanoid(6)}`, start: cards[6].id, end: cards[7].id, type: 'positive', sourceHandle: 'Agendar visita', sourcePortLabel: 'Agendar visita' },
        
        // Connections from visit scheduling card (index 7)
        { id: `conn-${nanoid(6)}`, start: cards[7].id, end: cards[9].id, type: 'positive', sourceHandle: 'Confirmar', sourcePortLabel: 'Confirmar' },
        
        // Connections from financing simulation card (index 8)
        { id: `conn-${nanoid(6)}`, start: cards[8].id, end: cards[9].id, type: 'positive', sourceHandle: 'Calcular', sourcePortLabel: 'Calcular' }
      ];
      break;
      
    case 'ecommerce':
      // Create cards for e-commerce
      cards = [
        // Initial card - welcome message (level 0)
        {
          id: `card-${nanoid(6)}`,
          type: 'initial',
          title: 'Boas-vindas',
          description: 'Mensagem de boas-vindas para o cliente',
          content: 'Olá! Bem-vindo(a) à Tech Store. Meu nome é Fernanda, como posso ajudar você hoje?',
          position: calculatePosition(0, 0, 0, 1),
          fields: {},
          outputPorts: ['Produtos', 'Ofertas', 'Rastreamento', 'Troca/Devolução', 'Dúvidas']
        },
        
        // Products card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'product',
          title: 'Produtos',
          description: 'Categorias de produtos disponíveis',
          content: 'Qual categoria de produtos você está procurando?\n- Smartphones\n- Notebooks e Computadores\n- TVs e Áudio\n- Tablets e E-readers\n- Acessórios\n- Produtos para Casa Inteligente',
          position: calculatePosition(1, 1, 0, 5),
          fields: {
            brands: 'Apple, Samsung, Xiaomi, LG, Sony, JBL'
          },
          outputPorts: ['Ver detalhes', 'Comparar produtos', 'Verificar disponibilidade']
        },
        
        // Offers card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'promotion',
          title: 'Ofertas',
          description: 'Promoções e descontos atuais',
          content: 'Confira nossas ofertas da semana:\n- Smartphones com até 20% de desconto\n- Fones de ouvido com 30% off\n- Compre um notebook e ganhe uma mochila\n- Frete grátis para compras acima de R$ 500\n- Cupom TECH10: 10% de desconto na primeira compra',
          position: calculatePosition(2, 1, 1, 5),
          fields: {
            validUntil: 'Final da semana atual'
          },
          outputPorts: ['Ver produtos em oferta', 'Usar cupom', 'Mais informações']
        },
        
        // Order tracking card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'service',
          title: 'Rastreamento',
          description: 'Rastreamento de pedidos',
          content: 'Para rastrear seu pedido, preciso das seguintes informações:\n1. Número do pedido ou código de rastreio\n2. Email cadastrado na compra\n\nCom essas informações, posso verificar o status e localização atual do seu pedido.',
          position: calculatePosition(3, 1, 2, 5),
          fields: {
            deliveryPartners: 'Correios, Jadlog, Loggi, Transportadora própria'
          },
          outputPorts: ['Rastrear', 'Problemas com entrega', 'Prazo de entrega']
        },
        
        // Returns card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'service',
          title: 'Troca/Devolução',
          description: 'Informações sobre troca e devolução',
          content: 'Nossa política de trocas e devoluções:\n- Prazo de 7 dias para devolução por arrependimento\n- Prazo de 30 dias para troca em caso de defeito\n- Produto deve estar em perfeito estado, com embalagem original e todos os acessórios\n- Custos de envio para devolução são por nossa conta em caso de defeito',
          position: calculatePosition(4, 1, 3, 5),
          fields: {
            returnProcess: 'Online via área do cliente ou atendimento'
          },
          outputPorts: ['Solicitar troca/devolução', 'Status do pedido', 'Falar com atendente']
        },
        
        // FAQ card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'faq',
          title: 'Dúvidas',
          description: 'Perguntas frequentes',
          content: 'Como posso ajudar?\n- Formas de pagamento: cartões, boleto, Pix\n- Prazo de entrega: 2-10 dias úteis, dependendo da região\n- Garantia: todos os produtos possuem garantia mínima de 1 ano\n- Horário de atendimento: Segunda a Sábado, 8h às 20h',
          position: calculatePosition(5, 1, 4, 5),
          fields: {},
          outputPorts: ['Produtos', 'Pagamento', 'Entrega', 'Falar com atendente']
        },
        
        // Product details card (level 2)
        {
          id: `card-${nanoid(6)}`,
          type: 'info',
          title: 'Detalhes do Produto',
          description: 'Informações detalhadas sobre produtos',
          content: 'Informações técnicas do produto selecionado:\n- Nome: [nome do produto]\n- Marca: [marca]\n- Modelo: [modelo]\n- Especificações técnicas: [detalhes técnicos]\n- Preço: R$ [valor]\n- Disponibilidade: [em estoque/indisponível]\n- Prazo de entrega: [prazo]',
          position: calculatePosition(6, 2, 0, 3),
          fields: {},
          outputPorts: ['Comprar', 'Ver avaliações', 'Comparar']
        },
        
        // Purchase card (level 2)
        {
          id: `card-${nanoid(6)}`,
          type: 'service',
          title: 'Compra',
          description: 'Processo de compra',
          content: 'Para finalizar sua compra, precisamos das seguintes informações:\n1. Produto e quantidade\n2. Endereço de entrega\n3. Forma de pagamento\n4. Dados para nota fiscal\n\nDeseja prosseguir com a compra?',
          position: calculatePosition(7, 2, 1, 3),
          fields: {
            paymentMethods: 'Cartão de crédito/débito, boleto, Pix'
          },
          outputPorts: ['Finalizar compra', 'Calcular frete', 'Adicionar mais produtos']
        },
        
        // Order status card (level 2)
        {
          id: `card-${nanoid(6)}`,
          type: 'info',
          title: 'Status do Pedido',
          description: 'Informações sobre o status do pedido',
          content: 'Status do pedido [número do pedido]:\n- Data da compra: [data]\n- Pagamento: [status do pagamento]\n- Preparação: [status da preparação]\n- Envio: [status do envio]\n- Previsão de entrega: [data estimada]\n\nDeseja receber atualizações por email?',
          position: calculatePosition(8, 2, 2, 3),
          fields: {},
          outputPorts: ['Rastrear entrega', 'Problemas com pedido', 'Voltar']
        },
        
        // Order confirmation card (level 3)
        {
          id: `card-${nanoid(6)}`,
          type: 'final',
          title: 'Confirmação',
          description: 'Confirmação de pedido',
          content: 'Seu pedido foi realizado com sucesso!\n\nNúmero do pedido: [número]\nProduto: [produto]\nValor total: R$ [valor]\nPrazo de entrega: [prazo]\n\nVocê receberá um email com todos os detalhes e o código de rastreamento assim que o pedido for despachado.',
          position: calculatePosition(-100, 3, 0, 1),
          fields: {},
          outputPorts: ['Continuar comprando', 'Encerrar']
        }
      ];
      
      // Create connections between cards for e-commerce
      connections = [
        // Connections from welcome card (index 0)
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[1].id, type: 'positive', sourceHandle: 'Produtos', sourcePortLabel: 'Produtos' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[2].id, type: 'positive', sourceHandle: 'Ofertas', sourcePortLabel: 'Ofertas' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[3].id, type: 'positive', sourceHandle: 'Rastreamento', sourcePortLabel: 'Rastreamento' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[4].id, type: 'positive', sourceHandle: 'Troca/Devolução', sourcePortLabel: 'Troca/Devolução' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[5].id, type: 'positive', sourceHandle: 'Dúvidas', sourcePortLabel: 'Dúvidas' },
        
        // Connections from products card (index 1)
        { id: `conn-${nanoid(6)}`, start: cards[1].id, end: cards[6].id, type: 'positive', sourceHandle: 'Ver detalhes', sourcePortLabel: 'Ver detalhes' },
        
        // Connections from offers card (index 2)
        { id: `conn-${nanoid(6)}`, start: cards[2].id, end: cards[1].id, type: 'positive', sourceHandle: 'Ver produtos em oferta', sourcePortLabel: 'Ver produtos em oferta' },
        
        // Connections from tracking card (index 3)
        { id: `conn-${nanoid(6)}`, start: cards[3].id, end: cards[8].id, type: 'positive', sourceHandle: 'Rastrear', sourcePortLabel: 'Rastrear' },
        
        // Connections from returns card (index 4)
        { id: `conn-${nanoid(6)}`, start: cards[4].id, end: cards[8].id, type: 'positive', sourceHandle: 'Status do pedido', sourcePortLabel: 'Status do pedido' },
        
        // Connections from FAQ card (index 5)
        { id: `conn-${nanoid(6)}`, start: cards[5].id, end: cards[1].id, type: 'positive', sourceHandle: 'Produtos', sourcePortLabel: 'Produtos' },
        
        // Connections from product details card (index 6)
        { id: `conn-${nanoid(6)}`, start: cards[6].id, end: cards[7].id, type: 'positive', sourceHandle: 'Comprar', sourcePortLabel: 'Comprar' },
        
        // Connections from purchase card (index 7)
        { id: `conn-${nanoid(6)}`, start: cards[7].id, end: cards[9].id, type: 'positive', sourceHandle: 'Finalizar compra', sourcePortLabel: 'Finalizar compra' },
        
        // Connections from order status card (index 8)
        { id: `conn-${nanoid(6)}`, start: cards[8].id, end: cards[7].id, type: 'positive', sourceHandle: 'Problemas com pedido', sourcePortLabel: 'Problemas com pedido' }
      ];
      break;
      
    case 'clinica':
      // Create cards for medical clinic
      cards = [
        // Initial card - welcome message (level 0)
        {
          id: `card-${nanoid(6)}`,
          type: 'initial',
          title: 'Boas-vindas',
          description: 'Mensagem de boas-vindas para o paciente',
          content: 'Olá! Seja bem-vindo(a) à Clínica Saúde Total. Meu nome é Renata, como posso ajudar você hoje?',
          position: calculatePosition(0, 0, 0, 1),
          fields: {},
          outputPorts: ['Especialidades', 'Agendamento', 'Convênios', 'Exames', 'Dúvidas']
        },
        
        // Specialties card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'specialty',
          title: 'Especialidades',
          description: 'Especialidades médicas disponíveis',
          content: 'Contamos com profissionais nas seguintes especialidades:\n- Clínica Geral\n- Cardiologia\n- Dermatologia\n- Ginecologia e Obstetrícia\n- Ortopedia\n- Pediatria\n- Psicologia\n- Nutrição\n\nQual especialidade você gostaria de consultar?',
          position: calculatePosition(1, 1, 0, 5),
          fields: {
            professionals: 'Mais de 30 profissionais qualificados'
          },
          outputPorts: ['Agendar consulta', 'Informações sobre médicos', 'Preços']
        },
        
        // Cardiology specialty card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'specialty',
          title: 'Cardiologia',
          description: 'Informações sobre a especialidade de Cardiologia',
          content: 'Nossa equipe de Cardiologia é especializada em:\n- Avaliação cardiológica completa\n- Eletrocardiograma\n- Teste ergométrico\n- Holter 24h\n- MAPA (Monitorização Ambulatorial da Pressão Arterial)\n- Ecocardiograma\n\nContamos com os seguintes profissionais:\n- Dr. Paulo Santos (CRM 54321)\n- Dra. Márcia Oliveira (CRM 65432)',
          position: calculatePosition(2, 1, 1, 5),
          fields: {
            exams: 'Eletrocardiograma, Teste ergométrico, Holter, MAPA, Ecocardiograma'
          },
          outputPorts: ['Agendar consulta', 'Agendar exame', 'Outras especialidades']
        },
        
        // Dermatology specialty card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'specialty',
          title: 'Dermatologia',
          description: 'Informações sobre a especialidade de Dermatologia',
          content: 'Nossa equipe de Dermatologia é especializada em:\n- Tratamento de acne\n- Tratamentos estéticos\n- Avaliação de manchas e pintas\n- Tratamento de queda de cabelo\n- Doenças da pele\n\nContamos com os seguintes profissionais:\n- Dra. Camila Rocha (CRM 78901)\n- Dr. Ricardo Lima (CRM 89012)',
          position: calculatePosition(3, 1, 2, 5),
          fields: {
            procedures: 'Peeling, Laser, Preenchimento, Toxina botulínica'
          },
          outputPorts: ['Agendar consulta', 'Procedimentos estéticos', 'Outras especialidades']
        },
        
        // Scheduling card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'appointment',
          title: 'Agendamento',
          description: 'Processo de agendamento de consultas',
          content: 'Para agendar uma consulta, preciso das seguintes informações:\n1. Especialidade médica\n2. Médico de preferência (opcional)\n3. Data e horário de preferência\n4. Nome completo do paciente\n5. Telefone para contato\n6. Convênio (se houver)',
          position: calculatePosition(4, 1, 3, 5),
          fields: {
            availableDays: 'Segunda a Sexta, 8h às 20h; Sábado, 8h às 12h'
          },
          outputPorts: ['Confirmar', 'Verificar convênios', 'Cancelar']
        },
        
        // Health insurance card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'insurance',
          title: 'Convênios',
          description: 'Informações sobre convênios aceitos',
          content: 'Trabalhamos com os seguintes convênios:\n- Unimed\n- Bradesco Saúde\n- Amil\n- SulAmérica\n- Porto Seguro\n- Intermedica\n- Cassi\n\nTambém realizamos atendimentos particulares. Gostaria de saber os valores?',
          position: calculatePosition(5, 1, 4, 5),
          fields: {
            discounts: 'Desconto de 10% para pagamentos à vista'
          },
          outputPorts: ['Agendar consulta', 'Valores', 'Autorizações']
        },
        
        // Exams card (level 2)
        {
          id: `card-${nanoid(6)}`,
          type: 'exam',
          title: 'Exames',
          description: 'Informações sobre exames disponíveis',
          content: 'Realizamos os seguintes tipos de exames:\n- Exames laboratoriais (sangue, urina, etc.)\n- Exames de imagem (Raio-X, Ultrassom, Tomografia)\n- Eletrocardiograma\n- Teste ergométrico\n- Endoscopia e Colonoscopia\n\nPara agendar um exame, é necessário ter um pedido médico.',
          position: calculatePosition(6, 2, 0, 3),
          fields: {
            preparation: 'Instruções de preparo enviadas por email/WhatsApp'
          },
          outputPorts: ['Agendar exame', 'Preparo', 'Resultados online']
        },
        
        // Price list card (level 2)
        {
          id: `card-${nanoid(6)}`,
          type: 'info',
          title: 'Valores',
          description: 'Tabela de preços',
          content: 'Valores de referência para pagamentos particulares:\n- Consulta clínica geral: R$ 200,00\n- Consulta especialista: R$ 280,00 a R$ 350,00\n- Retorno (até 30 dias): 50% do valor\n- Exames laboratoriais: a partir de R$ 30,00\n- Exames de imagem: a partir de R$ 120,00\n\nOferecemos parcelamento em até 3x sem juros.',
          position: calculatePosition(7, 2, 1, 3),
          fields: {},
          outputPorts: ['Agendar', 'Verificar convênios', 'Voltar']
        },
        
        // Exam scheduling card (level 2)
        {
          id: `card-${nanoid(6)}`,
          type: 'appointment',
          title: 'Agendar Exame',
          description: 'Processo de agendamento de exames',
          content: 'Para agendar um exame, preciso das seguintes informações:\n1. Tipo de exame\n2. Pedido médico (obrigatório para maioria dos exames)\n3. Data e horário de preferência\n4. Nome completo do paciente\n5. Telefone para contato\n6. Convênio (se houver)',
          position: calculatePosition(8, 2, 2, 3),
          fields: {
            documents: 'Pedido médico, documento de identidade, cartão do convênio'
          },
          outputPorts: ['Confirmar', 'Informações de preparo', 'Cancelar']
        },
        
        // Confirmation card (level 3)
        {
          id: `card-${nanoid(6)}`,
          type: 'final',
          title: 'Confirmação',
          description: 'Confirmação de agendamento',
          content: 'Agendamento confirmado!\n\nEspecialidade/Exame: [tipo]\nData: [data]\nHorário: [hora]\nMédico: [nome do profissional]\n\nPor favor, chegue com 15 minutos de antecedência e traga seu documento de identidade e cartão do convênio (se aplicável).\n\nPrecisa de mais alguma informação?',
          position: calculatePosition(-100, 3, 0, 1),
          fields: {},
          outputPorts: ['Agendar outro', 'Encerrar']
        }
      ];
      
      // Create connections between cards for medical clinic
      connections = [
        // Connections from welcome card (index 0)
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[1].id, type: 'positive', sourceHandle: 'Especialidades', sourcePortLabel: 'Especialidades' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[4].id, type: 'positive', sourceHandle: 'Agendamento', sourcePortLabel: 'Agendamento' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[5].id, type: 'positive', sourceHandle: 'Convênios', sourcePortLabel: 'Convênios' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[6].id, type: 'positive', sourceHandle: 'Exames', sourcePortLabel: 'Exames' },
        
        // Connections from specialties card (index 1)
        { id: `conn-${nanoid(6)}`, start: cards[1].id, end: cards[4].id, type: 'positive', sourceHandle: 'Agendar consulta', sourcePortLabel: 'Agendar consulta' },
        { id: `conn-${nanoid(6)}`, start: cards[1].id, end: cards[7].id, type: 'positive', sourceHandle: 'Preços', sourcePortLabel: 'Preços' },
        { id: `conn-${nanoid(6)}`, start: cards[1].id, end: cards[2].id, type: 'positive', sourceHandle: 'Cardiologia', sourcePortLabel: 'Cardiologia' },
        { id: `conn-${nanoid(6)}`, start: cards[1].id, end: cards[3].id, type: 'positive', sourceHandle: 'Dermatologia', sourcePortLabel: 'Dermatologia' },
        
        // Connections from cardiology card (index 2)
        { id: `conn-${nanoid(6)}`, start: cards[2].id, end: cards[4].id, type: 'positive', sourceHandle: 'Agendar consulta', sourcePortLabel: 'Agendar consulta' },
        { id: `conn-${nanoid(6)}`, start: cards[2].id, end: cards[8].id, type: 'positive', sourceHandle: 'Agendar exame', sourcePortLabel: 'Agendar exame' },
        { id: `conn-${nanoid(6)}`, start: cards[2].id, end: cards[1].id, type: 'positive', sourceHandle: 'Outras especialidades', sourcePortLabel: 'Outras especialidades' },
        
        // Connections from dermatology card (index 3)
        { id: `conn-${nanoid(6)}`, start: cards[3].id, end: cards[4].id, type: 'positive', sourceHandle: 'Agendar consulta', sourcePortLabel: 'Agendar consulta' },
        { id: `conn-${nanoid(6)}`, start: cards[3].id, end: cards[1].id, type: 'positive', sourceHandle: 'Outras especialidades', sourcePortLabel: 'Outras especialidades' },
        
        // Connections from scheduling card (index 4)
        { id: `conn-${nanoid(6)}`, start: cards[4].id, end: cards[9].id, type: 'positive', sourceHandle: 'Confirmar', sourcePortLabel: 'Confirmar' },
        { id: `conn-${nanoid(6)}`, start: cards[4].id, end: cards[5].id, type: 'positive', sourceHandle: 'Verificar convênios', sourcePortLabel: 'Verificar convênios' },
        
        // Connections from health insurance card (index 5)
        { id: `conn-${nanoid(6)}`, start: cards[5].id, end: cards[4].id, type: 'positive', sourceHandle: 'Agendar consulta', sourcePortLabel: 'Agendar consulta' },
        { id: `conn-${nanoid(6)}`, start: cards[5].id, end: cards[7].id, type: 'positive', sourceHandle: 'Valores', sourcePortLabel: 'Valores' },
        
        // Connections from exams card (index 6)
        { id: `conn-${nanoid(6)}`, start: cards[6].id, end: cards[8].id, type: 'positive', sourceHandle: 'Agendar exame', sourcePortLabel: 'Agendar exame' },
        
        // Connections from price list card (index 7)
        { id: `conn-${nanoid(6)}`, start: cards[7].id, end: cards[4].id, type: 'positive', sourceHandle: 'Agendar', sourcePortLabel: 'Agendar' },
        { id: `conn-${nanoid(6)}`, start: cards[7].id, end: cards[5].id, type: 'positive', sourceHandle: 'Verificar convênios', sourcePortLabel: 'Verificar convênios' },
        
        // Connections from exam scheduling card (index 8)
        { id: `conn-${nanoid(6)}`, start: cards[8].id, end: cards[9].id, type: 'positive', sourceHandle: 'Confirmar', sourcePortLabel: 'Confirmar' }
      ];
      break;
      
    case 'marketing':
      // Create cards for digital marketing
      cards = [
        // Initial card - welcome message (level 0)
        {
          id: `card-${nanoid(6)}`,
          type: 'initial',
          title: 'Boas-vindas',
          description: 'Mensagem de boas-vindas para o cliente',
          content: 'Olá! Seja bem-vindo(a) à Agência Conecta. Meu nome é Lucas, como posso ajudar você hoje?',
          position: calculatePosition(0, 0, 0, 1),
          fields: {},
          outputPorts: ['Serviços', 'Cases', 'Pacotes', 'Orçamento', 'Dúvidas']
        },
        
        // Services card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'service',
          title: 'Serviços',
          description: 'Serviços de marketing digital oferecidos',
          content: 'Oferecemos os seguintes serviços de marketing digital:\n- Gestão de Redes Sociais\n- Marketing de Conteúdo\n- SEO (Otimização para Buscadores)\n- Google Ads e Meta Ads\n- Email Marketing\n- Produção de Conteúdo\n- Desenvolvimento de Sites e Landing Pages',
          position: calculatePosition(1, 1, 0, 5),
          fields: {
            deliverables: 'Relatórios mensais, reuniões de alinhamento, conteúdo personalizado'
          },
          outputPorts: ['Detalhes de serviços', 'Ver pacotes', 'Solicitar orçamento']
        },
        
        // Case studies card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'cases',
          title: 'Cases',
          description: 'Casos de sucesso',
          content: 'Conheça alguns de nossos casos de sucesso:\n\n1. Empresa XYZ: Aumento de 300% em leads qualificados em 6 meses com estratégia de SEO e conteúdo.\n\n2. Loja ABC: Crescimento de 150% em vendas online com campanhas de Google Ads e Meta Ads otimizadas.\n\n3. Serviços DEF: Engajamento triplicado nas redes sociais e aumento de 80% em conversões do site.',
          position: calculatePosition(2, 1, 1, 5),
          fields: {
            industries: 'E-commerce, Saúde, Educação, Serviços B2B, Imobiliário'
          },
          outputPorts: ['Ver case completo', 'Serviços relacionados', 'Solicitar orçamento']
        },
        
        // Packages card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'pacotes',
          title: 'Pacotes',
          description: 'Pacotes de serviços disponíveis',
          content: 'Nossos pacotes de marketing digital:\n\n1. Pacote Essencial: Gestão de 2 redes sociais + Blog (4 posts/mês) - R$ 1.500/mês\n\n2. Pacote Crescimento: Gestão de 3 redes sociais + Blog (8 posts/mês) + Email marketing - R$ 2.800/mês\n\n3. Pacote Premium: Gestão completa de redes sociais + Blog + Email + Ads (Google e Meta) - R$ 4.500/mês\n\nTodos incluem relatórios mensais e reuniões de alinhamento.',
          position: calculatePosition(3, 1, 2, 5),
          fields: {
            contract: 'Contrato mínimo de 3 meses, sem multa após esse período'
          },
          outputPorts: ['Detalhes dos pacotes', 'Personalizar pacote', 'Contratar']
        },
        
        // Budget card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'service',
          title: 'Orçamento',
          description: 'Solicitação de orçamento personalizado',
          content: 'Para elaborar um orçamento personalizado, preciso de algumas informações:\n1. Nome da empresa\n2. Segmento de atuação\n3. Site e redes sociais atuais (se houver)\n4. Principais objetivos (vendas, leads, branding, etc.)\n5. Orçamento disponível (opcional)\n6. Serviços de interesse',
          position: calculatePosition(4, 1, 3, 5),
          fields: {
            responseTime: 'Até 24h úteis'
          },
          outputPorts: ['Enviar informações', 'Ver pacotes prontos', 'Falar com consultor']
        },
        
        // FAQ card (level 1)
        {
          id: `card-${nanoid(6)}`,
          type: 'faq',
          title: 'Dúvidas',
          description: 'Perguntas frequentes',
          content: 'Como posso ajudar?\n- Prazo de resultados: varia conforme estratégia, primeiros resultados em 30-90 dias\n- Forma de trabalho: reuniões de alinhamento, entregas conforme cronograma, relatórios mensais\n- Cancelamento: aviso prévio de 30 dias após período mínimo de contrato\n- Propriedade do conteúdo: todo conteúdo produzido pertence ao cliente',
          position: calculatePosition(5, 1, 4, 5),
          fields: {},
          outputPorts: ['Serviços', 'Solicitar orçamento', 'Falar com consultor']
        },
        
        // Service details card (level 2)
        {
          id: `card-${nanoid(6)}`,
          type: 'info',
          title: 'Detalhes de Serviços',
          description: 'Informações detalhadas sobre serviços',
          content: 'Detalhes do serviço [nome do serviço]:\n\n- O que inclui: [detalhamento]\n- Metodologia: [metodologia]\n- Entregas: [entregas]\n- Prazo para resultados: [prazo]\n- Investimento: a partir de R$ [valor]/mês\n\nTodos os serviços incluem relatórios de desempenho e reuniões de alinhamento.',
          position: calculatePosition(6, 2, 0, 3),
          fields: {},
          outputPorts: ['Solicitar orçamento', 'Ver outros serviços', 'Contratar']
        },
        
        // Custom package card (level 2)
        {
          id: `card-${nanoid(6)}`,
          type: 'service',
          title: 'Pacote Personalizado',
          description: 'Criação de pacote personalizado',
          content: 'Vamos criar um pacote que atenda exatamente às suas necessidades. Selecione os serviços desejados:\n- Gestão de Redes Sociais (quais redes?)\n- Marketing de Conteúdo\n- SEO\n- Google Ads\n- Meta Ads\n- Email Marketing\n- Desenvolvimento Web\n\nCom base em sua seleção, prepararemos uma proposta personalizada.',
          position: calculatePosition(7, 2, 1, 3),
          fields: {},
          outputPorts: ['Solicitar proposta', 'Ver pacotes prontos', 'Falar com consultor']
        },
        
        // Contract card (level 2)
        {
          id: `card-${nanoid(6)}`,
          type: 'info',
          title: 'Contratação',
          description: 'Processo de contratação',
          content: 'Para formalizar a contratação, seguimos este processo:\n1. Alinhamento final do escopo e investimento\n2. Envio de proposta comercial detalhada\n3. Assinatura digital do contrato\n4. Reunião de kickoff para definição de estratégias\n5. Início das atividades conforme cronograma\n\nO pagamento é realizado mensalmente, com emissão de nota fiscal.',
          position: calculatePosition(8, 2, 2, 3),
          fields: {
            paymentMethods: 'Transferência bancária, PIX, boleto'
          },
          outputPorts: ['Avançar', 'Tirar dúvidas', 'Voltar']
        },
        
        // Proposal card (level 3)
        {
          id: `card-${nanoid(6)}`,
          type: 'final',
          title: 'Proposta',
          description: 'Envio de proposta comercial',
          content: 'Ótimo! Baseado nas informações fornecidas, prepararemos uma proposta personalizada em até 24h úteis. A proposta será enviada para seu email e um de nossos consultores entrará em contato para explicar todos os detalhes e esclarecer eventuais dúvidas.\n\nPrecisa de mais alguma informação no momento?',
          position: calculatePosition(-100, 3, 0, 1),
          fields: {},
          outputPorts: ['Solicitar outras informações', 'Encerrar']
        }
      ];
      
      // Create connections between cards for digital marketing
      connections = [
        // Connections from welcome card (index 0)
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[1].id, type: 'positive', sourceHandle: 'Serviços', sourcePortLabel: 'Serviços' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[2].id, type: 'positive', sourceHandle: 'Cases', sourcePortLabel: 'Cases' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[3].id, type: 'positive', sourceHandle: 'Pacotes', sourcePortLabel: 'Pacotes' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[4].id, type: 'positive', sourceHandle: 'Orçamento', sourcePortLabel: 'Orçamento' },
        { id: `conn-${nanoid(6)}`, start: cards[0].id, end: cards[5].id, type: 'positive', sourceHandle: 'Dúvidas', sourcePortLabel: 'Dúvidas' },
        
        // Connections from services card (index 1)
        { id: `conn-${nanoid(6)}`, start: cards[1].id, end: cards[6].id, type: 'positive', sourceHandle: 'Detalhes de serviços', sourcePortLabel: 'Detalhes de serviços' },
        { id: `conn-${nanoid(6)}`, start: cards[1].id, end: cards[3].id, type: 'positive', sourceHandle: 'Ver pacotes', sourcePortLabel: 'Ver pacotes' },
        { id: `conn-${nanoid(6)}`, start: cards[1].id, end: cards[4].id, type: 'positive', sourceHandle: 'Solicitar orçamento', sourcePortLabel: 'Solicitar orçamento' },
        
        // Connections from case studies card (index 2)
        { id: `conn-${nanoid(6)}`, start: cards[2].id, end: cards[1].id, type: 'positive', sourceHandle: 'Serviços relacionados', sourcePortLabel: 'Serviços relacionados' },
        { id: `conn-${nanoid(6)}`, start: cards[2].id, end: cards[4].id, type: 'positive', sourceHandle: 'Solicitar orçamento', sourcePortLabel: 'Solicitar orçamento' },
        
        // Connections from packages card (index 3)
        { id: `conn-${nanoid(6)}`, start: cards[3].id, end: cards[7].id, type: 'positive', sourceHandle: 'Personalizar pacote', sourcePortLabel: 'Personalizar pacote' },
        { id: `conn-${nanoid(6)}`, start: cards[3].id, end: cards[8].id, type: 'positive', sourceHandle: 'Contratar', sourcePortLabel: 'Contratar' },
        
        // Connections from budget card (index 4)
        { id: `conn-${nanoid(6)}`, start: cards[4].id, end: cards[9].id, type: 'positive', sourceHandle: 'Enviar informações', sourcePortLabel: 'Enviar informações' },
        { id: `conn-${nanoid(6)}`, start: cards[4].id, end: cards[3].id, type: 'positive', sourceHandle: 'Ver pacotes prontos', sourcePortLabel: 'Ver pacotes prontos' },
        
        // Connections from FAQ card (index 5)
        { id: `conn-${nanoid(6)}`, start: cards[5].id, end: cards[1].id, type: 'positive', sourceHandle: 'Serviços', sourcePortLabel: 'Serviços' },
        { id: `conn-${nanoid(6)}`, start: cards[5].id, end: cards[4].id, type: 'positive', sourceHandle: 'Solicitar orçamento', sourcePortLabel: 'Solicitar orçamento' },
        
        // Connections from service details card (index 6)
        { id: `conn-${nanoid(6)}`, start: cards[6].id, end: cards[4].id, type: 'positive', sourceHandle: 'Solicitar orçamento', sourcePortLabel: 'Solicitar orçamento' },
        { id: `conn-${nanoid(6)}`, start: cards[6].id, end: cards[8].id, type: 'positive', sourceHandle: 'Contratar', sourcePortLabel: 'Contratar' },
        
        // Connections from custom package card (index 7)
        { id: `conn-${nanoid(6)}`, start: cards[7].id, end: cards[9].id, type: 'positive', sourceHandle: 'Solicitar proposta', sourcePortLabel: 'Solicitar proposta' },
        { id: `conn-${nanoid(6)}`, start: cards[7].id, end: cards[3].id, type: 'positive', sourceHandle: 'Ver pacotes prontos', sourcePortLabel: 'Ver pacotes prontos' },
        
        // Connections from contract card (index 8)
        { id: `conn-${nanoid(6)}`, start: cards[8].id, end: cards[9].id, type: 'positive', sourceHandle: 'Avançar', sourcePortLabel: 'Avançar' }
      ];
      break;
      
    default:
      // Default empty flow
      break;
  }
  
  // Return the complete flow data
  return {
    cards,
    connections,
    profile
  };
};

