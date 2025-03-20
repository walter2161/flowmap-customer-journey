
import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FlowData, FlowCard } from '@/utils/flowTypes';
import FlowCardComponent from './FlowCard';
import FlowConnector from './FlowConnector';
import CardTypeSelector from './CardTypeSelector';
import { nanoid } from 'nanoid';
import FlowControls, { FlowControlsProps } from './FlowControls';
import { useFlowData } from '@/hooks/useFlowData';
import { useFileSystem } from '@/hooks/useFileSystem';
import TemplateModal from './modals/TemplateModal';
import ImportModal from './modals/ImportModal';
import ScriptModal from './modals/ScriptModal';
import ExportModal from './modals/ExportModal';
import GoogleSheetsManager from './modals/GoogleSheetsManager';
import { useToast } from "@/components/ui/use-toast";

// Define node types
const nodeTypes = {
  flowCard: FlowCardComponent
};

// Define edge types
const edgeTypes = {
  flowConnector: FlowConnector
};

interface FlowEditorProps {
  initialData: FlowData;
}

const FlowEditor: React.FC<FlowEditorProps> = ({ initialData }) => {
  // Toast notification
  const { toast } = useToast();
  
  // Initialize flow data with custom hook
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
    currentProfile,
    saveFlow,
    prepareExportData,
    processImportedData,
    generateScript
  } = useFlowData(initialData);
  
  // Initialize file system operations with custom hook
  const {
    isExportFileSelected,
    selectedExportFile,
    exportFileName,
    setExportFileName,
    handleExportFileSelect,
    handleDirectDownload,
    handleUpdateExistingFile,
    handleFileUpload
  } = useFileSystem();
  
  // State for selected card type and showing card selector
  const [isCardSelectorOpen, setIsCardSelectorOpen] = useState(false);
  const [newCardPosition, setNewCardPosition] = useState({ x: 0, y: 0 });
  
  // State for template modal
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templatePreviewData, setTemplatePreviewData] = useState<FlowData | null>(null);
  
  // State for script modal
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [scriptContent, setScriptContent] = useState("");
  
  // State for import modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [jsonImportContent, setJsonImportContent] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  
  // State for export modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportJsonData, setExportJsonData] = useState("");
  
  // State for Google Sheets modal
  const [isGoogleSheetsModalOpen, setIsGoogleSheetsModalOpen] = useState(false);
  
  // ReactFlow instance ref
  const reactFlowInstance = useRef(null);
  
  // Zoom functions
  const zoomIn = useCallback(() => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.zoomIn();
    }
  }, []);
  
  const zoomOut = useCallback(() => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.zoomOut();
    }
  }, []);
  
  const onResetView = useCallback(() => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.fitView();
    }
  }, []);
  
  // Save flow handler
  const onSaveFlow = useCallback(() => {
    saveFlow();
  }, [saveFlow]);
  
  // Load flow function
  const onLoad = useCallback(() => {
    setIsImportModalOpen(true);
    setJsonImportContent("");
    setImportError(null);
  }, []);
  
  // Import handler
  const processImportedJson = useCallback(() => {
    try {
      setImportError(null);
      let jsonData: FlowData;
      
      try {
        jsonData = JSON.parse(jsonImportContent) as FlowData;
      } catch (e) {
        setImportError('JSON inválido. Verifique o formato e tente novamente.');
        return;
      }
      
      if (!jsonData.cards || !Array.isArray(jsonData.cards)) {
        setImportError('Formato de dados inválido. O JSON deve conter um array "cards".');
        return;
      }
      
      processImportedData(jsonData);
      setIsImportModalOpen(false);
      setJsonImportContent("");
      
      toast({
        title: "Fluxo importado",
        description: "Seu fluxo de atendimento foi importado com sucesso!",
      });
    } catch (error) {
      console.error('Error processing imported JSON:', error);
      setImportError('Erro ao processar o JSON. Verifique o formato e tente novamente.');
    }
  }, [jsonImportContent, processImportedData, toast]);
  
  // Handle file upload wrapper
  const handleFileUploadWrapper = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event, setJsonImportContent, setImportError);
  }, [handleFileUpload]);
  
  // Export flow function
  const onExportFlow = useCallback(() => {
    const flowData = prepareExportData();
    if (!flowData) {
      toast({
        title: "Sem conteúdo",
        description: "Adicione cartões ao fluxo antes de exportar.",
        variant: "destructive",
      });
      return;
    }
    
    // Format the JSON with indentation for better readability
    const formattedJsonData = JSON.stringify(flowData, null, 2);
    
    // Set the export data and open the modal
    setExportJsonData(formattedJsonData);
    setIsExportModalOpen(true);
  }, [prepareExportData, toast]);
  
  // Direct download wrapper
  const handleDirectDownloadWrapper = useCallback(() => {
    const success = handleDirectDownload(exportJsonData);
    if (success) {
      setIsExportModalOpen(false);
    }
  }, [handleDirectDownload, exportJsonData]);
  
  // Update existing file wrapper
  const handleUpdateExistingFileWrapper = useCallback(async () => {
    const success = await handleUpdateExistingFile(exportJsonData);
    if (success) {
      setIsExportModalOpen(false);
    }
  }, [handleUpdateExistingFile, exportJsonData]);
  
  // Generate script function
  const onGenerateScript = useCallback(() => {
    if (nodes.length === 0) {
      toast({
        title: "Sem conteúdo",
        description: "Adicione cartões ao fluxo antes de gerar o script.",
        variant: "destructive",
      });
      return;
    }
    
    const script = generateScript();
    if (script) {
      setScriptContent(script);
      setIsScriptModalOpen(true);
    }
  }, [nodes.length, generateScript, toast]);
  
  // Handle new card
  const handleNewCard = useCallback(() => {
    if (reactFlowInstance.current) {
      const position = reactFlowInstance.current.project({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });
      setNewCardPosition(position);
      setIsCardSelectorOpen(true);
    }
  }, []);
  
  // Handle card selection
  const handleCardSelect = useCallback((type, formData) => {
    const newCard: FlowCard = {
      id: `card-${nanoid(6)}`,
      type,
      title: formData.title || `New ${type} Card`,
      description: formData.description || '',
      content: formData.content || '',
      position: newCardPosition,
      fields: { ...formData },
      outputPorts: [],
      files: type === 'arquivo' ? [] : undefined
    };
    
    const newNode = {
      id: newCard.id,
      type: 'flowCard',
      position: newCard.position,
      data: newCard
    };
    
    setNodes(nodes => [...nodes, newNode]);
    setIsCardSelectorOpen(false);
  }, [newCardPosition, setNodes]);
  
  // Apply selected template 
  const applySelectedTemplate = useCallback(() => {
    if (!templatePreviewData) return;
    processImportedData(templatePreviewData);
    setIsTemplateModalOpen(false);
    
    toast({
      title: "Template aplicado",
      description: `O template foi aplicado com sucesso ao seu fluxo!`,
    });
  }, [templatePreviewData, processImportedData, toast]);
  
  // Abrir modal do Google Sheets
  const handleOpenGoogleSheets = useCallback(() => {
    setIsGoogleSheetsModalOpen(true);
  }, []);
  
  // Carregar flow do Google Sheets
  const handleLoadFlowFromSheets = useCallback((flowData: FlowData) => {
    processImportedData(flowData);
  }, [processImportedData]);

  // Criar props para FlowControls incluindo a nova função
  const flowControlsProps: FlowControlsProps = {
    onZoomIn,
    onZoomOut,
    onReset: onResetView,
    onSave: onSaveFlow,
    onLoad,
    onExport: onExportFlow,
    onScript: onGenerateScript,
    onTemplate: () => setIsTemplateModalOpen(true),
    onNewCard: handleNewCard,
    onGoogleSheets: handleOpenGoogleSheets,
    currentProfile
  };

  return (
    <ReactFlowProvider>
      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          attributionPosition="bottom-right"
          onInit={(instance) => { reactFlowInstance.current = instance; }}
        >
          <MiniMap />
          <Background gap={16} size={1} />
          
          <FlowControls {...flowControlsProps} />
        </ReactFlow>
        
        {isCardSelectorOpen && (
          <CardTypeSelector
            onSelect={handleCardSelect}
            onClose={() => setIsCardSelectorOpen(false)}
          />
        )}
        
        {/* Template Selection Modal */}
        <TemplateModal
          isOpen={isTemplateModalOpen}
          onOpenChange={setIsTemplateModalOpen}
          selectedTemplateId={selectedTemplateId}
          setSelectedTemplateId={setSelectedTemplateId}
          templatePreviewData={templatePreviewData}
          setTemplatePreviewData={setTemplatePreviewData}
          onApplyTemplate={applySelectedTemplate}
        />
        
        {/* Import Modal */}
        <ImportModal
          isOpen={isImportModalOpen}
          onOpenChange={setIsImportModalOpen}
          jsonImportContent={jsonImportContent}
          setJsonImportContent={setJsonImportContent}
          importError={importError}
          handleFileUpload={handleFileUploadWrapper}
          processImportedJson={processImportedJson}
        />
        
        {/* Script Modal */}
        <ScriptModal
          isOpen={isScriptModalOpen}
          onOpenChange={setIsScriptModalOpen}
          scriptContent={scriptContent}
          currentProfile={currentProfile}
        />
        
        {/* Export Modal */}
        <ExportModal
          isOpen={isExportModalOpen}
          onOpenChange={setIsExportModalOpen}
          exportFileName={exportFileName}
          setExportFileName={setExportFileName}
          exportJsonData={exportJsonData}
          isExportFileSelected={isExportFileSelected}
          selectedExportFile={selectedExportFile}
          handleExportFileSelect={handleExportFileSelect}
          handleDirectDownload={handleDirectDownloadWrapper}
          handleUpdateExistingFile={handleUpdateExistingFileWrapper}
        />
        
        {/* Google Sheets Modal */}
        <GoogleSheetsManager
          isOpen={isGoogleSheetsModalOpen}
          onOpenChange={setIsGoogleSheetsModalOpen}
          currentFlowData={prepareExportData() || initialData}
          onFlowLoad={handleLoadFlowFromSheets}
        />
      </div>
    </ReactFlowProvider>
  );
};

export default FlowEditor;
