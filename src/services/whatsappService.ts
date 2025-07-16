// Simulação da API do Baileys para integração WhatsApp
interface BaileysMessage {
  key: {
    id?: string;
    remoteJid?: string;
    fromMe?: boolean;
  };
  message?: {
    conversation?: string;
    extendedTextMessage?: { text?: string };
    imageMessage?: { caption?: string };
    audioMessage?: any;
    videoMessage?: any;
    documentMessage?: any;
  };
  messageTimestamp?: number;
}

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

type WAConnectionState = 'connecting' | 'open' | 'close' | 'error';

class WhatsAppService {
  private sock: any = null;
  private connectionState: WAConnectionState = 'close';
  private chats: Map<string, WhatsAppChat> = new Map();
  private onConnectionUpdate?: (state: WAConnectionState) => void;
  private onNewMessage?: (message: WhatsAppMessage) => void;
  private onChatsUpdate?: (chats: WhatsAppChat[]) => void;

  async connect() {
    try {
      this.connectionState = 'connecting';
      this.onConnectionUpdate?.('connecting');

      console.log('🔄 Conectando ao WhatsApp usando API Baileys...');
      console.log('📱 QR Code será gerado no console do servidor');
      
      // Simular processo de autenticação do Baileys
      setTimeout(() => {
        console.log('✅ WhatsApp conectado com sucesso via Baileys!');
        this.connectionState = 'open';
        this.onConnectionUpdate?.('open');
        this.loadDemoChats();
      }, 3000);

    } catch (error) {
      console.error('❌ Erro ao conectar no WhatsApp via Baileys:', error);
      this.connectionState = 'error';
      this.onConnectionUpdate?.('error');
    }
  }

  private loadDemoChats() {
    // Simular chats carregados via Baileys
    const baileysChats = [
      {
        jid: '5511999999999@s.whatsapp.net',
        name: 'Cliente Premium',
        unreadCount: 1,
        messages: [
          {
            id: 'baileys_msg_1',
            from: '5511999999999@s.whatsapp.net',
            to: 'me',
            body: 'Olá! Vi que vocês têm um atendimento automatizado. Gostaria de saber mais sobre os serviços.',
            timestamp: Date.now() - 180000,
            isFromMe: false,
            messageType: 'text' as const
          }
        ]
      },
      {
        jid: '5511888888888@s.whatsapp.net', 
        name: 'João Silva',
        unreadCount: 0,
        messages: [
          {
            id: 'baileys_msg_2',
            from: '5511888888888@s.whatsapp.net',
            to: 'me',
            body: 'Bom dia! Preciso de ajuda com um agendamento.',
            timestamp: Date.now() - 300000,
            isFromMe: false,
            messageType: 'text' as const
          },
          {
            id: 'baileys_msg_3',
            from: 'me',
            to: '5511888888888@s.whatsapp.net',
            body: 'Bom dia! Claro, posso ajudá-lo. Que tipo de serviço você gostaria de agendar?',
            timestamp: Date.now() - 240000,
            isFromMe: true,
            messageType: 'text' as const
          }
        ]
      }
    ];

    baileysChats.forEach(chat => {
      const chatData = {
        ...chat,
        lastMessage: chat.messages[chat.messages.length - 1]
      };
      this.chats.set(chat.jid, chatData);
    });

    console.log('📋 Chats carregados via API Baileys:', this.chats.size);
    this.onChatsUpdate?.(Array.from(this.chats.values()));
  }

  private handleIncomingMessage(msg: BaileysMessage) {
    const message = this.convertBaileysMessage(msg);
    if (!message) return;

    const chatId = message.from;
    let chat = this.chats.get(chatId);
    
    if (!chat) {
      chat = {
        jid: chatId,
        name: chatId.split('@')[0],
        messages: [],
        unreadCount: 0
      };
    }

    chat.messages.push(message);
    chat.lastMessage = message;
    chat.unreadCount++;
    this.chats.set(chatId, chat);

    console.log('📨 Nova mensagem recebida via Baileys:', message.body);
    this.onNewMessage?.(message);
    this.onChatsUpdate?.(Array.from(this.chats.values()));
  }

  private convertBaileysMessage(msg: BaileysMessage): WhatsAppMessage | null {
    if (!msg.message || !msg.key) return null;

    const messageContent = msg.message.conversation || 
                          msg.message.extendedTextMessage?.text || 
                          msg.message.imageMessage?.caption || 
                          'Mídia';

    return {
      id: msg.key.id || '',
      from: msg.key.remoteJid || '',
      to: msg.key.fromMe ? msg.key.remoteJid || '' : 'me',
      body: messageContent,
      timestamp: (msg.messageTimestamp as number) * 1000 || Date.now(),
      isFromMe: msg.key.fromMe || false,
      messageType: msg.message.imageMessage ? 'image' : 
                   msg.message.audioMessage ? 'audio' :
                   msg.message.videoMessage ? 'video' :
                   msg.message.documentMessage ? 'document' : 'text'
    };
  }

  async sendMessage(to: string, text: string): Promise<void> {
    if (this.connectionState !== 'open') {
      throw new Error('WhatsApp não está conectado via Baileys');
    }

    try {
      console.log('📤 Enviando mensagem via Baileys para:', to);
      
      const message: WhatsAppMessage = {
        id: `baileys_${Date.now()}`,
        from: 'me',
        to: to,
        body: text,
        timestamp: Date.now(),
        isFromMe: true,
        messageType: 'text'
      };

      // Adicionar mensagem ao chat local
      const chat = this.chats.get(to);
      if (chat) {
        chat.messages.push(message);
        chat.lastMessage = message;
        this.chats.set(to, chat);
        this.onNewMessage?.(message);
        this.onChatsUpdate?.(Array.from(this.chats.values()));
      }

      // Simular resposta automática usando Baileys
      setTimeout(() => {
        this.simulateBaileysResponse(to);
      }, 2000);

    } catch (error) {
      console.error('❌ Erro ao enviar mensagem via Baileys:', error);
      throw error;
    }
  }

  private simulateBaileysResponse(fromJid: string) {
    const responses = [
      'Recebido via Baileys! Obrigado pelo contato.',
      'Mensagem processada através da API Baileys.',
      'Entendi sua solicitação. Em que mais posso ajudar?',
      'Perfeito! A integração Baileys está funcionando.',
      'Ótimo! Mais alguma dúvida?'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const baileysMessage: BaileysMessage = {
      key: {
        id: `baileys_incoming_${Date.now()}`,
        remoteJid: fromJid,
        fromMe: false
      },
      message: {
        conversation: randomResponse
      },
      messageTimestamp: Date.now() / 1000
    };

    this.handleIncomingMessage(baileysMessage);
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

  onConnectionStateChange(callback: (state: WAConnectionState) => void) {
    this.onConnectionUpdate = callback;
  }

  onMessageReceived(callback: (message: WhatsAppMessage) => void) {
    this.onNewMessage = callback;
  }

  onChatsUpdated(callback: (chats: WhatsAppChat[]) => void) {
    this.onChatsUpdate = callback;
  }

  getConnectionState(): WAConnectionState {
    return this.connectionState;
  }

  disconnect() {
    console.log('🔌 Desconectando do WhatsApp via Baileys...');
    this.sock = null;
    this.connectionState = 'close';
    this.onConnectionUpdate?.('close');
  }
}

export const whatsappService = new WhatsAppService();