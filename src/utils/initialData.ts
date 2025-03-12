
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
      "type": "multipla-escolha",
      "fields": {
        "opcoes": "Apartamento na região central,Casa em condomínio,Imóvel comercial,Terreno para construção"
      }
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
      "type": "pergunta-respostas",
      "fields": {
        "perguntas": "Qual bairro você prefere?,Quanto quartos precisa?,Qual valor máximo do aluguel?"
      }
    },
    {
      "id": "imob-4",
      "title": "Sugestão de Imóvel",
      "description": "Apresentação de imóvel para cliente",
      "content": "Encontrei um imóvel que pode te interessar com base nas suas preferências!",
      "position": {
        "x": 789,
        "y": 167
      },
      "type": "imovel",
      "fields": {
        "endereco": "Av. Paulista, 1000, Bela Vista",
        "preco": "R$ 450.000,00",
        "area": "75",
        "quartos": "2",
        "tipo": "Apartamento",
        "finalidade": "Venda"
      }
    },
    {
      "id": "imob-5",
      "title": "Agendamento de Visita",
      "description": "Agendar visita ao imóvel",
      "content": "Gostaria de agendar uma visita para conhecer este imóvel pessoalmente? Temos disponibilidade nos seguintes horários.",
      "position": {
        "x": 1094,
        "y": 221
      },
      "type": "agendar",
      "fields": {
        "dias": "Segunda,Terça,Quarta,Quinta,Sexta",
        "horarios": "09:00,11:00,14:00,16:00",
        "duracao": "45 minutos"
      }
    },
    {
      "id": "imob-6",
      "title": "Coleta de Contatos",
      "description": "Obter dados para contato",
      "content": "Para confirmarmos sua visita, precisamos de alguns dados para contato:",
      "position": {
        "x": 1094,
        "y": 400
      },
      "type": "contatos",
      "fields": {
        "campos": "Nome completo,Telefone,Email,CPF"
      }
    },
    {
      "id": "imob-7",
      "title": "Confirmação",
      "description": "Encerramento do atendimento",
      "content": "Perfeito! Sua visita está agendada. Um de nossos corretores entrará em contato para confirmar. Obrigado pelo interesse em nossa imobiliária!",
      "position": {
        "x": 1094,
        "y": 580
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
    },
    {
      "id": "imob-conn-6",
      "start": "imob-5",
      "end": "imob-6",
      "type": "positive"
    },
    {
      "id": "imob-conn-7",
      "start": "imob-6",
      "end": "imob-7",
      "type": "positive"
    }
  ]
};

export const templates = {
  imobiliaria: initialFlowData,
  
  coworking: {
    cards: [
      {
        id: "cowork-1",
        title: "Boas-vindas Coworking",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo ao Espaço Colaborativo. Como posso ajudar você hoje? Está interessado em conhecer nossos planos ou agendar uma visita?",
        position: { x: 71, y: 32 },
        type: "initial" as const
      },
      {
        id: "cowork-2",
        title: "Interesse em Planos",
        description: "Cliente interessado nos planos",
        content: "Temos diversos planos para atender suas necessidades. Qual deles melhor atende sua necessidade?",
        position: { x: 433, y: 63 },
        type: "multipla-escolha" as const,
        fields: {
          opcoes: "Plano Diário,Plano Semanal,Plano Mensal,Plano Corporativo"
        }
      },
      {
        id: "cowork-3",
        title: "Detalhes do Serviço",
        description: "Informações sobre o plano escolhido",
        content: "Excelente escolha! Veja os detalhes deste plano:",
        position: { x: 483, y: 250 },
        type: "servico" as const,
        fields: {
          nome: "Plano Mensal",
          preco: "R$ 450,00",
          duracao: "30 dias",
          categoria: "Premium"
        }
      },
      {
        id: "cowork-4",
        title: "Briefing de Necessidades",
        description: "Coleta de necessidades específicas",
        content: "Para personalizarmos sua experiência, conte-nos um pouco sobre suas necessidades específicas:",
        position: { x: 483, y: 491 },
        type: "briefing" as const,
        fields: {
          perguntas: "Quantas pessoas utilizarão o espaço?,Precisa de sala de reunião?,Quais horários pretende utilizar?,Precisa de equipamentos específicos?"
        }
      },
      {
        id: "cowork-5",
        title: "Agendamento de Visita",
        description: "Cliente quer conhecer o espaço",
        content: "Ficaremos felizes em recebê-lo para conhecer nosso espaço. Quando seria melhor para você?",
        position: { x: 789, y: 167 },
        type: "agendar" as const,
        fields: {
          dias: "Segunda,Terça,Quarta,Quinta,Sexta",
          horarios: "09:00,11:00,14:00,16:00",
          duracao: "30 minutos"
        }
      },
      {
        id: "cowork-6",
        title: "Coleta de Contatos",
        description: "Obter informações para contato",
        content: "Para finalizarmos, preciso de alguns dados para contato:",
        position: { x: 789, y: 350 },
        type: "contatos" as const,
        fields: {
          campos: "Nome completo,Telefone,Email,Empresa"
        }
      },
      {
        id: "cowork-7",
        title: "Finalização",
        description: "Encerramento do atendimento",
        content: "Perfeito! Sua visita está agendada. Nossa equipe entrará em contato para confirmar. Agradecemos seu interesse em nosso espaço de coworking!",
        position: { x: 789, y: 550 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "cowork-conn-1", start: "cowork-1", end: "cowork-2", type: "positive" as const },
      { id: "cowork-conn-2", start: "cowork-1", end: "cowork-5", type: "negative" as const },
      { id: "cowork-conn-3", start: "cowork-2", end: "cowork-3", type: "positive" as const },
      { id: "cowork-conn-4", start: "cowork-3", end: "cowork-4", type: "positive" as const },
      { id: "cowork-conn-5", start: "cowork-4", end: "cowork-5", type: "positive" as const },
      { id: "cowork-conn-6", start: "cowork-5", end: "cowork-6", type: "positive" as const },
      { id: "cowork-conn-7", start: "cowork-6", end: "cowork-7", type: "positive" as const }
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
        type: "initial" as const
      },
      {
        id: "clinic-2",
        title: "Tipo de Atendimento",
        description: "Escolha do tipo de atendimento",
        content: "Que tipo de atendimento você está buscando?",
        position: { x: 433, y: 63 },
        type: "multipla-escolha" as const,
        fields: {
          opcoes: "Consulta Médica,Exames,Procedimento Estético,Fisioterapia,Nutrição"
        }
      },
      {
        id: "clinic-3",
        title: "Detalhes do Serviço",
        description: "Detalhes da consulta/procedimento",
        content: "Temos disponibilidade para o serviço escolhido!",
        position: { x: 433, y: 250 },
        type: "servico" as const,
        fields: {
          nome: "Consulta Cardiologia",
          preco: "R$ 350,00",
          duracao: "45 minutos",
          categoria: "Especialidade Médica"
        }
      },
      {
        id: "clinic-4",
        title: "Informações sobre Serviços",
        description: "Paciente com dúvidas",
        content: "Nossa clínica oferece diversas especialidades médicas. Qual serviço específico você gostaria de saber mais?",
        position: { x: 483, y: 491 },
        type: "pergunta-respostas" as const,
        fields: {
          perguntas: "Qual especialidade interessa?,Tem convênio médico?,Já é paciente da clínica?"
        }
      },
      {
        id: "clinic-5",
        title: "Agendamento",
        description: "Paciente deseja agendar",
        content: "Vamos agendar sua consulta! Qual seria o melhor dia e horário para você?",
        position: { x: 789, y: 167 },
        type: "agendar" as const,
        fields: {
          dias: "Segunda,Terça,Quarta,Quinta,Sexta",
          horarios: "08:00,09:00,10:00,14:00,15:00,16:00",
          duracao: "45 minutos"
        }
      },
      {
        id: "clinic-6",
        title: "Coleta de Dados",
        description: "Informações do paciente",
        content: "Para finalizarmos o agendamento, preciso de algumas informações:",
        position: { x: 789, y: 350 },
        type: "contatos" as const,
        fields: {
          campos: "Nome completo,Data de nascimento,CPF,Telefone,Email,Convênio,Número da carteirinha"
        }
      },
      {
        id: "clinic-7",
        title: "Ordem de Serviço",
        description: "Criação de OS para atendimento",
        content: "Vamos gerar uma ordem de serviço para seu atendimento:",
        position: { x: 789, y: 500 },
        type: "ordem-servico" as const,
        fields: {
          numero: "OS-2023-",
          tipo: "Consulta Médica",
          prioridade: "Normal",
          observacoes: "Primeira consulta - Verificar documentação"
        }
      },
      {
        id: "clinic-8",
        title: "Confirmação",
        description: "Finalização do atendimento",
        content: "Sua consulta foi agendada com sucesso! Enviaremos um lembrete 24h antes. Lembre-se de trazer seus documentos e chegar 15 minutos antes do horário marcado.",
        position: { x: 789, y: 650 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "clinic-conn-1", start: "clinic-1", end: "clinic-2", type: "positive" as const },
      { id: "clinic-conn-2", start: "clinic-1", end: "clinic-4", type: "negative" as const },
      { id: "clinic-conn-3", start: "clinic-2", end: "clinic-3", type: "positive" as const },
      { id: "clinic-conn-4", start: "clinic-3", end: "clinic-5", type: "positive" as const },
      { id: "clinic-conn-5", start: "clinic-4", end: "clinic-5", type: "positive" as const },
      { id: "clinic-conn-6", start: "clinic-5", end: "clinic-6", type: "positive" as const },
      { id: "clinic-conn-7", start: "clinic-6", end: "clinic-7", type: "positive" as const },
      { id: "clinic-conn-8", start: "clinic-7", end: "clinic-8", type: "positive" as const }
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
        type: "initial" as const
      },
      {
        id: "mkt-2",
        title: "Atenção - AIDA",
        description: "Captura de atenção do cliente",
        content: "Você sabia que empresas com estratégia digital bem definida têm 3x mais chance de aumentar sua participação no mercado? Qual desafio sua empresa enfrenta atualmente?",
        position: { x: 300, y: 100 },
        type: "multipla-escolha" as const,
        fields: {
          opcoes: "Pouca visibilidade online,Baixa taxa de conversão,Identidade de marca fraca,Necessidade de campanhas sazonais"
        }
      },
      {
        id: "mkt-3",
        title: "Interesse - AIDA",
        description: "Despertar interesse do cliente",
        content: "Interessante! Temos cases de sucesso em situações similares à sua. Uma de nossas soluções aumentou em 70% o tráfego de um cliente do seu segmento em apenas 3 meses.",
        position: { x: 500, y: 100 },
        type: "acao" as const,
        fields: {
          acao: "Enviar portfólio de cases",
          responsavel: "Setor Comercial",
          prazo: "Imediato",
          script: "Enviar PDF com cases de sucesso relevantes para o segmento do cliente"
        }
      },
      {
        id: "mkt-4",
        title: "Desejo - AIDA",
        description: "Criar desejo no cliente",
        content: "Com base no seu negócio, desenvolvemos uma estratégia personalizada que inclui: SEO otimizado, gestão de mídias sociais e campanhas segmentadas. Veja como isso se aplicaria ao seu caso:",
        position: { x: 700, y: 100 },
        type: "produto" as const,
        fields: {
          nome: "Pacote Marketing Digital Completo",
          preco: "R$ 3.500,00/mês",
          estoque: "10",
          codigo: "MKT-COMP-01"
        }
      },
      {
        id: "mkt-5",
        title: "Pacote SEO",
        description: "Detalhes do serviço de SEO",
        position: { x: 300, y: 300 },
        content: "Nossa estratégia de SEO inclui análise de palavras-chave, otimização on-page e link building para melhorar seu posicionamento nos buscadores.",
        type: "servico" as const,
        fields: {
          nome: "Otimização SEO",
          preco: "R$ 1.200,00/mês",
          duracao: "Contínuo",
          categoria: "Marketing Digital"
        }
      },
      {
        id: "mkt-6",
        title: "Pacote Mídias Sociais",
        description: "Gerenciamento de redes sociais",
        position: { x: 500, y: 300 },
        content: "Gerenciamento completo das suas redes sociais, incluindo criação de conteúdo, design de posts e relatórios de performance.",
        type: "servico" as const,
        fields: {
          nome: "Gestão de Redes Sociais",
          preco: "R$ 1.800,00/mês",
          duracao: "Contínuo",
          categoria: "Marketing Digital"
        }
      },
      {
        id: "mkt-7",
        title: "Ação - AIDA",
        description: "Incentivar a ação do cliente",
        content: "Para garantirmos os melhores resultados, precisamos começar o quanto antes. Se fecharmos hoje, oferecemos 15% de desconto no primeiro mês e um diagnóstico gratuito do seu site!",
        position: { x: 700, y: 300 },
        type: "briefing" as const,
        fields: {
          perguntas: "Qual seu prazo para início do projeto?,Qual seu orçamento mensal disponível?,Quais são seus principais concorrentes?,Quais plataformas digitais já utiliza?"
        }
      },
      {
        id: "mkt-8",
        title: "Agendamento de Reunião",
        description: "Marcar reunião de detalhamento",
        content: "Vamos agendar uma reunião para apresentarmos a proposta completa adaptada ao seu negócio.",
        position: { x: 700, y: 450 },
        type: "agendar" as const,
        fields: {
          dias: "Segunda,Terça,Quarta,Quinta,Sexta",
          horarios: "09:00,11:00,14:00,16:00",
          duracao: "60 minutos"
        }
      },
      {
        id: "mkt-9",
        title: "Coleta de Dados",
        description: "Informações para contato",
        content: "Precisamos de algumas informações para prepararmos a proposta personalizada:",
        position: { x: 700, y: 600 },
        type: "contatos" as const,
        fields: {
          campos: "Nome completo,Cargo,Empresa,CNPJ,Telefone,Email,Site atual"
        }
      },
      {
        id: "mkt-10",
        title: "Proposta Comercial",
        description: "Envio de proposta",
        content: "Baseado em suas necessidades, prepararemos uma proposta detalhada e personalizada para sua empresa. Aguarde o contato de nosso consultor em breve!",
        position: { x: 700, y: 750 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "mkt-conn-1", start: "mkt-1", end: "mkt-2", type: "positive" as const },
      { id: "mkt-conn-2", start: "mkt-2", end: "mkt-3", type: "positive" as const },
      { id: "mkt-conn-3", start: "mkt-3", end: "mkt-4", type: "positive" as const },
      { id: "mkt-conn-4", start: "mkt-4", end: "mkt-5", type: "positive" as const },
      { id: "mkt-conn-5", start: "mkt-4", end: "mkt-6", type: "negative" as const },
      { id: "mkt-conn-6", start: "mkt-5", end: "mkt-7", type: "positive" as const },
      { id: "mkt-conn-7", start: "mkt-6", end: "mkt-7", type: "positive" as const },
      { id: "mkt-conn-8", start: "mkt-7", end: "mkt-8", type: "positive" as const },
      { id: "mkt-conn-9", start: "mkt-8", end: "mkt-9", type: "positive" as const },
      { id: "mkt-conn-10", start: "mkt-9", end: "mkt-10", type: "positive" as const }
    ]
  },
  
  ecommerce: {
    cards: [
      {
        id: "ecom-1",
        title: "Boas-vindas E-commerce",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo à Loja Virtual Premium. Como posso ajudar você hoje? Está procurando algo específico ou deseja conhecer nossas promoções?",
        position: { x: 71, y: 32 },
        type: "initial" as const
      },
      {
        id: "ecom-2",
        title: "Categorias de Produtos",
        description: "Escolha de categoria",
        content: "Temos diversas categorias disponíveis. Qual delas você tem interesse?",
        position: { x: 300, y: 100 },
        type: "multipla-escolha" as const,
        fields: {
          opcoes: "Eletrônicos,Moda,Casa e Decoração,Esportes,Beleza"
        }
      },
      {
        id: "ecom-3",
        title: "Promoções",
        description: "Visualização de ofertas",
        content: "Confira nossas promoções especiais desta semana! Aproveite descontos de até 50%.",
        position: { x: 500, y: 100 },
        type: "html" as const,
        fields: {
          html: "<div class='promo-banner'><h3>OFERTAS ESPECIAIS</h3><ul><li>Smartphone XYZ - <strike>R$1.999</strike> por R$1.599</li><li>Smart TV 55\" - <strike>R$3.200</strike> por R$2.499</li><li>Frete grátis em compras acima de R$300</li></ul></div>"
        }
      },
      {
        id: "ecom-4",
        title: "Destaque Produto",
        description: "Produto em destaque",
        content: "Este é um dos nossos produtos mais vendidos:",
        position: { x: 300, y: 250 },
        type: "produto" as const,
        fields: {
          nome: "Smartphone Ultra Plus",
          preco: "R$ 2.499,00",
          estoque: "23",
          codigo: "SMAP-2022"
        }
      },
      {
        id: "ecom-5",
        title: "Busca Específica",
        description: "Cliente procura item específico",
        content: "O que você está procurando exatamente? Posso ajudar com especificações ou faixas de preço.",
        position: { x: 500, y: 250 },
        type: "pergunta-respostas" as const,
        fields: {
          perguntas: "Qual produto você procura?,Qual sua faixa de preço?,Alguma marca específica?"
        }
      },
      {
        id: "ecom-6",
        title: "Detalhes do Produto",
        description: "Informações detalhadas",
        content: "Aqui estão mais detalhes sobre o produto que você está interessado:",
        position: { x: 300, y: 400 },
        type: "html" as const,
        fields: {
          html: "<div class='product-details'><img src='placeholder.jpg' alt='Produto' /><h3>Especificações Técnicas</h3><ul><li>Processador: Octa-core 2.8GHz</li><li>Memória: 8GB RAM</li><li>Armazenamento: 256GB</li><li>Tela: 6.5\" AMOLED</li><li>Bateria: 5000mAh</li></ul><p><strong>Garantia:</strong> 12 meses</p></div>"
        }
      },
      {
        id: "ecom-7",
        title: "Dúvidas do Cliente",
        description: "Esclarecimento de dúvidas",
        content: "Quais dúvidas você tem sobre o produto? Posso ajudar com informações sobre garantia, entrega ou formas de pagamento.",
        position: { x: 500, y: 400 },
        type: "multipla-escolha" as const,
        fields: {
          opcoes: "Prazo de entrega,Formas de pagamento,Política de trocas,Disponibilidade em loja física"
        }
      },
      {
        id: "ecom-8",
        title: "Processo de Compra",
        description: "Finalização da compra",
        content: "Para finalizar sua compra, preciso de algumas informações:",
        position: { x: 400, y: 550 },
        type: "contatos" as const,
        fields: {
          campos: "Nome completo,CPF,Telefone,Email,Endereço de entrega,CEP"
        }
      },
      {
        id: "ecom-9",
        title: "Finalização",
        description: "Confirmação de pedido",
        content: "Seu pedido foi realizado com sucesso! O número do seu pedido é #23456. Você receberá um email com todos os detalhes e o código de rastreamento assim que o produto for despachado.",
        position: { x: 400, y: 700 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "ecom-conn-1", start: "ecom-1", end: "ecom-2", type: "positive" as const },
      { id: "ecom-conn-2", start: "ecom-1", end: "ecom-3", type: "negative" as const },
      { id: "ecom-conn-3", start: "ecom-2", end: "ecom-4", type: "positive" as const },
      { id: "ecom-conn-4", start: "ecom-2", end: "ecom-5", type: "negative" as const },
      { id: "ecom-conn-5", start: "ecom-3", end: "ecom-5", type: "positive" as const },
      { id: "ecom-conn-6", start: "ecom-4", end: "ecom-6", type: "positive" as const },
      { id: "ecom-conn-7", start: "ecom-5", end: "ecom-7", type: "positive" as const },
      { id: "ecom-conn-8", start: "ecom-6", end: "ecom-7", type: "positive" as const },
      { id: "ecom-conn-9", start: "ecom-7", end: "ecom-8", type: "positive" as const },
      { id: "ecom-conn-10", start: "ecom-8", end: "ecom-9", type: "positive" as const }
    ]
  }
};
