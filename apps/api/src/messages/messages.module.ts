import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessageRepository } from './repositories/message.repository';
import { Message, MessageSchema } from './schemas/message.schema';
import { ConversationsModule } from '../conversations/conversations.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ConversationsModule, // Importar para usar ConversationRepository
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessageRepository],
  exports: [MessagesService, MessageRepository],
})
export class MessagesModule {}
