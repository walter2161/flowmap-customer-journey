import React, { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { FlowCard, OutputPort, AssistantProfile } from '@/utils/flowTypes';
import { Edit, Plus, Trash, Upload, Image, FileText, UserCircle } from 'lucide-react';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useReactFlow } from 'reactflow';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  'agendar-reuniao': 'bg-gradient-to-br from-lime-50 to-lime-100 border-2 border-lime-500',
  confirmacao: 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500',
  documentacao: 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500',
  duvidas: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-500',
  detalhes: 'bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-500',
  orcamento: 'bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-500',
  carrinho: 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-500',
  checkout: 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500',
  pedido: 'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-500',
  problema: 'bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-500',
  solucoes: 'bg-gradient-to-br from-lime-50 to-lime-100 border-2 border-lime-500',
  chamado: 'bg-gradient-to-br from-rose-50 to-rose-100 border-2 border-rose-500',
  faq: 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-500',
  arquivo: 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500',
  profile: 'bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-600'
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
  'agendar-reuniao': 'bg-lime-500 text-white',
  confirmacao: 'bg-green-500 text-white',
  documentacao: 'bg-blue-500 text-white',
  duvidas: 'bg-yellow-500 text-white',
  detalhes: 'bg-purple-500 text-white',
  orcamento: 'bg-teal-500 text-white',
  carrinho: 'bg-indigo-500 text-white',
  checkout: 'bg-green-500 text-white',
  pedido: 'bg-orange-500 text-white',
  problema: 'bg-red-500 text-white',
  solucoes: 'bg-lime-500 text-white',
  chamado: 'bg-rose-500 text-white',
  faq: 'bg-gray-500 text-white',
  arquivo: 'bg-blue-500 text-white',
  profile: 'bg-purple-600 text-white'
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
  'agendar-reuniao': 'AGENDAR REUNIÃO',
  confirmacao: 'CONFIRMAÇÃO',
  documentacao: 'DOCUMENTAÇÃO',
  duvidas: 'DÚVIDAS',
  detalhes: 'DETALHES',
  orcamento: 'ORÇAMENTO',
  carrinho: 'CARRINHO',
  checkout: 'CHECKOUT',
  pedido: 'PEDIDO',
  problema: 'PROBLEMA',
  solucoes: 'SOLUÇÕES',
  chamado: 'CHAMADO',
  faq: 'FAQ',
  arquivo: 'ARQUIVO',
  profile: 'PERFIL DO ASSISTENTE'
};

// Array de letras para identifcar as portas
const portLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// Default profile (if needed)
const defaultProfile: AssistantProfile = {
  name: "Assistente Virtual",
  profession: "Atendente",
  company: "Minha Empresa",
  contacts: "assistente@empresa.com",
  avatar: "",
  guidelines: "Este assistente deve ser cordial e respeitoso. Deve fornecer informações precisas e úteis. Não deve usar linguagem inapropriada ou compartilhar informações sensíveis.",
  scriptGuidelines: [
    "Sempre entender a intenção do cliente antes de responder, adaptando o fluxo conforme necessário.",
    "Navegar entre os cartões de maneira lógica, seguindo as conexões definidas no fluxo."
  ]
};

interface FlowCardProps {
  data: FlowCard;
  selected: boolean;
}

const FlowCardComponent: React.FC<FlowCardProps> = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  const [content, setContent] = useState(data.content);
  const [fields, setFields] = useState(data.fields || {});
  const [outputPorts, setOutputPorts] = useState<OutputPort[]>(data.outputPorts || []);
  const [newPortLabel, setNewPortLabel] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [files, setFiles] = useState<any[]>(data.files || []);
  const [profile, setProfile] = useState<AssistantProfile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newGuideline, setNewGuideline] = useState("");
  
  const { getNodes, setNodes, getEdges, setEdges } = useReactFlow();

  // Load profile data when component mounts
  useEffect(() => {
    // For profile card type, try to load from localStorage
    if (data.type === 'profile') {
      const savedProfile = localStorage.getItem('assistantProfile');
      const profileData = savedProfile ? JSON.parse(savedProfile) : defaultProfile;
      
      setProfile(profileData);
      
      // Ensure the profile has scriptGuidelines
      if (!profileData.scriptGuidelines) {
        setProfile(prev => ({
          ...prev!,
          scriptGuidelines: defaultProfile.scriptGuidelines
        }));
      }
    }
  }, [data.type]);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = (e: CustomEvent) => {
      if (data.type === 'profile') {
        setProfile(e.detail);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
    };
  }, [data.type]);

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
    data.files = files;
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setTitle(data.title);
    setDescription(data.description);
    setContent(data.content);
    setFields(data.fields || {});
    setOutputPorts(data.outputPorts || []);
    setFiles(data.files || []);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Process files
      const filePromises = newFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: file.name,
              type: file.type,
              content: file.type.startsWith('image/') ? null : event.target?.result as string,
              url: file.type.startsWith('image/') ? event.target?.result as string : null
            });
          };
          
          if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
          } else {
            reader.readAsText(file);
          }
        });
      });
      
      Promise.all(filePromises).then((fileData: any) => {
        setFiles([...files, ...fileData]);
      });
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
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

  // Profile specific methods
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;
    
    // Only accept image files
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas imagens.');
      return;
    }
    
    // Resize and convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Maintain aspect ratio
        if (width > height) {
          if (width > 350) {
            height = height * (350 / width);
            width = 350;
          }
        } else {
          if (height > 350) {
            width = width * (350 / height);
            height = 350;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setProfile({...profile, avatar: dataUrl});
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSaveProfile = () => {
    if (profile) {
      localStorage.setItem('assistantProfile', JSON.stringify(profile));
      
      // Dispatch custom event to notify other components
      const event = new CustomEvent('profileUpdated', { detail: profile });
      window.dispatchEvent(event);
      
      setIsProfileEditorOpen(false);
    }
  };
  
  // Add a new script guideline
  const addScriptGuideline = () => {
    if (!profile || newGuideline.trim() === "") return;
    
    setProfile({
      ...profile,
      scriptGuidelines: [...(profile.scriptGuidelines || []), newGuideline.trim()]
    });
    
    setNewGuideline("");
  };
  
  // Remove a script guideline
  const removeScriptGuideline = (index: number) => {
    if (!profile) return;
    
    const updatedGuidelines = [...(profile.scriptGuidelines || [])];
    updatedGuidelines.splice(index, 1);
    
    setProfile({
      ...profile,
      scriptGuidelines: updatedGuidelines
    });
  };
  
  // Update a script guideline
  const updateScriptGuideline = (index: number, value: string) => {
    if (!profile) return;
    
    const updatedGuidelines = [...(profile.scriptGuidelines || [])];
    updatedGuidelines[index] = value;
    
    setProfile({
      ...profile,
      scriptGuidelines: updatedGuidelines
    });
  };

  const renderTypeSpecificFields = () => {
    if (!isEditing) return null;

    switch (data.type) {
      case 'imovel':
        return (
          <div className="mt-4 border-t pt-3 border-gray-200">
            <h4 className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-2">Tabela de Imóveis</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Título da lista</label>
                <input
                  type="text"
                  value={fields.imovel_titulo || 'Imóveis disponíveis'}
                  onChange={(e) => handleFieldChange('imovel_titulo', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Lista de imóveis (um por linha)</label>
                <textarea
                  value={fields.imoveis || ''}
                  onChange={(e) => handleFieldChange('imoveis', e.target.value)}
                  placeholder="Ex: Apartamento, Rua A, 120m², 3 quartos, R$ 450.000&#10;Casa, Rua B, 200m², 4 quartos, R$ 650.000"
                  className="w-full p-1 text-sm border border-gray-300 rounded h-20"
                  rows={4}
                />
              </div>
            </div>
          </div>
        );
      
      case 'servico':
        return (
          <div className="mt-4 border-t pt-3 border-gray-200">
            <h4 className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-2">Tabela de Serviços</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Título da lista</label>
                <input
                  type="text"
                  value={fields.servico_titulo || 'Serviços oferecidos'}
                  onChange={(e) => handleFieldChange('servico_titulo', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Lista de serviços (um por linha)</label>
                <textarea
                  value={fields.servicos || ''}
                  onChange={(e) => handleFieldChange('servicos', e.target.value)}
                  placeholder="Ex: Corte de cabelo, 30min, R$ 50&#10;Manicure, 45min, R$ 35"
                  className="w-full p-1 text-sm border border-gray-300 rounded h-20"
                  rows={4}
                />
              </div>
            </div>
          </div>
        );
      
      case 'produto':
        return (
          <div className="mt-4 border-t pt-3 border-gray-200">
            <h4 className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-2">Tabela de Produtos</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Título da lista</label>
                <input
                  type="text"
                  value={fields.produto_titulo || 'Produtos disponíveis'}
                  onChange={(e) => handleFieldChange('produto_titulo', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Lista de produtos (um por linha)</label>
                <textarea
                  value={fields.produtos || ''}
                  onChange={(e) => handleFieldChange('produtos', e.target.value)}
                  placeholder="Ex: Camisa, Azul, M, R$ 79,90&#10;Calça, Preta, 42, R$ 129,90"
                  className="w-full p-1 text-sm border border-gray-300 rounded h-20"
                  rows={4}
                />
              </div>
            </div>
          </div>
        );
      
      case 'arquivo':
        return (
          <div className="mt-4 border-t pt-3 border-gray-200">
            <h4 className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-2">Arquivos</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Título da seção</label>
                <input
                  type="text"
                  value={fields.arquivo_titulo || 'Arquivos'}
                  onChange={(e) => handleFieldChange('arquivo_titulo', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Adicionar arquivos</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              {files.length > 0 && (
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                      <div className="flex items-center text-xs">
                        {file.type.startsWith('image/') ? (
                          <Image size={12} className="mr-2" />
                        ) : (
                          <FileText size={12} className="mr-2" />
                        )}
                        <span>{file.name}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-red-500 p-1 rounded hover:bg-red-50"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'contatos':
        return (
          <div className="mt-4 border-t pt-3 border-gray-200">
            <h4 className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-2">Informações de Contato</h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Telefone</label>
                <input
                  type="text"
                  value={fields.contato_telefone || ''}
                  onChange={(e) => handleFieldChange('contato_telefone', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Email</label>
                <input
                  type="email"
                  value={fields.contato_email || ''}
                  onChange={(e) => handleFieldChange('contato_email', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-600 block mb-1">Endereço</label>
                <textarea
                  value={fields.contato_endereco || ''}
                  onChange={(e) => handleFieldChange('contato_endereco', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                  rows={2}
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-600 block mb-1">Horário de atendimento</label>
                <input
                  type="text"
                  value={fields.contato_horario || ''}
                  onChange={(e) => handleFieldChange('contato_horario', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                  placeholder="Ex: Seg-Sex: 9h às 18h"
                />
              </div>
            </div>
          </div>
        );
      
      case 'agendar':
        return (
          <div className="mt-4 border-t pt-3 border-gray-200">
            <h4 className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-2">Detalhes do Agendamento</h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Tipo</label>
                <input
                  type="text"
                  value={fields.agenda_tipo || ''}
                  onChange={(e) => handleFieldChange('agenda_tipo', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                  placeholder="Ex: Consulta, Reunião"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Duração</label>
                <input
                  type="text"
                  value={fields.agenda_duracao || ''}
                  onChange={(e) => handleFieldChange('agenda_duracao', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                  placeholder="Ex: 1 hora"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Horários disponíveis</label>
                <textarea
                  value={fields.agenda_horarios || ''}
                  onChange={(e) => handleFieldChange('agenda_horarios', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                  rows={2}
                  placeholder="Ex: Segunda: 9h, 10h, 14h..."
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Preço</label>
                <input
                  type="text"
                  value={fields.agenda_preco || ''}
                  onChange={(e) => handleFieldChange('agenda_preco', e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                  placeholder="Ex: R$ 100,00"
                />
              </div>
            </div>
          </div>
        );
      
      // Add cases for other card types as needed
      default:
        // For other card types, we just use the standard fields
        return null;
    }
  };

  const renderTypeSpecificDisplay = () => {
    if (isEditing) return null;

    switch (data.type) {
      case 'profile':
        return (
          <div className="mt-3 border-t pt-2 border-gray-200">
            {profile && (
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 border-2 border-primary/30 mb-3">
                  {profile.avatar ? (
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <p className="text-sm font-medium">{profile.name}</p>
                <p className="text-xs text-gray-500">{profile.profession}</p>
                <p className="text-xs text-gray-500">{profile.company}</p>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => setIsProfileEditorOpen(true)}
                >
                  Editar Perfil
                </Button>
              </div>
            )}
          </div>
        );
      
      case 'imovel':
        if (!fields) return null;
        return (
          <div className="mt-3 border-t pt-2 border-gray-200">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-1">{fields.imovel_titulo || 'Imóveis disponíveis'}</p>
            {fields.imoveis ? (
              <ScrollArea className="h-[120px]">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Descrição</TableHead>
                      <TableHead className="text-xs">Localização</TableHead>
                      <TableHead className="text-xs">Área</TableHead>
                      <TableHead className="text-xs">Preço</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.imoveis.split('\n').filter(Boolean).map((line: string, idx: number) => {
                      const parts = line.split(',').map(p => p.trim());
                      return (
                        <TableRow key={idx}>
                          <TableCell className="text-xs py-1">{parts[0] || '-'}</TableCell>
                          <TableCell className="text-xs py-1">{parts[1] || '-'}</TableCell>
                          <TableCell className="text-xs py-1">{parts[2] || '-'}</TableCell>
                          <TableCell className="text-xs py-1">{parts[3] || '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <p className="text-xs text-gray-500 italic">Nenhum imóvel adicionado</p>
            )}
          </div>
        );
      
      case 'servico':
        if (!fields) return null;
        return (
          <div className="mt-3 border-t pt-2 border-gray-200">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-1">{fields.servico_titulo || 'Serviços oferecidos'}</p>
            {fields.servicos ? (
              <ScrollArea className="h-[120px]">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Serviço</TableHead>
                      <TableHead className="text-xs">Duração</TableHead>
                      <TableHead className="text-xs">Preço</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.servicos.split('\n').filter(Boolean).map((line: string, idx: number) => {
                      const parts = line.split(',').map(p => p.trim());
                      return (
                        <TableRow key={idx}>
                          <TableCell className="text-xs py-1">{parts[0] || '-'}</TableCell>
                          <TableCell className="text-xs py-1">{parts[1] || '-'}</TableCell>
                          <TableCell className="text-xs py-1">{parts[2] || '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <p className="text-xs text-gray-500 italic">Nenhum serviço adicionado</p>
            )}
          </div>
        );
      
      case 'produto':
        if (!fields) return null;
        return (
          <div className="mt-3 border-t pt-2 border-gray-200">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-1">{fields.produto_titulo || 'Produtos disponíveis'}</p>
            {fields.produtos ? (
              <ScrollArea className="h-[120px]">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Produto</TableHead>
                      <TableHead className="text-xs">Variação</TableHead>
                      <TableHead className="text-xs">Tamanho</TableHead>
                      <TableHead className="text-xs">Preço</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.produtos.split('\n').filter(Boolean).map((line: string, idx: number) => {
                      const parts = line.split(',').map(p => p.trim());
                      return (
                        <TableRow key={idx}>
                          <TableCell className="text-xs py-1">{parts[0] || '-'}</TableCell>
                          <TableCell className="text-xs py-1">{parts[1] || '-'}</TableCell>
                          <TableCell className="text-xs py-1">{parts[2] || '-'}</TableCell>
                          <TableCell className="text-xs py-1">{parts[3] || '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <p className="text-xs text-gray-500 italic">Nenhum produto adicionado</p>
            )}
          </div>
        );
      
      case 'arquivo':
        if (!files || files.length === 0) return null;
        return (
          <div className="mt-3 border-t pt-2 border-gray-200">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-1">{fields.arquivo_titulo || 'Arquivos'}</p>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {files.map((file, idx) => (
                  <div key={idx} className="p-1 rounded bg-gray-50">
                    <div className="flex items-center mb-1">
                      {file.type.startsWith('image/') ? (
                        <div className="flex items-center">
                          <Image size={12} className="mr-2 text-blue-500" />
                          <span className="text-xs">{file.name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <FileText size={12} className="mr-2 text-green-500" />
                          <span className="text-xs">{file.name}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Display file content based on type */}
                    {file.type.startsWith('image/') ? (
                      <div className="mt-1 border border-gray-200 rounded overflow-hidden">
                        <img 
                          src={file.url} 
                          alt={file.name} 
                          className="max-w-full h-auto max-h-[150px] object-contain mx-auto"
                        />
                      </div>
                    ) : (
                      <div className="mt-1 p-2 bg-white border border-gray-200 rounded">
                        <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-[150px]">
                          {file.content}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        );
      
      case 'contatos':
        if (!fields) return null;
        return (
          <div className="mt-3 border-t pt-2 border-gray-200">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-1">Informações de Contato</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
              {fields.contato_telefone && (
                <div className="col-span-1">
                  <span className="font-semibold">Telefone: </span>
                  {fields.contato_telefone}
                </div>
              )}
              {fields.contato_email && (
                <div className="col-span-1">
                  <span className="font-semibold">Email: </span>
                  {fields.contato_email}
                </div>
              )}
              {fields.contato_endereco && (
                <div className="col-span-2">
                  <span className="font-semibold">Endereço: </span>
                  {fields.contato_endereco}
                </div>
              )}
              {fields.contato_horario && (
                <div className="col-span-2">
                  <span className="font-semibold">Horário: </span>
                  {fields.contato_horario}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'agendar':
        if (!fields) return null;
        return (
          <div className="mt-3 border-t pt-2 border-gray-200">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-1">Detalhes do Agendamento</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
              {fields.agenda_tipo && (
                <div className="col-span-1">
                  <span className="font-semibold">Tipo: </span>
                  {fields.agenda_tipo}
                </div>
              )}
              {fields.agenda_duracao && (
                <div className="col-span-1">
                  <span className="font-semibold">Duração: </span>
                  {fields.agenda_duracao}
                </div>
              )}
              {fields.agenda_horarios && (
                <div className="col-span-2">
                  <span className="font-semibold">Horários: </span>
                  {fields.agenda_horarios}
                </div>
              )}
              {fields.agenda_preco && (
                <div className="col-span-1">
                  <span className="font-semibold">Preço: </span>
                  {fields.agenda_preco}
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      className={`rounded-md shadow-md overflow-hidden ${cardTypeClasses[data.type]} ${selected ? 'ring-2 ring-black ring-opacity-50' : ''}`}
      style={{ width: '350px' }} // Set standard width for all cards
    >
      {/* Input source handle */}
      {data.type !== 'initial' && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: '#555', width: 10, height: 10 }}
          id="in"
        />
      )}
      
      {/* Header */}
      <div className={`px-3 py-1 ${cardTypeHeaders[data.type]} flex justify-between items-center`}>
        <div className="text-xs font-semibold">{cardTypeLabels[data.type]}</div>
        <div className="flex gap-1">
          {!isEditing && data.type !== 'profile' && (
            <button
              onClick={handleEdit}
              className="text-white p-1 rounded hover:bg-white hover:bg-opacity-20"
            >
              <Edit size={12} />
            </button>
          )}
        </div>
      </div>
      
      {/* Card Content */}
      <div className="bg-white p-3">
        {isEditing ? (
          // Edit mode
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-1 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Descrição</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-1 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Conteúdo</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-1 text-sm border border-gray-300 rounded"
                rows={3}
              />
            </div>
            
            {/* Type-specific fields */}
            {renderTypeSpecificFields()}

            {/* Output port management - only show for non-end cards */}
            {data.type !== 'end' && (
              <div className="mt-4 border-t pt-3 border-gray-200">
                <h4 className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-2">Portas de Saída</h4>
                
                {outputPorts.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {outputPorts.map((port, index) => (
                      <div key={port.id} className="flex items-center justify-between">
                        <span className="text-xs text-gray-700 flex items-center">
                          <span className="inline-flex items-center justify-center bg-blue-500 text-white rounded-full w-5 h-5 text-xs mr-2">
                            {index < portLetters.length ? portLetters[index] : '#'}
                          </span>
                          {port.label}
                        </span>
                        <button
                          onClick={() => removeOutputPort(port.id)}
                          className="text-red-500 p-1 rounded hover:bg-red-50"
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newPortLabel}
                    onChange={(e) => setNewPortLabel(e.target.value)}
                    placeholder="Adicionar porta..."
                    className="flex-1 p-1 text-sm border border-gray-300 rounded"
                  />
                  <button
                    onClick={addOutputPort}
                    className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                    disabled={newPortLabel.trim() === ''}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex justify-between mt-4">
              {/* Delete button */}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
              >
                <Trash size={12} />
                Excluir
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-2 py-1 text-xs bg-gray-100 rounded border border-gray-300 hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        ) : (
          // View mode
          <div>
            <h3 className="font-medium text-sm">{title}</h3>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
            {content && <p className="text-xs text-gray-700 mt-2">{content}</p>}
            
            {/* Display type-specific fields */}
            {renderTypeSpecificDisplay()}
            
            {/* Display output ports with connection points at the end of each row */}
            {data.type !== 'end' && outputPorts.length > 0 && (
              <div className="mt-3 border-t pt-2 border-gray-200">
                <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Portas de Saída</p>
                <div className="flex flex-col gap-2 mt-1">
                  {outputPorts.map((port, index) => (
                    <div key={port.id} className="flex items-center justify-between relative">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded flex-1">{port.label}</span>
                      {/* Connection point at the end of each row */}
                      <Handle
                        type="source"
                        position={Position.Right}
                        id={port.id}
                        style={{
                          position: 'absolute',
                          right: '-10px',
                          width: '10px',
                          height: '10px',
                          background: '#3B82F6',
                          borderRadius: '50%',
                          border: '2px solid white'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profile Editor Dialog */}
      {data.type === 'profile' && profile && (
        <>
          <Dialog open={isProfileEditorOpen} onOpenChange={setIsProfileEditorOpen}>
            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Perfil do Assistente</DialogTitle>
                <DialogDescription>
                  Configure as informações e diretrizes do seu assistente virtual
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="flex flex-col items-center mb-4">
                  <div 
                    className="relative cursor-pointer group" 
                    onClick={handleAvatarClick}
                  >
                    <Avatar className="h-24 w-24 border-2 border-primary/30">
                      {profile.avatar ? (
                        <AvatarImage src={profile.avatar} alt={profile.name} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary text-xl">
                          {getInitials(profile.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity">
                      Editar
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                  <p className="text-xs mt-2 text-muted-foreground">
                    Clique para alterar (máx. 350px)
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    id="name" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="profession">Profissão</Label>
                  <Input 
                    id="profession" 
                    value={profile.profession}
                    onChange={(e) => setProfile({...profile, profession: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="company">Empresa</Label>
                  <Input 
                    id="company" 
                    value={profile.company}
                    onChange={(e) => setProfile({...profile, company: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="contacts">Contatos</Label>
                  <Input 
                    id="contacts" 
                    value={profile.contacts}
                    onChange={(e) => setProfile({...profile, contacts: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="guidelines">Diretrizes Gerais</Label>
                  <Textarea 
                    id="guidelines" 
                    value={profile.guidelines}
                    onChange={(e) => setProfile({...profile, guidelines: e.target.value})}
                    className="h-32"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Diretrizes de Interpretação do Fluxo</Label>
                  
                  {(profile.scriptGuidelines || []).map((guideline, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <Textarea 
                        value={guideline}
                        onChange={(e) => updateScriptGuideline(index, e.target.value)}
                        className="flex-1 min-h-[60px]"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => removeScriptGuideline(index)}
                        className="mt-2"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2 items-start">
                    <Textarea 
                      value={newGuideline}
                      onChange={(e) => setNewGuideline(e.target.value)}
                      placeholder="Adicione uma nova diretriz..."
                      className="flex-1 min-h-[60px]"
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={addScriptGuideline}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsProfileEditorOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveProfile}>Salvar Perfil</Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Cartão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cartão? Esta ação não pode ser desfeita e todas as conexões associadas também serão removidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default memo(FlowCardComponent);
