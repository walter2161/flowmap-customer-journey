
import React, { useState } from 'react';
import { CardType } from '@/utils/flowTypes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building, Home, ShoppingBag, Calendar, Phone, FileText, MessageSquare, CheckCircle, FileQuestion, DollarSign, ShoppingCart, CreditCard, ClipboardList, AlertCircle, HelpCircle, File } from 'lucide-react';

// Define card categories
interface CardCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  types: CardType[];
}

// Define labels for card types
const cardTypeLabels: Record<CardType, string> = {
  initial: 'Início',
  regular: 'Regular',
  end: 'Fim',
  imovel: 'Imóvel',
  servico: 'Serviço',
  produto: 'Produto',
  'multipla-escolha': 'Múltipla Escolha',
  'pergunta-respostas': 'Perguntas e Respostas',
  contatos: 'Contatos',
  agendar: 'Agendar',
  'ordem-servico': 'Ordem de Serviço',
  briefing: 'Briefing',
  acao: 'Ação',
  html: 'HTML',
  'imovel-lancamento': 'Imóvel (Lançamento)',
  'imovel-usado': 'Imóvel (Usado)',
  'imovel-comercial': 'Imóvel (Comercial)',
  'agendar-visita': 'Agendar Visita',
  'agendar-reuniao': 'Agendar Reunião',
  'confirmacao': 'Confirmação',
  'documentacao': 'Documentação',
  'duvidas': 'Dúvidas',
  'detalhes': 'Detalhes',
  'orcamento': 'Orçamento',
  'carrinho': 'Carrinho',
  'checkout': 'Checkout',
  'pedido': 'Pedido',
  'problema': 'Problema',
  'solucoes': 'Soluções',
  'chamado': 'Chamado',
  'faq': 'FAQ',
  'arquivo': 'Arquivo'
};

// Define colors for card types
const cardTypeColors: Record<CardType, string> = {
  initial: 'bg-green-100 border-green-500',
  regular: 'bg-gray-100 border-gray-500',
  end: 'bg-red-100 border-red-500',
  imovel: 'bg-blue-100 border-blue-500',
  servico: 'bg-purple-100 border-purple-500',
  produto: 'bg-yellow-100 border-yellow-500',
  'multipla-escolha': 'bg-indigo-100 border-indigo-500',
  'pergunta-respostas': 'bg-teal-100 border-teal-500',
  contatos: 'bg-pink-100 border-pink-500',
  agendar: 'bg-orange-100 border-orange-500',
  'ordem-servico': 'bg-cyan-100 border-cyan-500',
  briefing: 'bg-lime-100 border-lime-500',
  acao: 'bg-amber-100 border-amber-500',
  html: 'bg-rose-100 border-rose-500',
  'imovel-lancamento': 'bg-sky-100 border-sky-500',
  'imovel-usado': 'bg-emerald-100 border-emerald-500',
  'imovel-comercial': 'bg-violet-100 border-violet-500',
  'agendar-visita': 'bg-fuchsia-100 border-fuchsia-500',
  'agendar-reuniao': 'bg-slate-100 border-slate-500',
  'confirmacao': 'bg-green-100 border-green-500',
  'documentacao': 'bg-blue-100 border-blue-500',
  'duvidas': 'bg-yellow-100 border-yellow-500',
  'detalhes': 'bg-purple-100 border-purple-500',
  'orcamento': 'bg-cyan-100 border-cyan-500',
  'carrinho': 'bg-indigo-100 border-indigo-500',
  'checkout': 'bg-emerald-100 border-emerald-500',
  'pedido': 'bg-amber-100 border-amber-500',
  'problema': 'bg-red-100 border-red-500',
  'solucoes': 'bg-teal-100 border-teal-500',
  'chamado': 'bg-orange-100 border-orange-500',
  'faq': 'bg-gray-100 border-gray-500',
  'arquivo': 'bg-blue-100 border-blue-500'
};

// Define card categories
const cardCategories: CardCategory[] = [
  {
    id: 'basic',
    label: 'Básicos',
    icon: <FileText size={16} />,
    types: ['initial', 'regular', 'end']
  },
  {
    id: 'real-estate',
    label: 'Imóveis',
    icon: <Building size={16} />,
    types: ['imovel', 'imovel-lancamento', 'imovel-usado', 'imovel-comercial']
  },
  {
    id: 'commerce',
    label: 'Comércio',
    icon: <ShoppingBag size={16} />,
    types: ['produto', 'servico', 'carrinho', 'checkout', 'pedido', 'orcamento']
  },
  {
    id: 'interaction',
    label: 'Interação',
    icon: <MessageSquare size={16} />,
    types: ['multipla-escolha', 'pergunta-respostas', 'briefing', 'contatos', 'duvidas', 'faq']
  },
  {
    id: 'scheduling',
    label: 'Agendamento',
    icon: <Calendar size={16} />,
    types: ['agendar', 'agendar-visita', 'agendar-reuniao']
  },
  {
    id: 'service',
    label: 'Serviços',
    icon: <ClipboardList size={16} />,
    types: ['ordem-servico', 'problema', 'solucoes', 'chamado']
  },
  {
    id: 'documentation',
    label: 'Documentação',
    icon: <FileText size={16} />,
    types: ['documentacao', 'detalhes', 'confirmacao', 'acao', 'html', 'arquivo']
  }
];

interface CardTypeSelectorProps {
  onSelect: (type: CardType, formData: any) => void;
  onClose: () => void;
}

const CardTypeSelector: React.FC<CardTypeSelectorProps> = ({ onSelect, onClose }) => {
  const [selectedType, setSelectedType] = useState<CardType>('regular');
  const [formData, setFormData] = useState<any>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
      
      // Process files for the formData
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
      
      Promise.all(filePromises).then((fileData) => {
        setFormData(prev => ({
          ...prev,
          files: [...(prev.files || []), ...fileData]
        }));
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    
    setFormData(prev => {
      const newFormFiles = [...(prev.files || [])];
      newFormFiles.splice(index, 1);
      return {
        ...prev,
        files: newFormFiles
      };
    });
  };

  const handleSelect = () => {
    onSelect(selectedType, formData);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Selecione o tipo de cartão</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="card-type" className="w-full mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="card-type">Tipo de Cartão</TabsTrigger>
            <TabsTrigger value="form">Formulário</TabsTrigger>
          </TabsList>

          <TabsContent value="card-type" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <Accordion type="single" collapsible className="w-full">
                {cardCategories.map((category) => (
                  <AccordionItem value={category.id} key={category.id}>
                    <AccordionTrigger className="flex items-center gap-2">
                      {category.icon}
                      <span>{category.label}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {category.types.map((type) => (
                          <button
                            key={type}
                            className={`p-3 rounded-md text-sm font-medium border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${cardTypeColors[type]} ${selectedType === type ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                            onClick={() => setSelectedType(type)}
                          >
                            {cardTypeLabels[type]}
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="form">
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Título
                  </Label>
                  <Input id="title" value={formData.title || ''} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Descrição
                  </Label>
                  <Textarea id="description" value={formData.description || ''} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content" className="text-right">
                    Conteúdo
                  </Label>
                  <Textarea id="content" value={formData.content || ''} onChange={handleInputChange} className="col-span-3" />
                </div>

                {selectedType === 'imovel' && (
                  <div className="grid grid-cols-1 gap-4 pt-3 border-t border-gray-200">
                    <h3 className="text-sm font-semibold">Tabela de Imóveis</h3>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="imovel_titulo" className="text-right">
                        Título da lista
                      </Label>
                      <Input id="imovel_titulo" value={formData.imovel_titulo || 'Imóveis disponíveis'} onChange={handleInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="imoveis" className="text-right">
                        Lista de imóveis
                      </Label>
                      <Textarea
                        id="imoveis"
                        value={formData.imoveis || ''}
                        onChange={handleInputChange}
                        placeholder="Ex: Apartamento, Rua A, 120m², 3 quartos, R$ 450.000\nCasa, Rua B, 200m², 4 quartos, R$ 650.000"
                        className="col-span-3 h-20"
                      />
                    </div>
                  </div>
                )}

                {selectedType === 'servico' && (
                  <div className="grid grid-cols-1 gap-4 pt-3 border-t border-gray-200">
                    <h3 className="text-sm font-semibold">Tabela de Serviços</h3>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="servico_titulo" className="text-right">
                        Título da lista
                      </Label>
                      <Input id="servico_titulo" value={formData.servico_titulo || 'Serviços oferecidos'} onChange={handleInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="servicos" className="text-right">
                        Lista de serviços
                      </Label>
                      <Textarea
                        id="servicos"
                        value={formData.servicos || ''}
                        onChange={handleInputChange}
                        placeholder="Ex: Corte de cabelo, 30min, R$ 50\nManicure, 45min, R$ 35"
                        className="col-span-3 h-20"
                      />
                    </div>
                  </div>
                )}

                {selectedType === 'produto' && (
                  <div className="grid grid-cols-1 gap-4 pt-3 border-t border-gray-200">
                    <h3 className="text-sm font-semibold">Tabela de Produtos</h3>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="produto_titulo" className="text-right">
                        Título da lista
                      </Label>
                      <Input id="produto_titulo" value={formData.produto_titulo || 'Produtos disponíveis'} onChange={handleInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="produtos" className="text-right">
                        Lista de produtos
                      </Label>
                      <Textarea
                        id="produtos"
                        value={formData.produtos || ''}
                        onChange={handleInputChange}
                        placeholder="Ex: Camisa, Azul, M, R$ 79,90\nCalça, Preta, 42, R$ 129,90"
                        className="col-span-3 h-20"
                      />
                    </div>
                  </div>
                )}

                {selectedType === 'arquivo' && (
                  <div className="grid grid-cols-1 gap-4 pt-3 border-t border-gray-200">
                    <h3 className="text-sm font-semibold">Arquivos</h3>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="arquivo_titulo" className="text-right">
                        Título dos arquivos
                      </Label>
                      <Input id="arquivo_titulo" value={formData.arquivo_titulo || 'Arquivos'} onChange={handleInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="files" className="text-right">
                        Selecionar arquivos
                      </Label>
                      <div className="col-span-3">
                        <Input id="files" type="file" multiple onChange={handleFileChange} className="col-span-3" />
                        {uploadedFiles.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                <div className="flex items-center">
                                  <File size={16} className="mr-2" />
                                  <span className="text-sm">{file.name}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRemoveFile(index)}
                                  className="text-red-500 h-6 w-6 p-0"
                                >
                                  ×
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {selectedType === 'agendar' && (
                  <div className="grid grid-cols-1 gap-4 pt-3 border-t border-gray-200">
                    <h3 className="text-sm font-semibold">Detalhes do Agendamento</h3>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="agenda_tipo" className="text-right">
                        Tipo de agendamento
                      </Label>
                      <Input id="agenda_tipo" value={formData.agenda_tipo || ''} onChange={handleInputChange} className="col-span-3" placeholder="Ex: Consulta, Reunião, etc." />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="agenda_duracao" className="text-right">
                        Duração
                      </Label>
                      <Input id="agenda_duracao" value={formData.agenda_duracao || ''} onChange={handleInputChange} className="col-span-3" placeholder="Ex: 1 hora, 30 minutos, etc." />
                    </div>
                  </div>
                )}

                {selectedType === 'contatos' && (
                  <div className="grid grid-cols-1 gap-4 pt-3 border-t border-gray-200">
                    <h3 className="text-sm font-semibold">Informações de Contato</h3>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="contato_telefone" className="text-right">
                        Telefone
                      </Label>
                      <Input id="contato_telefone" value={formData.contato_telefone || ''} onChange={handleInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="contato_email" className="text-right">
                        Email
                      </Label>
                      <Input id="contato_email" value={formData.contato_email || ''} onChange={handleInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="contato_endereco" className="text-right">
                        Endereço
                      </Label>
                      <Textarea id="contato_endereco" value={formData.contato_endereco || ''} onChange={handleInputChange} className="col-span-3" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSelect}>
            Selecionar Cartão
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CardTypeSelector;
