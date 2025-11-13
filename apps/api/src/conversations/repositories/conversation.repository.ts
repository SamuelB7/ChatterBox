import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation, ConversationDocument } from '../schemas/conversation.schema';

@Injectable()
export class ConversationRepository {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  /**
   * Criar nova conversa
   */
  async create(data: Partial<Conversation>): Promise<ConversationDocument> {
    const conversation = new this.conversationModel(data);
    return conversation.save();
  }

  /**
   * Buscar todas as conversas com paginação
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    status?: string,
  ): Promise<{ data: ConversationDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter = status ? { status } : {};

    const [data, total] = await Promise.all([
      this.conversationModel.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).exec(),
      this.conversationModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  /**
   * Buscar conversa por ID
   */
  async findById(id: string): Promise<ConversationDocument | null> {
    return this.conversationModel.findById(id).exec();
  }

  /**
   * Atualizar contador de mensagens
   */
  async updateMessageCount(id: string, increment: number = 1): Promise<void> {
    await this.conversationModel.findByIdAndUpdate(id, {
      $inc: { messageCount: increment },
      $set: { updatedAt: new Date() },
    });
  }

  /**
   * Atualizar título da conversa
   */
  async updateTitle(id: string, title: string): Promise<void> {
    await this.conversationModel.findByIdAndUpdate(id, {
      $set: { title, updatedAt: new Date() },
    });
  }

  /**
   * Arquivar conversa
   */
  async archive(id: string): Promise<void> {
    await this.conversationModel.findByIdAndUpdate(id, {
      $set: { status: 'archived', updatedAt: new Date() },
    });
  }

  /**
   * Deletar conversa
   */
  async delete(id: string): Promise<void> {
    await this.conversationModel.findByIdAndDelete(id).exec();
  }

  /**
   * Contar conversas por status
   */
  async countByStatus(status: string): Promise<number> {
    return this.conversationModel.countDocuments({ status }).exec();
  }
}
