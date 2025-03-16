
import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  jsonImportContent: string;
  setJsonImportContent: (content: string) => void;
  importError: string | null;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  processImportedJson: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onOpenChange,
  jsonImportContent,
  setJsonImportContent,
  importError,
  handleFileUpload,
  processImportedJson
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Importar Fluxo</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="paste" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="paste">Colar JSON</TabsTrigger>
            <TabsTrigger value="upload">Carregar Arquivo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paste" className="space-y-4">
            <Alert className="bg-blue-50 text-blue-700 mb-4">
              <InfoIcon className="h-4 w-4 mr-2" />
              <AlertDescription>
                Certifique-se de que o JSON inclui a propriedade "position" para cada cartão, com valores "x" e "y" para garantir o posicionamento correto.
              </AlertDescription>
            </Alert>
            <Textarea
              placeholder="Cole o conteúdo JSON aqui..."
              value={jsonImportContent}
              onChange={(e) => setJsonImportContent(e.target.value)}
              className="h-[300px] font-mono text-sm"
            />
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <Alert className="bg-blue-50 text-blue-700 mb-4">
              <InfoIcon className="h-4 w-4 mr-2" />
              <AlertDescription>
                Os arquivos JSON importados devem incluir a propriedade "position" para cada cartão para preservar o layout.
              </AlertDescription>
            </Alert>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="mb-4">
                <p className="text-gray-600 mb-2">Selecione um arquivo JSON para importar</p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Escolher Arquivo
                </Button>
              </div>
              {jsonImportContent && (
                <div className="text-sm text-gray-500 truncate max-w-full">
                  Arquivo carregado com sucesso!
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {importError && (
          <div className="text-red-500 text-sm border border-red-200 bg-red-50 p-3 rounded">
            {importError}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={processImportedJson}
            disabled={!jsonImportContent}
          >
            Importar Fluxo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportModal;
