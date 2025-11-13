import { ApiProperty } from '@nestjs/swagger';
import { ConversationResponseDto } from './conversation-response.dto';

export class PaginationDto {
  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;

  @ApiProperty({ example: false })
  hasPreviousPage: boolean;
}

export class PaginatedConversationsResponseDto {
  @ApiProperty({ type: [ConversationResponseDto] })
  conversations: ConversationResponseDto[];

  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;
}
