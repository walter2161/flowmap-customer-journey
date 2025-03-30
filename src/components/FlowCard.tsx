
import React, { useCallback, useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Plus, Upload, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from 'uuid';
import { AssistantProfile } from '@/utils/flowTypes';

// Define the FlowCardProps interface
interface FlowCardProps {
  id: string;
  data: any;
}

const FlowCard: React.FC<FlowCardProps> = ({ id, data }) => {
  const { toast } = useToast()
  const [title, setTitle] = useState(data.title || '');
  const [description, setDescription] = useState(data.description || '');
  const [content, setContent] = useState(data.content || '');
  const [type, setType] = useState(data.type || 'basic');
  const [fields, setFields] = useState(data.fields || {});
  const [isAdvanced, setIsAdvanced] = useState(data.isAdvanced || false);
  const [files, setFiles] = useState(data.files || []);
  const [currentProfile, setCurrentProfile] = useState<AssistantProfile | null>(null);
  
  // Load profile from localStorage on component mount
  useEffect(() => {
    const profile = localStorage.getItem('assistantProfile');
    if (profile) {
      setCurrentProfile(JSON.parse(profile));
    }
  }, []);
  
  // Update local state when data changes
  useEffect(() => {
    setTitle(data.title || '');
    setDescription(data.description || '');
    setContent(data.content || '');
    setType(data.type || 'basic');
    setFields(data.fields || {});
    setIsAdvanced(data.isAdvanced || false);
    setFiles(data.files || []);
  }, [data]);
  
  // Generic handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    const value = e.target.value;
    
    // Update local state
    if (field === 'title') setTitle(value);
    if (field === 'description') setDescription(value);
    if (field === 'content') setContent(value);
    
    // Update data prop
    data.title = title;
    data.description = description;
    data.content = content;
  };
  
  // Handler for type selection
  const handleTypeChange = (value: string) => {
    setType(value);
    data.type = value;
  };
  
  // Handler for adding a new field
  const handleAddField = useCallback(() => {
    const newFieldKey = `field${Object.keys(fields).length + 1}`;
    setFields(prevFields => ({ ...prevFields, [newFieldKey]: '' }));
    data.fields = { ...fields, [newFieldKey]: '' };
  }, [fields, data]);
  
  // Handler for updating a field's value
  const handleFieldValueChange = useCallback((fieldKey: string, value: string) => {
    setFields(prevFields => {
      const updatedFields = { ...prevFields, [fieldKey]: value };
      data.fields = updatedFields; // Update data prop here
      return updatedFields;
    });
  }, [data]);
  
  // Handler for deleting a field
  const handleDeleteField = useCallback((fieldKey: string) => {
    setFields(prevFields => {
      const updatedFields = { ...prevFields };
      delete updatedFields[fieldKey];
      data.fields = updatedFields; // Update data prop here
      return updatedFields;
    });
  }, [data]);
  
  // Handler for advanced toggle
  const handleAdvancedToggle = useCallback((checked: boolean) => {
    setIsAdvanced(checked);
    data.isAdvanced = checked;
  }, [data]);
  
  // File upload handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        const fileData = {
          id: uuidv4(),
          name: file.name,
          type: file.type,
          size: file.size,
          content: file.type.startsWith('image/') ? null : e.target.result,
          url: file.type.startsWith('image/') ? e.target.result : null,
        };
        
        setFiles(prevFiles => {
          const updatedFiles = [...prevFiles, fileData];
          data.files = updatedFiles; // Update data prop here
          return updatedFiles;
        });
      };
      
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };
  
  const handleRemoveFile = (fileId: string) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(file => file.id !== fileId);
      data.files = updatedFiles; // Update data prop here
      return updatedFiles;
    });
  };
  
  return (
    <Card className="w-[400px]" data-type={type}>
      <CardHeader>
        <CardTitle>
          <Input 
            type="text" 
            placeholder="Título do Card" 
            value={title} 
            onChange={(e) => handleInputChange(e, 'title')} 
          />
        </CardTitle>
        <CardDescription>
          <Textarea
            placeholder="Descrição do Card"
            value={description}
            onChange={(e) => handleInputChange(e, 'description')}
          />
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid w-full gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="initial">Boas-vindas</SelectItem>
                <SelectItem value="servico">Serviço</SelectItem>
                <SelectItem value="agendar">Agendar Horário</SelectItem>
                <SelectItem value="confirmacao">Agendamento Confirmado</SelectItem>
                <SelectItem value="promocao">Promoção</SelectItem>
                <SelectItem value="produto">Produto</SelectItem>
                <SelectItem value="arquivo">Arquivo</SelectItem>
                <SelectItem value="basic">Básico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea 
              id="content" 
              placeholder="Conteúdo do Card" 
              value={content} 
              onChange={(e) => handleInputChange(e, 'content')} 
            />
          </div>
          
          {type === 'arquivo' && (
            <div>
              <Label>
                Arquivos
                <Input type="file" multiple className="hidden" id="upload" onChange={handleFileSelect} />
                <Button variant="secondary" size="sm" asChild>
                  <label htmlFor="upload" className="flex items-center gap-2 cursor-pointer">
                    <Upload className="h-4 w-4" />
                    Selecionar Arquivos
                  </label>
                </Button>
              </Label>
              
              {files.map(file => (
                <div key={file.id} className="flex items-center justify-between p-2 mt-2 bg-gray-100 rounded-md">
                  <span>{file.name}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(file.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {Object.keys(fields).map(fieldKey => (
            <div key={fieldKey} className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder={`Campo ${fieldKey}`}
                value={fields[fieldKey] || ''}
                onChange={(e) => handleFieldValueChange(fieldKey, e.target.value)}
              />
              <Button variant="ghost" size="icon" onClick={() => handleDeleteField(fieldKey)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button variant="outline" size="sm" onClick={handleAddField} className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Campo
          </Button>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="advanced">Avançado</Label>
            <Switch id="advanced" checked={isAdvanced} onCheckedChange={handleAdvancedToggle} />
          </div>
        </div>
      </CardContent>
      
      {/* Input handle on the left */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left"
        className={`handle-${type}`}
      />
      
      {/* Output handle on the right */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right"
        className={`handle-${type}`}
      />
    </Card>
  );
};

export default FlowCard;
