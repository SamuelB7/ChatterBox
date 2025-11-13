import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true, maxlength: 200 })
  title: string;

  @Prop({ default: 0 })
  messageCount: number;

  @Prop({ type: String, enum: ['active', 'archived'], default: 'active' })
  status: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// Indexes para otimizar queries
ConversationSchema.index({ updatedAt: -1 });
ConversationSchema.index({ status: 1, updatedAt: -1 });
