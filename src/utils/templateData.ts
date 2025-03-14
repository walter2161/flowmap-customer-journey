
import { FlowData, FlowCard, AssistantProfile } from './flowTypes';
import { nanoid } from 'nanoid';

// Define template options for the UI
export const templateOptions = [
  { id: 'imobiliaria', name: 'Imobiliária', description: 'Template para atendimento imobiliário' },
  { id: 'servicos', name: 'Serviços', description: 'Template para empresas de serviços' },
  { id: 'ecommerce', name: 'E-commerce', description: 'Template para lojas online' },
  { id: 'suporte', name: 'Suporte', description: 'Template para atendimento de suporte' },
];

// Function to create a template-specific profile
const createProfile = (templateId: string): AssistantProfile => {
  switch (templateId) {
    case 'imobiliaria':
      return {
        name: 'Ana Imóveis',
        profession: 'Corretora de Imóveis',
        company: 'Imobiliária Exemplo',
        contacts: 'contato@imobiliaria.com | (11) 99999-9999',
        guidelines: 'Seja cordial e ajude o cliente a encontrar o imóvel ideal para suas necessidades.'
      };
    case 'servicos':
      return {
        name: 'Carlos Serviços',
        profession: 'Prestador de Serviços',
        company: 'Serviços Gerais',
        contacts: 'contato@servicos.com | (11) 88888-8888',
        guidelines: 'Explique detalhadamente os serviços e dê orçamentos precisos.'
      };
    case 'ecommerce':
      return {
        name: 'Loja Virtual',
        profession: 'Atendente de E-commerce',
        company: 'Loja Online',
        contacts: 'vendas@loja.com | (11) 77777-7777',
        guidelines: 'Ajude o cliente a escolher produtos e facilite o processo de compra.'
      };
    case 'suporte':
      return {
        name: 'Suporte Técnico',
        profession: 'Atendente de Suporte',
        company: 'TechSuporte',
        contacts: 'suporte@empresa.com | (11) 66666-6666',
        guidelines: 'Resolva os problemas técnicos do cliente de maneira clara e objetiva.'
      };
    default:
      return {
        name: 'Assistente Virtual',
        profession: 'Atendente',
        company: 'Empresa',
        contacts: 'contato@empresa.com',
        guidelines: 'Seja cordial e ajude o cliente da melhor forma possível.'
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
    case 'imobiliaria':
      // Initial greeting card
      const initialCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'initial',
        title: 'Boas-vindas',
        description: 'Mensagem inicial de atendimento',
        content: 'Olá! Bem-vindo à Imobiliária Exemplo. Como posso ajudar você hoje?',
        position: { x: 250, y: 50 },
        fields: {},
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Buscar Imóveis' },
          { id: `port-${nanoid(6)}`, label: 'Agendar Visita' },
          { id: `port-${nanoid(6)}`, label: 'Outros Assuntos' }
        ]
      };
      
      // Imóvel card
      const imovelCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'imovel',
        title: 'Apartamento Vila Mariana',
        description: 'Apartamento disponível para venda',
        content: 'Ótimo apartamento com localização privilegiada.',
        position: { x: 100, y: 250 },
        fields: {
          endereco: 'Rua das Flores, 123 - Vila Mariana',
          preco: 'R$ 450.000,00',
          area: '75',
          quartos: '2'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Interessado' },
          { id: `port-${nanoid(6)}`, label: 'Não Interessado' }
        ]
      };
      
      // Agendamento card
      const agendamentoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'agendar-visita',
        title: 'Agendar Visita',
        description: 'Formulário para agendamento de visita',
        content: 'Preencha os dados abaixo para agendar uma visita.',
        position: { x: 400, y: 250 },
        fields: {
          data: '',
          horario: '',
          endereco: 'Rua das Flores, 123 - Vila Mariana'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Agendado' }
        ]
      };
      
      // Contato card
      const contatoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'contatos',
        title: 'Nossos Contatos',
        description: 'Informações de contato da imobiliária',
        content: 'Entre em contato conosco pelos canais abaixo:',
        position: { x: 700, y: 250 },
        fields: {
          telefone: '(11) 99999-9999',
          email: 'contato@imobiliaria.com',
          whatsapp: '(11) 99999-9999'
        },
        outputPorts: []
      };
      
      // Add connections
      connections = [
        {
          id: `conn-${nanoid(6)}`,
          start: initialCard.id,
          end: imovelCard.id,
          type: 'positive',
          sourceHandle: initialCard.outputPorts[0].id,
          sourcePortLabel: initialCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: initialCard.id,
          end: agendamentoCard.id,
          type: 'positive',
          sourceHandle: initialCard.outputPorts[1].id,
          sourcePortLabel: initialCard.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: initialCard.id,
          end: contatoCard.id,
          type: 'positive',
          sourceHandle: initialCard.outputPorts[2].id,
          sourcePortLabel: initialCard.outputPorts[2].label
        }
      ];
      
      cards = [initialCard, imovelCard, agendamentoCard, contatoCard];
      break;
      
    case 'servicos':
      // Initial greeting card
      const initialServiceCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'initial',
        title: 'Boas-vindas',
        description: 'Mensagem inicial de atendimento',
        content: 'Olá! Bem-vindo à Serviços Gerais. Como posso ajudar você hoje?',
        position: { x: 250, y: 50 },
        fields: {},
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Solicitar Serviço' },
          { id: `port-${nanoid(6)}`, label: 'Orçamento' },
          { id: `port-${nanoid(6)}`, label: 'Contatos' }
        ]
      };
      
      // Serviço card
      const servicoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'servico',
        title: 'Pintura Residencial',
        description: 'Serviço de pintura completa',
        content: 'Serviço de pintura interna e externa com materiais de qualidade.',
        position: { x: 100, y: 250 },
        fields: {
          nome: 'Pintura Residencial',
          preco: 'R$ 35,00/m²',
          duracao: '5 dias (em média)'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Solicitar' }
        ]
      };
      
      // Ordem de serviço card
      const ordemServicoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'ordem-servico',
        title: 'Ordem de Serviço',
        description: 'Criar ordem de serviço',
        content: 'Preencha os dados para criarmos sua ordem de serviço.',
        position: { x: 400, y: 250 },
        fields: {
          cliente: '',
          endereco: '',
          telefone: '',
          servico: 'Pintura Residencial'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Finalizar' }
        ]
      };
      
      // Contato card
      const contatoServicoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'contatos',
        title: 'Nossos Contatos',
        description: 'Informações de contato da empresa',
        content: 'Entre em contato conosco pelos canais abaixo:',
        position: { x: 700, y: 250 },
        fields: {
          telefone: '(11) 88888-8888',
          email: 'contato@servicos.com',
          whatsapp: '(11) 88888-8888'
        },
        outputPorts: []
      };
      
      // Add connections
      connections = [
        {
          id: `conn-${nanoid(6)}`,
          start: initialServiceCard.id,
          end: servicoCard.id,
          type: 'positive',
          sourceHandle: initialServiceCard.outputPorts[0].id,
          sourcePortLabel: initialServiceCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: initialServiceCard.id,
          end: ordemServicoCard.id,
          type: 'positive',
          sourceHandle: initialServiceCard.outputPorts[1].id,
          sourcePortLabel: initialServiceCard.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: initialServiceCard.id,
          end: contatoServicoCard.id,
          type: 'positive',
          sourceHandle: initialServiceCard.outputPorts[2].id,
          sourcePortLabel: initialServiceCard.outputPorts[2].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: servicoCard.id,
          end: ordemServicoCard.id,
          type: 'positive',
          sourceHandle: servicoCard.outputPorts[0].id,
          sourcePortLabel: servicoCard.outputPorts[0].label
        }
      ];
      
      cards = [initialServiceCard, servicoCard, ordemServicoCard, contatoServicoCard];
      break;
      
    case 'ecommerce':
      // Create ecommerce template cards and connections
      const initialEcommerceCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'initial',
        title: 'Boas-vindas',
        description: 'Mensagem inicial de atendimento',
        content: 'Olá! Bem-vindo à nossa loja virtual. Como posso ajudar você hoje?',
        position: { x: 250, y: 50 },
        fields: {},
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Ver Produtos' },
          { id: `port-${nanoid(6)}`, label: 'Ajuda com Pedido' },
          { id: `port-${nanoid(6)}`, label: 'Contatos' }
        ]
      };
      
      // Produto card
      const produtoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'produto',
        title: 'Smartphone XYZ',
        description: 'Smartphone de última geração',
        content: 'Smartphone com câmera de alta resolução e processador potente.',
        position: { x: 100, y: 250 },
        fields: {
          nome: 'Smartphone XYZ',
          preco: 'R$ 1.999,00',
          estoque: '15',
          categoria: 'Eletrônicos'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Comprar' },
          { id: `port-${nanoid(6)}`, label: 'Ver mais produtos' }
        ]
      };
      
      cards = [initialEcommerceCard, produtoCard];
      connections = [
        {
          id: `conn-${nanoid(6)}`,
          start: initialEcommerceCard.id,
          end: produtoCard.id,
          type: 'positive',
          sourceHandle: initialEcommerceCard.outputPorts[0].id,
          sourcePortLabel: initialEcommerceCard.outputPorts[0].label
        }
      ];
      break;
      
    case 'suporte':
      // Create support template cards and connections
      const initialSupportCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'initial',
        title: 'Boas-vindas',
        description: 'Mensagem inicial de atendimento de suporte',
        content: 'Olá! Seja bem-vindo ao Suporte Técnico. Como posso ajudar você hoje?',
        position: { x: 250, y: 50 },
        fields: {},
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Problema Técnico' },
          { id: `port-${nanoid(6)}`, label: 'Dúvida' },
          { id: `port-${nanoid(6)}`, label: 'Contato' }
        ]
      };
      
      cards = [initialSupportCard];
      connections = [];
      break;
      
    default:
      // Default template with just an initial card
      const defaultCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'initial',
        title: 'Boas-vindas',
        description: 'Mensagem inicial de atendimento',
        content: 'Olá! Como posso ajudar você hoje?',
        position: { x: 250, y: 50 },
        fields: {},
        outputPorts: []
      };
      
      cards = [defaultCard];
  }

  return {
    cards,
    connections,
    profile
  };
};
