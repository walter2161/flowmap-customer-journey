import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { FlowCard } from '@/utils/flowTypes';
import { PlusCircle, MinusCircle, Edit } from 'lucide-react';

const cardTypeClasses = {
  initial: 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500',
  regular: 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500',
  end: 'bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-500',
  imovel: 'bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-500',
  servico: 'bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-500',
  produto: 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-2 border-cyan-500',
  'multipla-escolha': 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-500',
  'pergunta-respostas': 'bg-gradient-to-br from-lime-50 to-lime-100 border-2 border-lime-500',
  contatos: 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-500',
  agendar: 'bg-gradient-to-br from-rose-50 to-rose-100 border-2 border-rose-500',
  'ordem-servico': 'bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-500',
  briefing: 'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-500',
  acao: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-500',
  html: 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-500'
};

const cardTypeHeaders = {
  initial: 'bg-green-500 text-white',
  regular: 'bg-blue-500 text-white',
  end: 'bg-red-500 text-white',
  imovel: 'bg-amber-500 text-white',
  servico: 'bg-purple-500 text-white',
  produto: 'bg-cyan-500 text-white',
  'multipla-escolha': 'bg-yellow-500 text-white',
  'pergunta-respostas': 'bg-lime-500 text-white',
  contatos: 'bg-indigo-500 text-white',
  agendar: 'bg-rose-500 text-white',
  'ordem-servico': 'bg-teal-500 text-white',
  briefing: 'bg-orange-500 text-white',
  acao: 'bg-emerald-500 text-white',
  html: 'bg-gray-500 text-white'
};

const cardTypeLabels = {
  initial: 'INÍCIO',
  regular: 'PADRÃO',
  end: 'FIM',
  imovel: 'IMÓVEL',
  servico: 'SERVIÇO',
  produto: 'PRODUTO',
  'multipla-escolha': 'MÚLTIPLA ESCOLHA',
  'pergunta-respostas': 'PERGUNTA E RESPOSTAS',
  contatos: 'CONTATOS',
  agendar: 'AGENDAR',
  'ordem-servico': 'ORDEM DE SERVIÇO',
  briefing: 'BRIEFING',
  acao: 'AÇÃO',
  html: 'HTML'
};

interface FlowCardProps {
  data: FlowCard;
  selected: boolean;
}

const FlowCardComponent: React.FC<FlowCardProps> = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  const [content, setContent] = useState(data.content);
  const [fields, setFields] = useState(data.fields || {});

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Update the data in the node
    data.title = title;
    data.description = description;
    data.content = content;
    data.fields = fields;
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setTitle(data.title);
    setDescription(data.description);
    setContent(data.content);
    setFields(data.fields || {});
    setIsEditing(false);
  };

  const handleFieldChange = (key: string, value: any) => {
    setFields({
      ...fields,
      [key]: value
    });
  };

  const renderTypeSpecificFields = () => {
    if (!isEditing) return null;

    switch (data.type) {
      case 'imovel':
        return (
          <div className="mt-4 border-t pt-3 border-gray-200">
            <h4 className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-2">Detalhes do Imóvel</h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Endereço</label>
                <input
                  type="text"
                  value={fields.endereco || ''}
                  onChange={(e) => handleFieldChange('endereco', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Preço</label>
                <input
                  type="text"
                  value={fields.preco || ''}
                  onChange={(e) => handleFieldChange('preco', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Área (m²)</label>
                <input
                  type="text"
                  value={fields.area || ''}
                  onChange={(e) => handleFieldChange('area', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Quartos</label>
                <input
                  type="number"
                  value={fields.quartos || ''}
                  onChange={(e) => handleFieldChange('quartos', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Tipo</label>
                <select
                  value={fields.tipo || 'Apartamento'}
                  onChange={(e) => handleFieldChange('tipo', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                >
                  <option value="Apartamento">Apartamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Comercial">Comercial</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Finalidade</label>
                <select
                  value={fields.finalidade || 'Venda'}
                  onChange={(e) => handleFieldChange('finalidade', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                >
                  <option value="Venda">Venda</option>
                  <option value="Aluguel">Aluguel</option>
                  <option value="Temporada">Temporada</option>
                </select>
              </div>
            </div>
          </div>
        );
        
      case 'servico':
        return (
          <div className="mt-4 border-t pt-3 border-gray-200">
            <h4 className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-2">Detalhes do Serviço</h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Nome</label>
                <input
                  type="text"
                  value={fields.nome || ''}
                  onChange={(e) => handleFieldChange('nome', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Preço</label>
                <input
                  type="text"
                  value={fields.preco || ''}
                  onChange={(e) => handleFieldChange('preco', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Duração</label>
                <input
                  type="text"
                  value={fields.duracao || ''}
                  onChange={(e) => handleFieldChange('duracao', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Categoria</label>
                <input
                  type="text"
                  value={fields.categoria || ''}
                  onChange={(e) => handleFieldChange('categoria', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        );
        
      // Add cases for other card types as needed
      case 'produto':
        return (
          <div className="mt-4 border-t pt-3 border-gray-200">
            <h4 className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-2">Detalhes do Produto</h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Nome</label>
                <input
                  type="text"
                  value={fields.nome || ''}
                  onChange={(e) => handleFieldChange('nome', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Preço</label>
                <input
                  type="text"
                  value={fields.preco || ''}
                  onChange={(e) => handleFieldChange('preco', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Estoque</label>
                <input
                  type="number"
                  value={fields.estoque || ''}
                  onChange={(e) => handleFieldChange('estoque', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Código</label>
                <input
                  type="text"
                  value={fields.codigo || ''}
                  onChange={(e) => handleFieldChange('codigo', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderTypeSpecificDisplay = () => {
    if (isEditing) return null;

    switch (data.type) {
      case 'imovel':
        if (!fields) return null;
        return (
          <div className="mt-3 border-t pt-2 border-gray-200">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Detalhes do Imóvel</p>
            {fields.endereco && <p className="text-xs text-gray-700"><span className="font-semibold">Endereço:</span> {fields.endereco}</p>}
            <div className="flex flex-wrap gap-x-4">
              {fields.preco && <p className="text-xs text-gray-700"><span className="font-semibold">Preço:</span> {fields.preco}</p>}
              {fields.area && <p className="text-xs text-gray-700"><span className="font-semibold">Área:</span> {fields.area}m²</p>}
              {fields.quartos && <p className="text-xs text-gray-700"><span className="font-semibold">Quartos:</span> {fields.quartos}</p>}
              {fields.tipo && <p className="text-xs text-gray-700"><span className="font-semibold">Tipo:</span> {fields.tipo}</p>}
              {fields.finalidade && <p className="text-xs text-gray-700"><span className="font-semibold">Finalidade:</span> {fields.finalidade}</p>}
            </div>
          </div>
        );
        
      case 'servico':
        if (!fields) return null;
        return (
          <div className="mt-3 border-t pt-2 border-gray-200">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Detalhes do Serviço</p>
            <div className="flex flex-wrap gap-x-4">
              {fields.nome && <p className="text-xs text-gray-700"><span className="font-semibold">Nome:</span> {fields.nome}</p>}
              {fields.preco && <p className="text-xs text-gray-700"><span className="font-semibold">Preço:</span> {fields.preco}</p>}
              {fields.duracao && <p className="text-xs text-gray-700"><span className="font-semibold">Duração:</span> {fields.duracao}</p>}
              {fields.categoria && <p className="text-xs text-gray-700"><span className="font-semibold">Categoria:</span> {fields.categoria}</p>}
            </div>
          </div>
        );
        
      case 'produto':
        if (!fields) return null;
        return (
          <div className="mt-3 border-t pt-2 border-gray-200">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Detalhes do Produto</p>
            <div className="flex flex-wrap gap-x-4">
              {fields.nome && <p className="text-xs text-gray-700"><span className="font-semibold">Nome:</span> {fields.nome}</p>}
              {fields.preco && <p className="text-xs text-gray-700"><span className="font-semibold">Preço:</span> {fields.preco}</p>}
              {fields.estoque && <p className="text-xs text-gray-700"><span className="font-semibold">Estoque:</span> {fields.estoque}</p>}
              {fields.codigo && <p className="text-xs text-gray-700"><span className="font-semibold">Código:</span> {fields.codigo}</p>}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div
      className={`w-[320px] rounded-xl shadow-lg transition-all duration-300 overflow-hidden flow-card-appear ${
        cardTypeClasses[data.type]
      } ${selected ? 'ring-2 ring-blue-400 shadow-xl' : ''}`}
    >
      {/* Left handle - entry point - now more visible */}
      <div className="absolute left-0 top-[30px] ml-[-8px] z-20">
        <Handle
          type="target"
          position={Position.Left}
          className="connector-handle !bg-blue-500 !border-white w-4 h-4 rounded-full"
          style={{ zIndex: 20 }}
        />
      </div>
      
      {/* Header */}
      <div className={`p-3 ${cardTypeHeaders[data.type]} flex justify-between items-center`}>
        <span className="font-bold text-xs px-2 py-1 rounded bg-white/20">
          {cardTypeLabels[data.type]}
        </span>
        <h3 className="font-bold text-center uppercase tracking-wide flex-1">
          {data.title}
        </h3>
      </div>
      
      {/* Body */}
      {!isEditing ? (
        <div className="p-4 bg-white/90 backdrop-blur-sm">
          <div className="mb-3">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Descrição</p>
            <p className="text-sm text-gray-800">{data.description}</p>
          </div>
          
          <div className="mt-3">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Conteúdo</p>
            <p className="text-sm text-gray-800">{data.content}</p>
          </div>
          
          {renderTypeSpecificDisplay()}
          
          <button 
            onClick={handleEdit}
            className="mt-4 flex items-center justify-center w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" /> Editar
          </button>
        </div>
      ) : (
        <div className="p-4 bg-white/90 backdrop-blur-sm">
          <div className="mb-3">
            <label className="text-xs uppercase text-gray-500 font-semibold tracking-wide block mb-1">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          
          <div className="mb-3">
            <label className="text-xs uppercase text-gray-500 font-semibold tracking-wide block mb-1">Descrição</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          
          <div className="mb-3">
            <label className="text-xs uppercase text-gray-500 font-semibold tracking-wide block mb-1">Conteúdo</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={4}
            />
          </div>
          
          {renderTypeSpecificFields()}
          
          <div className="flex gap-2 mt-4">
            <button 
              onClick={handleCancel}
              className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
            >
              Salvar
            </button>
          </div>
        </div>
      )}
      
      {/* Bottom right connectors - exit points - now more visible */}
      <div className="absolute right-[-8px] bottom-10 flex flex-col gap-4 z-20">
        {/* Positive handle */}
        <div className="relative group">
          <Handle
            id="positive"
            type="source"
            position={Position.Right}
            className="connector-handle !bg-green-500 !border-white w-4 h-4 rounded-full"
            style={{ zIndex: 20 }}
          />
          <div className="absolute right-[-30px] opacity-0 group-hover:opacity-100 transition-opacity">
            <PlusCircle className="w-4 h-4 text-green-500" />
          </div>
        </div>
        
        {/* Negative handle */}
        <div className="relative group">
          <Handle
            id="negative"
            type="source"
            position={Position.Right}
            className="connector-handle !bg-red-500 !border-white w-4 h-4 rounded-full"
            style={{ zIndex: 20 }}
          />
          <div className="absolute right-[-30px] opacity-0 group-hover:opacity-100 transition-opacity">
            <MinusCircle className="w-4 h-4 text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(FlowCardComponent);
