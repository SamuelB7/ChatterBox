import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  /**
   * Criar nova mensagem
   */
  async create(data: Partial<Message>): Promise<MessageDocument> {
    const message = new this.messageModel(data);
    return message.save();
  }

  /**
   * Buscar mensagens de uma conversa com paginação
   */
  async findByConversation(
    conversationId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ data: MessageDocument[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.messageModel
        .find({ conversationId: new Types.ObjectId(conversationId) })
        .sort({ timestamp: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.messageModel.countDocuments({ conversationId: new Types.ObjectId(conversationId) }),
    ]);

    return { data, total };
  }

  /**
   * Buscar última mensagem de uma conversa
   */
  async findLastByConversation(conversationId: string): Promise<MessageDocument | null> {
    return this.messageModel
      .findOne({ conversationId: new Types.ObjectId(conversationId) })
      .sort({ timestamp: -1 })
      .exec();
  }

  /**
   * Buscar mensagem por ID
   */
  async findById(id: string): Promise<MessageDocument | null> {
    return this.messageModel.findById(id).exec();
  }

  /**
   * Contar mensagens de uma conversa
   */
  async countByConversation(conversationId: string): Promise<number> {
    return this.messageModel
      .countDocuments({ conversationId: new Types.ObjectId(conversationId) })
      .exec();
  }

  /**
   * Deletar todas as mensagens de uma conversa
   */
  async deleteByConversation(conversationId: string): Promise<void> {
    await this.messageModel
      .deleteMany({ conversationId: new Types.ObjectId(conversationId) })
      .exec();
  }

  /**
   * Deletar mensagem por ID
   */
  async delete(id: string): Promise<void> {
    await this.messageModel.findByIdAndDelete(id).exec();
  }

  /**
   * Buscar histórico de mensagens (para IA)
   * Retorna últimas N mensagens em ordem cronológica
   */
  async getConversationHistory(
    conversationId: string,
    limit: number = 50,
  ): Promise<MessageDocument[]> {
    return this.messageModel
      .find({ conversationId: new Types.ObjectId(conversationId) })
      .sort({ timestamp: 1 })
      .limit(limit)
      .exec();
  }
}
