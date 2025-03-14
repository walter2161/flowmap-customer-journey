import React, { useState } from 'react';
import { CardType } from '@/utils/flowTypes';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface CardTypeSelectorProps {
  onSelect: (type: CardType, formData: any) => void;
  onClose: () => void;
}

export const cardTypeLabels: Record<CardType, string> = {
  'initial': 'Início',
  'regular': 'Padrão',
  'end': 'Fim',
  'imovel': 'Imóvel',
  'servico': 'Serviço',
  'produto': 'Produto',
  'multipla-escolha': 'Múltipla Escolha',
  'pergunta-respostas': 'Pergunta e Respostas',
  'contatos': 'Contatos',
  'agendar': 'Agendar',
  'ordem-servico': 'Ordem de Serviço',
  'briefing': 'Briefing',
  'acao': 'Ação',
  'html': 'HTML',
  'imovel-lancamento': 'Imóvel Lançamento',
  'imovel-usado': 'Imóvel Usado',
  'imovel-comercial': 'Imóvel Comercial',
  'agendar-visita': 'Agendar Visita',
  'agendar-reuniao': 'Agendar Reunião',
  'assistant-profile': 'Perfil do Assistente'
};

const cardTypeColors: Record<CardType, string> = {
  'initial': 'bg-green-100 border-green-500 text-green-700',
  'regular': 'bg-blue-100 border-blue-500 text-blue-700',
  'end': 'bg-red-100 border-red-500 text-red-700',
  'imovel': 'bg-amber-100 border-amber-500 text-amber-700',
  'servico': 'bg-purple-100 border-purple-500 text-purple-700',
  'produto': 'bg-cyan-100 border-cyan-500 text-cyan-700',
  'multipla-escolha': 'bg-yellow-100 border-yellow-500 text-yellow-700',
  'pergunta-respostas': 'bg-lime-100 border-lime-500 text-lime-700',
  'contatos': 'bg-indigo-100 border-indigo-500 text-indigo-700',
  'agendar': 'bg-rose-100 border-rose-500 text-rose-700',
  'ordem-servico': 'bg-teal-100 border-teal-500 text-teal-700',
  'briefing': 'bg-orange-100 border-orange-500 text-orange-700',
  'acao': 'bg-emerald-100 border-emerald-500 text-emerald-700',
  'html': 'bg-gray-100 border-gray-500 text-gray-700',
  'imovel-lancamento': 'bg-pink-100 border-pink-500 text-pink-700',
  'imovel-usado': 'bg-violet-100 border-violet-500 text-violet-700',
  'imovel-comercial': 'bg-sky-100 border-sky-500 text-sky-700',
  'agendar-visita': 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-700',
  'agendar-reuniao': 'bg-lime-100 border-lime-500 text-lime-700',
  'assistant-profile': 'bg-black border-gray-800 text-white'
};

const CardTypeSelector: React.FC<CardTypeSelectorProps> = ({ onSelect, onClose }) => {
  const [selectedType, setSelectedType] = useState<CardType | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const cardTypes = Object.keys(cardTypeLabels) as CardType[];

  const handleSelectType = (type: CardType) => {
    setSelectedType(type);
    // Initialize form data based on type
    const initialData: any = {
      title: `Novo Cartão ${cardTypeLabels[type]}`,
      description: 'Descrição do cartão',
      content: 'Conteúdo do cartão'
    };
    
    switch(type) {
      case 'assistant-profile':
        initialData.title = 'Assistente Virtual';
        initialData.description = 'Perfil do assistente virtual';
        initialData.content = 'Este é o perfil do assistente virtual que vai atender os clientes.';
        initialData.name = 'Assistente Virtual';
        initialData.profession = 'Atendente Virtual';
        initialData.company = 'Minha Empresa';
        initialData.email = 'assistente@minhaempresa.com';
        initialData.phone = '(00) 00000-0000';
        initialData.guidelines = 'Diretrizes do assistente:\n\n1. Seja sempre educado e profissional.\n2. Mantenha uma linguagem clara e direta.\n3. Evite usar gírias ou linguagem informal.\n4. Responda às perguntas de forma objetiva.\n5. Encaminhe para um atendente humano quando não puder responder.';
        initialData.prohibitions = 'O assistente NÃO deve:\n\n1. Fornecer informações falsas ou enganosas.\n2. Prometer prazos ou condições que não podem ser cumpridos.\n3. Realizar transações sem autorização expressa.\n4. Compartilhar dados confidenciais.\n5. Usar linguagem ofensiva.';
        initialData.avatar = '';
        break;
      case 'imovel':
        initialData.endereco = '';
        initialData.preco = '';
        initialData.area = '';
        initialData.quartos = '';
        initialData.banheiros = '';
        initialData.vagas = '';
        initialData.tipo = 'Apartamento';
        initialData.finalidade = 'Venda';
        break;
      case 'imovel-lancamento':
        initialData.endereco = '';
        initialData.preco = '';
        initialData.area = '';
        initialData.quartos = '';
        initialData.banheiros = '';
        initialData.vagas = '';
        initialData.construtora = '';
        initialData.previsaoEntrega = '';
        initialData.imagens = [];
        initialData.mapa = '';
        break;
      case 'imovel-usado':
        initialData.endereco = '';
        initialData.preco = '';
        initialData.area = '';
        initialData.quartos = '';
        initialData.banheiros = '';
        initialData.vagas = '';
        initialData.idade = '';
        initialData.reformado = false;
        initialData.imagens = [];
        break;
      case 'imovel-comercial':
        initialData.endereco = '';
        initialData.valorAluguel = '';
        initialData.valorCondominio = '';
        initialData.iptu = '';
        initialData.area = '';
        initialData.tipoComercial = 'Loja';
        initialData.possuiVitrine = false;
        initialData.estacionamento = '';
        break;
      case 'agendar-visita':
        initialData.imovel = '';
        initialData.enderecoImovel = '';
        initialData.data = '';
        initialData.horario = '';
        initialData.nomeCliente = '';
        initialData.telefoneCliente = '';
        initialData.emailCliente = '';
        initialData.observacoes = '';
        break;
      case 'agendar-reuniao':
        initialData.assunto = '';
        initialData.data = '';
        initialData.horario = '';
        initialData.local = 'Escritório';
        initialData.nomeCliente = '';
        initialData.telefoneCliente = '';
        initialData.emailCliente = '';
        initialData.observacoes = '';
        break;
      case 'servico':
        initialData.nome = '';
        initialData.preco = '';
        initialData.duracao = '';
        initialData.categoria = '';
        break;
      case 'produto':
        initialData.nome = '';
        initialData.preco = '';
        initialData.estoque = '';
        initialData.categoria = '';
        initialData.codigo = '';
        break;
      case 'multipla-escolha':
        initialData.opcoes = ['Opção 1', 'Opção 2', 'Opção 3'];
        break;
      case 'pergunta-respostas':
        initialData.pergunta = '';
        initialData.respostas = ['Resposta 1', 'Resposta 2'];
        break;
      case 'contatos':
        initialData.nome = '';
        initialData.email = '';
        initialData.telefone = '';
        initialData.mensagem = '';
        break;
      case 'agendar':
        initialData.data = '';
        initialData.horario = '';
        initialData.servico = '';
        initialData.profissional = '';
        break;
      case 'ordem-servico':
        initialData.cliente = '';
        initialData.servico = '';
        initialData.valor = '';
        initialData.prazo = '';
        initialData.descricao = '';
        break;
      case 'briefing':
        initialData.objetivo = '';
        initialData.publico = '';
        initialData.prazo = '';
        initialData.orcamento = '';
        initialData.referencias = '';
        break;
      case 'acao':
        initialData.tipo = 'botão';
        initialData.texto = 'Clique aqui';
        initialData.url = '';
        break;
      case 'html':
        initialData.codigo = '<div>Seu HTML personalizado aqui</div>';
        break;
    }
    
    setFormData(initialData);
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const handleArrayChange = (key: string, index: number, value: string) => {
    const newArray = [...formData[key]];
    newArray[index] = value;
    handleInputChange(key, newArray);
  };

  const handleAddArrayItem = (key: string) => {
    const newArray = [...formData[key], ''];
    handleInputChange(key, newArray);
  };

  const handleRemoveArrayItem = (key: string, index: number) => {
    const newArray = [...formData[key]];
    newArray.splice(index, 1);
    handleInputChange(key, newArray);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas to resize the image
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 350;
        const MAX_HEIGHT = 350;
        let width = img.width;
        let height = img.height;

        // Calculate the new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to base64 with reduced quality
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        setAvatarPreview(base64);
        handleInputChange('avatar', base64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const renderFormFields = () => {
    if (!selectedType) return null;

    const commonFields = (
      <>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo Principal</label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>
      </>
    );

    // Type-specific fields
    switch (selectedType) {
      case 'assistant-profile':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Assistente</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profissão</label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4 col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {avatarPreview && (
                  <div className="mt-2">
                    <img src={avatarPreview} alt="Avatar Preview" className="w-24 h-24 object-cover rounded-full" />
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Diretrizes do Assistente</label>
              <textarea
                value={formData.guidelines}
                onChange={(e) => handleInputChange('guidelines', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={5}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Proibições</label>
              <textarea
                value={formData.prohibitions}
                onChange={(e) => handleInputChange('prohibitions', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={5}
              />
            </div>
          </>
        );
      case 'imovel':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                <input
                  type="text"
                  value={formData.preco}
                  onChange={(e) => handleInputChange('preco', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quartos</label>
                <input
                  type="number"
                  value={formData.quartos}
                  onChange={(e) => handleInputChange('quartos', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Banheiros</label>
                <input
                  type="number"
                  value={formData.banheiros}
                  onChange={(e) => handleInputChange('banheiros', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Vagas</label>
                <input
                  type="number"
                  value={formData.vagas}
                  onChange={(e) => handleInputChange('vagas', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Apartamento">Apartamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Comercial">Comercial</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Finalidade</label>
                <select
                  value={formData.finalidade}
                  onChange={(e) => handleInputChange('finalidade', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Venda">Venda</option>
                  <option value="Aluguel">Aluguel</option>
                  <option value="Temporada">Temporada</option>
                </select>
              </div>
            </div>
          </>
        );
      
      case 'imovel-lancamento':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                <input
                  type="text"
                  value={formData.preco}
                  onChange={(e) => handleInputChange('preco', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quartos</label>
                <input
                  type="number"
                  value={formData.quartos}
                  onChange={(e) => handleInputChange('quartos', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Banheiros</label>
                <input
                  type="number"
                  value={formData.banheiros}
                  onChange={(e) => handleInputChange('banheiros', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Vagas</label>
                <input
                  type="number"
                  value={formData.vagas}
                  onChange={(e) => handleInputChange('vagas', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Construtora</label>
                <input
                  type="text"
                  value={formData.construtora}
                  onChange={(e) => handleInputChange('construtora', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Previsão de Entrega</label>
                <input
                  type="text"
                  value={formData.previsaoEntrega}
                  onChange={(e) => handleInputChange('previsaoEntrega', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </>
        );
        
      case 'imovel-usado':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                <input
                  type="text"
                  value={formData.preco}
                  onChange={(e) => handleInputChange('preco', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quartos</label>
                <input
                  type="number"
                  value={formData.quartos}
                  onChange={(e) => handleInputChange('quartos', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Banheiros</label>
                <input
                  type="number"
                  value={formData.banheiros}
                  onChange={(e) => handleInputChange('banheiros', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Vagas</label>
                <input
                  type="number"
                  value={formData.vagas}
                  onChange={(e) => handleInputChange('vagas', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Idade do imóvel</label>
                <input
                  type="text"
                  value={formData.idade}
                  onChange={(e) => handleInputChange('idade', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reformado</label>
                <select
                  value={formData.reformado ? "sim" : "nao"}
                  onChange={(e) => handleInputChange('reformado', e.target.value === "sim")}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>
          </>
        );
        
      case 'imovel-comercial':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Aluguel</label>
                <input
                  type="text"
                  value={formData.valorAluguel}
                  onChange={(e) => handleInputChange('valorAluguel', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Condomínio</label>
                <input
                  type="text"
                  value={formData.valorCondominio}
                  onChange={(e) => handleInputChange('valorCondominio', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">IPTU</label>
                <input
                  type="text"
                  value={formData.iptu}
                  onChange={(e) => handleInputChange('iptu', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={formData.tipoComercial}
                  onChange={(e) => handleInputChange('tipoComercial', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Loja">Loja</option>
                  <option value="Sala">Sala Comercial</option>
                  <option value="Galpão">Galpão</option>
                  <option value="Ponto">Ponto Comercial</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Possui Vitrine</label>
                <select
                  value={formData.possuiVitrine ? "sim" : "nao"}
                  onChange={(e) => handleInputChange('possuiVitrine', e.target.value === "sim")}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estacionamento</label>
                <input
                  type="text"
                  value={formData.estacionamento}
                  onChange={(e) => handleInputChange('estacionamento', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </>
        );
        
      case 'agendar-visita':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text
