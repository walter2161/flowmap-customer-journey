
import { FlowData, FlowCard, AssistantProfile } from './flowTypes';
import { nanoid } from 'nanoid';

// Define template options for the UI
export const templateOptions = [
  { id: 'salao', name: 'Salão de Beleza', description: 'Template para salão de beleza' },
  { id: 'imobiliaria', name: 'Imobiliária', description: 'Template para atendimento imobiliário' },
  { id: 'clinica', name: 'Clínica', description: 'Template para clínicas médicas' },
  { id: 'ecommerce', name: 'E-commerce', description: 'Template para lojas online' },
  { id: 'marketing', name: 'Marketing', description: 'Template para agência de marketing' },
];

// Function to create a template-specific profile
const createProfile = (templateId: string): AssistantProfile => {
  switch (templateId) {
    case 'salao':
      return {
        name: 'Beleza Total',
        profession: 'Assistente Virtual',
        company: 'Salão Beleza Total',
        contacts: 'contato@belezatotal.com | (11) 99999-8888',
        guidelines: 'Seja cordial e ajude o cliente a agendar serviços ou tirar dúvidas sobre nossos tratamentos.',
        avatar: '/placeholder.svg'
      };
    case 'imobiliaria':
      return {
        name: 'Ana Imóveis',
        profession: 'Corretora de Imóveis',
        company: 'Imobiliária Premium',
        contacts: 'contato@imobiliariapremium.com | (11) 99999-9999',
        guidelines: 'Seja cordial e ajude o cliente a encontrar o imóvel ideal para suas necessidades.',
        avatar: '/placeholder.svg'
      };
    case 'clinica':
      return {
        name: 'Dr. Saúde',
        profession: 'Assistente Virtual',
        company: 'Clínica Saúde Integral',
        contacts: 'contato@clinicasaude.com | (11) 55555-7777',
        guidelines: 'Seja acolhedor e ajude o paciente a agendar consultas e tirar dúvidas sobre nossos serviços.',
        avatar: '/placeholder.svg'
      };
    case 'ecommerce':
      return {
        name: 'Loja Virtual',
        profession: 'Atendente de E-commerce',
        company: 'MegaShop Online',
        contacts: 'vendas@megashop.com | (11) 77777-7777',
        guidelines: 'Ajude o cliente a escolher produtos e facilite o processo de compra.',
        avatar: '/placeholder.svg'
      };
    case 'marketing':
      return {
        name: 'Marketing Digital',
        profession: 'Consultor de Marketing',
        company: 'Agência Impacto',
        contacts: 'contato@agenciaimpacto.com | (11) 88888-6666',
        guidelines: 'Seja proativo e ajude o cliente a entender os serviços de marketing que oferecemos.',
        avatar: '/placeholder.svg'
      };
    default:
      return {
        name: 'Assistente Virtual',
        profession: 'Atendente',
        company: 'Empresa',
        contacts: 'contato@empresa.com',
        guidelines: 'Seja cordial e ajude o cliente da melhor forma possível.',
        avatar: '/placeholder.svg'
      };
  }
};

// Function to get template data based on the selected template ID
export const getTemplateData = (templateId: string): FlowData => {
  const profile = createProfile(templateId);
  let cards: FlowCard[] = [];
  let connections: any[] = [];

  // Create template-specific cards and connections
  switch (templateId) {
    case 'salao':
      // Initial greeting card
      const initialSalaoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'initial',
        title: 'Boas-vindas',
        description: 'Mensagem inicial de atendimento',
        content: 'Olá! Bem-vindo ao Salão Beleza Total. Como posso ajudar você hoje?',
        position: { x: 250, y: 50 },
        fields: {},
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Serviços' },
          { id: `port-${nanoid(6)}`, label: 'Agendar Horário' },
          { id: `port-${nanoid(6)}`, label: 'Promoções' }
        ]
      };
      
      // Serviços cards
      const servicoCard1: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'servico',
        title: 'Corte de Cabelo',
        description: 'Cortes femininos e masculinos',
        content: 'Cortes modernos e personalizados para realçar sua beleza.',
        position: { x: 100, y: 200 },
        fields: {
          nome: 'Corte de Cabelo',
          preco: 'A partir de R$ 60,00',
          duracao: '45 minutos'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Agendar' },
          { id: `port-${nanoid(6)}`, label: 'Ver mais serviços' }
        ]
      };
      
      const servicoCard2: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'servico',
        title: 'Coloração',
        description: 'Coloração e mechas',
        content: 'Transforme seu visual com nossas colorações de alta qualidade.',
        position: { x: 100, y: 350 },
        fields: {
          nome: 'Coloração',
          preco: 'A partir de R$ 150,00',
          duracao: '2 horas'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Agendar' },
          { id: `port-${nanoid(6)}`, label: 'Ver mais serviços' }
        ]
      };
      
      const servicoCard3: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'servico',
        title: 'Manicure e Pedicure',
        description: 'Tratamento para unhas',
        content: 'Unhas impecáveis com esmaltação comum ou em gel.',
        position: { x: 100, y: 500 },
        fields: {
          nome: 'Manicure e Pedicure',
          preco: 'R$ 80,00',
          duracao: '1 hora'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Agendar' },
          { id: `port-${nanoid(6)}`, label: 'Ver mais serviços' }
        ]
      };
      
      // Agendamento card
      const agendamentoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'agendamento',
        title: 'Agendar Horário',
        description: 'Formulário para agendamento',
        content: 'Preencha os dados abaixo para agendar seu horário.',
        position: { x: 400, y: 250 },
        fields: {
          cliente: '',
          servico: '',
          data: '',
          horario: ''
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Confirmar' },
          { id: `port-${nanoid(6)}`, label: 'Cancelar' }
        ]
      };
      
      // Promoções card
      const promocoesCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'promocoes',
        title: 'Promoções',
        description: 'Promoções especiais',
        content: 'Confira nossas promoções exclusivas:',
        position: { x: 400, y: 450 },
        fields: {
          promocao1: 'Terça e quinta: 20% off em colorações',
          promocao2: 'Combo manicure + pedicure: R$ 70,00',
          promocao3: 'Traga uma amiga e ganhe 15% de desconto'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Agendar' },
          { id: `port-${nanoid(6)}`, label: 'Voltar' }
        ]
      };
      
      // Confirmação card
      const confirmacaoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'confirmacao',
        title: 'Agendamento Confirmado',
        description: 'Confirmação de horário',
        content: 'Seu horário foi agendado com sucesso! Lembramos que o cancelamento deve ser feito com pelo menos 2 horas de antecedência.',
        position: { x: 600, y: 250 },
        fields: {
          profissional: 'A definir conforme disponibilidade',
          endereco: 'Rua da Beleza, 123 - Centro'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Finalizar' }
        ]
      };
      
      // Produtos card
      const produtosCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'produtos',
        title: 'Produtos Profissionais',
        description: 'Produtos à venda',
        content: 'Temos produtos profissionais para cuidados domiciliares:',
        position: { x: 600, y: 450 },
        fields: {
          produto1: 'Shampoo e condicionador: R$ 120,00 o kit',
          produto2: 'Máscara de hidratação capilar: R$ 80,00',
          produto3: 'Óleo reparador: R$ 65,00'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Ver mais' },
          { id: `port-${nanoid(6)}`, label: 'Voltar' }
        ]
      };
      
      // Add connections
      connections = [
        {
          id: `conn-${nanoid(6)}`,
          start: initialSalaoCard.id,
          end: servicoCard1.id,
          type: 'positive',
          sourceHandle: initialSalaoCard.outputPorts[0].id,
          sourcePortLabel: initialSalaoCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: initialSalaoCard.id,
          end: agendamentoCard.id,
          type: 'positive',
          sourceHandle: initialSalaoCard.outputPorts[1].id,
          sourcePortLabel: initialSalaoCard.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: initialSalaoCard.id,
          end: promocoesCard.id,
          type: 'positive',
          sourceHandle: initialSalaoCard.outputPorts[2].id,
          sourcePortLabel: initialSalaoCard.outputPorts[2].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: servicoCard1.id,
          end: servicoCard2.id,
          type: 'positive',
          sourceHandle: servicoCard1.outputPorts[1].id,
          sourcePortLabel: servicoCard1.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: servicoCard2.id,
          end: servicoCard3.id,
          type: 'positive',
          sourceHandle: servicoCard2.outputPorts[1].id,
          sourcePortLabel: servicoCard2.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: servicoCard1.id,
          end: agendamentoCard.id,
          type: 'positive',
          sourceHandle: servicoCard1.outputPorts[0].id,
          sourcePortLabel: servicoCard1.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: servicoCard2.id,
          end: agendamentoCard.id,
          type: 'positive',
          sourceHandle: servicoCard2.outputPorts[0].id,
          sourcePortLabel: servicoCard2.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: servicoCard3.id,
          end: agendamentoCard.id,
          type: 'positive',
          sourceHandle: servicoCard3.outputPorts[0].id,
          sourcePortLabel: servicoCard3.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: agendamentoCard.id,
          end: confirmacaoCard.id,
          type: 'positive',
          sourceHandle: agendamentoCard.outputPorts[0].id,
          sourcePortLabel: agendamentoCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: promocoesCard.id,
          end: agendamentoCard.id,
          type: 'positive',
          sourceHandle: promocoesCard.outputPorts[0].id,
          sourcePortLabel: promocoesCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: promocoesCard.id,
          end: produtosCard.id,
          type: 'positive',
          sourceHandle: promocoesCard.outputPorts[1].id,
          sourcePortLabel: promocoesCard.outputPorts[1].label
        }
      ];
      
      cards = [initialSalaoCard, servicoCard1, servicoCard2, servicoCard3, agendamentoCard, promocoesCard, confirmacaoCard, produtosCard];
      break;
      
    case 'imobiliaria':
      // Initial greeting card
      const initialImobCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'initial',
        title: 'Boas-vindas',
        description: 'Mensagem inicial de atendimento',
        content: 'Olá! Bem-vindo à Imobiliária Premium. Como posso ajudar você hoje?',
        position: { x: 250, y: 50 },
        fields: {},
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Buscar Imóveis' },
          { id: `port-${nanoid(6)}`, label: 'Agendar Visita' },
          { id: `port-${nanoid(6)}`, label: 'Financiamento' }
        ]
      };
      
      // Imóveis cards
      const imovelCard1: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'imovel',
        title: 'Apartamento Vila Nova',
        description: 'Apartamento disponível para venda',
        content: 'Amplo apartamento com localização privilegiada.',
        position: { x: 100, y: 200 },
        fields: {
          endereco: 'Av. São João, 500 - Vila Nova',
          preco: 'R$ 550.000,00',
          area: '90m²',
          quartos: '3'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Agendar visita' },
          { id: `port-${nanoid(6)}`, label: 'Ver mais imóveis' }
        ]
      };
      
      const imovelCard2: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'imovel',
        title: 'Casa em Condomínio',
        description: 'Casa de alto padrão',
        content: 'Casa espaçosa em condomínio fechado com segurança 24h.',
        position: { x: 100, y: 350 },
        fields: {
          endereco: 'Rua das Palmeiras, 200 - Condomínio Verde',
          preco: 'R$ 1.500.000,00',
          area: '250m²',
          quartos: '4'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Agendar visita' },
          { id: `port-${nanoid(6)}`, label: 'Ver mais imóveis' }
        ]
      };
      
      const imovelCard3: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'imovel',
        title: 'Comercial Centro',
        description: 'Sala comercial para locação',
        content: 'Sala comercial em prédio moderno e bem localizado.',
        position: { x: 100, y: 500 },
        fields: {
          endereco: 'Av. Paulista, 1000 - Centro',
          preco: 'R$ 3.500,00/mês',
          area: '70m²',
          tipo: 'Comercial'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Agendar visita' },
          { id: `port-${nanoid(6)}`, label: 'Ver mais imóveis' }
        ]
      };
      
      // Agendamento card
      const agendamentoImovelCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'agendamento',
        title: 'Agendar Visita',
        description: 'Formulário para agendamento de visita',
        content: 'Preencha os dados abaixo para agendar uma visita.',
        position: { x: 400, y: 250 },
        fields: {
          cliente: '',
          imovel: '',
          data: '',
          horario: ''
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Confirmar' },
          { id: `port-${nanoid(6)}`, label: 'Cancelar' }
        ]
      };
      
      // Financiamento card
      const financiamentoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'financiamento',
        title: 'Financiamento Imobiliário',
        description: 'Informações sobre financiamento',
        content: 'Trabalhamos com diversas opções de financiamento:',
        position: { x: 400, y: 450 },
        fields: {
          banco1: 'Caixa: até 80% do valor do imóvel, até 35 anos',
          banco2: 'Banco do Brasil: até 80% do valor, até 30 anos',
          banco3: 'Santander: até 90% do valor, até 35 anos'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Simular' },
          { id: `port-${nanoid(6)}`, label: 'Voltar' }
        ]
      };
      
      // Confirmação card
      const confirmacaoImovelCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'confirmacao',
        title: 'Visita Agendada',
        description: 'Confirmação de agendamento',
        content: 'Sua visita foi agendada com sucesso! Enviaremos um lembrete no dia anterior.',
        position: { x: 600, y: 250 },
        fields: {
          corretor: 'Ana Silva',
          contato: '(11) 99999-9999'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Finalizar' }
        ]
      };
      
      // Simulação card
      const simulacaoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'simulacao',
        title: 'Simulação de Financiamento',
        description: 'Calculadora de financiamento',
        content: 'Preencha os dados para simular seu financiamento:',
        position: { x: 600, y: 450 },
        fields: {
          valor: '',
          entrada: '',
          prazo: '',
          banco: ''
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Calcular' },
          { id: `port-${nanoid(6)}`, label: 'Voltar' }
        ]
      };
      
      // Add connections
      connections = [
        {
          id: `conn-${nanoid(6)}`,
          start: initialImobCard.id,
          end: imovelCard1.id,
          type: 'positive',
          sourceHandle: initialImobCard.outputPorts[0].id,
          sourcePortLabel: initialImobCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: initialImobCard.id,
          end: agendamentoImovelCard.id,
          type: 'positive',
          sourceHandle: initialImobCard.outputPorts[1].id,
          sourcePortLabel: initialImobCard.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: initialImobCard.id,
          end: financiamentoCard.id,
          type: 'positive',
          sourceHandle: initialImobCard.outputPorts[2].id,
          sourcePortLabel: initialImobCard.outputPorts[2].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: imovelCard1.id,
          end: imovelCard2.id,
          type: 'positive',
          sourceHandle: imovelCard1.outputPorts[1].id,
          sourcePortLabel: imovelCard1.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: imovelCard2.id,
          end: imovelCard3.id,
          type: 'positive',
          sourceHandle: imovelCard2.outputPorts[1].id,
          sourcePortLabel: imovelCard2.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: imovelCard1.id,
          end: agendamentoImovelCard.id,
          type: 'positive',
          sourceHandle: imovelCard1.outputPorts[0].id,
          sourcePortLabel: imovelCard1.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: imovelCard2.id,
          end: agendamentoImovelCard.id,
          type: 'positive',
          sourceHandle: imovelCard2.outputPorts[0].id,
          sourcePortLabel: imovelCard2.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: imovelCard3.id,
          end: agendamentoImovelCard.id,
          type: 'positive',
          sourceHandle: imovelCard3.outputPorts[0].id,
          sourcePortLabel: imovelCard3.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: agendamentoImovelCard.id,
          end: confirmacaoImovelCard.id,
          type: 'positive',
          sourceHandle: agendamentoImovelCard.outputPorts[0].id,
          sourcePortLabel: agendamentoImovelCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: financiamentoCard.id,
          end: simulacaoCard.id,
          type: 'positive',
          sourceHandle: financiamentoCard.outputPorts[0].id,
          sourcePortLabel: financiamentoCard.outputPorts[0].label
        }
      ];
      
      cards = [initialImobCard, imovelCard1, imovelCard2, imovelCard3, agendamentoImovelCard, financiamentoCard, confirmacaoImovelCard, simulacaoCard];
      break;
      
    case 'clinica':
      // Initial greeting card
      const initialClinicaCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'initial',
        title: 'Boas-vindas',
        description: 'Mensagem inicial de atendimento',
        content: 'Olá! Bem-vindo à Clínica Saúde Integral. Como posso ajudar você hoje?',
        position: { x: 250, y: 50 },
        fields: {},
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Especialidades' },
          { id: `port-${nanoid(6)}`, label: 'Agendar Consulta' },
          { id: `port-${nanoid(6)}`, label: 'Convênios' }
        ]
      };
      
      // Especialidades cards
      const especialidadeCard1: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'especialidade',
        title: 'Clínica Geral',
        description: 'Consultas de rotina',
        content: 'Atendimento para diagnóstico e tratamento de problemas gerais de saúde.',
        position: { x: 100, y: 200 },
        fields: {
          nome: 'Clínica Geral',
          medicos: 'Dr. Carlos Silva, Dra. Ana Oliveira',
          preco: 'R$ 250,00'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Agendar' },
          { id: `port-${nanoid(6)}`, label: 'Ver mais especialidades' }
        ]
      };
      
      const especialidadeCard2: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'especialidade',
        title: 'Cardiologia',
        description: 'Saúde do coração',
        content: 'Diagnóstico e tratamento de problemas cardiovasculares.',
        position: { x: 100, y: 350 },
        fields: {
          nome: 'Cardiologia',
          medicos: 'Dr. Paulo Santos, Dra. Maria Costa',
          preco: 'R$ 350,00'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Agendar' },
          { id: `port-${nanoid(6)}`, label: 'Ver mais especialidades' }
        ]
      };
      
      const especialidadeCard3: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'especialidade',
        title: 'Dermatologia',
        description: 'Cuidados com a pele',
        content: 'Tratamentos estéticos e clínicos para problemas de pele.',
        position: { x: 100, y: 500 },
        fields: {
          nome: 'Dermatologia',
          medicos: 'Dra. Camila Rocha, Dr. Roberto Almeida',
          preco: 'R$ 300,00'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Agendar' },
          { id: `port-${nanoid(6)}`, label: 'Ver mais especialidades' }
        ]
      };
      
      // Agendamento card
      const agendamentoClinicaCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'agendamento',
        title: 'Agendar Consulta',
        description: 'Formulário para agendamento',
        content: 'Preencha os dados abaixo para agendar sua consulta.',
        position: { x: 400, y: 250 },
        fields: {
          paciente: '',
          especialidade: '',
          medico: '',
          data: '',
          horario: ''
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Confirmar' },
          { id: `port-${nanoid(6)}`, label: 'Cancelar' }
        ]
      };
      
      // Convênios card
      const conveniosCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'convenios',
        title: 'Convênios Aceitos',
        description: 'Planos de saúde aceitos',
        content: 'Trabalhamos com os seguintes convênios:',
        position: { x: 400, y: 450 },
        fields: {
          convenio1: 'Amil - todos os planos',
          convenio2: 'Bradesco Saúde - a partir do plano essencial',
          convenio3: 'Unimed - todos os planos',
          convenio4: 'SulAmérica - a partir do plano especial'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Agendar com convênio' },
          { id: `port-${nanoid(6)}`, label: 'Voltar' }
        ]
      };
      
      // Confirmação card
      const confirmacaoClinicaCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'confirmacao',
        title: 'Consulta Agendada',
        description: 'Confirmação de agendamento',
        content: 'Sua consulta foi agendada com sucesso! Enviaremos um lembrete 24h antes do horário.',
        position: { x: 600, y: 250 },
        fields: {
          observacoes: 'Chegar 15 minutos antes, trazer documentos e exames anteriores'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Finalizar' }
        ]
      };
      
      // Exames card
      const examesCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'exames',
        title: 'Exames Disponíveis',
        description: 'Exames realizados na clínica',
        content: 'Realizamos os seguintes exames in loco:',
        position: { x: 600, y: 450 },
        fields: {
          exame1: 'Hemograma completo',
          exame2: 'Eletrocardiograma',
          exame3: 'Ultrassonografia',
          exame4: 'Raio-X'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Agendar exame' },
          { id: `port-${nanoid(6)}`, label: 'Voltar' }
        ]
      };
      
      // Add connections
      connections = [
        {
          id: `conn-${nanoid(6)}`,
          start: initialClinicaCard.id,
          end: especialidadeCard1.id,
          type: 'positive',
          sourceHandle: initialClinicaCard.outputPorts[0].id,
          sourcePortLabel: initialClinicaCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: initialClinicaCard.id,
          end: agendamentoClinicaCard.id,
          type: 'positive',
          sourceHandle: initialClinicaCard.outputPorts[1].id,
          sourcePortLabel: initialClinicaCard.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: initialClinicaCard.id,
          end: conveniosCard.id,
          type: 'positive',
          sourceHandle: initialClinicaCard.outputPorts[2].id,
          sourcePortLabel: initialClinicaCard.outputPorts[2].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: especialidadeCard1.id,
          end: especialidadeCard2.id,
          type: 'positive',
          sourceHandle: especialidadeCard1.outputPorts[1].id,
          sourcePortLabel: especialidadeCard1.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: especialidadeCard2.id,
          end: especialidadeCard3.id,
          type: 'positive',
          sourceHandle: especialidadeCard2.outputPorts[1].id,
          sourcePortLabel: especialidadeCard2.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: especialidadeCard1.id,
          end: agendamentoClinicaCard.id,
          type: 'positive',
          sourceHandle: especialidadeCard1.outputPorts[0].id,
          sourcePortLabel: especialidadeCard1.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: especialidadeCard2.id,
          end: agendamentoClinicaCard.id,
          type: 'positive',
          sourceHandle: especialidadeCard2.outputPorts[0].id,
          sourcePortLabel: especialidadeCard2.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: especialidadeCard3.id,
          end: agendamentoClinicaCard.id,
          type: 'positive',
          sourceHandle: especialidadeCard3.outputPorts[0].id,
          sourcePortLabel: especialidadeCard3.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: agendamentoClinicaCard.id,
          end: confirmacaoClinicaCard.id,
          type: 'positive',
          sourceHandle: agendamentoClinicaCard.outputPorts[0].id,
          sourcePortLabel: agendamentoClinicaCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: conveniosCard.id,
          end: agendamentoClinicaCard.id,
          type: 'positive',
          sourceHandle: conveniosCard.outputPorts[0].id,
          sourcePortLabel: conveniosCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: especialidadeCard3.id,
          end: examesCard.id,
          type: 'positive',
          sourceHandle: especialidadeCard3.outputPorts[1].id,
          sourcePortLabel: especialidadeCard3.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: examesCard.id,
          end: agendamentoClinicaCard.id,
          type: 'positive',
          sourceHandle: examesCard.outputPorts[0].id,
          sourcePortLabel: examesCard.outputPorts[0].label
        }
      ];
      
      cards = [initialClinicaCard, especialidadeCard1, especialidadeCard2, especialidadeCard3, agendamentoClinicaCard, conveniosCard, confirmacaoClinicaCard, examesCard];
      break;
      
    case 'ecommerce':
      // Initial greeting card
      const initialEcommerceCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'initial',
        title: 'Boas-vindas',
        description: 'Mensagem inicial de atendimento',
        content: 'Olá! Bem-vindo à MegaShop Online. Como posso ajudar você hoje?',
        position: { x: 250, y: 50 },
        fields: {},
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Ver Produtos' },
          { id: `port-${nanoid(6)}`, label: 'Meu Pedido' },
          { id: `port-${nanoid(6)}`, label: 'Promoções' }
        ]
      };
      
      // Produto cards
      const produtoCard1: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'produto',
        title: 'Smartphone Ultra X',
        description: 'Smartphone topo de linha',
        content: 'Smartphone com câmera de 108MP, tela AMOLED de 6.7" e processador de última geração.',
        position: { x: 100, y: 200 },
        fields: {
          nome: 'Smartphone Ultra X',
          preco: 'R$ 3.999,00',
          estoque: '15 unidades',
          parcelas: 'até 12x sem juros'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Comprar' },
          { id: `port-${nanoid(6)}`, label: 'Ver mais produtos' }
        ]
      };
      
      const produtoCard2: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'produto',
        title: 'Notebook Pro Book',
        description: 'Notebook para trabalho',
        content: 'Notebook com processador i7, 16GB RAM, SSD de 512GB e placa de vídeo dedicada.',
        position: { x: 100, y: 350 },
        fields: {
          nome: 'Notebook Pro Book',
          preco: 'R$ 4.799,00',
          estoque: '8 unidades',
          parcelas: 'até 10x sem juros'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Comprar' },
          { id: `port-${nanoid(6)}`, label: 'Ver mais produtos' }
        ]
      };
      
      const produtoCard3: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'produto',
        title: 'Smart TV 55"',
        description: 'TV de alta definição',
        content: 'Smart TV LED 4K, 55 polegadas, com HDR, Wifi e Bluetooth integrados.',
        position: { x: 100, y: 500 },
        fields: {
          nome: 'Smart TV 55"',
          preco: 'R$ 2.899,00',
          estoque: '12 unidades',
          parcelas: 'até 8x sem juros'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Comprar' },
          { id: `port-${nanoid(6)}`, label: 'Ver mais produtos' }
        ]
      };
      
      // Carrinho card
      const carrinhoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'carrinho',
        title: 'Carrinho de Compras',
        description: 'Itens no carrinho',
        content: 'Você adicionou os seguintes itens ao seu carrinho:',
        position: { x: 400, y: 250 },
        fields: {
          quantidade: '1',
          produto: 'Smartphone Ultra X',
          preco: 'R$ 3.999,00',
          frete: 'Frete grátis'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Finalizar Compra' },
          { id: `port-${nanoid(6)}`, label: 'Continuar Comprando' }
        ]
      };
      
      // Pedido card
      const pedidoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'pedido',
        title: 'Meu Pedido',
        description: 'Acompanhamento de pedido',
        content: 'Digite o número do seu pedido para verificar o status:',
        position: { x: 400, y: 450 },
        fields: {
          numeroPedido: '',
          email: ''
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Verificar' },
          { id: `port-${nanoid(6)}`, label: 'Voltar' }
        ]
      };
      
      // Checkout card
      const checkoutCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'checkout',
        title: 'Finalizar Compra',
        description: 'Dados para finalização',
        content: 'Preencha os dados para concluir sua compra:',
        position: { x: 600, y: 250 },
        fields: {
          cliente: '',
          endereco: '',
          pagamento: 'Cartão de crédito',
          parcelas: '1x'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Confirmar Compra' },
          { id: `port-${nanoid(6)}`, label: 'Voltar ao Carrinho' }
        ]
      };
      
      // Promoções card
      const promocoesEcommerceCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'promocoes',
        title: 'Ofertas Especiais',
        description: 'Promoções da semana',
        content: 'Confira nossas promoções exclusivas:',
        position: { x: 600, y: 450 },
        fields: {
          promo1: 'Smartphones com até 20% OFF',
          promo2: 'Frete grátis para todo o Brasil',
          promo3: 'Compre 2 acessórios e ganhe 50% OFF no 3º'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Ver Produtos' },
          { id: `port-${nanoid(6)}`, label: 'Voltar' }
        ]
      };
      
      // Confirmação card
      const confirmacaoCompraCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'confirmacao',
        title: 'Compra Confirmada',
        description: 'Confirmação de pedido',
        content: 'Seu pedido foi realizado com sucesso! Você receberá um e-mail com os detalhes da compra.',
        position: { x: 800, y: 250 },
        fields: {
          numeroPedido: 'PED-2023-0001',
          previsaoEntrega: '7 dias úteis'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Finalizar' }
        ]
      };
      
      // Add connections
      connections = [
        {
          id: `conn-${nanoid(6)}`,
          start: initialEcommerceCard.id,
          end: produtoCard1.id,
          type: 'positive',
          sourceHandle: initialEcommerceCard.outputPorts[0].id,
          sourcePortLabel: initialEcommerceCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: initialEcommerceCard.id,
          end: pedidoCard.id,
          type: 'positive',
          sourceHandle: initialEcommerceCard.outputPorts[1].id,
          sourcePortLabel: initialEcommerceCard.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: initialEcommerceCard.id,
          end: promocoesEcommerceCard.id,
          type: 'positive',
          sourceHandle: initialEcommerceCard.outputPorts[2].id,
          sourcePortLabel: initialEcommerceCard.outputPorts[2].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: produtoCard1.id,
          end: produtoCard2.id,
          type: 'positive',
          sourceHandle: produtoCard1.outputPorts[1].id,
          sourcePortLabel: produtoCard1.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: produtoCard2.id,
          end: produtoCard3.id,
          type: 'positive',
          sourceHandle: produtoCard2.outputPorts[1].id,
          sourcePortLabel: produtoCard2.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: produtoCard1.id,
          end: carrinhoCard.id,
          type: 'positive',
          sourceHandle: produtoCard1.outputPorts[0].id,
          sourcePortLabel: produtoCard1.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: produtoCard2.id,
          end: carrinhoCard.id,
          type: 'positive',
          sourceHandle: produtoCard2.outputPorts[0].id,
          sourcePortLabel: produtoCard2.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: produtoCard3.id,
          end: carrinhoCard.id,
          type: 'positive',
          sourceHandle: produtoCard3.outputPorts[0].id,
          sourcePortLabel: produtoCard3.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: carrinhoCard.id,
          end: checkoutCard.id,
          type: 'positive',
          sourceHandle: carrinhoCard.outputPorts[0].id,
          sourcePortLabel: carrinhoCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: checkoutCard.id,
          end: confirmacaoCompraCard.id,
          type: 'positive',
          sourceHandle: checkoutCard.outputPorts[0].id,
          sourcePortLabel: checkoutCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: promocoesEcommerceCard.id,
          end: produtoCard1.id,
          type: 'positive',
          sourceHandle: promocoesEcommerceCard.outputPorts[0].id,
          sourcePortLabel: promocoesEcommerceCard.outputPorts[0].label
        }
      ];
      
      cards = [initialEcommerceCard, produtoCard1, produtoCard2, produtoCard3, carrinhoCard, pedidoCard, checkoutCard, promocoesEcommerceCard, confirmacaoCompraCard];
      break;
      
    case 'marketing':
      // Initial greeting card
      const initialMarketingCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'initial',
        title: 'Boas-vindas',
        description: 'Mensagem inicial de atendimento',
        content: 'Olá! Bem-vindo à Agência Impacto. Como posso ajudar você hoje?',
        position: { x: 250, y: 50 },
        fields: {},
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Serviços' },
          { id: `port-${nanoid(6)}`, label: 'Solicitar Orçamento' },
          { id: `port-${nanoid(6)}`, label: 'Cases de Sucesso' }
        ]
      };
      
      // Serviços cards
      const servicoMktCard1: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'servico',
        title: 'Marketing Digital',
        description: 'Estratégias online',
        content: 'Desenvolva sua presença online com estratégias personalizadas de marketing digital.',
        position: { x: 100, y: 200 },
        fields: {
          nome: 'Marketing Digital',
          prazo: 'Contrato mínimo de 3 meses',
          resultados: 'Primeiros resultados em 30 dias'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Solicitar Orçamento' },
          { id: `port-${nanoid(6)}`, label: 'Ver mais serviços' }
        ]
      };
      
      const servicoMktCard2: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'servico',
        title: 'Gestão de Redes Sociais',
        description: 'Gerenciamento completo',
        content: 'Planejamento, criação de conteúdo e gerenciamento completo das suas redes sociais.',
        position: { x: 100, y: 350 },
        fields: {
          nome: 'Gestão de Redes Sociais',
          posts: '15 posts mensais',
          stories: '30 stories mensais',
          relatorios: 'Relatório mensal de performance'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Solicitar Orçamento' },
          { id: `port-${nanoid(6)}`, label: 'Ver mais serviços' }
        ]
      };
      
      const servicoMktCard3: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'servico',
        title: 'Google Ads',
        description: 'Anúncios no Google',
        content: 'Campanhas de anúncios no Google para atrair clientes qualificados para seu negócio.',
        position: { x: 100, y: 500 },
        fields: {
          nome: 'Google Ads',
          gestao: 'Gestão de campanhas',
          relatorios: 'Relatório semanal de performance',
          investimento: 'Mínimo de R$ 1.500/mês'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Solicitar Orçamento' },
          { id: `port-${nanoid(6)}`, label: 'Ver mais serviços' }
        ]
      };
      
      // Orçamento card
      const orcamentoMktCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'orcamento',
        title: 'Solicitar Orçamento',
        description: 'Formulário para orçamento',
        content: 'Preencha os dados abaixo para receber um orçamento personalizado:',
        position: { x: 400, y: 250 },
        fields: {
          nome: '',
          empresa: '',
          email: '',
          telefone: '',
          servicos: '',
          observacoes: ''
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Enviar' },
          { id: `port-${nanoid(6)}`, label: 'Cancelar' }
        ]
      };
      
      // Cases card
      const casesCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'cases',
        title: 'Cases de Sucesso',
        description: 'Projetos realizados',
        content: 'Conheça alguns de nossos cases de sucesso:',
        position: { x: 400, y: 450 },
        fields: {
          case1: 'E-commerce XYZ: Aumento de 300% em vendas em 6 meses',
          case2: 'Restaurante ABC: 500% mais reservas online',
          case3: 'Clínica ZZZ: Dobrou o número de pacientes em 3 meses'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Solicitar Orçamento' },
          { id: `port-${nanoid(6)}`, label: 'Voltar' }
        ]
      };
      
      // Confirmação card
      const confirmacaoMktCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'confirmacao',
        title: 'Solicitação Enviada',
        description: 'Confirmação de envio',
        content: 'Recebemos sua solicitação de orçamento! Nossa equipe entrará em contato em até 24h úteis.',
        position: { x: 600, y: 250 },
        fields: {
          protocolo: 'ORÇ-2023-0001'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Finalizar' }
        ]
      };
      
      // Pacotes card
      const pacotesCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'pacotes',
        title: 'Pacotes de Serviços',
        description: 'Opções combinadas',
        content: 'Confira nossos pacotes especiais combinando diferentes serviços:',
        position: { x: 600, y: 450 },
        fields: {
          pacote1: 'Starter: Redes sociais + Site (R$ 1.200/mês)',
          pacote2: 'Pro: Redes sociais + Google Ads (R$ 2.500/mês)',
          pacote3: 'Premium: Redes sociais + Google Ads + SEO (R$ 4.000/mês)'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Solicitar Orçamento' },
          { id: `port-${nanoid(6)}`, label: 'Voltar' }
        ]
      };
      
      // Add connections
      connections = [
        {
          id: `conn-${nanoid(6)}`,
          start: initialMarketingCard.id,
          end: servicoMktCard1.id,
          type: 'positive',
          sourceHandle: initialMarketingCard.outputPorts[0].id,
          sourcePortLabel: initialMarketingCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: initialMarketingCard.id,
          end: orcamentoMktCard.id,
          type: 'positive',
          sourceHandle: initialMarketingCard.outputPorts[1].id,
          sourcePortLabel: initialMarketingCard.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: initialMarketingCard.id,
          end: casesCard.id,
          type: 'positive',
          sourceHandle: initialMarketingCard.outputPorts[2].id,
          sourcePortLabel: initialMarketingCard.outputPorts[2].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: servicoMktCard1.id,
          end: servicoMktCard2.id,
          type: 'positive',
          sourceHandle: servicoMktCard1.outputPorts[1].id,
          sourcePortLabel: servicoMktCard1.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: servicoMktCard2.id,
          end: servicoMktCard3.id,
          type: 'positive',
          sourceHandle: servicoMktCard2.outputPorts[1].id,
          sourcePortLabel: servicoMktCard2.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: servicoMktCard1.id,
          end: orcamentoMktCard.id,
          type: 'positive',
          sourceHandle: servicoMktCard1.outputPorts[0].id,
          sourcePortLabel: servicoMktCard1.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: servicoMktCard2.id,
          end: orcamentoMktCard.id,
          type: 'positive',
          sourceHandle: servicoMktCard2.outputPorts[0].id,
          sourcePortLabel: servicoMktCard2.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: servicoMktCard3.id,
          end: orcamentoMktCard.id,
          type: 'positive',
          sourceHandle: servicoMktCard3.outputPorts[0].id,
          sourcePortLabel: servicoMktCard3.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: orcamentoMktCard.id,
          end: confirmacaoMktCard.id,
          type: 'positive',
          sourceHandle: orcamentoMktCard.outputPorts[0].id,
          sourcePortLabel: orcamentoMktCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: casesCard.id,
          end: orcamentoMktCard.id,
          type: 'positive',
          sourceHandle: casesCard.outputPorts[0].id,
          sourcePortLabel: casesCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: servicoMktCard3.id,
          end: pacotesCard.id,
          type: 'positive',
          sourceHandle: servicoMktCard3.outputPorts[1].id,
          sourcePortLabel: servicoMktCard3.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: pacotesCard.id,
          end: orcamentoMktCard.id,
          type: 'positive',
          sourceHandle: pacotesCard.outputPorts[0].id,
          sourcePortLabel: pacotesCard.outputPorts[0].label
        }
      ];
      
      cards = [initialMarketingCard, servicoMktCard1, servicoMktCard2, servicoMktCard3, orcamentoMktCard, casesCard, confirmacaoMktCard, pacotesCard];
      break;
      
    default:
      // Default to the beauty salon template
      return getTemplateData('salao');
  }

  return {
    cards,
    connections,
    profile
  };
};
