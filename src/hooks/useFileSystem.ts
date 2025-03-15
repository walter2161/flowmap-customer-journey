
import { useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useFileSystem = () => {
  const { toast } = useToast();
  
  const [isExportFileSelected, setIsExportFileSelected] = useState(false);
  const [selectedExportFile, setSelectedExportFile] = useState<File | null>(null);
  const [exportFileName, setExportFileName] = useState("flow-data.json");
  
  // Handle export file selection
  const handleExportFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setIsExportFileSelected(false);
      setSelectedExportFile(null);
      return;
    }
    
    setSelectedExportFile(file);
    setIsExportFileSelected(true);
    setExportFileName(file.name);
  }, []);
  
  // Handle direct download export
  const handleDirectDownload = useCallback((exportJsonData: string) => {
    // Create a JSON file and download it
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(exportJsonData);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    toast({
      title: "Fluxo exportado",
      description: "Seu fluxo de atendimento foi exportado com sucesso!",
    });
    
    return true;
  }, [exportFileName, toast]);
  
  // Handle update existing file export
  const handleUpdateExistingFile = useCallback(async (exportJsonData: string) => {
    if (!selectedExportFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Selecione um arquivo para atualizar.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      // Create a new file with the same name
      const file = new File([exportJsonData], selectedExportFile.name, {
        type: 'application/json',
      });
      
      // Use the File System Access API if available
      if ('showSaveFilePicker' in window) {
        try {
          const options = {
            suggestedName: selectedExportFile.name,
            types: [{
              description: 'JSON Files',
              accept: {'application/json': ['.json']},
            }],
          };
          
          const fileHandle = await window.showSaveFilePicker(options);
          const writable = await fileHandle.createWritable();
          await writable.write(file);
          await writable.close();
          
          toast({
            title: "Arquivo atualizado",
            description: "O arquivo foi atualizado com sucesso!",
          });
          
          return true;
        } catch (err) {
          console.error('Error with File System Access API:', err);
          // Fall back to regular download if the File System API fails
          return handleDirectDownload(exportJsonData);
        }
      } else {
        // Fall back to regular download for browsers without File System Access API
        return handleDirectDownload(exportJsonData);
      }
    } catch (error) {
      console.error('Error exporting file:', error);
      toast({
        title: "Erro ao exportar",
        description: "Ocorreu um erro ao exportar o arquivo. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }, [selectedExportFile, handleDirectDownload, toast]);
  
  // Handle file upload for import
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>, setJsonImportContent: (content: string) => void, setImportError: (error: string | null) => void) => {
    setImportError(null);
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setJsonImportContent(content);
      } catch (error) {
        console.error('Error reading file:', error);
        setImportError('Erro ao ler o arquivo. Verifique se é um arquivo válido.');
      }
    };
    reader.readAsText(file);
  }, []);
  
  return {
    isExportFileSelected,
    selectedExportFile,
    exportFileName,
    setExportFileName,
    handleExportFileSelect,
    handleDirectDownload,
    handleUpdateExistingFile,
    handleFileUpload
  };
};
