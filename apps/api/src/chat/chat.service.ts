import { Injectable, Logger } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { AIService, AIMessage } from '../ai/ai.service';

export interface ProcessMessageResult {
  userMessageId: string;
  assistantMessageId: string;
  content: string;
  processingTime: number;
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private messagesService: MessagesService,
    private aiService: AIService,
  ) {}

  /**
   * Processar mensagem do usuário e gerar resposta da IA
   * Usado para REST API (resposta completa)
   */
  async processMessage(conversationId: string, userMessage: string): Promise<ProcessMessageResult> {
    try {
      const startTime = Date.now();

      // 1. Salvar mensagem do usuário
      this.logger.debug(`Salvando mensagem do usuário na conversa ${conversationId}`);
      const userMsg = await this.messagesService.sendMessage(conversationId, {
        content: userMessage,
      });

      // 2. Buscar histórico da conversa
      const history = await this.messagesService.getConversationHistory(conversationId, 50);

      // 3. Converter para formato da IA
      const aiHistory: AIMessage[] = history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

      // 4. Gerar resposta da IA
      this.logger.debug('Gerando resposta da IA...');
      const aiResponse = await this.aiService.generateResponse(aiHistory);

      // 5. Salvar resposta da IA
      const assistantMsg = await this.messagesService.createAssistantMessage(
        conversationId,
        aiResponse.content,
        aiResponse.metadata,
      );

      const processingTime = Date.now() - startTime;

      this.logger.log(
        `✅ Mensagem processada em ${processingTime}ms (conversa: ${conversationId})`,
      );

      return {
        userMessageId: userMsg.id,
        assistantMessageId: assistantMsg.id,
        content: aiResponse.content,
        processingTime,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('❌ Erro ao processar mensagem:', errorMessage);
      throw error;
    }
  }

  /**
   * Processar mensagem com streaming (para WebSocket)
   * Retorna AsyncGenerator que emite chunks de texto
   */
  async *processMessageStream(
    conversationId: string,
    userMessage: string,
  ): AsyncGenerator<
    { type: 'userMessage' | 'chunk' | 'complete'; data: string | ProcessMessageResult },
    void,
    unknown
  > {
    try {
      const startTime = Date.now();

      // 1. Salvar mensagem do usuário
      this.logger.debug(`[Stream] Salvando mensagem do usuário na conversa ${conversationId}`);
      const userMsg = await this.messagesService.sendMessage(conversationId, {
        content: userMessage,
      });

      yield {
        type: 'userMessage',
        data: userMsg.id,
      };

      // 2. Buscar histórico da conversa
      const history = await this.messagesService.getConversationHistory(conversationId, 50);

      // 3. Converter para formato da IA
      const aiHistory: AIMessage[] = history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

      // 4. Stream da resposta da IA
      this.logger.debug('[Stream] Iniciando streaming de resposta da IA...');
      let fullContent = '';

      for await (const chunk of this.aiService.generateResponseStream(aiHistory)) {
        fullContent += chunk;
        yield {
          type: 'chunk',
          data: chunk,
        };
      }

      // 5. Salvar resposta completa da IA
      const processingTime = Date.now() - startTime;
      const assistantMsg = await this.messagesService.createAssistantMessage(
        conversationId,
        fullContent,
        {
          model: 'gemini-pro',
          processingTime,
        },
      );

      this.logger.log(
        `✅ [Stream] Mensagem processada em ${processingTime}ms (conversa: ${conversationId})`,
      );

      yield {
        type: 'complete',
        data: JSON.stringify({
          userMessageId: userMsg.id,
          assistantMessageId: assistantMsg.id,
          content: fullContent,
          processingTime,
        }),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('❌ [Stream] Erro ao processar mensagem:', errorMessage);
      throw error;
    }
  }

  /**
   * Verificar se uma conversa existe (helper para o Gateway)
   */
  async conversationExists(conversationId: string): Promise<boolean> {
    try {
      await this.messagesService.getConversationMessages(conversationId, 1, 1);
      return true;
    } catch {
      return false;
    }
  }
}
