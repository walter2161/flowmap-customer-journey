
import React from 'react';
import { CardType } from '@/utils/flowTypes';
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

export type { CardType };

interface CardTypeSelectorProps {
  onSelect: (type: CardType) => void;
  onCancel: () => void;
}

interface CardTypeOption {
  type: CardType;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const cardTypes: CardTypeOption[] = [
  {
    type: 'initial',
    label: 'Início',
    icon: <Home className="w-5 h-5" />,
    description: 'Primeiro passo do fluxo',
    color: 'bg-green-100 border-green-500 text-green-800'
  },
  {
    type: 'regular',
    label: 'Padrão',
    icon: <CheckSquare className="w-5 h-5" />,
    description: 'Etapa padrão do fluxo',
    color: 'bg-blue-100 border-blue-500 text-blue-800'
  },
  {
    type: 'end',
    label: 'Fim',
    icon: <Flag className="w-5 h-5" />,
    description: 'Fim do fluxo',
    color: 'bg-red-100 border-red-500 text-red-800'
  },
  {
    type: 'imovel',
    label: 'Imóvel',
    icon: <Building className="w-5 h-5" />,
    description: 'Informações sobre imóvel',
    color: 'bg-purple-100 border-purple-500 text-purple-800'
  },
  {
    type: 'servico',
    label: 'Serviço',
    icon: <Wrench className="w-5 h-5" />,
    description: 'Oferta de serviço',
    color: 'bg-yellow-100 border-yellow-500 text-yellow-800'
  },
  {
    type: 'produto',
    label: 'Produto',
    icon: <Package className="w-5 h-5" />,
    description: 'Detalhes de produto',
    color: 'bg-indigo-100 border-indigo-500 text-indigo-800'
  },
  {
    type: 'multipla_escolha',
    label: 'Múltipla Escolha',
    icon: <List className="w-5 h-5" />,
    description: 'Opções para escolha',
    color: 'bg-pink-100 border-pink-500 text-pink-800'
  },
  {
    type: 'pergunta_resposta',
    label: 'Pergunta e Respostas',
    icon: <MessageSquareQuestion className="w-5 h-5" />,
    description: 'FAQ ou dúvidas comuns',
    color: 'bg-orange-100 border-orange-500 text-orange-800'
  },
  {
    type: 'contatos',
    label: 'Contatos',
    icon: <User className="w-5 h-5" />,
    description: 'Informações de contato',
    color: 'bg-teal-100 border-teal-500 text-teal-800'
  },
  {
    type: 'agendar',
    label: 'Agendar',
    icon: <Calendar className="w-5 h-5" />,
    description: 'Marcação de horários',
    color: 'bg-cyan-100 border-cyan-500 text-cyan-800'
  },
  {
    type: 'ordem_servico',
    label: 'Ordem de Serviço',
    icon: <ClipboardList className="w-5 h-5" />,
    description: 'Detalhes de OS',
    color: 'bg-lime-100 border-lime-500 text-lime-800'
  },
  {
    type: 'briefing',
    label: 'Briefing',
    icon: <FileText className="w-5 h-5" />,
    description: 'Coleta de informações',
    color: 'bg-emerald-100 border-emerald-500 text-emerald-800'
  },
  {
    type: 'acao',
    label: 'Ação',
    icon: <Zap className="w-5 h-5" />,
    description: 'Ação a ser executada',
    color: 'bg-amber-100 border-amber-500 text-amber-800'
  },
  {
    type: 'html',
    label: 'HTML',
    icon: <Code className="w-5 h-5" />,
    description: 'Conteúdo HTML personalizado',
    color: 'bg-gray-100 border-gray-500 text-gray-800'
  }
];

const CardTypeSelector: React.FC<CardTypeSelectorProps> = ({ onSelect, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-[800px] max-h-[90vh] animate-scale-in">
        <h2 className="text-xl font-bold mb-4">Selecione o Tipo de Cartão</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh] p-2">
          {cardTypes.map((cardType) => (
            <div 
              key={cardType.type}
              onClick={() => onSelect(cardType.type)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${cardType.color}`}
            >
              <div className="flex items-center gap-2 mb-2">
                {cardType.icon}
                <h3 className="font-semibold">{cardType.label}</h3>
              </div>
              <p className="text-sm">{cardType.description}</p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end mt-6">
          <button 
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardTypeSelector;
