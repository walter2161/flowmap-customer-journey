
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
    // Create a blob with the JSON data
    const blob = new Blob([exportJsonData], { type: 'application/json' });
    
    // Create a data URL
    const url = URL.createObjectURL(blob);
    
    // Create and click a download link
    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.download = exportFileName;
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    
    // Clean up the URL
    URL.revokeObjectURL(url);
    
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
      // First try to use the File System Access API
      if ('showSaveFilePicker' in window) {
        try {
          // Create options with the original filename
          const options = {
            suggestedName: selectedExportFile.name,
            types: [{
              description: 'JSON Files',
              accept: {'application/json': ['.json']},
            }],
          };
          
          // Show the save file picker with the original filename
          const fileHandle = await window.showSaveFilePicker(options);
          const writable = await fileHandle.createWritable();
          await writable.write(exportJsonData);
          await writable.close();
          
          toast({
            title: "Arquivo atualizado",
            description: "O arquivo foi atualizado com sucesso!",
          });
          
          return true;
        } catch (err) {
          console.error('Error with File System Access API:', err);
          // If it's a security error or the API fails, fall back to regular download
          return handleDirectDownload(exportJsonData);
        }
      } else {
        // For browsers without File System Access API, use regular download
        // Create a blob with the new content
        const blob = new Blob([exportJsonData], { type: 'application/json' });
        
        // Create a download link with the original filename
        const url = URL.createObjectURL(blob);
        const linkElement = document.createElement('a');
        linkElement.href = url;
        linkElement.download = selectedExportFile.name;
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
        
        // Clean up
        URL.revokeObjectURL(url);
        
        toast({
          title: "Arquivo salvo",
          description: "O arquivo foi salvo com sucesso. Por favor, substitua o original manualmente.",
        });
        
        return true;
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
