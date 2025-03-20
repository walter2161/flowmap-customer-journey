import React, { useState, useCallback, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { CardType, FlowCard, CardForm, AssistantProfile } from '@/utils/flowTypes';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Save, Upload, File, X, Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { useDropzone } from 'react-dropzone';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const cardTypeColors = {
  initial: '#32CD32',
  regular: '#424242',
  end: '#6200EA',
  imovel: '#FFA000',
  servico: '#9C27B0',
  produto: '#00BCD4',
  'multipla-escolha': '#FFEB3B',
  'pergunta-respostas': '#CDDC39',
  contatos: '#3F51B5',
  agendar: '#E91E63',
  'ordem-servico': '#009688',
  briefing: '#FF9800',
  acao: '#00C853',
  html: '#607D8B',
  'imovel-lancamento': '#EC407A',
  'imovel-usado': '#7E57C2',
  'imovel-comercial': '#29B6F6',
  'agendar-visita': '#D500F9',
  'agendar-reuniao': '#CDDC39',
  confirmacao: '#32CD32',
  documentacao: '#1E88E5',
  duvidas: '#FFEB3B',
  detalhes: '#9C27B0',
  orcamento: '#009688',
  carrinho: '#3F51B5',
  checkout: '#32CD32',
  pedido: '#FF9800',
  problema: '#FF4136',
  solucoes: '#CDDC39',
  chamado: '#E91E63',
  faq: '#607D8B',
  arquivo: '#1E88E5',
  profile: '#9C27B0'
};

interface FlowCardProps {
  id: string;
  data: FlowCard;
  selected: boolean;
  isConnectable: boolean;
  onNodeChange: (id: string, data: Partial<FlowCard>) => void;
  removeNode: (id: string) => void;
}

const FlowCardComponent: React.FC<FlowCardProps> = ({
  id,
  data,
  selected,
  isConnectable,
  onNodeChange,
  removeNode
}) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  const [content, setContent] = useState(data.content);
  const [fields, setFields] = useState(data.fields || {});
  const [isEditing, setIsEditing] = useState(false);
  const [outputCount, setOutputCount] = useState(data.outputPorts ? data.outputPorts.length : 1);
  const [files, setFiles] = useState<File[]>(data.files || []);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [profile, setProfile] = useState<AssistantProfile>(() => {
    try {
      const storedProfile = localStorage.getItem('assistantProfile');
      return storedProfile ? JSON.parse(storedProfile) : {
        name: 'Assistente IA',
        company: 'Sua Empresa',
        profession: 'Assistente Virtual'
      };
    } catch (error) {
      console.error("Error retrieving assistant profile from localStorage:", error);
      return {
        name: 'Assistente IA',
        company: 'Sua Empresa',
        profession: 'Assistente Virtual'
      };
    }
  });
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);
  const [isOutputPortsVisible, setIsOutputPortsVisible] = useState(true);
  
  useEffect(() => {
    setTitle(data.title);
    setDescription(data.description);
    setContent(data.content);
    setFields(data.fields || {});
    setFiles(data.files || []);
    setOutputCount(data.outputPorts ? data.outputPorts.length : 1);
  }, [data]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    switch (name) {
      case 'title':
        setTitle(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'content':
        setContent(value);
        break;
      default:
        setFields(prevFields => ({ ...prevFields, [name]: value }));
        break;
    }
  };
  
  const handleFieldChange = (fieldName: string, value: any) => {
    setFields(prevFields => ({ ...prevFields, [fieldName]: value }));
  };
  
  const handleSave = useCallback(() => {
    const updatedData: Partial<FlowCard> = {
      title,
      description,
      content,
      fields,
      outputPorts: Array.from({ length: outputCount }, (_, i) => `output-${i + 1}`),
      files
    };
    
    onNodeChange(id, updatedData);
    setIsEditing(false);
    
    toast({
      title: "Cartão atualizado",
      description: "As alterações foram salvas com sucesso!",
    });
  }, [id, title, description, content, fields, outputCount, files, onNodeChange, toast]);
  
  const handleDelete = useCallback(() => {
    removeNode(id);
    toast({
      title: "Cartão removido",
      description: "O cartão foi removido do fluxo.",
    });
  }, [id, removeNode, toast]);
  
  const handleAddOutput = useCallback(() => {
    setOutputCount(count => count + 1);
  }, []);
  
  const handleRemoveOutput = useCallback(() => {
    if (outputCount > 1) {
      setOutputCount(count => count - 1);
    }
  }, [outputCount]);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);
  
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  
  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
  };
  
  const handleSaveProfile = () => {
    if (profile) {
      localStorage.setItem('assistantProfile', JSON.stringify(profile));
      
      // Fix the CustomEvent creation by providing the required event name
      const event = new CustomEvent('profileUpdated', { 
        detail: profile 
      });
      window.dispatchEvent(event);
      
      setIsProfileEditorOpen(false);
    }
  };
  
  const cardColor = cardTypeColors[data.type] || '#777';
  
  return (
    <div className="flow-card-appear">
      <div
        className={`rounded-xl shadow-md transition-shadow duration-300 ease-in-out ${selected ? 'shadow-lg' : 'shadow-md'} bg-white border border-gray-200`}
        style={{ width: '300px', wordWrap: 'break-word' }}
      >
        <div className="flex justify-between items-center bg-gray-100 p-3 rounded-t-xl">
          <h6 className="text-sm font-semibold text-gray-800 truncate" title={title}>
            {title}
          </h6>
          <div>
            {isEditing ? (
              <Button variant="ghost" size="icon" onClick={handleSave} title="Salvar">
                <Save className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} title="Editar">
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleDelete} title="Remover">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          {isEditing ? (
            <>
              <div className="mb-2">
                <Label htmlFor="title" className="block text-xs font-medium text-gray-700">Título</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-2">
                <Label htmlFor="description" className="block text-xs font-medium text-gray-700">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-2">
                <Label htmlFor="content" className="block text-xs font-medium text-gray-700">Conteúdo</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={content}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              {data.type === 'multipla-escolha' && (
                <div className="mb-2">
                  <Label className="block text-xs font-medium text-gray-700">Opções de Escolha</Label>
                  {Object.keys(fields).map((key, index) => (
                    key.startsWith('option') && (
                      <div key={key} className="flex items-center mb-1">
                        <Input
                          type="text"
                          name={key}
                          value={fields[key] || ''}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mr-2"
                        />
                        <Button variant="ghost" size="icon" onClick={() => {
                          const newFields = { ...fields };
                          delete newFields[key];
                          setFields(newFields);
                        }} title="Remover Opção">
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    )
                  ))}
                  <Button variant="outline" size="sm" onClick={() => {
                    const newOptionKey = `option-${uuidv4()}`;
                    setFields(prevFields => ({ ...prevFields, [newOptionKey]: '' }));
                  }} className="mt-2 gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Opção
                  </Button>
                </div>
              )}
              {data.type === 'pergunta-respostas' && (
                <>
                  <div className="mb-2">
                    <Label htmlFor="question" className="block text-xs font-medium text-gray-700">Pergunta</Label>
                    <Input
                      type="text"
                      id="question"
                      name="question"
                      value={fields.question || ''}
                      onChange={(e) => handleFieldChange('question', e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-2">
                    <Label htmlFor="answer" className="block text-xs font-medium text-gray-700">Resposta</Label>
                    <Textarea
                      id="answer"
                      name="answer"
                      value={fields.answer || ''}
                      onChange={(e) => handleFieldChange('answer', e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </>
              )}
              {data.type === 'contatos' && (
                <>
                  <div className="mb-2">
                    <Label htmlFor="name" className="block text-xs font-medium text-gray-700">Nome</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={fields.name || ''}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-2">
                    <Label htmlFor="email" className="block text-xs font-medium text-gray-700">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={fields.email || ''}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-2">
                    <Label htmlFor="phone" className="block text-xs font-medium text-gray-700">Telefone</Label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={fields.phone || ''}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </>
              )}
              {data.type === 'agendar' && (
                <>
                  <div className="mb-2">
                    <Label htmlFor="date" className="block text-xs font-medium text-gray-700">Data</Label>
                    <Input
                      type="date"
                      id="date"
                      name="date"
                      value={fields.date || ''}
                      onChange={(e) => handleFieldChange('date', e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-2">
                    <Label htmlFor="time" className="block text-xs font-medium text-gray-700">Hora</Label>
                    <Input
                      type="time"
                      id="time"
                      name="time"
                      value={fields.time || ''}
                      onChange={(e) => handleFieldChange('time', e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </>
              )}
              {data.type === 'arquivo' && (
                <div>
                  <div {...getRootProps()} className="dropzone mb-2 p-4 border-2 border-dashed rounded-md border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 cursor-pointer">
                    <input {...getInputProps()} />
                    <p className="text-sm">Arraste e solte arquivos aqui, ou clique para selecionar arquivos</p>
                  </div>
                  <div>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
                        <div className="flex items-center">
                          <File className="h-4 w-4 mr-2" />
                          <span className="text-xs">{file.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(file)} title="Remover Arquivo">
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {description && <p className="text-gray-600 text-sm mb-2">{description}</p>}
              {content && <p className="text-gray-700 text-sm">{content}</p>}
              {data.type === 'multipla-escolha' && (
                <div>
                  {Object.keys(fields).map(key => (
                    key.startsWith('option') && fields[key] && (
                      <Badge key={key} className="mr-1 mt-1">{fields[key]}</Badge>
                    )
                  ))}
                </div>
              )}
              {data.type === 'pergunta-respostas' && (
                <>
                  {fields.question && <p className="text-gray-600 text-sm mb-1">Pergunta: {fields.question}</p>}
                  {fields.answer && <p className="text-gray-700 text-sm">Resposta: {fields.answer}</p>}
                </>
              )}
              {data.type === 'contatos' && (
                <>
                  {fields.name && <p className="text-gray-600 text-sm mb-1">Nome: {fields.name}</p>}
                  {fields.email && <p className="text-gray-600 text-sm mb-1">Email: {fields.email}</p>}
                  {fields.phone && <p className="text-gray-600 text-sm">Telefone: {fields.phone}</p>}
                </>
              )}
              {data.type === 'agendar' && (
                <>
                  {fields.date && <p className="text-gray-600 text-sm mb-1">Data: {fields.date}</p>}
                  {fields.time && <p className="text-gray-600 text-sm">Hora: {fields.time}</p>}
                </>
              )}
              {data.type === 'arquivo' && (
                <div>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center p-2 rounded-md bg-gray-100">
                      <File className="h-4 w-4 mr-2" />
                      <span className="text-xs">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="bg-gray-50 p-3 rounded-b-xl border-t border-gray-200">
          {isEditing ? (
            <>
              <Button variant="secondary" size="sm" onClick={handleSave} className="mr-2">
                Salvar
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
            </>
          ) : (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="xs" className="gap-2">
                      <Edit className="h-3 w-3" />
                      Editar Perfil
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Editar Perfil do Assistente</DialogTitle>
                      <DialogDescription>
                        Atualize as informações do seu assistente virtual.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Nome
                        </Label>
                        <Input id="name" value={profile.name} onChange={handleProfileChange} name="name" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="company" className="text-right">
                          Empresa
                        </Label>
                        <Input id="company" value={profile.company} onChange={handleProfileChange} name="company" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="profession" className="text-right">
                          Função
                        </Label>
                        <Input id="profession" value={profile.profession} onChange={handleProfileChange} name="profession" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" onClick={handleSaveProfile}>Salvar Perfil</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="xs" className="ml-2 gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings-2"><path d="M12 2v2"/><path d="M12 20v2"/><path d="m17 6.3-1.4 1.4"/><path d="m7 17.7-1.4 1.4"/><path d="m17 17.7 1.4 1.4"/><path d="m7 6.3 1.4 1.4"/><path d="M15 12h2.6a1 1 0 0 0 0-2H15"/><path d="M7 12H4.4a1 1 0 0 1 0 2H7"/><path d="M9 16a1 1 0 0 1 2 0v-4a1 1 0 0 1-2 0v4"/><circle cx="12" cy="12" r="3"/></svg>
                      Avançado
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Configurações Avançadas</DialogTitle>
                      <DialogDescription>
                        Personalize as configurações avançadas do seu cartão.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Mostrar Portas
                        </Label>
                        <Switch id="name" checked={isOutputPortsVisible} onCheckedChange={(checked) => setIsOutputPortsVisible(checked)} className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" onClick={() => setIsAdvancedSettingsOpen(false)}>Salvar Configurações</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {isOutputPortsVisible && (
                <div className="flex items-center">
                  {outputCount > 1 && (
                    <Button variant="ghost" size="icon" onClick={handleRemoveOutput} title="Remover Saída">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minus"><line x1="5" x2="19" y1="12" y2="12"/></svg>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={handleAddOutput} title="Adicionar Saída">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {isOutputPortsVisible && Array.from({ length: outputCount }, (_, i) => (
          <Handle
            key={`output-${i + 1}`}
            type="source"
            position={Position.Right}
            id={`output-${i + 1}`}
            isConnectable={isConnectable}
            style={{ backgroundColor: cardColor }}
            className="react-flow__handle"
          />
        ))}
      </div>
    </div>
  );
};

export default FlowCardComponent;
