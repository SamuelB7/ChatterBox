import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';

interface JoinConversationPayload {
  conversationId: string;
}

interface SendMessagePayload {
  conversationId: string;
  message: string;
}

// Parse allowed CORS origins from environment variable
const configService = new ConfigService();
const allowedWsOrigins = configService
  .get<string>('WS_CORS_ORIGIN', 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

@WebSocketGateway({
  cors: {
    origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedWsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly userConversations = new Map<string, string>(); // socketId -> conversationId

  constructor(private chatService: ChatService) {}

  /**
   * Quando um cliente conecta ao WebSocket
   */
  handleConnection(client: Socket) {
    this.logger.log(`🔌 Cliente conectado: ${client.id}`);
  }

  /**
   * Quando um cliente desconecta do WebSocket
   */
  handleDisconnect(client: Socket) {
    const conversationId = this.userConversations.get(client.id);
    if (conversationId) {
      this.logger.log(`🔌 Cliente ${client.id} desconectado da conversa ${conversationId}`);
      this.userConversations.delete(client.id);
    } else {
      this.logger.log(`🔌 Cliente desconectado: ${client.id}`);
    }
  }

  /**
   * Cliente entra em uma conversa
   */
  @SubscribeMessage('join:conversation')
  async handleJoinConversation(
    @MessageBody() payload: JoinConversationPayload,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { conversationId } = payload;

      this.logger.log(`👤 Cliente ${client.id} entrando na conversa ${conversationId}`);

      // Verificar se a conversa existe
      const exists = await this.chatService.conversationExists(conversationId);
      if (!exists) {
        client.emit('error', {
          message: `Conversation ${conversationId} not found`,
        });
        return;
      }

      // Registrar o cliente na conversa
      this.userConversations.set(client.id, conversationId);

      // Confirmar entrada
      client.emit('joined:conversation', {
        conversationId,
        message: 'Successfully joined conversation',
      });

      this.logger.log(`✅ Cliente ${client.id} entrou na conversa ${conversationId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('❌ Erro ao entrar na conversa:', errorMessage);
      client.emit('error', {
        message: 'Failed to join conversation',
      });
    }
  }

  /**
   * Cliente sai de uma conversa
   */
  @SubscribeMessage('leave:conversation')
  handleLeaveConversation(@ConnectedSocket() client: Socket) {
    const conversationId = this.userConversations.get(client.id);

    if (conversationId) {
      this.logger.log(`👋 Cliente ${client.id} saindo da conversa ${conversationId}`);
      this.userConversations.delete(client.id);

      client.emit('left:conversation', {
        conversationId,
        message: 'Successfully left conversation',
      });
    }
  }

  /**
   * Cliente envia mensagem (com streaming de resposta)
   */
  @SubscribeMessage('send:message')
  async handleSendMessage(
    @MessageBody() payload: SendMessagePayload,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { conversationId, message } = payload;

      this.logger.log(`💬 Cliente ${client.id} enviando mensagem na conversa ${conversationId}`);

      // Verificar se o cliente está na conversa
      const clientConversation = this.userConversations.get(client.id);
      if (clientConversation !== conversationId) {
        client.emit('error', {
          message: 'You must join the conversation first',
        });
        return;
      }

      // Emitir evento de "IA está digitando"
      client.emit('ai:typing', {
        conversationId,
        isTyping: true,
      });

      // Processar mensagem com streaming
      for await (const event of this.chatService.processMessageStream(conversationId, message)) {
        if (event.type === 'userMessage') {
          // Confirmar que a mensagem do usuário foi salva
          client.emit('message:saved', {
            messageId: event.data,
            conversationId,
          });
        } else if (event.type === 'chunk') {
          // Emitir chunk de resposta da IA
          client.emit('ai:response:stream', {
            conversationId,
            chunk: event.data,
          });
        } else if (event.type === 'complete') {
          // Emitir resposta completa
          const result = JSON.parse(event.data as string);
          client.emit('ai:response:complete', {
            conversationId,
            messageId: result.assistantMessageId,
            content: result.content,
            processingTime: result.processingTime,
          });

          // Parar indicador de "está digitando"
          client.emit('ai:typing', {
            conversationId,
            isTyping: false,
          });

          this.logger.log(
            `✅ Mensagem processada na conversa ${conversationId} (${result.processingTime}ms)`,
          );
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('❌ Erro ao processar mensagem:', errorMessage);

      // Parar indicador de "está digitando" em caso de erro
      client.emit('ai:typing', {
        conversationId: payload.conversationId,
        isTyping: false,
      });

      client.emit('error', {
        message: 'Failed to process message',
        details: errorMessage,
      });
    }
  }
}
