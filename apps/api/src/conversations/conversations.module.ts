import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { ConversationRepository } from './repositories/conversation.repository';
import { Conversation, ConversationSchema } from './schemas/conversation.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }])],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationRepository],
  exports: [ConversationsService, ConversationRepository],
})
export class ConversationsModule {}
