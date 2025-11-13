import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface IMessageMetadata {
  model?: string;
  tokensUsed?: number;
  processingTime?: number;
}

export class MessageResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  conversationId: string;

  @ApiProperty({ enum: ['user', 'assistant'], example: 'user' })
  role: string;

  @ApiProperty({ example: 'Olá! Me fale sobre a Terra.' })
  content: string;

  @ApiProperty({ example: '2025-11-13T14:30:00.000Z' })
  timestamp: string;

  @ApiPropertyOptional({
    description: 'Metadata about the message (only for assistant messages)',
    type: 'object',
    example: {
      model: 'gemini-pro',
      tokensUsed: 150,
      processingTime: 1250,
    },
  })
  metadata?: IMessageMetadata;
}
