
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Bot, User, Loader2, FolderTree } from 'lucide-react';
import { AssistantProfile } from '@/utils/flowTypes';

interface ChatPreviewProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scriptContent: string;
  profile?: AssistantProfile | null;
}

const ChatPreview: React.FC<ChatPreviewProps> = ({
  isOpen,
  onOpenChange,
  scriptContent,
  profile
}) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant' | 'system', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant' | 'system', content: string }>>([]);
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Start with assistant welcome message and system message when modal opens
  useEffect(() => {
    if (isOpen) {
      // Create system message based on script content
      const systemMessage = {
        role: 'system' as const,
        content: `Instruções para o assistente virtual:
        
1. Você é um assistente com conhecimento baseado no seguinte roteiro:
${scriptContent}

2. Use as informações acima para responder perguntas dos usuários.
3. Se uma pergunta estiver fora do escopo do roteiro, informe gentilmente que não pode ajudar com isso.
4. Mantenha um tom conversacional e amigável.
5. Seja conciso nas respostas.`
      };
      
      // Create welcome message based on profile if available
      let welcomeMessage = '';
      
      if (profile) {
        welcomeMessage = `Olá! Eu sou ${profile.name} ${profile.profession ? `da ${profile.profession}` : ''} ${profile.company ? `na ${profile.company}` : ''}. Como posso ajudar você hoje?`;
      } else {
        welcomeMessage = 'Olá! Como posso ajudar você hoje?';
      }
      
      setChatHistory([systemMessage]);
      setMessages([
        { role: 'assistant', content: welcomeMessage }
      ]);
    }
  }, [isOpen, scriptContent, profile]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Update chat history with user message
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    
    try {
      // This simulates an AutoGPT processing by looking at the chat history and script content
      // In a real implementation, this would connect to the AutoGPT API
      
      // Simulate thinking and processing time
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      // Create a more intelligent simulated response based on the user's message, chat history, and script content
      let botResponse = simulateAutoGPTResponse(userMessage.content, updatedHistory, scriptContent, profile);
      
      // Add assistant response to messages and chat history
      const assistantMessage = { role: 'assistant' as const, content: botResponse };
      setMessages(prev => [...prev, assistantMessage]);
      setChatHistory([...updatedHistory, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Function to simulate AutoGPT response generation based on context
  const simulateAutoGPTResponse = (
    userMessage: string,
    history: Array<{ role: 'user' | 'assistant' | 'system', content: string }>,
    script: string,
    profile?: AssistantProfile | null
  ): string => {
    const userMessageLower = userMessage.toLowerCase();
    
    // Extract key information from the script to use in responses
    const scriptLines = script.split('\n');
    const keyPoints = scriptLines.filter(line => 
      line.length > 10 && 
      !line.startsWith('#') && 
      !line.startsWith('-') && 
      !line.includes('```')
    ).slice(0, 10);
    
    // Check for greetings
    if (userMessageLower.includes('olá') || 
        userMessageLower.includes('oi') || 
        userMessageLower.includes('bom dia') || 
        userMessageLower.includes('boa tarde') || 
        userMessageLower.includes('boa noite')) {
      return `Olá! Como vai? Estou aqui para ajudar com informações sobre ${profile?.company || 'nossa empresa'}. Como posso ser útil hoje?`;
    }
    
    // Check for price inquiries
    if (userMessageLower.includes('preço') || 
        userMessageLower.includes('valor') || 
        userMessageLower.includes('custo') ||
        userMessageLower.includes('quanto custa')) {
      // Look for price information in the script
      const priceInfo = scriptLines.find(line => 
        line.toLowerCase().includes('preço') || 
        line.toLowerCase().includes('valor') || 
        line.toLowerCase().includes('custo') ||
        line.toLowerCase().includes('r$') ||
        line.toLowerCase().includes('reais')
      );
      
      if (priceInfo) {
        return `Sobre preços: ${priceInfo.trim()}. Posso fornecer mais detalhes se necessário.`;
      } else {
        return "Sobre preços, temos diferentes opções que podem se adequar ao seu orçamento. Posso verificar valores específicos para o que você precisa ou podemos agendar uma conversa com nossa equipe comercial para uma cotação detalhada.";
      }
    }
    
    // Check for scheduling inquiries
    if (userMessageLower.includes('horário') || 
        userMessageLower.includes('agendar') || 
        userMessageLower.includes('marcar') ||
        userMessageLower.includes('disponibilidade')) {
      // Look for scheduling information in the script
      const scheduleInfo = scriptLines.find(line => 
        line.toLowerCase().includes('horário') || 
        line.toLowerCase().includes('agenda') || 
        line.toLowerCase().includes('disponib')
      );
      
      if (scheduleInfo) {
        return `Sobre agendamentos: ${scheduleInfo.trim()}. Para marcar um horário, precisamos verificar nossa disponibilidade. Qual seria o melhor dia e horário para você?`;
      } else {
        return "Para agendar um horário, precisamos verificar nossa disponibilidade. Qual seria a melhor data e horário para você? Normalmente, temos disponibilidade de segunda a sexta, das 9h às 18h.";
      }
    }
    
    // Check for product/service details
    if (userMessageLower.includes('como funciona') || 
        userMessageLower.includes('detalhe') || 
        userMessageLower.includes('explicar') ||
        userMessageLower.includes('informação')) {
      // Try to find relevant information in key points
      const relevantInfo = keyPoints.find(point => 
        userMessageLower.split(' ').some(word => 
          word.length > 3 && point.toLowerCase().includes(word.toLowerCase())
        )
      );
      
      if (relevantInfo) {
        return `${relevantInfo.trim()} Posso detalhar mais algum aspecto específico que você gostaria de saber?`;
      } else {
        return "De acordo com nosso roteiro de atendimento, oferecemos serviços personalizados para atender às suas necessidades específicas. Poderia me dizer exatamente qual aspecto você gostaria de conhecer melhor?";
      }
    }
    
    // Check for thanks
    if (userMessageLower.includes('obrigado') || 
        userMessageLower.includes('obrigada') ||
        userMessageLower.includes('agradeço')) {
      return "Foi um prazer ajudar! Se precisar de mais alguma informação ou assistência, estou à disposição. Tenha um ótimo dia!";
    }
    
    // General response for other queries
    // Look for keywords in the user message and try to find relevant information
    const keywords = userMessageLower.split(' ')
      .filter(word => word.length > 3)
      .filter(word => !['como', 'para', 'você', 'pode', 'sobre', 'qual', 'quais', 'quando', 'onde'].includes(word));
      
    if (keywords.length > 0) {
      // Try to find a line in the script containing any of the keywords
      const relevantLine = scriptLines.find(line => 
        keywords.some(keyword => line.toLowerCase().includes(keyword))
      );
      
      if (relevantLine) {
        return `Baseado no nosso roteiro de atendimento: ${relevantLine.trim()}. Posso ajudar com mais alguma informação específica sobre isso?`;
      }
    }
    
    // Fallback response
    return "Entendi sua pergunta. Com base no nosso roteiro de atendimento, posso ajudar a encontrar a melhor solução para você. Poderia me dar mais detalhes sobre o que está procurando especificamente?";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0 bg-gray-50">
        <DialogHeader className="px-4 py-2 bg-white border-b">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            {profile?.name || "Assistente"} - AutoGPT Chat
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-4 top-2 flex items-center gap-1"
            onClick={() => setIsContextExpanded(!isContextExpanded)}
          >
            <FolderTree className="h-4 w-4" />
            {isContextExpanded ? "Ocultar Contexto" : "Ver Contexto"}
          </Button>
        </DialogHeader>
        
        {isContextExpanded && (
          <div className="max-h-[200px] overflow-y-auto p-3 bg-gray-100 border-b text-xs">
            <h4 className="font-semibold mb-1">Contexto do Script:</h4>
            <pre className="whitespace-pre-wrap">{scriptContent}</pre>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
                  {message.role === 'user' ? (
                    <>
                      <User className="h-3 w-3" /> Você
                    </>
                  ) : (
                    <>
                      <Bot className="h-3 w-3" /> {profile?.name || "Assistente"}
                    </>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-200">
                <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
                  <Bot className="h-3 w-3" /> {profile?.name || "Assistente"}
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">Processando resposta...</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button onClick={handleSendMessage} variant="default" size="icon">
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500 italic text-center">
            Este é um preview simulando integração com AutoGPT. As respostas são baseadas no roteiro do fluxo.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatPreview;
