
import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { FlowCard, OutputPort } from '@/utils/flowTypes';
import { Edit, Plus, Trash } from 'lucide-react';
import { nanoid } from 'nanoid';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useReactFlow } from 'reactflow';

const cardTypeClasses = {
  assistente: 'bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-500',
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
  html: 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-500',
  'imovel-lancamento': 'bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-500',
  'imovel-usado': 'bg-gradient-to-br from-violet-50 to-violet-100 border-2 border-violet-500',
  'imovel-comercial': 'bg-gradient-to-br from-sky-50 to-sky-100 border-2 border-sky-500',
  'agendar-visita': 'bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 border-2 border-fuchsia-500',
  'agendar-reuniao': 'bg-gradient-to-br from-lime-50 to-lime-100 border-2 border-lime-500'
};

const cardTypeHeaders = {
  assistente: 'bg-slate-800 text-white',
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
  html: 'bg-gray-500 text-white',
  'imovel-lancamento': 'bg-pink-500 text-white',
  'imovel-usado': 'bg-violet-500 text-white',
  'imovel-comercial': 'bg-sky-500 text-white',
  'agendar-visita': 'bg-fuchsia-500 text-white',
  'agendar-reuniao': 'bg-lime-500 text-white'
};

const cardTypeLabels = {
  assistente: 'ASSISTENTE',
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
  html: 'HTML',
  'imovel-lancamento': 'IMÓVEL LANÇAMENTO',
  'imovel-usado': 'IMÓVEL USADO',
  'imovel-comercial': 'IMÓVEL COMERCIAL',
  'agendar-visita': 'AGENDAR VISITA',
  'agendar-reuniao': 'AGENDAR REUNIÃO'
};

// Array de letras para identifcar as portas
const portLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

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
  const [outputPorts, setOutputPorts] = useState<OutputPort[]>(data.outputPorts || []);
  const [newPortLabel, setNewPortLabel] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { getNodes, setNodes, getEdges, setEdges } = useReactFlow();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Update the data in the node
    data.title = title;
    data.description = description;
    data.content = content;
    data.fields = fields;
    data.outputPorts = outputPorts;
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setTitle(data.title);
    setDescription(data.description);
    setContent(data.content);
    setFields(data.fields || {});
    setOutputPorts(data.outputPorts || []);
    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    // Close the confirmation dialog
    setShowDeleteConfirm(false);
    
    // Get all edges connected to this node
    const edges = getEdges();
    const nodeId = data.id;
    
    // Remove the node
    setNodes(nodes => nodes.filter(node => node.id !== nodeId));
    
    // Remove all edges connected to this node
    setEdges(edges => edges.filter(
      edge => edge.source !== nodeId && edge.target !== nodeId
    ));
  };

  const handleFieldChange = (key: string, value: any) => {
    setFields({
      ...fields,
      [key]: value
    });
  };

  const addOutputPort = () => {
    if (newPortLabel.trim() !== '') {
      const newPort: OutputPort = {
        id: `port-${nanoid(6)}`,
        label: newPortLabel.trim()
      };
      setOutputPorts([...outputPorts, newPort]);
      setNewPortLabel('');
    }
  };

  const removeOutputPort = (portId: string) => {
    setOutputPorts(outputPorts.filter(port => port.id !== portId));
  };

  const renderTypeSpecificFields = () => {
    if (!isEditing) return null;

    switch (data.type) {
      case 'assistente':
        return (
          <div className="mt-4 border-t pt-3 border-gray-200">
            <h4 className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-2">Detalhes do Assistente</h4>
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
                <label className="text-xs text-gray-600 block mb-1">Profissão</label>
                <input
                  type="text"
                  value={fields.profissao || ''}
                  onChange={(e) => handleFieldChange('profissao', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Empresa</label>
                <input
                  type="text"
                  value={fields.empresa || ''}
                  onChange={(e) => handleFieldChange('empresa', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Email</label>
                <input
                  type="email"
                  value={fields.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Telefone</label>
                <input
                  type="text"
                  value={fields.telefone || ''}
                  onChange={(e) => handleFieldChange('telefone', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Avatar URL</label>
                <input
                  type="text"
                  value={fields.avatar || ''}
                  onChange={(e) => handleFieldChange('avatar', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="text-xs text-gray-600 block mb-1">Diretrizes</label>
              <textarea
                value={fields.diretrizes || ''}
                onChange={(e) => handleFieldChange('diretrizes', e.target.value)}
                className="w-full p-1 text-sm border border-gray-300 rounded"
                rows={3}
              />
            </div>
            <div className="mt-2">
              <label className="text-xs text-gray-600 block mb-1">Restrições</label>
              <textarea
                value={fields.restricoes || ''}
                onChange={(e) => handleFieldChange('restricoes', e.target.value)}
                className="w-full p-1 text-sm border border-gray-300 rounded"
                rows={3}
              />
            </div>
          </div>
        );
        
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
      
      case 'imovel-lancamento':
        return (
          <div className="mt-4 border-t pt-3 border-gray-200">
            <h4 className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-2">Detalhes do Imóvel Lançamento</h4>
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
                <label className="text-xs text-gray-600 block mb-1">Construtora</label>
                <input
                  type="text"
                  value={fields.construtora || ''}
                  onChange={(e) => handleFieldChange('construtora', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Previsão Entrega</label>
                <input
                  type="text"
                  value={fields.previsaoEntrega || ''}
                  onChange={(e) => handleFieldChange('previsaoEntrega', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        );
      
      case 'imovel-usado':
        return (
          <div className="mt-4 border-t pt-3 border-gray-200">
            <h4 className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-2">Detalhes do Imóvel Usado</h4>
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
                <label className="text-xs text-gray-600 block mb-1">Idade</label>
                <input
                  type="text"
                  value={fields.idade || ''}
                  onChange={(e) => handleFieldChange('idade', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Reformado</label>
                <select
                  value={fields.reformado ? "sim" : "nao"}
                  onChange={(e) => handleFieldChange('reformado', e.target.value === "sim")}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                >
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 'imovel-comercial':
        return (
          <div className="mt-4 border-t pt-3 border-gray-200">
            <h4 className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-2">Detalhes do Imóvel Comercial</h4>
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
                <label className="text-xs text-gray-600 block mb-1">Valor Aluguel</label>
                <input
                  type="text"
                  value={fields.valorAluguel || ''}
                  onChange={(e) => handleFieldChange('valorAluguel', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Tipo</label>
                <select
                  value={fields.tipoComercial || 'Loja'}
                  onChange={(e) => handleFieldChange('tipoComercial', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                >
                  <option value="Loja">Loja</option>
                  <option value="Sala">Sala Comercial</option>
                  <option value="Galpão">Galpão</option>
                  <option value="Ponto">Ponto Comercial</option>
                </select>
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
            </div>
          </div>
        );
      
      case 'agendar-visita':
        return (
          <div className="mt-4 border-t pt-3 border-gray-200">
            <h4 className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-2">Detalhes da Visita</h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Imóvel</label>
                <input
                  type="text"
                  value={fields.imovel || ''}
                  onChange={(e) => handleFieldChange('imovel', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Data</label>
                <input
                  type="date"
                  value={fields.data || ''}
                  onChange={(e) => handleFieldChange('data', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Horário</label>
                <input
                  type="time"
                  value={fields.horario || ''}
                  onChange={(e) => handleFieldChange('horario', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Cliente</label>
                <input
                  type="text"
                  value={fields.nomeCliente || ''}
                  onChange={(e) => handleFieldChange('nomeCliente', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        );
      
      case 'agendar-reuniao':
        return (
          <div className="mt-4 border-t pt-3 border-gray-200">
            <h4 className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-2">Detalhes da Reunião</h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Assunto</label>
                <input
                  type="text"
                  value={fields.assunto || ''}
                  onChange={(e) => handleFieldChange('assunto', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Local</label>
                <select
                  value={fields.local || 'Escritório'}
                  onChange={(e) => handleFieldChange('local', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                >
                  <option value="Escritório">Escritório</option>
                  <option value="Imóvel">No Imóvel</option>
                  <option value="Virtual">Reunião Virtual</option>
                  <option value="Outro">Outro Local</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Data</label>
                <input
                  type="date"
                  value={fields.data || ''}
                  onChange={(e) => handleFieldChange('data', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Horário</label>
                <input
                  type="time"
                  value={fields.horario || ''}
                  onChange={(e) => handleFieldChange('horario', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
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
      case 'assistente':
        if (!fields) return null;
        return (
          <div className="mt-3 border-t pt-2 border-gray-200">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Detalhes do Assistente</p>
            <div className="flex flex-wrap gap-x-4">
              {fields.email && <p className="text-xs text-gray-700"><span className="font-semibold">Email:</span> {fields.email}</p>}
              {fields.telefone && <p className="text-xs text-gray-700"><span className="font-semibold">Telefone:</span> {fields.telefone}</p>}
            </div>
            {fields.diretrizes && (
              <div className="mt-2">
                <p className="text-xs text-gray-700"><span className="font-semibold">Diretrizes:</span></p>
                <p className="text-xs text-gray-700 mt-1 whitespace-pre-line">{fields.diretrizes}</p>
              </div>
            )}
          </div>
        );
      
      case 'imovel':
      case 'imovel-lancamento':
      case 'imovel-usado':
      case 'imovel-comercial':
        if (!fields) return null;
        return (
          <div className="mt-3 border-t pt-2 border-gray-200">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Detalhes do Imóvel</p>
            <div className="flex flex-wrap gap-x-4">
              {fields.endereco && <p className="text-xs text-gray-700"><span className="font-semibold">Endereço:</span> {fields.endereco}</p>}
              {fields.preco && <p className="text-xs text-gray-700"><span className="font-semibold">Preço:</span> {fields.preco}</p>}
              {fields.area && <p className="text-xs text-gray-700"><span className="font-semibold">Área:</span> {fields.area}m²</p>}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col ${cardTypeClasses[data.type]} rounded-md shadow-md overflow-hidden min-w-[220px] max-w-[300px]`}>
      {/* Card Header */}
      <div className={`flex items-center justify-between ${cardTypeHeaders[data.type]} px-3 py-1.5 text-xs font-medium`}>
        <span>{cardTypeLabels[data.type]}</span>
        <div className="flex space-x-1">
          {!isEditing && (
            <>
              <button
                onClick={handleEdit}
                className="text-xs p-0.5 rounded hover:bg-white/20"
                title="Editar"
              >
                <Edit size={12} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs p-0.5 rounded hover:bg-white/20"
                title="Excluir"
              >
                <Trash size={12} />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-3 flex-grow bg-white/50 backdrop-blur-sm">
        {isEditing ? (
          // Edit Mode
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-1 text-sm font-medium mb-1 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-1 text-xs text-gray-500 mb-2 border border-gray-300 rounded"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-1 text-sm mb-3 border border-gray-300 rounded"
              rows={3}
            />
            
            {renderTypeSpecificFields()}
            
            {/* Output Ports Section */}
            <div className="mt-4 border-t pt-3 border-gray-200">
              <h4 className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-2">Saídas</h4>
              
              {outputPorts.map((port, index) => (
                <div key={port.id} className="flex items-center mb-2">
                  <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs font-semibold mr-2">
                    {portLetters[index]}
                  </span>
                  <input
                    type="text"
                    value={port.label}
                    onChange={(e) => {
                      const updatedPorts = [...outputPorts];
                      updatedPorts[index].label = e.target.value;
                      setOutputPorts(updatedPorts);
                    }}
                    className="flex-grow p-1 text-sm border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => removeOutputPort(port.id)}
                    className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash size={12} />
                  </button>
                </div>
              ))}
              
              <div className="flex items-center mt-3">
                <input
                  type="text"
                  value={newPortLabel}
                  onChange={(e) => setNewPortLabel(e.target.value)}
                  placeholder="Nova saída..."
                  className="flex-grow p-1 text-sm border border-gray-300 rounded"
                />
                <button
                  onClick={addOutputPort}
                  className="ml-2 p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={!newPortLabel.trim()}
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Salvar
              </button>
            </div>
          </div>
        ) : (
          // View Mode
          <div>
            <h3 className="text-sm font-medium mb-1 line-clamp-2">{title}</h3>
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{description}</p>
            <p className="text-sm mb-2 overflow-hidden text-ellipsis line-clamp-3">{content}</p>
            
            {renderTypeSpecificDisplay()}
            
            {/* Show output ports in view mode */}
            {outputPorts && outputPorts.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {outputPorts.map((port, index) => (
                    <div key={port.id} className="flex items-center">
                      <span className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full text-[10px] font-semibold mr-1">
                        {portLetters[index]}
                      </span>
                      <span className="text-xs">{port.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-2 border-2 bg-white border-gray-400 rounded-sm"
      />
      
      {/* Output handles based on outputPorts */}
      {outputPorts && outputPorts.map((port, index) => (
        <Handle
          key={port.id}
          id={port.id}
          type="source"
          position={Position.Bottom}
          className="w-3 h-2 border-2 bg-white border-gray-400 rounded-sm"
          style={{
            left: `${(index + 1) * (100 / (outputPorts.length + 1))}%`,
            bottom: 0
          }}
        />
      ))}
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cartão? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default memo(FlowCardComponent);
