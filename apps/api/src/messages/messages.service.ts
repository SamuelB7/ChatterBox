import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { MessageRepository } from './repositories/message.repository';
import { ConversationRepository } from '../conversations/repositories/conversation.repository';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageResponseDto, IMessageMetadata } from './dto/message-response.dto';
import { PaginatedMessagesResponseDto } from './dto/paginated-messages.dto';
import { MessageDocument } from './schemas/message.schema';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  /**
   * Enviar mensagem do usuário
   */
  async sendMessage(conversationId: string, dto: SendMessageDto): Promise<MessageResponseDto> {
    // Verificar se conversa existe
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${conversationId} not found`);
    }

    // Criar mensagem do usuário
    const message = await this.messageRepository.create({
      conversationId: new Types.ObjectId(conversationId),
      role: 'user',
      content: dto.content,
      timestamp: new Date(),
    });

    // Atualizar contador de mensagens da conversa
    await this.conversationRepository.updateMessageCount(conversationId, 1);

    return this.toResponseDto(message);
  }

  /**
   * Criar mensagem do assistente (IA)
   * Usado internamente pelo ChatService
   */
  async createAssistantMessage(
    conversationId: string,
    content: string,
    metadata?: IMessageMetadata,
  ): Promise<MessageResponseDto> {
    // Verificar se conversa existe
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${conversationId} not found`);
    }

    // Criar mensagem do assistente
    const message = await this.messageRepository.create({
      conversationId: new Types.ObjectId(conversationId),
      role: 'assistant',
      content,
      timestamp: new Date(),
      metadata,
    });

    // Atualizar contador de mensagens da conversa
    await this.conversationRepository.updateMessageCount(conversationId, 1);

    return this.toResponseDto(message);
  }

  /**
   * Buscar mensagens de uma conversa com paginação
   */
  async getConversationMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<PaginatedMessagesResponseDto> {
    // Verificar se conversa existe
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${conversationId} not found`);
    }

    // Validar página e limite
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100);

    const { data, total } = await this.messageRepository.findByConversation(
      conversationId,
      validPage,
      validLimit,
    );

    return {
      messages: data.map((msg) => this.toResponseDto(msg)),
      pagination: {
        total,
        page: validPage,
        limit: validLimit,
        hasNextPage: validPage * validLimit < total,
        hasPreviousPage: validPage > 1,
      },
    };
  }

  /**
   * Buscar última mensagem de uma conversa
   */
  async getLastMessage(conversationId: string): Promise<MessageResponseDto | null> {
    const message = await this.messageRepository.findLastByConversation(conversationId);
    return message ? this.toResponseDto(message) : null;
  }

  /**
   * Buscar mensagem por ID
   */
  async findById(id: string): Promise<MessageResponseDto> {
    const message = await this.messageRepository.findById(id);

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return this.toResponseDto(message);
  }

  /**
   * Deletar mensagem
   */
  async delete(id: string): Promise<void> {
    const message = await this.messageRepository.findById(id);

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    await this.messageRepository.delete(id);

    // Decrementar contador de mensagens
    await this.conversationRepository.updateMessageCount(message.conversationId.toString(), -1);
  }

  /**
   * Obter histórico de conversa para a IA
   */
  async getConversationHistory(
    conversationId: string,
    limit: number = 50,
  ): Promise<
    Array<{
      role: 'user' | 'assistant';
      content: string;
    }>
  > {
    const messages = await this.messageRepository.getConversationHistory(conversationId, limit);

    return messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));
  }

  /**
   * Converter documento MongoDB para DTO de resposta
   */
  private toResponseDto(message: MessageDocument): MessageResponseDto {
    return {
      id: (message._id as string).toString(),
      conversationId: message.conversationId.toString(),
      role: message.role,
      content: message.content,
      timestamp: message.timestamp.toISOString(),
      metadata: message.metadata,
    };
  }
}
