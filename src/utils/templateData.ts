
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
        guidelines: 'Seja cordial e ajude o cliente a encontrar o imóvel ideal para suas necessidades.',
        avatar: '/placeholder.svg' // Add required avatar property
      };
    case 'servicos':
      return {
        name: 'Carlos Serviços',
        profession: 'Prestador de Serviços',
        company: 'Serviços Gerais',
        contacts: 'contato@servicos.com | (11) 88888-8888',
        guidelines: 'Explique detalhadamente os serviços e dê orçamentos precisos.',
        avatar: '/placeholder.svg' // Add required avatar property
      };
    case 'ecommerce':
      return {
        name: 'Loja Virtual',
        profession: 'Atendente de E-commerce',
        company: 'Loja Online',
        contacts: 'vendas@loja.com | (11) 77777-7777',
        guidelines: 'Ajude o cliente a escolher produtos e facilite o processo de compra.',
        avatar: '/placeholder.svg' // Add required avatar property
      };
    case 'suporte':
      return {
        name: 'Suporte Técnico',
        profession: 'Atendente de Suporte',
        company: 'TechSuporte',
        contacts: 'suporte@empresa.com | (11) 66666-6666',
        guidelines: 'Resolva os problemas técnicos do cliente de maneira clara e objetiva.',
        avatar: '/placeholder.svg' // Add required avatar property
      };
    default:
      return {
        name: 'Assistente Virtual',
        profession: 'Atendente',
        company: 'Empresa',
        contacts: 'contato@empresa.com',
        guidelines: 'Seja cordial e ajude o cliente da melhor forma possível.',
        avatar: '/placeholder.svg' // Add required avatar property
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
      
      // Imóvel cards - adding multiple property cards
      const imovelCard1: FlowCard = {
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
      
      const imovelCard2: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'imovel',
        title: 'Casa Jardins',
        description: 'Casa de alto padrão',
        content: 'Casa espaçosa em condomínio fechado com segurança 24h.',
        position: { x: 100, y: 450 },
        fields: {
          endereco: 'Rua dos Ipês, 500 - Jardins',
          preco: 'R$ 1.200.000,00',
          area: '220',
          quartos: '4'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Interessado' },
          { id: `port-${nanoid(6)}`, label: 'Não Interessado' }
        ]
      };
      
      const imovelCard3: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'imovel',
        title: 'Studio Pinheiros',
        description: 'Studio moderno e bem localizado',
        content: 'Studio com acabamento premium e próximo ao metrô.',
        position: { x: 250, y: 350 },
        fields: {
          endereco: 'Rua Augusta, 1200 - Pinheiros',
          preco: 'R$ 320.000,00',
          area: '45',
          quartos: '1'
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
          { id: `port-${nanoid(6)}`, label: 'Agendado' },
          { id: `port-${nanoid(6)}`, label: 'Cancelar' }
        ]
      };
      
      // Confirmação de agendamento
      const confirmacaoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'confirmacao',
        title: 'Visita Agendada',
        description: 'Confirmação de agendamento',
        content: 'Sua visita foi agendada com sucesso! Enviaremos um lembrete no dia anterior.',
        position: { x: 600, y: 250 },
        fields: {
          corretor: 'Ana Silva',
          telefone: '(11) 99999-9999'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Finalizar' }
        ]
      };
      
      // Documentação card
      const documentacaoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'documentacao',
        title: 'Documentação',
        description: 'Informações sobre documentação',
        content: 'Para avançar com a compra do imóvel, precisaremos dos seguintes documentos:',
        position: { x: 400, y: 400 },
        fields: {
          documentos: 'RG, CPF, Comprovante de Residência, Comprovante de Renda'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Enviar Documentos' },
          { id: `port-${nanoid(6)}`, label: 'Dúvidas' }
        ]
      };
      
      // Dúvidas frequentes card
      const duvidasCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'duvidas',
        title: 'Dúvidas Frequentes',
        description: 'Respostas para dúvidas comuns',
        content: 'Aqui estão respostas para as perguntas mais comuns:',
        position: { x: 600, y: 400 },
        fields: {
          financiamento: 'Trabalhamos com todos os bancos.',
          prazo: 'O processo de compra leva em média 60 dias.'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Voltar ao Início' }
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
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Voltar ao Início' }
        ]
      };
      
      // Add connections
      connections = [
        {
          id: `conn-${nanoid(6)}`,
          start: initialCard.id,
          end: imovelCard1.id,
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
        },
        {
          id: `conn-${nanoid(6)}`,
          start: imovelCard1.id,
          end: agendamentoCard.id,
          type: 'positive',
          sourceHandle: imovelCard1.outputPorts[0].id,
          sourcePortLabel: imovelCard1.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: imovelCard2.id,
          end: agendamentoCard.id,
          type: 'positive',
          sourceHandle: imovelCard2.outputPorts[0].id,
          sourcePortLabel: imovelCard2.outputPorts[0].label
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
          start: imovelCard1.id,
          end: documentacaoCard.id,
          type: 'positive',
          sourceHandle: imovelCard1.outputPorts[0].id,
          sourcePortLabel: imovelCard1.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: documentacaoCard.id,
          end: duvidasCard.id,
          type: 'positive',
          sourceHandle: documentacaoCard.outputPorts[1].id,
          sourcePortLabel: documentacaoCard.outputPorts[1].label
        }
      ];
      
      cards = [initialCard, imovelCard1, imovelCard2, imovelCard3, agendamentoCard, confirmacaoCard, documentacaoCard, duvidasCard, contatoCard];
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
      
      // Serviço cards
      const servicoCard1: FlowCard = {
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
          { id: `port-${nanoid(6)}`, label: 'Solicitar' },
          { id: `port-${nanoid(6)}`, label: 'Detalhes' }
        ]
      };
      
      const servicoCard2: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'servico',
        title: 'Reforma de Banheiro',
        description: 'Reforma completa de banheiro',
        content: 'Serviço de reforma completa incluindo troca de piso, azulejos e louças.',
        position: { x: 100, y: 400 },
        fields: {
          nome: 'Reforma de Banheiro',
          preco: 'A partir de R$ 8.000,00',
          duracao: '15 dias (em média)'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Solicitar' },
          { id: `port-${nanoid(6)}`, label: 'Detalhes' }
        ]
      };
      
      const servicoCard3: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'servico',
        title: 'Limpeza de Caixa D\'água',
        description: 'Limpeza e higienização',
        content: 'Serviço de limpeza e higienização de caixa d\'água com produtos de qualidade.',
        position: { x: 250, y: 325 },
        fields: {
          nome: 'Limpeza de Caixa D\'água',
          preco: 'A partir de R$ 350,00',
          duracao: '1 dia'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Solicitar' },
          { id: `port-${nanoid(6)}`, label: 'Detalhes' }
        ]
      };
      
      // Detalhes card
      const detalhesCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'detalhes',
        title: 'Detalhes do Serviço',
        description: 'Mais informações sobre o serviço',
        content: 'Nossos serviços incluem:',
        position: { x: 400, y: 400 },
        fields: {
          materiais: 'Materiais de primeira linha',
          garantia: '6 meses para todos os serviços',
          pagamento: 'Parcelamento em até 12x no cartão'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Solicitar Serviço' },
          { id: `port-${nanoid(6)}`, label: 'Voltar' }
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
          { id: `port-${nanoid(6)}`, label: 'Enviar' },
          { id: `port-${nanoid(6)}`, label: 'Cancelar' }
        ]
      };
      
      // Confirmação card
      const confirmacaoServicoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'confirmacao',
        title: 'Serviço Agendado',
        description: 'Confirmação de agendamento',
        content: 'Seu serviço foi agendado com sucesso! Entraremos em contato para confirmar a data.',
        position: { x: 600, y: 250 },
        fields: {
          protocolo: 'SRV-2023-0001',
          previsao: 'Em até 3 dias úteis'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Finalizar' }
        ]
      };
      
      // Orçamento card
      const orcamentoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'orcamento',
        title: 'Solicitar Orçamento',
        description: 'Formulário para solicitar orçamento',
        content: 'Preencha os dados abaixo para receber um orçamento personalizado.',
        position: { x: 400, y: 100 },
        fields: {
          nome: '',
          endereco: '',
          telefone: '',
          descricao: ''
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Enviar' },
          { id: `port-${nanoid(6)}`, label: 'Cancelar' }
        ]
      };
      
      // Contato card
      const contatoServicoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'contatos',
        title: 'Nossos Contatos',
        description: 'Informações de contato da empresa',
        content: 'Entre em contato conosco pelos canais abaixo:',
        position: { x: 600, y: 400 },
        fields: {
          telefone: '(11) 88888-8888',
          email: 'contato@servicos.com',
          whatsapp: '(11) 88888-8888'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Voltar ao Início' }
        ]
      };
      
      // Add connections
      connections = [
        {
          id: `conn-${nanoid(6)}`,
          start: initialServiceCard.id,
          end: servicoCard1.id,
          type: 'positive',
          sourceHandle: initialServiceCard.outputPorts[0].id,
          sourcePortLabel: initialServiceCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: initialServiceCard.id,
          end: orcamentoCard.id,
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
          start: servicoCard1.id,
          end: ordemServicoCard.id,
          type: 'positive',
          sourceHandle: servicoCard1.outputPorts[0].id,
          sourcePortLabel: servicoCard1.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: servicoCard1.id,
          end: detalhesCard.id,
          type: 'positive',
          sourceHandle: servicoCard1.outputPorts[1].id,
          sourcePortLabel: servicoCard1.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: ordemServicoCard.id,
          end: confirmacaoServicoCard.id,
          type: 'positive',
          sourceHandle: ordemServicoCard.outputPorts[0].id,
          sourcePortLabel: ordemServicoCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: orcamentoCard.id,
          end: confirmacaoServicoCard.id,
          type: 'positive',
          sourceHandle: orcamentoCard.outputPorts[0].id,
          sourcePortLabel: orcamentoCard.outputPorts[0].label
        }
      ];
      
      cards = [initialServiceCard, servicoCard1, servicoCard2, servicoCard3, detalhesCard, ordemServicoCard, confirmacaoServicoCard, orcamentoCard, contatoServicoCard];
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
      
      // Produto cards
      const produtoCard1: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'produto',
        title: 'Smartphone XYZ',
        description: 'Smartphone de última geração',
        content: 'Smartphone com câmera de alta resolução e processador potente.',
        position: { x: 100, y: 200 },
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
      
      const produtoCard2: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'produto',
        title: 'Notebook ABC',
        description: 'Notebook para trabalho e jogos',
        content: 'Notebook com processador rápido, memória ampla e placa de vídeo dedicada.',
        position: { x: 100, y: 350 },
        fields: {
          nome: 'Notebook ABC',
          preco: 'R$ 3.499,00',
          estoque: '8',
          categoria: 'Eletrônicos'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Comprar' },
          { id: `port-${nanoid(6)}`, label: 'Ver mais produtos' }
        ]
      };
      
      const produtoCard3: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'produto',
        title: 'Smart TV 4K',
        description: 'TV de alta definição',
        content: 'Smart TV com resolução 4K, 55 polegadas e sistema operacional Android.',
        position: { x: 100, y: 500 },
        fields: {
          nome: 'Smart TV 4K',
          preco: 'R$ 2.799,00',
          estoque: '12',
          categoria: 'Eletrônicos'
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
        position: { x: 350, y: 200 },
        fields: {
          qtdItens: '1',
          total: 'R$ 1.999,00',
          frete: 'Grátis'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Finalizar Compra' },
          { id: `port-${nanoid(6)}`, label: 'Continuar Comprando' }
        ]
      };
      
      // Checkout card
      const checkoutCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'checkout',
        title: 'Finalizar Compra',
        description: 'Dados de pagamento e entrega',
        content: 'Por favor, preencha os dados para finalizar sua compra:',
        position: { x: 550, y: 200 },
        fields: {
          endereco: '',
          pagamento: '',
          parcelas: ''
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Confirmar Pedido' },
          { id: `port-${nanoid(6)}`, label: 'Cancelar' }
        ]
      };
      
      // Pedido card
      const pedidoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'pedido',
        title: 'Status do Pedido',
        description: 'Informações sobre seu pedido',
        content: 'Digite o número do seu pedido para verificar o status:',
        position: { x: 350, y: 350 },
        fields: {
          numeroPedido: '',
          status: '',
          prazoEntrega: ''
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Verificar' },
          { id: `port-${nanoid(6)}`, label: 'Voltar ao Início' }
        ]
      };
      
      // Confirmação de compra
      const confirmacaoCompraCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'confirmacao',
        title: 'Pedido Confirmado',
        description: 'Confirmação de compra',
        content: 'Seu pedido foi realizado com sucesso! Você receberá um e-mail com todos os detalhes.',
        position: { x: 750, y: 200 },
        fields: {
          numeroPedido: 'PED-2023-0001',
          previsaoEntrega: '5 dias úteis'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Finalizar' }
        ]
      };
      
      // Contato card
      const contatoEcommerceCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'contatos',
        title: 'Nossos Contatos',
        description: 'Informações de contato da loja',
        content: 'Entre em contato conosco pelos canais abaixo:',
        position: { x: 550, y: 350 },
        fields: {
          telefone: '(11) 77777-7777',
          email: 'vendas@loja.com',
          whatsapp: '(11) 77777-7777'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Voltar ao Início' }
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
          end: contatoEcommerceCard.id,
          type: 'positive',
          sourceHandle: initialEcommerceCard.outputPorts[2].id,
          sourcePortLabel: initialEcommerceCard.outputPorts[2].label
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
          start: produtoCard1.id,
          end: produtoCard2.id,
          type: 'positive',
          sourceHandle: produtoCard1.outputPorts[1].id,
          sourcePortLabel: produtoCard1.outputPorts[1].label
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
        }
      ];
      
      cards = [initialEcommerceCard, produtoCard1, produtoCard2, produtoCard3, carrinhoCard, checkoutCard, pedidoCard, confirmacaoCompraCard, contatoEcommerceCard];
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
      
      // Problema cards
      const problemaCard1: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'problema',
        title: 'Problema com Software',
        description: 'Resolução de problemas com software',
        content: 'Por favor, descreva o problema que está enfrentando com o software:',
        position: { x: 100, y: 200 },
        fields: {
          sistema: 'Windows/Mac/Linux',
          software: '',
          versao: ''
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Verificar Soluções' },
          { id: `port-${nanoid(6)}`, label: 'Contatar Suporte' }
        ]
      };
      
      const problemaCard2: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'problema',
        title: 'Problema com Hardware',
        description: 'Resolução de problemas com hardware',
        content: 'Por favor, descreva o problema que está enfrentando com o hardware:',
        position: { x: 100, y: 350 },
        fields: {
          equipamento: '',
          modelo: '',
          anoCompra: ''
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Verificar Soluções' },
          { id: `port-${nanoid(6)}`, label: 'Contatar Suporte' }
        ]
      };
      
      // Soluções card
      const solucoesCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'solucoes',
        title: 'Soluções Comuns',
        description: 'Soluções para problemas frequentes',
        content: 'Aqui estão algumas soluções para problemas comuns:',
        position: { x: 350, y: 200 },
        fields: {
          solucao1: 'Reinicie o computador',
          solucao2: 'Verifique as conexões',
          solucao3: 'Atualize os drivers'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Problema Resolvido' },
          { id: `port-${nanoid(6)}`, label: 'Ainda com Problema' }
        ]
      };
      
      // Chamado card
      const chamadoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'chamado',
        title: 'Abrir Chamado',
        description: 'Criar um chamado de suporte',
        content: 'Preencha os dados abaixo para abrir um chamado:',
        position: { x: 350, y: 350 },
        fields: {
          nome: '',
          email: '',
          descricao: '',
          prioridade: 'Média'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Enviar' }
        ]
      };
      
      // Confirmação de chamado
      const confirmacaoChamadoCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'confirmacao',
        title: 'Chamado Aberto',
        description: 'Confirmação de abertura de chamado',
        content: 'Seu chamado foi aberto com sucesso! Nossa equipe entrará em contato em breve.',
        position: { x: 550, y: 350 },
        fields: {
          numeroChamado: 'SUP-2023-0001',
          prazoResposta: '24 horas'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Finalizar' }
        ]
      };
      
      // FAQ card
      const faqCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'faq',
        title: 'Perguntas Frequentes',
        description: 'Respostas para dúvidas comuns',
        content: 'Aqui estão respostas para as perguntas mais comuns:',
        position: { x: 350, y: 500 },
        fields: {
          pergunta1: 'Como redefinir minha senha?',
          resposta1: 'Acesse a página de login e clique em "Esqueci minha senha".',
          pergunta2: 'Como atualizar o software?',
          resposta2: 'Acesse o menu Ajuda > Verificar Atualizações.'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Dúvida Resolvida' },
          { id: `port-${nanoid(6)}`, label: 'Abrir Chamado' }
        ]
      };
      
      // Contato card
      const contatoSuporteCard: FlowCard = {
        id: `card-${nanoid(6)}`,
        type: 'contatos',
        title: 'Nossos Contatos',
        description: 'Informações de contato do suporte',
        content: 'Entre em contato conosco pelos canais abaixo:',
        position: { x: 550, y: 500 },
        fields: {
          telefone: '(11) 66666-6666',
          email: 'suporte@empresa.com',
          horario: 'Segunda a Sexta, das 8h às 18h'
        },
        outputPorts: [
          { id: `port-${nanoid(6)}`, label: 'Voltar ao Início' }
        ]
      };
      
      // Add connections
      connections = [
        {
          id: `conn-${nanoid(6)}`,
          start: initialSupportCard.id,
          end: problemaCard1.id,
          type: 'positive',
          sourceHandle: initialSupportCard.outputPorts[0].id,
          sourcePortLabel: initialSupportCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: initialSupportCard.id,
          end: faqCard.id,
          type: 'positive',
          sourceHandle: initialSupportCard.outputPorts[1].id,
          sourcePortLabel: initialSupportCard.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: initialSupportCard.id,
          end: contatoSuporteCard.id,
          type: 'positive',
          sourceHandle: initialSupportCard.outputPorts[2].id,
          sourcePortLabel: initialSupportCard.outputPorts[2].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: problemaCard1.id,
          end: solucoesCard.id,
          type: 'positive',
          sourceHandle: problemaCard1.outputPorts[0].id,
          sourcePortLabel: problemaCard1.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: problemaCard1.id,
          end: chamadoCard.id,
          type: 'positive',
          sourceHandle: problemaCard1.outputPorts[1].id,
          sourcePortLabel: problemaCard1.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: problemaCard2.id,
          end: solucoesCard.id,
          type: 'positive',
          sourceHandle: problemaCard2.outputPorts[0].id,
          sourcePortLabel: problemaCard2.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: problemaCard2.id,
          end: chamadoCard.id,
          type: 'positive',
          sourceHandle: problemaCard2.outputPorts[1].id,
          sourcePortLabel: problemaCard2.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: solucoesCard.id,
          end: chamadoCard.id,
          type: 'positive',
          sourceHandle: solucoesCard.outputPorts[1].id,
          sourcePortLabel: solucoesCard.outputPorts[1].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: chamadoCard.id,
          end: confirmacaoChamadoCard.id,
          type: 'positive',
          sourceHandle: chamadoCard.outputPorts[0].id,
          sourcePortLabel: chamadoCard.outputPorts[0].label
        },
        {
          id: `conn-${nanoid(6)}`,
          start: faqCard.id,
          end: chamadoCard.id,
          type: 'positive',
          sourceHandle: faqCard.outputPorts[1].id,
          sourcePortLabel: faqCard.outputPorts[1].label
        }
      ];
      
      cards = [initialSupportCard, problemaCard1, problemaCard2, solucoesCard, chamadoCard, confirmacaoChamadoCard, faqCard, contatoSuporteCard];
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

