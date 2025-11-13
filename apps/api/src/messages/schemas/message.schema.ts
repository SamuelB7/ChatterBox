import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: false })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true, index: true })
  conversationId: Types.ObjectId;

  @Prop({ type: String, enum: ['user', 'assistant'], required: true })
  role: string;

  @Prop({ required: true, maxlength: 10000 })
  content: string;

  @Prop({ type: Date, default: () => new Date(), index: true })
  timestamp: Date;

  @Prop({ type: Object })
  metadata?: {
    model?: string;
    tokensUsed?: number;
    processingTime?: number;
  };
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Índice composto para queries eficientes
MessageSchema.index({ conversationId: 1, timestamp: 1 });
