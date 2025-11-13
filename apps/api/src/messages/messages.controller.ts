import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { PaginatedMessagesResponseDto } from './dto/paginated-messages.dto';

@ApiTags('messages')
@Controller('conversations/:conversationId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message from the user' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  @ApiResponse({
    status: 201,
    description:
      'Message sent successfully. AI response will be processed asynchronously via WebSocket.',
    schema: {
      type: 'object',
      properties: {
        userMessage: { $ref: '#/components/schemas/MessageResponseDto' },
        conversationId: { type: 'string', example: '507f1f77bcf86cd799439011' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  async sendMessage(
    @Param('conversationId') conversationId: string,
    @Body() dto: SendMessageDto,
  ): Promise<{ userMessage: MessageResponseDto; conversationId: string }> {
    const userMessage = await this.messagesService.sendMessage(conversationId, dto);

    // TODO: Na Fase 5, processar resposta da IA via ChatService assincronamente
    // setImmediate(() => {
    //   this.chatService.processUserMessage(conversationId, userMessage.id);
    // });

    return {
      userMessage,
      conversationId,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all messages from a conversation' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 50, max: 100)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of messages',
    type: PaginatedMessagesResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  getMessages(
    @Param('conversationId') conversationId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<PaginatedMessagesResponseDto> {
    return this.messagesService.getConversationMessages(conversationId, page, limit);
  }

  @Get('last')
  @ApiOperation({ summary: 'Get the last message from a conversation' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'Last message',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'No messages found' })
  getLastMessage(@Param('conversationId') conversationId: string) {
    return this.messagesService.getLastMessage(conversationId);
  }

  @Delete(':messageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a message' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  @ApiParam({ name: 'messageId', description: 'Message ID' })
  @ApiResponse({ status: 204, description: 'Message deleted successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  delete(@Param('messageId') messageId: string): Promise<void> {
    return this.messagesService.delete(messageId);
  }
}
