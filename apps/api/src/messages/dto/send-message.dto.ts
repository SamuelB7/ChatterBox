import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    description: 'Message content from the user',
    minLength: 1,
    maxLength: 5000,
    example: 'Olá! Me fale sobre o formato da Terra.',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  @Matches(/\S/, { message: 'Content cannot be only whitespace' })
  content: string;
}
