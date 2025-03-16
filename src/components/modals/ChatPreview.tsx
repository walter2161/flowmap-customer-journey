
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Bot, User, Loader2, FolderTree, Brain } from 'lucide-react';
import { AssistantProfile } from '@/utils/flowTypes';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  const { toast } = useToast();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant' | 'system', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant' | 'system', content: string }>>([]);
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  const [isAgentThinking, setIsAgentThinking] = useState(false);
  const [agentThoughts, setAgentThoughts] = useState('');
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
5. Seja conciso nas respostas.
6. Use análise de linguagem natural (NLP) para interpretar a intenção do usuário e encontrar informações relevantes no roteiro.
7. Mantenha contexto da conversa para proporcionar respostas coerentes ao longo da interação.`
      };
      
      // Create welcome message based on profile if available
      let welcomeMessage = '';
      
      if (profile) {
        welcomeMessage = `Olá! Eu sou ${profile.name} ${profile.profession ? `da ${profile.profession}` : ''} ${profile.company ? `na ${profile.company}` : ''}. Como posso ajudar você hoje?`;
      } else {
        welcomeMessage = 'Olá! Como posso ajudar você hoje?';
      }
      
      // Reset state when modal opens
      setChatHistory([systemMessage]);
      setMessages([
        { role: 'assistant', content: welcomeMessage }
      ]);
      setInput('');
      setIsLoading(false);
      setAgentThoughts('');
      setIsAgentThinking(false);
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
      // Simulate AutoGPT "thinking" process
      setIsAgentThinking(true);
      
      // Generate "thoughts" step by step
      await simulateAgentThinking(userMessage.content, updatedHistory, scriptContent);
      
      // Simulate processing time - reduced for better responsiveness
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Create a more intelligent simulated response based on the user's message, chat history, and script content
      let botResponse = processNLPResponse(userMessage.content, updatedHistory, scriptContent, profile);
      
      setIsAgentThinking(false);
      setAgentThoughts('');
      
      // Add assistant response to messages and chat history
      const assistantMessage = { role: 'assistant' as const, content: botResponse };
      setMessages(prev => [...prev, assistantMessage]);
      setChatHistory([...updatedHistory, assistantMessage]);
      
      // Notification for successful processing
      toast({
        title: "Processamento concluído",
        description: "O chatbot processou sua mensagem com sucesso.",
        duration: 2000
      });
    } catch (error) {
      console.error('Error generating response:', error);
      setIsAgentThinking(false);
      setAgentThoughts('');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.' 
      }]);
      
      toast({
        title: "Erro no processamento",
        description: "Houve um problema ao processar sua mensagem.",
        variant: "destructive"
      });
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

  // Function to simulate the AutoGPT "thinking" process
  const simulateAgentThinking = async (
    userMessage: string,
    history: Array<{ role: 'user' | 'assistant' | 'system', content: string }>,
    script: string
  ) => {
    const thinkingSteps = [
      "Analisando entrada do usuário...",
      "Identificando palavras-chave e intenção...",
      "Buscando informações relevantes no roteiro de atendimento...",
      "Considerando o histórico da conversa para contexto...",
      "Formulando resposta baseada nos dados disponíveis...",
      "Aplicando regras de comunicação do perfil do assistente...",
      "Verificando consistência com respostas anteriores...",
      "Preparando resposta final..."
    ];
    
    setAgentThoughts('');
    
    for (const step of thinkingSteps) {
      setAgentThoughts(prev => prev + step + '\n\n');
      // Random delay between thinking steps - reduced for better UX
      await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 300));
    }
    
    // Extract key information from the script for more advanced response
    const keyPhrases = extractKeyPhrases(script);
    const intentKeywords = identifyIntentKeywords(userMessage);
    
    // Show matching between user intent and available information
    setAgentThoughts(prev => prev + `Palavras-chave identificadas: ${intentKeywords.join(', ')}\n\n`);
    setAgentThoughts(prev => prev + `Informações relevantes encontradas: ${keyPhrases.filter(phrase => 
      intentKeywords.some(keyword => 
        phrase.toLowerCase().includes(keyword.toLowerCase())
      )).slice(0, 3).join('; ')}\n\n`);
  };
  
  // Function to extract key phrases from the script
  const extractKeyPhrases = (script: string): string[] => {
    // Split script into sentences
    const sentences = script.split(/[.!?]\s+/).filter(s => s.length > 10);
    
    // Return most informative sentences (simplified version)
    return sentences.filter(s => 
      !s.includes('Nota:') && 
      !s.includes('---') && 
      !s.toLowerCase().includes('roteiro gerado')
    ).slice(0, 15);
  };
  
  // Function to identify intent keywords from user message
  const identifyIntentKeywords = (message: string): string[] => {
    const words = message.toLowerCase().split(/\s+/);
    
    // Filter out common stopwords in Portuguese
    const stopwords = ['e', 'o', 'a', 'os', 'as', 'um', 'uma', 'para', 'com', 'de', 'do', 'da', 'que', 'é', 'em', 'por', 'você', 'me', 'mim', 'eu', 'como'];
    
    // Keep only meaningful words (length > 2 and not stopwords)
    return words
      .filter(word => word.length > 2 && !stopwords.includes(word))
      .slice(0, 5); // Limit to 5 keywords
  };

  // Enhanced NLP simulated response function
  const processNLPResponse = (
    userMessage: string,
    history: Array<{ role: 'user' | 'assistant' | 'system', content: string }>,
    script: string,
    profile?: AssistantProfile | null
  ): string => {
    const userMessageLower = userMessage.toLowerCase();
    const userWords = userMessageLower.split(/\s+/);
    
    // Extract key information from the script
    const scriptLines = script.split('\n');
    
    // Build a simple keyword index from the script
    const keywordIndex = buildKeywordIndex(scriptLines);
    
    // Identify intent from user message
    const intent = identifyUserIntent(userMessageLower, userWords);
    
    // Get recent conversation context
    const recentUserMessages = history
      .filter(msg => msg.role === 'user')
      .slice(-3)
      .map(msg => msg.content);
    
    // Enhanced context-aware greeting response
    if (intent === 'greeting') {
      // Check if this is not the first message (continued conversation)
      if (history.filter(msg => msg.role === 'user').length > 1) {
        return `Olá novamente! Estou aqui para continuar te ajudando com informações sobre ${profile?.company || 'nossa empresa'}. Como posso ser útil agora?`;
      }
      
      return `Olá! Como vai? Estou aqui para ajudar com informações sobre ${profile?.company || 'nossa empresa'}. Como posso ser útil hoje?`;
    }
    
    // Price inquiries with better context understanding
    if (intent === 'price') {
      // Look for price information in the script with better keyword matching
      const priceInfo = findRelevantInformation(keywordIndex, ['preço', 'valor', 'custo', 'pagamento', 'investimento']);
      
      if (priceInfo) {
        return `Sobre preços: ${priceInfo}. Posso fornecer mais detalhes se necessário.`;
      } else {
        return "Sobre preços, temos diferentes opções que podem se adequar ao seu orçamento. Posso verificar valores específicos para o que você precisa ou podemos agendar uma conversa com nossa equipe comercial para uma cotação detalhada.";
      }
    }
    
    // Scheduling with conversation history awareness
    if (intent === 'scheduling') {
      // Check if user already mentioned scheduling preferences in previous messages
      const previousSchedulingPreference = recentUserMessages.find(msg => 
        msg.toLowerCase().includes('hora') || 
        msg.toLowerCase().includes('dia') || 
        msg.toLowerCase().includes('semana') ||
        msg.toLowerCase().includes('segunda') ||
        msg.toLowerCase().includes('terça') ||
        msg.toLowerCase().includes('manhã')
      );
      
      // Look for scheduling information in the script
      const scheduleInfo = findRelevantInformation(keywordIndex, ['horário', 'agenda', 'disponib', 'atendimento']);
      
      if (previousSchedulingPreference) {
        return `Baseado na sua preferência anterior por "${previousSchedulingPreference}", posso te informar que ${scheduleInfo || 'temos disponibilidade de segunda a sexta, das 9h às 18h'}. Gostaria de confirmar um horário específico?`;
      }
      
      if (scheduleInfo) {
        return `Sobre agendamentos: ${scheduleInfo}. Para marcar um horário, precisamos verificar nossa disponibilidade. Qual seria o melhor dia e horário para você?`;
      } else {
        return "Para agendar um horário, precisamos verificar nossa disponibilidade. Qual seria a melhor data e horário para você? Normalmente, temos disponibilidade de segunda a sexta, das 9h às 18h.";
      }
    }
    
    // Product/service details with improved keyword matching
    if (intent === 'information') {
      // Extract keywords from user message (excluding stopwords)
      const keywords = userWords
        .filter(word => word.length > 3)
        .filter(word => !['como', 'para', 'você', 'pode', 'sobre', 'qual', 'quais', 'quando', 'onde', 'porque', 'porquê', 'tenho', 'estou', 'quero'].includes(word));
      
      // Find relevant information based on keywords
      if (keywords.length > 0) {
        const relevantInfo = findRelevantInformation(keywordIndex, keywords);
        
        if (relevantInfo) {
          return `${relevantInfo} Posso detalhar mais algum aspecto específico que você gostaria de saber?`;
        }
      }
      
      // Fall back to topic detection
      const topics = detectTopicsFromScript(script);
      return `De acordo com nosso roteiro de atendimento, posso fornecer informações sobre os seguintes tópicos: ${topics.join(', ')}. Sobre qual deles você gostaria de saber mais?`;
    }
    
    // Thank you handling with conversation history awareness
    if (intent === 'thanks') {
      // Check if this is the end of a substantive conversation
      if (history.filter(msg => msg.role === 'user').length > 2) {
        return "Foi um prazer ajudar! Se precisar de mais alguma informação ou assistência no futuro, estarei à disposição. Tenha um ótimo dia!";
      }
      
      // For quick thanks without much conversation
      return "De nada! Estou aqui para ajudar. Há mais alguma coisa em que eu possa ser útil hoje?";
    }
    
    // General response for other queries using keyword matching
    // Try to find relevant information based on user keywords
    const keywords = userWords
      .filter(word => word.length > 3)
      .filter(word => !['como', 'para', 'você', 'pode', 'sobre', 'qual', 'quais', 'quando', 'onde'].includes(word));
      
    if (keywords.length > 0) {
      const relevantInfo = findRelevantInformation(keywordIndex, keywords);
      
      if (relevantInfo) {
        return `Baseado no nosso roteiro de atendimento: ${relevantInfo}. Posso ajudar com mais alguma informação específica sobre isso?`;
      }
    }
    
    // Fallback response - make it more responsive to the user's query
    return `Entendi sua pergunta sobre "${userMessage.substring(0, 30)}${userMessage.length > 30 ? '...' : ''}". Com base no nosso roteiro de atendimento, posso ajudar a encontrar a melhor solução para você. Para que eu possa ser mais preciso, poderia me dar mais detalhes sobre o que está procurando especificamente?`;
  };

  // Function to build a simple keyword index from script lines
  const buildKeywordIndex = (scriptLines: string[]): Record<string, string[]> => {
    const index: Record<string, string[]> = {};
    
    scriptLines.forEach(line => {
      // Skip empty lines or headings
      if (line.trim().length < 5 || line.startsWith('#') || line.startsWith('-')) return;
      
      // Extract words from line
      const words = line.toLowerCase().split(/\s+/)
        .filter(word => word.length > 3)
        .filter(word => !['como', 'para', 'você', 'pode', 'sobre', 'qual', 'quais', 'quando', 'onde'].includes(word));
      
      // Add line to index for each word
      words.forEach(word => {
        if (!index[word]) index[word] = [];
        if (!index[word].includes(line)) index[word].push(line);
      });
    });
    
    return index;
  };
  
  // Function to find relevant information from the keyword index
  const findRelevantInformation = (keywordIndex: Record<string, string[]>, keywords: string[]): string | null => {
    let allRelevantLines: string[] = [];
    
    // Collect all lines that match any keyword
    keywords.forEach(keyword => {
      // Try exact match
      if (keywordIndex[keyword]) {
        allRelevantLines = [...allRelevantLines, ...keywordIndex[keyword]];
      } else {
        // Try partial matches
        Object.keys(keywordIndex).forEach(indexedWord => {
          if (indexedWord.includes(keyword) || keyword.includes(indexedWord)) {
            allRelevantLines = [...allRelevantLines, ...keywordIndex[indexedWord]];
          }
        });
      }
    });
    
    // If we found relevant lines, return the most relevant one
    if (allRelevantLines.length > 0) {
      // Sort by relevance (number of keyword matches)
      const mostRelevantLine = allRelevantLines.sort((a, b) => {
        const aMatches = keywords.filter(keyword => a.toLowerCase().includes(keyword.toLowerCase())).length;
        const bMatches = keywords.filter(keyword => b.toLowerCase().includes(keyword.toLowerCase())).length;
        return bMatches - aMatches;
      })[0];
      
      return mostRelevantLine.trim();
    }
    
    return null;
  };
  
  // Function to identify user intent from message
  const identifyUserIntent = (message: string, words: string[]): 'greeting' | 'price' | 'scheduling' | 'information' | 'thanks' | 'other' => {
    // Check for greetings
    if (message.includes('olá') || 
        message.includes('oi') || 
        message.includes('bom dia') || 
        message.includes('boa tarde') || 
        message.includes('boa noite')) {
      return 'greeting';
    }
    
    // Check for price inquiries
    if (message.includes('preço') || 
        message.includes('valor') || 
        message.includes('custo') ||
        message.includes('quanto custa') ||
        message.includes('pagamento') ||
        message.includes('investimento')) {
      return 'price';
    }
    
    // Check for scheduling inquiries
    if (message.includes('horário') || 
        message.includes('agendar') || 
        message.includes('marcar') ||
        message.includes('disponibilidade') ||
        message.includes('quando') && (message.includes('atende') || message.includes('atendimento'))) {
      return 'scheduling';
    }
    
    // Check for information requests
    if (message.includes('como funciona') || 
        message.includes('detalhe') || 
        message.includes('explicar') ||
        message.includes('informação') ||
        message.includes('o que') ||
        message.includes('como') ||
        message.includes('qual') ||
        message.includes('quais')) {
      return 'information';
    }
    
    // Check for thanks
    if (message.includes('obrigado') || 
        message.includes('obrigada') ||
        message.includes('agradeço') ||
        message.includes('valeu')) {
      return 'thanks';
    }
    
    return 'other';
  };
  
  // Function to detect main topics from script
  const detectTopicsFromScript = (script: string): string[] => {
    // Simple topic extraction based on frequent words and headers
    const topics: string[] = [];
    const lines = script.split('\n');
    
    // Extract topics from headers
    const headerLines = lines.filter(line => line.startsWith('##') || line.startsWith('###'));
    headerLines.forEach(header => {
      const topic = header.replace(/^#+\s*/, '').trim();
      if (topic && topic.length > 3 && !topics.includes(topic)) {
        topics.push(topic);
      }
    });
    
    // If no headers found, use a default set
    if (topics.length === 0) {
      return ['Serviços', 'Produtos', 'Preços', 'Agendamento', 'Informações gerais'];
    }
    
    return topics.slice(0, 5); // Limit to 5 topics
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0 bg-gray-50">
        <DialogHeader className="px-4 py-2 bg-white border-b">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            {profile?.name || "Assistente"} - AutoGPT Chat
          </DialogTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setIsContextExpanded(!isContextExpanded)}
            >
              <FolderTree className="h-4 w-4" />
              {isContextExpanded ? "Ocultar Contexto" : "Ver Contexto"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center gap-1 ${isAgentThinking ? 'bg-primary/10' : ''}`}
              onClick={() => setIsAgentThinking(!isAgentThinking)}
              disabled={!agentThoughts}
            >
              <Brain className="h-4 w-4" />
              {isAgentThinking ? "Ocultar Pensamentos" : "Ver Pensamentos"}
            </Button>
          </div>
        </DialogHeader>
        
        {isContextExpanded && (
          <div className="max-h-[200px] overflow-y-auto p-3 bg-gray-100 border-b text-xs">
            <h4 className="font-semibold mb-1">Contexto do Script:</h4>
            <pre className="whitespace-pre-wrap">{scriptContent}</pre>
          </div>
        )}
        
        {isAgentThinking && (
          <div className="max-h-[200px] overflow-y-auto p-3 bg-gray-900 text-gray-200 border-b text-xs font-mono">
            <h4 className="font-semibold mb-1">Processamento do Agente (AutoGPT):</h4>
            <pre className="whitespace-pre-wrap">{agentThoughts || "O agente ainda não processou nenhuma entrada..."}</pre>
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
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              variant="default" 
              size="icon"
              disabled={isLoading || input.trim() === ''}
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500 italic text-center">
            Este é um preview simulando integração com AutoGPT. As respostas são baseadas no roteiro do fluxo com processamento de linguagem natural.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatPreview;
