
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
      "type": "positive",
      "sourceHandle": "positive"
    },
    {
      "id": "imob-conn-2",
      "start": "imob-1",
      "end": "imob-3",
      "type": "negative",
      "sourceHandle": "negative"
    },
    {
      "id": "imob-conn-3",
      "start": "imob-2",
      "end": "imob-4",
      "type": "positive",
      "sourceHandle": "positive"
    },
    {
      "id": "imob-conn-4",
      "start": "imob-3",
      "end": "imob-4",
      "type": "positive",
      "sourceHandle": "positive"
    },
    {
      "id": "imob-conn-5",
      "start": "imob-4",
      "end": "imob-5",
      "type": "positive",
      "sourceHandle": "positive"
    },
    {
      "id": "imob-conn-6",
      "start": "imob-5",
      "end": "imob-6",
      "type": "positive",
      "sourceHandle": "positive"
    },
    {
      "id": "imob-conn-7",
      "start": "imob-6",
      "end": "imob-7",
      "type": "positive",
      "sourceHandle": "positive"
    }
  ]
};

export const templates = {
  imobiliaria: {
    cards: [
      {
        id: "imob-1",
        title: "Boas-vindas Imobiliária",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo à Imobiliária Horizonte. Como posso ajudar você hoje? Está procurando um imóvel para alugar ou comprar?",
        position: { x: 100, y: 50 },
        type: "initial" as const
      },
      {
        id: "imob-2",
        title: "Interesse em Compra",
        description: "Cliente interessado em comprar",
        content: "Ótimo! Para ajudar na busca do imóvel ideal para compra, poderia me dizer mais sobre suas preferências?",
        position: { x: 400, y: 50 },
        type: "multipla-escolha" as const,
        fields: {
          opcoes: "Apartamento na região central,Casa em condomínio,Imóvel comercial,Terreno para construção"
        }
      },
      {
        id: "imob-3",
        title: "Interesse em Aluguel",
        description: "Cliente interessado em alugar",
        content: "Perfeito! Para encontrarmos o imóvel ideal para locação, responda algumas perguntas:",
        position: { x: 400, y: 250 },
        type: "pergunta-respostas" as const,
        fields: {
          perguntas: "Qual bairro você prefere?,Quantos quartos precisa?,Qual valor máximo do aluguel?,Precisa de mobília?,Precisa de garagem?"
        }
      },
      {
        id: "imob-4",
        title: "Detalhes da Busca",
        description: "Coleta de requisitos do cliente",
        content: "Vamos obter mais detalhes sobre o que procura:",
        position: { x: 700, y: 50 },
        type: "briefing" as const,
        fields: {
          perguntas: "Qual sua faixa de preço?,Precisa de lazer no condomínio?,Qual metragem mínima desejada?,Quando pretende se mudar?,Possui animais de estimação?"
        }
      },
      {
        id: "imob-5", 
        title: "Imóvel Sugerido - Apartamento",
        description: "Sugestão de apartamento", 
        content: "Encontrei este apartamento que pode te interessar:",
        position: { x: 1000, y: 50 },
        type: "imovel" as const,
        fields: {
          endereco: "Av. Paulista, 1500, Jardins",
          preco: "R$ 650.000,00",
          area: "85",
          quartos: "3",
          tipo: "Apartamento",
          finalidade: "Venda"
        }
      },
      {
        id: "imob-6",
        title: "Imóvel Sugerido - Casa",
        description: "Sugestão de casa",
        content: "Esta casa em condomínio pode ser perfeita para você:",
        position: { x: 1000, y: 250 },
        type: "imovel" as const,
        fields: {
          endereco: "Rua das Palmeiras, 100, Cond. Villaggio",
          preco: "R$ 980.000,00",
          area: "180",
          quartos: "4",
          tipo: "Casa",
          finalidade: "Venda"
        }
      },
      {
        id: "imob-7",
        title: "Imóvel Sugerido - Aluguel",
        description: "Sugestão para locação",
        content: "Este apartamento para locação atende seus requisitos:",
        position: { x: 700, y: 250 },
        type: "imovel" as const,
        fields: {
          endereco: "Rua Augusta, 800, Consolação",
          preco: "R$ 3.500,00/mês",
          area: "65",
          quartos: "2",
          tipo: "Apartamento",
          finalidade: "Aluguel"
        }
      },
      {
        id: "imob-8",
        title: "Financiamento",
        description: "Informações sobre financiamento",
        content: "Podemos ajudar com o financiamento do seu imóvel. Temos parcerias com os principais bancos.",
        position: { x: 1300, y: 50 },
        type: "servico" as const,
        fields: {
          nome: "Consultoria de Financiamento",
          preco: "Gratuito",
          duracao: "60 minutos",
          categoria: "Financeiro"
        }
      },
      {
        id: "imob-9",
        title: "Documentação",
        description: "Informações sobre documentação",
        content: "Para prosseguirmos, precisaremos da seguinte documentação:",
        position: { x: 1300, y: 250 },
        type: "html" as const,
        fields: {
          html: "<div class='doc-list'><h3>Documentos Necessários</h3><ul><li>RG e CPF</li><li>Comprovante de Residência</li><li>Comprovante de Renda</li><li>Declaração de Imposto de Renda</li><li>Certidão de Nascimento/Casamento</li></ul></div>"
        }
      },
      {
        id: "imob-10",
        title: "Agendamento de Visita",
        description: "Agendar visita ao imóvel",
        content: "Vamos agendar uma visita para conhecer o imóvel pessoalmente:",
        position: { x: 1600, y: 150 },
        type: "agendar" as const,
        fields: {
          dias: "Segunda,Terça,Quarta,Quinta,Sexta,Sábado",
          horarios: "09:00,10:30,14:00,15:30,17:00",
          duracao: "45 minutos"
        }
      },
      {
        id: "imob-11",
        title: "Coleta de Dados",
        description: "Obter informações do cliente",
        content: "Para finalizarmos, precisamos dos seus dados:",
        position: { x: 1900, y: 150 },
        type: "contatos" as const,
        fields: {
          campos: "Nome completo,CPF,Telefone,Email,Endereço atual,Profissão"
        }
      },
      {
        id: "imob-12",
        title: "Ordem de Serviço",
        description: "Criação de OS para atendimento",
        content: "Vamos gerar uma ordem de serviço para seu atendimento:",
        position: { x: 2200, y: 150 },
        type: "ordem-servico" as const,
        fields: {
          numero: "OS-2023-",
          tipo: "Visita a Imóvel",
          prioridade: "Normal",
          observacoes: "Cliente potencialmente interessado em financiamento"
        }
      },
      {
        id: "imob-13",
        title: "Confirmação",
        description: "Encerramento do atendimento",
        content: "Perfeito! Sua visita está agendada. Um de nossos corretores entrará em contato para confirmar todos os detalhes. Obrigado pelo interesse em nossa imobiliária!",
        position: { x: 2500, y: 150 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "imob-conn-1", start: "imob-1", end: "imob-2", type: "positive" as const, sourceHandle: "positive" },
      { id: "imob-conn-2", start: "imob-1", end: "imob-3", type: "negative" as const, sourceHandle: "negative" },
      { id: "imob-conn-3", start: "imob-2", end: "imob-4", type: "positive" as const, sourceHandle: "positive" },
      { id: "imob-conn-4", start: "imob-4", end: "imob-5", type: "positive" as const, sourceHandle: "positive" },
      { id: "imob-conn-5", start: "imob-4", end: "imob-6", type: "negative" as const, sourceHandle: "negative" },
      { id: "imob-conn-6", start: "imob-3", end: "imob-7", type: "positive" as const, sourceHandle: "positive" },
      { id: "imob-conn-7", start: "imob-5", end: "imob-8", type: "positive" as const, sourceHandle: "positive" },
      { id: "imob-conn-8", start: "imob-6", end: "imob-8", type: "positive" as const, sourceHandle: "positive" },
      { id: "imob-conn-9", start: "imob-7", end: "imob-9", type: "positive" as const, sourceHandle: "positive" },
      { id: "imob-conn-10", start: "imob-8", end: "imob-10", type: "positive" as const, sourceHandle: "positive" },
      { id: "imob-conn-11", start: "imob-9", end: "imob-10", type: "positive" as const, sourceHandle: "positive" },
      { id: "imob-conn-12", start: "imob-10", end: "imob-11", type: "positive" as const, sourceHandle: "positive" },
      { id: "imob-conn-13", start: "imob-11", end: "imob-12", type: "positive" as const, sourceHandle: "positive" },
      { id: "imob-conn-14", start: "imob-12", end: "imob-13", type: "positive" as const, sourceHandle: "positive" }
    ]
  },
  
  coworking: {
    cards: [
      {
        id: "cowork-1",
        title: "Boas-vindas Coworking",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo ao Espaço Colaborativo. Como posso ajudar você hoje? Está interessado em conhecer nossos planos ou agendar uma visita?",
        position: { x: 100, y: 50 },
        type: "initial" as const
      },
      {
        id: "cowork-2",
        title: "Interesses do Cliente",
        description: "Identificação de necessidades",
        content: "Que tipo de espaço de trabalho você está procurando?",
        position: { x: 400, y: 50 },
        type: "multipla-escolha" as const,
        fields: {
          opcoes: "Estação de trabalho individual,Sala privativa,Sala de reuniões,Auditório para eventos,Endereço comercial"
        }
      },
      {
        id: "cowork-3",
        title: "Tempo de Uso",
        description: "Período de utilização",
        content: "Por quanto tempo você planeja utilizar nosso espaço?",
        position: { x: 700, y: 50 },
        type: "multipla-escolha" as const,
        fields: {
          opcoes: "Uso por dia,Uso por semana,Plano mensal,Plano trimestral,Plano anual"
        }
      },
      {
        id: "cowork-4",
        title: "Plano Diário",
        description: "Detalhes do plano diário",
        content: "Nosso plano diário é perfeito para quem precisa de um espaço ocasionalmente.",
        position: { x: 1000, y: 50 },
        type: "servico" as const,
        fields: {
          nome: "Day Pass",
          preco: "R$ 79,00/dia",
          duracao: "1 dia",
          categoria: "Acesso Flexível"
        }
      },
      {
        id: "cowork-5",
        title: "Plano Mensal",
        description: "Detalhes do plano mensal",
        content: "Nosso plano mensal oferece acesso ilimitado ao espaço durante o horário comercial.",
        position: { x: 1000, y: 250 },
        type: "servico" as const,
        fields: {
          nome: "Membership Plus",
          preco: "R$ 890,00/mês",
          duracao: "30 dias",
          categoria: "Acesso Premium"
        }
      },
      {
        id: "cowork-6",
        title: "Sala Privativa",
        description: "Informações sobre salas privativas",
        content: "Nossas salas privativas são ideais para equipes que precisam de privacidade.",
        position: { x: 1000, y: 450 },
        type: "servico" as const,
        fields: {
          nome: "Sala Privativa para 4 pessoas",
          preco: "R$ 2.490,00/mês",
          duracao: "30 dias",
          categoria: "Escritório Privativo"
        }
      },
      {
        id: "cowork-7",
        title: "Sala de Reunião",
        description: "Informações sobre salas de reunião",
        content: "Nossas salas de reunião são totalmente equipadas para suas necessidades corporativas.",
        position: { x: 1300, y: 50 },
        type: "produto" as const,
        fields: {
          nome: "Sala de Reunião Executiva",
          preco: "R$ 90,00/hora",
          estoque: "5",
          codigo: "SM-EXEC"
        }
      },
      {
        id: "cowork-8",
        title: "Eventos",
        description: "Espaços para eventos",
        content: "Nosso auditório é perfeito para workshops, palestras e treinamentos.",
        position: { x: 1300, y: 250 },
        type: "produto" as const,
        fields: {
          nome: "Auditório para 50 pessoas",
          preco: "R$ 1.200,00/período",
          estoque: "1",
          codigo: "AUD-50"
        }
      },
      {
        id: "cowork-9",
        title: "Necessidades Específicas",
        description: "Levantamento de necessidades",
        content: "Para personalizarmos sua experiência, conte-nos mais sobre suas necessidades:",
        position: { x: 1300, y: 450 },
        type: "briefing" as const,
        fields: {
          perguntas: "Quantas pessoas utilizarão o espaço?,Precisa de equipamentos específicos?,Qual horário costuma trabalhar?,Precisa de serviços adicionais (recepção, telefonia)?,Com que frequência realiza reuniões?"
        }
      },
      {
        id: "cowork-10",
        title: "Visita ao Espaço",
        description: "Agendamento de tour",
        content: "Que tal conhecer nosso espaço pessoalmente? Podemos agendar um tour guiado.",
        position: { x: 1600, y: 50 },
        type: "agendar" as const,
        fields: {
          dias: "Segunda,Terça,Quarta,Quinta,Sexta",
          horarios: "09:00,11:00,14:00,16:00,18:00",
          duracao: "30 minutos"
        }
      },
      {
        id: "cowork-11",
        title: "Informações sobre Localização",
        description: "Detalhes de como chegar",
        content: "Veja como chegar ao nosso espaço:",
        position: { x: 1600, y: 250 },
        type: "html" as const,
        fields: {
          html: "<div class='location-info'><h3>Como Chegar</h3><p>Estamos localizados na Av. Paulista, 1000, 10º andar</p><ul><li>Metrô: Estação Brigadeiro (5 min a pé)</li><li>Estacionamento: Disponível no subsolo (R$15/hora)</li><li>Bike: Bicicletário gratuito</li></ul><img src='placeholder.jpg' alt='Mapa' width='100%'/></div>"
        }
      },
      {
        id: "cowork-12",
        title: "Pacote Corporativo",
        description: "Soluções para empresas",
        content: "Para empresas, oferecemos pacotes especiais com benefícios exclusivos:",
        position: { x: 1600, y: 450 },
        type: "acao" as const,
        fields: {
          acao: "Enviar proposta corporativa",
          responsavel: "Gerente Comercial",
          prazo: "24 horas",
          script: "Preparar proposta personalizada baseada no número de colaboradores e frequência de uso"
        }
      },
      {
        id: "cowork-13",
        title: "Dados para Contato",
        description: "Coleta de informações",
        content: "Para finalizarmos, precisamos de alguns dados:",
        position: { x: 1900, y: 250 },
        type: "contatos" as const,
        fields: {
          campos: "Nome completo,Telefone,Email,Empresa,Cargo,Como conheceu nosso espaço?"
        }
      },
      {
        id: "cowork-14",
        title: "Ordem de Serviço",
        description: "Geração de OS interna",
        content: "Vamos gerar uma ordem de serviço para seu atendimento:",
        position: { x: 2200, y: 250 },
        type: "ordem-servico" as const,
        fields: {
          numero: "OSC-2023-",
          tipo: "Atendimento Novo Cliente",
          prioridade: "Alta",
          observacoes: "Cliente interessado em tour e plano mensal"
        }
      },
      {
        id: "cowork-15",
        title: "Finalização",
        description: "Encerramento do atendimento",
        content: "Perfeito! Nossa equipe entrará em contato em breve para confirmar todos os detalhes. Estamos ansiosos para recebê-lo em nosso espaço!",
        position: { x: 2500, y: 250 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "cowork-conn-1", start: "cowork-1", end: "cowork-2", type: "positive" as const, sourceHandle: "positive" },
      { id: "cowork-conn-2", start: "cowork-2", end: "cowork-3", type: "positive" as const, sourceHandle: "positive" },
      { id: "cowork-conn-3", start: "cowork-3", end: "cowork-4", type: "positive" as const, sourceHandle: "positive" },
      { id: "cowork-conn-4", start: "cowork-3", end: "cowork-5", type: "negative" as const, sourceHandle: "negative" },
      { id: "cowork-conn-5", start: "cowork-2", end: "cowork-6", type: "negative" as const, sourceHandle: "negative" },
      { id: "cowork-conn-6", start: "cowork-4", end: "cowork-7", type: "positive" as const, sourceHandle: "positive" },
      { id: "cowork-conn-7", start: "cowork-5", end: "cowork-7", type: "positive" as const, sourceHandle: "positive" },
      { id: "cowork-conn-8", start: "cowork-2", end: "cowork-8", type: "negative" as const, sourceHandle: "negative" },
      { id: "cowork-conn-9", start: "cowork-6", end: "cowork-9", type: "positive" as const, sourceHandle: "positive" },
      { id: "cowork-conn-10", start: "cowork-7", end: "cowork-10", type: "positive" as const, sourceHandle: "positive" },
      { id: "cowork-conn-11", start: "cowork-8", end: "cowork-10", type: "positive" as const, sourceHandle: "positive" },
      { id: "cowork-conn-12", start: "cowork-9", end: "cowork-10", type: "positive" as const, sourceHandle: "positive" },
      { id: "cowork-conn-13", start: "cowork-10", end: "cowork-11", type: "positive" as const, sourceHandle: "positive" },
      { id: "cowork-conn-14", start: "cowork-6", end: "cowork-12", type: "negative" as const, sourceHandle: "negative" },
      { id: "cowork-conn-15", start: "cowork-11", end: "cowork-13", type: "positive" as const, sourceHandle: "positive" },
      { id: "cowork-conn-16", start: "cowork-12", end: "cowork-13", type: "positive" as const, sourceHandle: "positive" },
      { id: "cowork-conn-17", start: "cowork-13", end: "cowork-14", type: "positive" as const, sourceHandle: "positive" },
      { id: "cowork-conn-18", start: "cowork-14", end: "cowork-15", type: "positive" as const, sourceHandle: "positive" }
    ]
  },
  
  clinica: {
    cards: [
      {
        id: "clinic-1",
        title: "Boas-vindas Clínica",
        description: "Primeiro contato com paciente",
        content: "Olá! Bem-vindo à Clínica Saúde Total. Como posso ajudar você hoje? Deseja agendar uma consulta, realizar exames ou tirar dúvidas sobre nossos serviços?",
        position: { x: 100, y: 50 },
        type: "initial" as const
      },
      {
        id: "clinic-2",
        title: "Tipo de Atendimento",
        description: "Escolha do serviço",
        content: "Qual serviço você está buscando em nossa clínica?",
        position: { x: 400, y: 50 },
        type: "multipla-escolha" as const,
        fields: {
          opcoes: "Consulta médica,Exames laboratoriais,Exames de imagem,Procedimento estético,Fisioterapia,Nutrição,Psicologia"
        }
      },
      {
        id: "clinic-3",
        title: "Especialidade Médica",
        description: "Escolha da especialidade",
        content: "Qual especialidade médica você precisa consultar?",
        position: { x: 700, y: 50 },
        type: "multipla-escolha" as const,
        fields: {
          opcoes: "Clínico Geral,Cardiologia,Dermatologia,Ortopedia,Ginecologia,Neurologia,Pediatria,Oftalmologia,Otorrinolaringologia,Endocrinologia"
        }
      },
      {
        id: "clinic-4",
        title: "Exames Laboratoriais",
        description: "Tipos de exames laboratoriais",
        content: "Quais exames laboratoriais você precisa realizar?",
        position: { x: 700, y: 250 },
        type: "multipla-escolha" as const,
        fields: {
          opcoes: "Hemograma completo,Glicemia,Colesterol e triglicérides,Hormônios,Exame de urina,PCR Covid-19,Outros exames"
        }
      },
      {
        id: "clinic-5",
        title: "Exames de Imagem",
        description: "Tipos de exames de imagem",
        content: "Qual exame de imagem você precisa realizar?",
        position: { x: 700, y: 450 },
        type: "multipla-escolha" as const,
        fields: {
          opcoes: "Raio-X,Ultrassonografia,Tomografia,Ressonância Magnética,Densitometria Óssea,Mamografia"
        }
      },
      {
        id: "clinic-6",
        title: "Consulta Cardiologia",
        description: "Detalhes da consulta",
        content: "A consulta com cardiologista inclui avaliação clínica completa e eletrocardiograma.",
        position: { x: 1000, y: 50 },
        type: "servico" as const,
        fields: {
          nome: "Consulta Cardiologia",
          preco: "R$ 350,00",
          duracao: "45 minutos",
          categoria: "Especialidade Médica"
        }
      },
      {
        id: "clinic-7",
        title: "Consulta Dermatologia",
        description: "Detalhes da consulta",
        content: "A consulta com dermatologista inclui avaliação da pele, cabelos e unhas.",
        position: { x: 1000, y: 150 },
        type: "servico" as const,
        fields: {
          nome: "Consulta Dermatologia",
          preco: "R$ 320,00",
          duracao: "40 minutos",
          categoria: "Especialidade Médica"
        }
      },
      {
        id: "clinic-8",
        title: "Pacote de Exames",
        description: "Pacote Check-up Completo",
        content: "Nosso check-up completo inclui consulta clínica e os principais exames para avaliação da sua saúde.",
        position: { x: 1000, y: 250 },
        type: "produto" as const,
        fields: {
          nome: "Check-up Completo",
          preco: "R$ 890,00",
          estoque: "Disponível",
          codigo: "CKP-01"
        }
      },
      {
        id: "clinic-9",
        title: "Ressonância Magnética",
        description: "Detalhes do exame",
        content: "Exame de Ressonância Magnética de alta resolução com laudo em até 48h.",
        position: { x: 1000, y: 350 },
        type: "servico" as const,
        fields: {
          nome: "Ressonância Magnética",
          preco: "R$ 950,00",
          duracao: "40 minutos",
          categoria: "Exame de Imagem"
        }
      },
      {
        id: "clinic-10",
        title: "Orientações para Exames",
        description: "Preparação para exames",
        content: "Instruções para preparação adequada antes do seu exame:",
        position: { x: 1000, y: 450 },
        type: "html" as const,
        fields: {
          html: "<div class='prep-instructions'><h3>Preparação para Exames</h3><ul><li><strong>Exames de sangue:</strong> Jejum de 8-12 horas</li><li><strong>Ultrassonografia abdominal:</strong> Jejum de 6 horas</li><li><strong>Raio-X:</strong> Não é necessário preparo</li><li><strong>Ressonância:</strong> Informar claustrofobia ou implantes metálicos</li></ul><p>Traga seus exames anteriores para comparação.</p></div>"
        }
      },
      {
        id: "clinic-11",
        title: "Histórico Médico",
        description: "Coleta de informações de saúde",
        content: "Para um atendimento mais eficiente, precisamos conhecer seu histórico médico:",
        position: { x: 1300, y: 150 },
        type: "pergunta-respostas" as const,
        fields: {
          perguntas: "Possui alguma doença crônica?,Faz uso contínuo de medicamentos? Quais?,Tem histórico de alergias?,Realizou cirurgias anteriormente?,Há histórico familiar de doenças cardíacas ou câncer?"
        }
      },
      {
        id: "clinic-12",
        title: "Informações sobre Convênio",
        description: "Verificação de convênios",
        content: "Nosso atendimento pode ser realizado por convênio ou particular. Informe seu convênio para verificarmos a cobertura.",
        position: { x: 1300, y: 350 },
        type: "acao" as const,
        fields: {
          acao: "Verificar cobertura do convênio",
          responsavel: "Setor de Convênios",
          prazo: "Imediato",
          script: "Consultar tabela de coberturas e autorizações necessárias"
        }
      },
      {
        id: "clinic-13",
        title: "Agendamento",
        description: "Marcação de consulta/exame",
        content: "Vamos agendar seu atendimento. Escolha a data e horário que melhor se adequam à sua agenda:",
        position: { x: 1600, y: 150 },
        type: "agendar" as const,
        fields: {
          dias: "Segunda,Terça,Quarta,Quinta,Sexta,Sábado",
          horarios: "08:00,09:00,10:00,11:00,14:00,15:00,16:00,17:00",
          duracao: "45 minutos"
        }
      },
      {
        id: "clinic-14",
        title: "Cadastro do Paciente",
        description: "Coleta de dados pessoais",
        content: "Para finalizarmos seu agendamento, precisamos de alguns dados:",
        position: { x: 1900, y: 150 },
        type: "contatos" as const,
        fields: {
          campos: "Nome completo,Data de nascimento,CPF,RG,Telefone,Email,Endereço,Convênio,Número da carteirinha,Validade do convênio"
        }
      },
      {
        id: "clinic-15",
        title: "Ordem de Serviço",
        description: "Criação de OS para atendimento",
        content: "Vamos gerar uma ordem de serviço para seu atendimento:",
        position: { x: 2200, y: 150 },
        type: "ordem-servico" as const,
        fields: {
          numero: "OSM-2023-",
          tipo: "Consulta Médica",
          prioridade: "Normal",
          observacoes: "Verificar disponibilidade de autorização prévia do convênio"
        }
      },
      {
        id: "clinic-16",
        title: "Lembretes e Recomendações",
        description: "Orientações finais",
        content: "Recomendações importantes para o dia do seu atendimento:",
        position: { x: 2200, y: 350 },
        type: "briefing" as const,
        fields: {
          perguntas: "Há necessidade de acompanhante?,Deseja receber lembretes por SMS ou WhatsApp?,Possui preferência por algum profissional específico?,Precisa de declaração de comparecimento?"
        }
      },
      {
        id: "clinic-17",
        title: "Confirmação",
        description: "Finalização do agendamento",
        content: "Seu agendamento foi realizado com sucesso! Enviaremos um lembrete 24h antes. Lembre-se de trazer seus documentos, carteirinha do convênio e chegar 15 minutos antes do horário marcado.",
        position: { x: 2500, y: 250 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "clinic-conn-1", start: "clinic-1", end: "clinic-2", type: "positive" as const, sourceHandle: "positive" },
      { id: "clinic-conn-2", start: "clinic-2", end: "clinic-3", type: "positive" as const, sourceHandle: "positive" },
      { id: "clinic-conn-3", start: "clinic-2", end: "clinic-4", type: "negative" as const, sourceHandle: "negative" },
      { id: "clinic-conn-4", start: "clinic-2", end: "clinic-5", type: "negative" as const, sourceHandle: "negative" },
      { id: "clinic-conn-5", start: "clinic-3", end: "clinic-6", type: "positive" as const, sourceHandle: "positive" },
      { id: "clinic-conn-6", start: "clinic-3", end: "clinic-7", type: "negative" as const, sourceHandle: "negative" },
      { id: "clinic-conn-7", start: "clinic-4", end: "clinic-8", type: "positive" as const, sourceHandle: "positive" },
      { id: "clinic-conn-8", start: "clinic-5", end: "clinic-9", type: "positive" as const, sourceHandle: "positive" },
      { id: "clinic-conn-9", start: "clinic-5", end: "clinic-10", type: "negative" as const, sourceHandle: "negative" },
      { id: "clinic-conn-10", start: "clinic-6", end: "clinic-11", type: "positive" as const, sourceHandle: "positive" },
      { id: "clinic-conn-11", start: "clinic-7", end: "clinic-11", type: "positive" as const, sourceHandle: "positive" },
      { id: "clinic-conn-12", start: "clinic-8", end: "clinic-11", type: "positive" as const, sourceHandle: "positive" },
      { id: "clinic-conn-13", start: "clinic-9", end: "clinic-11", type: "positive" as const, sourceHandle: "positive" },
      { id: "clinic-conn-14", start: "clinic-10", end: "clinic-12", type: "positive" as const, sourceHandle: "positive" },
      { id: "clinic-conn-15", start: "clinic-11", end: "clinic-12", type: "positive" as const, sourceHandle: "positive" },
      { id: "clinic-conn-16", start: "clinic-12", end: "clinic-13", type: "positive" as const, sourceHandle: "positive" },
      { id: "clinic-conn-17", start: "clinic-13", end: "clinic-14", type: "positive" as const, sourceHandle: "positive" },
      { id: "clinic-conn-18", start: "clinic-14", end: "clinic-15", type: "positive" as const, sourceHandle: "positive" },
      { id: "clinic-conn-19", start: "clinic-14", end: "clinic-16", type: "negative" as const, sourceHandle: "negative" },
      { id: "clinic-conn-20", start: "clinic-15", end: "clinic-17", type: "positive" as const, sourceHandle: "positive" },
      { id: "clinic-conn-21", start: "clinic-16", end: "clinic-17", type: "positive" as const, sourceHandle: "positive" }
    ]
  },
  
  marketing: {
    cards: [
      {
        id: "mkt-1",
        title: "Boas-vindas Marketing",
        description: "Primeiro contato com cliente",
        content: "Olá! Bem-vindo à Agência Impacto Digital. Como posso ajudar sua empresa hoje? Está interessado em melhorar sua presença online ou em uma campanha específica?",
        position: { x: 100, y: 50 },
        type: "initial" as const
      },
      {
        id: "mkt-2",
        title: "Atenção - AIDA",
        description: "Captura de atenção do cliente",
        content: "Você sabia que empresas com estratégia digital bem definida têm 3x mais chance de aumentar sua participação no mercado? Qual desafio sua empresa enfrenta atualmente?",
        position: { x: 400, y: 50 },
        type: "multipla-escolha" as const,
        fields: {
          opcoes: "Pouca visibilidade online,Baixa taxa de conversão,Identidade de marca fraca,Necessidade de campanhas sazonais,Lançamento de produto/serviço,Gestão de crise"
        }
      },
      {
        id: "mkt-3",
        title: "Interesse - AIDA",
        description: "Despertar interesse do cliente",
        content: "Interessante! Temos cases de sucesso em situações similares à sua. Uma de nossas soluções aumentou em 70% o tráfego de um cliente do seu segmento em apenas 3 meses.",
        position: { x: 700, y: 50 },
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
        title: "Segmento de Atuação",
        description: "Identificação do segmento",
        content: "Para oferecermos soluções mais adequadas, em qual segmento sua empresa atua?",
        position: { x: 700, y: 250 },
        type: "multipla-escolha" as const,
        fields: {
          opcoes: "E-commerce,Serviços B2B,Serviços B2C,Indústria,Tecnologia,Saúde,Educação,Imobiliário,Turismo,Alimentos e Bebidas"
        }
      },
      {
        id: "mkt-5",
        title: "Desejo - AIDA",
        description: "Criar desejo no cliente",
        content: "Com base no seu negócio, desenvolvemos estratégias personalizadas que incluem: SEO otimizado, gestão de mídias sociais, campanhas segmentadas e análise de resultados.",
        position: { x: 1000, y: 50 },
        type: "produto" as const,
        fields: {
          nome: "Pacote Marketing Digital Completo",
          preco: "R$ 3.900,00/mês",
          estoque: "Disponível",
          codigo: "MKT-COMP-01"
        }
      },
      {
        id: "mkt-6",
        title: "Pacote SEO",
        description: "Detalhes do serviço de SEO",
        content: "Nossa estratégia de SEO inclui análise de palavras-chave, otimização on-page e link building para melhorar seu posicionamento nos buscadores.",
        position: { x: 1000, y: 250 },
        type: "servico" as const,
        fields: {
          nome: "Otimização SEO",
          preco: "R$ 1.500,00/mês",
          duracao: "Contínuo",
          categoria: "Marketing Digital"
        }
      },
      {
        id: "mkt-7",
        title: "Gestão de Mídias Sociais",
        description: "Detalhes do serviço de redes sociais",
        content: "Nosso serviço de gestão de mídias sociais inclui planejamento estratégico, criação de conteúdo, design de posts e relatórios mensais de performance.",
        position: { x: 1000, y: 450 },
        type: "servico" as const,
        fields: {
          nome: "Gestão de Redes Sociais",
          preco: "R$ 2.100,00/mês",
          duracao: "Contínuo",
          categoria: "Marketing Digital"
        }
      },
      {
        id: "mkt-8",
        title: "Campanhas Google Ads",
        description: "Detalhes de campanhas pagas",
        content: "Nossas campanhas de Google Ads são altamente segmentadas e otimizadas para maximizar o ROI do seu investimento em marketing digital.",
        position: { x: 1300, y: 50 },
        type: "servico" as const,
        fields: {
          nome: "Campanhas Google Ads",
          preco: "R$ 1.800,00/mês + verba de mídia",
          duracao: "Contínuo",
          categoria: "Marketing Digital"
        }
      },
      {
        id: "mkt-9",
        title: "E-mail Marketing",
        description: "Detalhes de email marketing",
        content: "Nossas campanhas de e-mail marketing são personalizadas e segmentadas para aumentar as taxas de abertura e conversão.",
        position: { x: 1300, y: 250 },
        type: "servico" as const,
        fields: {
          nome: "Campanhas de E-mail Marketing",
          preco: "R$ 1.200,00/mês",
          duracao: "Contínuo",
          categoria: "Marketing Digital"
        }
      },
      {
        id: "mkt-10",
        title: "Análise da Concorrência",
        description: "Estudo de mercado e concorrentes",
        content: "Realizamos uma análise detalhada da sua concorrência para identificar oportunidades e diferenciais competitivos.",
        position: { x: 1300, y: 450 },
        type: "html" as const,
        fields: {
          html: "<div class='competition-analysis'><h3>Análise da Concorrência</h3><p>Nossa análise inclui:</p><ul><li>Identificação dos principais concorrentes</li><li>Análise das estratégias digitais utilizadas</li><li>Avaliação dos pontos fortes e fracos</li><li>Identificação de oportunidades de mercado</li><li>Recomendações estratégicas</li></ul><p><strong>Entrega:</strong> Relatório completo em até 15 dias</p></div>"
        }
      },
      {
        id: "mkt-11",
        title: "Ação - AIDA",
        description: "Incentivar a ação do cliente",
        content: "Para garantirmos os melhores resultados, precisamos começar o quanto antes. Se fecharmos hoje, oferecemos 15% de desconto no primeiro mês e um diagnóstico digital gratuito!",
        position: { x: 1600, y: 150 },
        type: "briefing" as const,
        fields: {
          perguntas: "Qual seu prazo para início do projeto?,Qual seu orçamento mensal disponível?,Quais são seus principais concorrentes?,Quais plataformas digitais já utiliza?,Quais são seus objetivos principais para os próximos 6 meses?"
        }
      },
      {
        id: "mkt-12",
        title: "Diagnóstico Digital",
        description: "Análise preliminar da presença digital",
        content: "Nosso diagnóstico digital analisa profundamente sua presença online e identifica pontos de melhoria.",
        position: { x: 1600, y: 350 },
        type: "acao" as const,
        fields: {
          acao: "Realizar diagnóstico digital",
          responsavel: "Equipe de Análise",
          prazo: "7 dias",
          script: "Analisar site, redes sociais, presença nos buscadores e reputação online"
        }
      },
      {
        id: "mkt-13",
        title: "Agendamento de Reunião",
        description: "Marcar reunião de apresentação",
        content: "Vamos agendar uma reunião para apresentarmos nosso diagnóstico e proposta personalizada para sua empresa.",
        position: { x: 1900, y: 150 },
        type: "agendar" as const,
        fields: {
          dias: "Segunda,Terça,Quarta,Quinta,Sexta",
          horarios: "09:00,11:00,14:00,16:00,18:00",
          duracao: "60 minutos"
        }
      },
      {
        id: "mkt-14",
        title: "Coleta de Dados",
        description: "Informações para contato",
        content: "Para finalizarmos, precisamos de algumas informações para prepararmos sua proposta personalizada:",
        position: { x: 2200, y: 150 },
        type: "contatos" as const,
        fields: {
          campos: "Nome completo,Cargo,Empresa,CNPJ,Telefone,Email,Site atual,Redes sociais da empresa,Faturamento anual aproximado"
        }
      },
      {
        id: "mkt-15",
        title: "Apresentação da Proposta",
        description: "Detalhamento da proposta comercial",
        content: "Com base em todas as informações coletadas, elaboraremos uma proposta comercial detalhada com soluções personalizadas para sua empresa.",
        position: { x: 2200, y: 350 },
        type: "ordem-servico" as const,
        fields: {
          numero: "PROP-2023-",
          tipo: "Proposta Comercial",
          prioridade: "Alta",
          observacoes: "Cliente com grande potencial, priorizar estratégias para conversão imediata"
        }
      },
      {
        id: "mkt-16",
        title: "Proposta Comercial",
        description: "Envio de proposta",
        content: "Baseado em suas necessidades, prepararemos uma proposta detalhada e personalizada para sua empresa. Aguarde o contato de nosso consultor em breve!",
        position: { x: 2500, y: 250 },
        type: "end" as const
      }
    ],
    connections: [
      { id: "mkt-conn-1", start: "mkt-1", end: "mkt-2", type: "positive" as const, sourceHandle: "positive" },
      { id: "mkt-conn-2", start: "mkt-2", end: "mkt-3", type: "positive" as const, sourceHandle: "positive" },
      { id: "mkt-conn-3", start: "mkt-2", end: "mkt-4", type: "negative" as const, sourceHandle: "negative" },
      { id: "mkt-conn-4", start: "mkt-3", end: "mkt-5", type: "positive" as const, sourceHandle: "positive" },
      { id: "mkt-conn-5", start: "mkt-4", end: "mkt-6", type: "positive" as const, sourceHandle: "positive" },
      { id: "mkt-conn-6", start: "mkt-4", end: "mkt-7", type: "negative" as const, sourceHandle: "negative" },
      { id: "mkt-conn-7", start: "mkt-5", end: "mkt-8", type: "positive" as const, sourceHandle: "positive" },
      { id: "mkt-conn-8", start: "mkt-6", end: "mkt-9", type: "positive" as const, sourceHandle: "positive" },
      { id: "mkt-conn-9", start: "mkt-7", end: "mkt-10", type: "positive" as const, sourceHandle: "positive" },
      { id: "mkt-conn-10", start: "mkt-8", end: "mkt-11", type: "positive" as const, sourceHandle: "positive" },
      { id: "mkt-conn-11", start: "mkt-9", end: "mkt-11", type: "positive" as const, sourceHandle: "positive" },
      { id: "mkt-conn-12", start: "mkt-10", end: "mkt-11", type: "positive" as const, sourceHandle: "positive" },
      { id: "mkt-conn-13", start: "mkt-11", end: "mkt-12", type: "positive" as const, sourceHandle: "positive" },
      { id: "mkt-conn-14", start: "mkt-12", end: "mkt-13", type: "positive" as const, sourceHandle: "positive" },
      { id: "mkt-conn-15", start: "mkt-13", end: "mkt-14", type: "positive" as const, sourceHandle: "positive" },
      { id: "mkt-conn-16", start: "mkt-14", end: "mkt-15", type: "positive" as const, sourceHandle: "positive" },
      { id: "mkt-conn-17", start: "mkt-15", end: "mkt-16", type: "positive" as const, sourceHandle: "positive" }
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
      { id: "ecom-conn-1", start: "ecom-1", end: "ecom-2", type: "positive" as const, sourceHandle: "positive" },
      { id: "ecom-conn-2", start: "ecom-1", end: "ecom-3", type: "negative" as const, sourceHandle: "negative" },
      { id: "ecom-conn-3", start: "ecom-2", end: "ecom-4", type: "positive" as const, sourceHandle: "positive" },
      { id: "ecom-conn-4", start: "ecom-2", end: "ecom-5", type: "negative" as const, sourceHandle: "negative" },
      { id: "ecom-conn-5", start: "ecom-3", end: "ecom-5", type: "positive" as const, sourceHandle: "positive" },
      { id: "ecom-conn-6", start: "ecom-4", end: "ecom-6", type: "positive" as const, sourceHandle: "positive" },
      { id: "ecom-conn-7", start: "ecom-5", end: "ecom-7", type: "positive" as const, sourceHandle: "positive" },
      { id: "ecom-conn-8", start: "ecom-6", end: "ecom-7", type: "positive" as const, sourceHandle: "positive" },
      { id: "ecom-conn-9", start: "ecom-7", end: "ecom-8", type: "positive" as const, sourceHandle: "positive" },
      { id: "ecom-conn-10", start: "ecom-8", end: "ecom-9", type: "positive" as const, sourceHandle: "positive" }
    ]
  }
};

