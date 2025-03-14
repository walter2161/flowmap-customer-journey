
import React, { useState } from 'react';
import { CardType } from '@/utils/flowTypes';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  'agendar-reuniao': 'Agendar Reunião'
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
  'agendar-reuniao': 'bg-lime-100 border-lime-500 text-lime-700'
};

const CardTypeSelector: React.FC<CardTypeSelectorProps> = ({ onSelect, onClose }) => {
  const [selectedType, setSelectedType] = useState<CardType | null>(null);
  const [formData, setFormData] = useState<any>({});
  
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Imóvel</label>
                <input
                  type="text"
                  value={formData.imovel}
                  onChange={(e) => handleInputChange('imovel', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço do Imóvel</label>
                <input
                  type="text"
                  value={formData.enderecoImovel}
                  onChange={(e) => handleInputChange('enderecoImovel', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleInputChange('data', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                <input
                  type="time"
                  value={formData.horario}
                  onChange={(e) => handleInputChange('horario', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  value={formData.nomeCliente}
                  onChange={(e) => handleInputChange('nomeCliente', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  value={formData.telefoneCliente}
                  onChange={(e) => handleInputChange('telefoneCliente', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.emailCliente}
                  onChange={(e) => handleInputChange('emailCliente', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
          </>
        );
        
      case 'agendar-reuniao':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                <input
                  type="text"
                  value={formData.assunto}
                  onChange={(e) => handleInputChange('assunto', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                <select
                  value={formData.local}
                  onChange={(e) => handleInputChange('local', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Escritório">Escritório</option>
                  <option value="Imóvel">No Imóvel</option>
                  <option value="Virtual">Reunião Virtual</option>
                  <option value="Outro">Outro Local</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleInputChange('data', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                <input
                  type="time"
                  value={formData.horario}
                  onChange={(e) => handleInputChange('horario', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  value={formData.nomeCliente}
                  onChange={(e) => handleInputChange('nomeCliente', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  value={formData.telefoneCliente}
                  onChange={(e) => handleInputChange('telefoneCliente', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.emailCliente}
                  onChange={(e) => handleInputChange('emailCliente', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
          </>
        );
        
      // Complete the rest of the cases here...
      case 'servico':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Serviço</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Duração</label>
                <input
                  type="text"
                  value={formData.duracao}
                  onChange={(e) => handleInputChange('duracao', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </>
        );
       
      case 'produto':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                <input
                  type="number"
                  value={formData.estoque}
                  onChange={(e) => handleInputChange('estoque', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => handleInputChange('codigo', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </>
        );
        
      // Add all remaining cases
      case 'multipla-escolha':
        return (
          <>
            {commonFields}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Opções</label>
              {formData.opcoes.map((opcao: string, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={opcao}
                    onChange={(e) => handleArrayChange('opcoes', index, e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-md mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('opcoes', index)}
                    className="bg-red-100 text-red-700 px-2 py-1 rounded"
                  >
                    Remover
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddArrayItem('opcoes')}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded mt-2"
              >
                Adicionar Opção
              </button>
            </div>
          </>
        );
        
      case 'pergunta-respostas':
        return (
          <>
            {commonFields}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pergunta</label>
              <input
                type="text"
                value={formData.pergunta}
                onChange={(e) => handleInputChange('pergunta', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Respostas</label>
              {formData.respostas.map((resposta: string, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={resposta}
                    onChange={(e) => handleArrayChange('respostas', index, e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-md mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('respostas', index)}
                    className="bg-red-100 text-red-700 px-2 py-1 rounded"
                  >
                    Remover
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddArrayItem('respostas')}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded mt-2"
              >
                Adicionar Resposta
              </button>
            </div>
          </>
        );
        
      case 'contatos':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
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
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
              <textarea
                value={formData.mensagem}
                onChange={(e) => handleInputChange('mensagem', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
          </>
        );
        
      case 'agendar':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleInputChange('data', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                <input
                  type="time"
                  value={formData.horario}
                  onChange={(e) => handleInputChange('horario', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
                <input
                  type="text"
                  value={formData.servico}
                  onChange={(e) => handleInputChange('servico', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profissional</label>
                <input
                  type="text"
                  value={formData.profissional}
                  onChange={(e) => handleInputChange('profissional', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </>
        );
        
      case 'ordem-servico':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <input
                  type="text"
                  value={formData.cliente}
                  onChange={(e) => handleInputChange('cliente', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
                <input
                  type="text"
                  value={formData.servico}
                  onChange={(e) => handleInputChange('servico', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                <input
                  type="text"
                  value={formData.valor}
                  onChange={(e) => handleInputChange('valor', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Prazo</label>
                <input
                  type="date"
                  value={formData.prazo}
                  onChange={(e) => handleInputChange('prazo', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
          </>
        );
        
      case 'briefing':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
                <input
                  type="text"
                  value={formData.objetivo}
                  onChange={(e) => handleInputChange('objetivo', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Público-alvo</label>
                <input
                  type="text"
                  value={formData.publico}
                  onChange={(e) => handleInputChange('publico', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Prazo</label>
                <input
                  type="date"
                  value={formData.prazo}
                  onChange={(e) => handleInputChange('prazo', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Orçamento</label>
                <input
                  type="text"
                  value={formData.orcamento}
                  onChange={(e) => handleInputChange('orcamento', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Referências</label>
              <textarea
                value={formData.referencias}
                onChange={(e) => handleInputChange('referencias', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
          </>
        );
        
      case 'acao':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="botão">Botão</option>
                  <option value="link">Link</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Texto</label>
                <input
                  type="text"
                  value={formData.texto}
                  onChange={(e) => handleInputChange('texto', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </>
        );
        
      case 'html':
        return (
          <>
            {commonFields}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Código HTML</label>
              <textarea
                value={formData.codigo}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md font-mono"
                rows={10}
              />
            </div>
          </>
        );
        
      default:
        return commonFields;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <h2 className="text-xl font-bold mb-4">Selecione o tipo de cartão</h2>
          
          {selectedType ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setSelectedType(null)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Voltar
                </button>
                <div className={`px-3 py-1 border rounded-md ${cardTypeColors[selectedType]}`}>
                  {cardTypeLabels[selectedType]}
                </div>
              </div>
              
              <form>
                {renderFormFields()}
                
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelect(selectedType, formData)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                  >
                    Adicionar Cartão
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {cardTypes.map((type) => (
                <div
                  key={type}
                  onClick={() => handleSelectType(type)}
                  className={`p-3 border rounded-md cursor-pointer transition-all ${cardTypeColors[type]} hover:shadow-md`}
                >
                  <div className="text-sm font-medium">{cardTypeLabels[type]}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardTypeSelector;
