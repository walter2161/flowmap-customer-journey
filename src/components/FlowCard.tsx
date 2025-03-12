
import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { FlowCard } from '@/utils/flowTypes';
import { PlusCircle, MinusCircle, Edit } from 'lucide-react';
import { 
  Home, 
  Flag, 
  CheckSquare, 
  Building, 
  Wrench, 
  Package, 
  List, 
  MessageSquareQuestion, 
  User, 
  Calendar, 
  ClipboardList, 
  FileText, 
  Zap, 
  Code
} from 'lucide-react';

interface FlowCardProps {
  data: FlowCard;
  selected: boolean;
}

const cardTypeClasses = {
  initial: 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500',
  regular: 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500',
  end: 'bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-500',
  imovel: 'bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-500',
  servico: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-500',
  produto: 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-500',
  multipla_escolha: 'bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-500',
  pergunta_resposta: 'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-500',
  contatos: 'bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-500',
  agendar: 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-2 border-cyan-500',
  ordem_servico: 'bg-gradient-to-br from-lime-50 to-lime-100 border-2 border-lime-500',
  briefing: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-500',
  acao: 'bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-500',
  html: 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-500'
};

const cardTypeHeaders = {
  initial: 'bg-green-500 text-white',
  regular: 'bg-blue-500 text-white',
  end: 'bg-red-500 text-white',
  imovel: 'bg-purple-500 text-white',
  servico: 'bg-yellow-500 text-white',
  produto: 'bg-indigo-500 text-white',
  multipla_escolha: 'bg-pink-500 text-white',
  pergunta_resposta: 'bg-orange-500 text-white',
  contatos: 'bg-teal-500 text-white',
  agendar: 'bg-cyan-500 text-white',
  ordem_servico: 'bg-lime-500 text-white',
  briefing: 'bg-emerald-500 text-white',
  acao: 'bg-amber-500 text-white',
  html: 'bg-gray-500 text-white'
};

const cardTypeIcons = {
  initial: <Home className="w-4 h-4" />,
  regular: <CheckSquare className="w-4 h-4" />,
  end: <Flag className="w-4 h-4" />,
  imovel: <Building className="w-4 h-4" />,
  servico: <Wrench className="w-4 h-4" />,
  produto: <Package className="w-4 h-4" />,
  multipla_escolha: <List className="w-4 h-4" />,
  pergunta_resposta: <MessageSquareQuestion className="w-4 h-4" />,
  contatos: <User className="w-4 h-4" />,
  agendar: <Calendar className="w-4 h-4" />,
  ordem_servico: <ClipboardList className="w-4 h-4" />,
  briefing: <FileText className="w-4 h-4" />,
  acao: <Zap className="w-4 h-4" />,
  html: <Code className="w-4 h-4" />
};

const cardTypeLabels = {
  initial: 'INÍCIO',
  regular: '',
  end: 'FIM',
  imovel: 'IMÓVEL',
  servico: 'SERVIÇO',
  produto: 'PRODUTO',
  multipla_escolha: 'MÚLT.ESCOLHA',
  pergunta_resposta: 'PERGUNTAS',
  contatos: 'CONTATOS',
  agendar: 'AGENDAR',
  ordem_servico: 'OS',
  briefing: 'BRIEFING',
  acao: 'AÇÃO',
  html: 'HTML'
};

const FlowCardComponent: React.FC<FlowCardProps> = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  const [content, setContent] = useState(data.content);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Update the data in the node
    data.title = title;
    data.description = description;
    data.content = content;
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setTitle(data.title);
    setDescription(data.description);
    setContent(data.content);
    setIsEditing(false);
  };

  return (
    <div
      className={`w-[320px] rounded-xl shadow-lg transition-all duration-300 overflow-hidden flow-card-appear ${
        cardTypeClasses[data.type] || cardTypeClasses.regular
      } ${selected ? 'ring-2 ring-blue-400 shadow-xl' : ''}`}
    >
      {/* Left handle - entry point */}
      <div className="absolute left-0 top-[30px] ml-[-8px]">
        <Handle
          type="target"
          position={Position.Left}
          className="connector-handle !bg-blue-500 !border-white w-4 h-4 rounded-full"
        />
      </div>
      
      {/* Header */}
      <div className={`p-3 ${cardTypeHeaders[data.type] || cardTypeHeaders.regular} flex justify-between items-center`}>
        <span className="font-bold text-xs px-2 py-1 rounded bg-white/20 flex items-center gap-1">
          {cardTypeIcons[data.type]} {cardTypeLabels[data.type]}
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
          
          <div className="flex gap-2">
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
      
      {/* Bottom right connectors - exit points */}
      <div className="absolute right-[-8px] bottom-10 flex flex-col gap-4">
        {/* Positive handle */}
        <div className="relative group">
          <Handle
            id="positive"
            type="source"
            position={Position.Right}
            className="connector-handle !bg-green-500 !border-white w-4 h-4 rounded-full"
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
