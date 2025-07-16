export interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  body: string;
  timestamp: number;
  isFromMe: boolean;
  messageType: 'text' | 'image' | 'audio' | 'video' | 'document';
}

export interface WhatsAppChat {
  jid: string;
  name: string;
  lastMessage?: WhatsAppMessage;
  unreadCount: number;
  messages: WhatsAppMessage[];
}

type ConnectionState = 'connecting' | 'open' | 'close' | 'error';

class WhatsAppService {
  private socket: WebSocket | null = null;
  private connectionState: ConnectionState = 'close';
  private chats: Map<string, WhatsAppChat> = new Map();
  private onConnectionUpdate?: (state: ConnectionState) => void;
  private onNewMessage?: (message: WhatsAppMessage) => void;
  private onChatsUpdate?: (chats: WhatsAppChat[]) => void;

  async connect() {
    try {
      this.connectionState = 'connecting';
      this.onConnectionUpdate?.('connecting');

      // Simular conexão WebSocket para demonstração
      setTimeout(() => {
        this.connectionState = 'open';
        this.onConnectionUpdate?.('open');
        
        // Adicionar alguns chats de exemplo
        this.loadDemoChats();
      }, 2000);

    } catch (error) {
      console.error('Error connecting to WhatsApp:', error);
      this.connectionState = 'error';
      this.onConnectionUpdate?.('error');
    }
  }

  private loadDemoChats() {
    const demoChats = [
      {
        jid: '5511999999999@s.whatsapp.net',
        name: 'Cliente 1',
        unreadCount: 2,
        messages: [
          {
            id: '1',
            from: '5511999999999@s.whatsapp.net',
            to: 'me',
            body: 'Olá! Gostaria de agendar um horário.',
            timestamp: Date.now() - 300000,
            isFromMe: false,
            messageType: 'text' as const
          },
          {
            id: '2',
            from: 'me',
            to: '5511999999999@s.whatsapp.net',
            body: 'Olá! Claro, posso ajudá-lo com o agendamento. Qual serviço você gostaria?',
            timestamp: Date.now() - 240000,
            isFromMe: true,
            messageType: 'text' as const
          }
        ]
      },
      {
        jid: '5511888888888@s.whatsapp.net',
        name: 'Cliente 2',
        unreadCount: 0,
        messages: [
          {
            id: '3',
            from: '5511888888888@s.whatsapp.net',
            to: 'me',
            body: 'Bom dia! Quais são os preços dos serviços?',
            timestamp: Date.now() - 600000,
            isFromMe: false,
            messageType: 'text' as const
          }
        ]
      }
    ];

    demoChats.forEach(chat => {
      const chatWithLastMessage = {
        ...chat,
        lastMessage: chat.messages[chat.messages.length - 1]
      };
      this.chats.set(chat.jid, chatWithLastMessage);
    });

    this.onChatsUpdate?.(Array.from(this.chats.values()));
  }

  async sendMessage(to: string, text: string): Promise<void> {
    if (this.connectionState !== 'open') {
      throw new Error('WhatsApp não está conectado');
    }

    try {
      const message: WhatsAppMessage = {
        id: `msg_${Date.now()}`,
        from: 'me',
        to: to,
        body: text,
        timestamp: Date.now(),
        isFromMe: true,
        messageType: 'text'
      };

      // Adicionar mensagem ao chat
      const chat = this.chats.get(to);
      if (chat) {
        chat.messages.push(message);
        chat.lastMessage = message;
        this.chats.set(to, chat);
        this.onNewMessage?.(message);
        this.onChatsUpdate?.(Array.from(this.chats.values()));
      }

      // Simular resposta automática após alguns segundos
      setTimeout(() => {
        this.simulateIncomingMessage(to);
      }, 2000);

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  private simulateIncomingMessage(fromJid: string) {
    const responses = [
      'Obrigado pela resposta!',
      'Entendi, pode me dar mais detalhes?',
      'Perfeito! Quando seria conveniente para você?',
      'Certo, vou verificar a disponibilidade.',
      'Ótimo! Mais alguma dúvida?'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const message: WhatsAppMessage = {
      id: `msg_${Date.now()}_incoming`,
      from: fromJid,
      to: 'me',
      body: randomResponse,
      timestamp: Date.now(),
      isFromMe: false,
      messageType: 'text'
    };

    const chat = this.chats.get(fromJid);
    if (chat) {
      chat.messages.push(message);
      chat.lastMessage = message;
      chat.unreadCount++;
      this.chats.set(fromJid, chat);
      this.onNewMessage?.(message);
      this.onChatsUpdate?.(Array.from(this.chats.values()));
    }
  }

  getChats(): WhatsAppChat[] {
    return Array.from(this.chats.values()).sort((a, b) => {
      const aTime = a.lastMessage?.timestamp || 0;
      const bTime = b.lastMessage?.timestamp || 0;
      return bTime - aTime;
    });
  }

  getChatMessages(jid: string): WhatsAppMessage[] {
    return this.chats.get(jid)?.messages || [];
  }

  onConnectionStateChange(callback: (state: ConnectionState) => void) {
    this.onConnectionUpdate = callback;
  }

  onMessageReceived(callback: (message: WhatsAppMessage) => void) {
    this.onNewMessage = callback;
  }

  onChatsUpdated(callback: (chats: WhatsAppChat[]) => void) {
    this.onChatsUpdate = callback;
  }

  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.connectionState = 'close';
    this.onConnectionUpdate?.('close');
  }
}

export const whatsappService = new WhatsAppService();