import { IsOptional, IsString, MaxLength, MinLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiPropertyOptional({
    description: 'Custom title for the conversation',
    maxLength: 200,
    example: 'Conversa sobre a Terra',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    description: 'Initial message from user',
    maxLength: 5000,
    example: 'Olá! Me fale sobre o planeta Terra.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  @Matches(/\S/, { message: 'Message cannot be only whitespace' })
  initialMessage?: string;
}
