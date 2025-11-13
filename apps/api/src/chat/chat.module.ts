import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MessagesModule } from '../messages/messages.module';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [MessagesModule, AIModule],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
