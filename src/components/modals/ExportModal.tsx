
import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExportModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  exportFileName: string;
  setExportFileName: (name: string) => void;
  exportJsonData: string;
  isExportFileSelected: boolean;
  selectedExportFile: File | null;
  handleExportFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDirectDownload: () => void;
  handleUpdateExistingFile: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onOpenChange,
  exportFileName,
  setExportFileName,
  exportJsonData,
  isExportFileSelected,
  selectedExportFile,
  handleExportFileSelect,
  handleDirectDownload,
  handleUpdateExistingFile
}) => {
  const exportFileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = React.useState<string>("download");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Exportar Fluxo</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="download" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="download">Download</TabsTrigger>
            <TabsTrigger value="update">Atualizar Arquivo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="download" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="fileName">Nome do arquivo</Label>
                <Input
                  id="fileName"
                  value={exportFileName}
                  onChange={(e) => setExportFileName(e.target.value)}
                />
              </div>
              
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Conteúdo do arquivo:</p>
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto max-h-[200px] overflow-y-auto">
                  {exportJsonData.substring(0, 500)}
                  {exportJsonData.length > 500 ? '...' : ''}
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="update" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Input
                ref={exportFileInputRef}
                type="file"
                accept=".json"
                onChange={handleExportFileSelect}
                className="hidden"
              />
              <div className="mb-4">
                <p className="text-gray-600 mb-2">Selecione um arquivo JSON existente para atualizar</p>
                <Button
                  variant="outline"
                  onClick={() => exportFileInputRef.current?.click()}
                >
                  Escolher Arquivo
                </Button>
              </div>
              {isExportFileSelected && (
                <div className="text-sm text-gray-500 truncate max-w-full">
                  Arquivo selecionado: {selectedExportFile?.name}
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded-lg">
              <p>Ao atualizar um arquivo existente, seu conteúdo será substituído pelo fluxo atual.</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          
          {activeTab === "download" ? (
            <Button onClick={handleDirectDownload}>
              Baixar Arquivo
            </Button>
          ) : (
            <Button
              onClick={handleUpdateExistingFile}
              disabled={!isExportFileSelected}
            >
              Atualizar Arquivo
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
