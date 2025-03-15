
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { templateOptions, getTemplateData } from '@/utils/templateData';
import { FlowData } from '@/utils/flowTypes';

interface TemplateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplateId: string | null;
  setSelectedTemplateId: (id: string) => void;
  templatePreviewData: FlowData | null;
  setTemplatePreviewData: (data: FlowData | null) => void;
  onApplyTemplate: () => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onOpenChange,
  selectedTemplateId,
  setSelectedTemplateId,
  templatePreviewData,
  setTemplatePreviewData,
  onApplyTemplate
}) => {
  
  const handleTemplatePreview = (templateId: string) => {
    setSelectedTemplateId(templateId);
    // Get template data based on ID
    const templateData = getTemplateData(templateId);
    setTemplatePreviewData(templateData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Selecione um Template</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="gallery">Galeria</TabsTrigger>
            <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {templateOptions.map((template) => (
                <div 
                  key={template.id} 
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedTemplateId === template.id ? 'border-blue-500 bg-blue-50' : ''}`}
                  onClick={() => handleTemplatePreview(template.id)}
                >
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            {templatePreviewData ? (
              <div className="border rounded-lg p-4 h-[300px] overflow-y-auto">
                <h3 className="font-medium mb-2">Perfil do Assistente</h3>
                <p><strong>Nome:</strong> {templatePreviewData.profile?.name}</p>
                <p><strong>Profissão:</strong> {templatePreviewData.profile?.profession}</p>
                <p><strong>Empresa:</strong> {templatePreviewData.profile?.company}</p>
                
                <h3 className="font-medium mt-4 mb-2">Cartões ({templatePreviewData.cards.length})</h3>
                <ul className="space-y-2">
                  {templatePreviewData.cards.map(card => (
                    <li key={card.id} className="border-l-2 border-blue-500 pl-2">
                      <p><strong>{card.title}</strong></p>
                      <p className="text-sm text-gray-500">Tipo: {card.type}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500">
                Selecione um template para visualizar detalhes
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={onApplyTemplate}
            disabled={!templatePreviewData}
          >
            Aplicar Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateModal;
