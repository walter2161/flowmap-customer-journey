import React, { useState } from 'react';
import { CardType } from '@/utils/flowTypes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  'faq': 'FAQ'
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
  'faq': 'bg-gray-100 border-gray-500'
};

interface CardTypeSelectorProps {
  onSelect: (type: CardType, formData: any) => void;
  onClose: () => void;
}

const CardTypeSelector: React.FC<CardTypeSelectorProps> = ({ onSelect, onClose }) => {
  const [selectedType, setSelectedType] = useState<CardType>('regular');
  const [formData, setFormData] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(cardTypeLabels).map(([type, label]) => (
                <button
                  key={type}
                  className={`p-3 rounded-md text-sm font-medium border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${cardTypeColors[type as CardType]} ${selectedType === type ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                  onClick={() => setSelectedType(type as CardType)}
                >
                  {label}
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="form">
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
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endereco" className="text-right">
                      Endereço
                    </Label>
                    <Input id="endereco" value={formData.endereco || ''} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="preco" className="text-right">
                      Preço
                    </Label>
                    <Input id="preco" value={formData.preco || ''} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="area" className="text-right">
                      Área (m²)
                    </Label>
                    <Input id="area" value={formData.area || ''} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quartos" className="text-right">
                      Quartos
                    </Label>
                    <Input id="quartos" value={formData.quartos || ''} onChange={handleInputChange} className="col-span-3" />
                  </div>
                </>
              )}

              {selectedType === 'servico' && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nome" className="text-right">
                      Nome
                    </Label>
                    <Input id="nome" value={formData.nome || ''} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="preco" className="text-right">
                      Preço
                    </Label>
                    <Input id="preco" value={formData.preco || ''} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duracao" className="text-right">
                      Duração
                    </Label>
                    <Input id="duracao" value={formData.duracao || ''} onChange={handleInputChange} className="col-span-3" />
                  </div>
                </>
              )}

              {selectedType === 'produto' && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nome" className="text-right">
                      Nome
                    </Label>
                    <Input id="nome" value={formData.nome || ''} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="preco" className="text-right">
                      Preço
                    </Label>
                    <Input id="preco" value={formData.preco || ''} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="descricao" className="text-right">
                      Descrição
                    </Label>
                    <Textarea id="descricao" value={formData.descricao || ''} onChange={handleInputChange} className="col-span-3" />
                  </div>
                </>
              )}
            </div>
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
