import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface ILastMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export class ConversationResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'Conversa sobre a Terra' })
  title: string;

  @ApiProperty({ example: '2025-11-13T14:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-11-13T14:35:22.000Z' })
  updatedAt: string;

  @ApiProperty({ example: 8 })
  messageCount: number;

  @ApiProperty({ enum: ['active', 'archived'], example: 'active' })
  status: string;

  @ApiPropertyOptional({
    description: 'Last message in the conversation',
    type: 'object',
  })
  lastMessage?: ILastMessage;
}
