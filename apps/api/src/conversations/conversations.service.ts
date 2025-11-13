import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from './repositories/conversation.repository';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ConversationResponseDto } from './dto/conversation-response.dto';
import { PaginatedConversationsResponseDto } from './dto/paginated-conversations.dto';
import { ConversationDocument } from './schemas/conversation.schema';

@Injectable()
export class ConversationsService {
  constructor(private readonly conversationRepository: ConversationRepository) {}

  /**
   * Criar nova conversa
   */
  async create(dto: CreateConversationDto): Promise<ConversationResponseDto> {
    const title = dto.title || this.generateDefaultTitle();
    const conversation = await this.conversationRepository.create({ title });

    return this.toResponseDto(conversation);
  }

  /**
   * Listar todas as conversas com paginação
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    status?: string,
  ): Promise<PaginatedConversationsResponseDto> {
    // Validar página e limite
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100);

    const { data, total } = await this.conversationRepository.findAll(
      validPage,
      validLimit,
      status,
    );

    return {
      conversations: data.map((conv) => this.toResponseDto(conv)),
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
   * Buscar conversa por ID
   */
  async findById(id: string): Promise<ConversationResponseDto> {
    const conversation = await this.conversationRepository.findById(id);

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return this.toResponseDto(conversation);
  }

  /**
   * Atualizar título da conversa
   */
  async updateTitle(id: string, title: string): Promise<ConversationResponseDto> {
    const conversation = await this.conversationRepository.findById(id);

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    await this.conversationRepository.updateTitle(id, title);

    const updated = await this.conversationRepository.findById(id);
    return this.toResponseDto(updated!);
  }

  /**
   * Arquivar conversa
   */
  async archive(id: string): Promise<ConversationResponseDto> {
    const conversation = await this.conversationRepository.findById(id);

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    await this.conversationRepository.archive(id);

    const updated = await this.conversationRepository.findById(id);
    return this.toResponseDto(updated!);
  }

  /**
   * Deletar conversa
   */
  async delete(id: string): Promise<void> {
    const conversation = await this.conversationRepository.findById(id);

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    await this.conversationRepository.delete(id);
  }

  /**
   * Obter estatísticas
   */
  async getStats(): Promise<{
    totalActive: number;
    totalArchived: number;
    total: number;
  }> {
    const [totalActive, totalArchived] = await Promise.all([
      this.conversationRepository.countByStatus('active'),
      this.conversationRepository.countByStatus('archived'),
    ]);

    return {
      totalActive,
      totalArchived,
      total: totalActive + totalArchived,
    };
  }

  /**
   * Converter documento MongoDB para DTO de resposta
   */
  private toResponseDto(conversation: ConversationDocument): ConversationResponseDto {
    return {
      id: (conversation._id as string).toString(),
      title: conversation.title,
      createdAt: (conversation.createdAt || new Date()).toISOString(),
      updatedAt: (conversation.updatedAt || new Date()).toISOString(),
      messageCount: conversation.messageCount,
      status: conversation.status,
    };
  }

  /**
   * Gerar título padrão para conversa
   */
  private generateDefaultTitle(): string {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `Conversa ${dateStr} às ${timeStr}`;
  }
}
