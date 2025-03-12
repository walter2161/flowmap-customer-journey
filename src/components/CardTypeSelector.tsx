
import React from 'react';
import { CardType } from '@/utils/flowTypes';

interface CardTypeSelectorProps {
  onSelect: (type: CardType) => void;
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
  'html': 'HTML'
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
  'html': 'bg-gray-100 border-gray-500 text-gray-700'
};

const CardTypeSelector: React.FC<CardTypeSelectorProps> = ({ onSelect, onClose }) => {
  const cardTypes = Object.keys(cardTypeLabels) as CardType[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[700px] p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Selecione o Tipo de Cartão</h2>
        <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto py-2">
          {cardTypes.map((type) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={`p-4 border-2 rounded-lg text-left hover:opacity-80 transition-colors ${cardTypeColors[type]}`}
            >
              <h3 className="text-lg font-semibold">{cardTypeLabels[type]}</h3>
              <p className="text-sm opacity-80">Cartão tipo {cardTypeLabels[type]}</p>
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardTypeSelector;
