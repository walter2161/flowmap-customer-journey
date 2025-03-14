import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { FlowCard, OutputPort } from '@/utils/flowTypes';
import { Edit, Plus, Trash, List } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useReactFlow } from 'reactflow';

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
  html: 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-500',
  'imovel-lancamento': 'bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-500',
  'imovel-usado': 'bg-gradient-to-br from-violet-50 to-violet-100 border-2 border-violet-500',
  'imovel-comercial': 'bg-gradient-to-br from-sky-50 to-sky-100 border-2 border-sky-500',
  'agendar-visita': 'bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 border-2 border-fuchsia-500',
  'agendar-reuniao': 'bg-gradient-to-br from-lime-50 to-lime-100 border-2 border-lime-500'
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
  html: 'bg-gray-500 text-white',
  'imovel-lancamento': 'bg-pink-500 text-white',
  'imovel-usado': 'bg-violet-500 text-white',
  'imovel-comercial': 'bg-sky-500 text-white',
  'agendar-visita': 'bg-fuchsia-500 text-white',
  'agendar-reuniao': 'bg-lime-500 text-white'
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
  const [showPortsDialog, setShowPortsDialog] = useState(false);
  const [editingPorts, setEditingPorts] = useState<OutputPort[]>([]);
  
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

  // New functions for port editing dialog
  const openPortsDialog = () => {
    setEditingPorts([...outputPorts]);
    setShowPortsDialog(true);
  };

  const handleAddPortInDialog = () => {
    if (newPortLabel.trim() !== '') {
      const newPort: OutputPort = {
        id: `port-${nanoid(6)}`,
        label: newPortLabel.trim()
      };
      setEditingPorts([...editingPorts, newPort]);
      setNewPortLabel('');
    }
  };

  const handleRemovePortInDialog = (portId: string) => {
    setEditingPorts(editingPorts.filter(port => port.id !== portId));
  };

  const handleEditPortLabel = (portId: string, newLabel: string) => {
    setEditingPorts(editingPorts.map(port => 
      port.id === portId ? { ...port, label: newLabel } : port
    ));
  };

  const savePortChanges = () => {
    // Need to update data directly and also update outputPorts state
    data.outputPorts = [...editingPorts];
    setOutputPorts([...editingPorts]);
    setShowPortsDialog(false);
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
      
      case 'imovel-lancamento':
        if (!fields) return null;
        return (
          <div className="mt-3 border-t pt-2 border-gray-200">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Detalhes do Lançamento</p>
            {fields.endereco && <p className="text-xs text-gray-700"><span className="font-semibold">Endereço:</span> {fields.endereco}</p>}
            <div className="flex flex-wrap gap-x-4">
              {fields.preco && <p className="text-xs text-gray-700"><span className="font-semibold">Preço:</span> {fields.preco}</p>}
              {fields.area && <p className="text-xs text-gray-700"><span className="font-semibold">Área:</span> {fields.area}m²</p>}
              {fields.quartos && <p className="text-xs text-gray-700"><span className="font-semibold">Quartos:</span> {fields.quartos}</p>}
              {fields.construtora && <p className="text-xs text-gray-700"><span className="font-semibold">Construtora:</span> {fields.construtora}</p>}
              {fields.previsaoEntrega && <p className="text-xs text-gray-700"><span className="font-semibold">Entrega:</span> {fields.previsaoEntrega}</p>}
            </div>
          </div>
        );
      
      case 'imovel-usado':
        if (!fields) return null;
        return (
          <div className="mt-3 border-t pt-2 border-gray-200">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Detalhes do Imóvel Usado</p>
            {fields.endereco && <p className="text-xs text-gray-700"><span className="font-semibold">Endereço:</span> {fields.endereco}</p>}
            <div className="flex flex-wrap gap-x-4">
              {
