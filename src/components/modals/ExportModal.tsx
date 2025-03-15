
import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogDescription } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle } from 'lucide-react';

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
  
  // Validate file name
  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Ensure the file has .json extension
    if (!value.endsWith('.json')) {
      if (value.includes('.')) {
        // Replace any existing extension with .json
        value = value.substring(0, value.lastIndexOf('.')) + '.json';
      } else {
        // Add .json if no extension exists
        value = value + '.json';
      }
    }
    setExportFileName(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Exportar Fluxo</DialogTitle>
          <DialogDescription>
            Escolha como deseja exportar seu fluxo de atendimento
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="download" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="download">Download</TabsTrigger>
            <TabsTrigger value="update">Atualizar Arquivo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="download" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="fileName" className="flex items-center gap-2">
                    Nome do arquivo
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <p className="text-sm">
                          O arquivo será salvo com a extensão .json automaticamente.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </Label>
                  <Input
                    id="fileName"
                    value={exportFileName}
                    onChange={handleFileNameChange}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2 flex items-center justify-between">
                  <span>Conteúdo do arquivo (prévia):</span>
                  <span className="text-xs text-muted-foreground">{exportJsonData.length} caracteres</span>
                </p>
                <div className="text-xs bg-gray-50 p-2 rounded max-h-[200px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap overflow-x-auto">
                    {exportJsonData}
                  </pre>
                </div>
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
            
            {isExportFileSelected && (
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2 flex items-center justify-between">
                  <span>Conteúdo que será salvo:</span>
                  <span className="text-xs text-muted-foreground">{exportJsonData.length} caracteres</span>
                </p>
                <div className="text-xs bg-gray-50 p-2 rounded max-h-[200px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap overflow-x-auto">
                    {exportJsonData}
                  </pre>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          
          {activeTab === "download" ? (
            <Button 
              onClick={handleDirectDownload}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Baixar Arquivo
            </Button>
          ) : (
            <Button
              onClick={handleUpdateExistingFile}
              disabled={!isExportFileSelected}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
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
