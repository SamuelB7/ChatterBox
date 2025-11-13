import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ConversationResponseDto } from './dto/conversation-response.dto';
import { PaginatedConversationsResponseDto } from './dto/paginated-conversations.dto';

@ApiTags('conversations')
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiResponse({
    status: 201,
    description: 'Conversation created successfully',
    type: ConversationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  create(@Body() dto: CreateConversationDto): Promise<ConversationResponseDto> {
    return this.conversationsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all conversations with pagination' })
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
    description: 'Items per page (default: 20, max: 100)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'archived'],
    description: 'Filter by status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of conversations',
    type: PaginatedConversationsResponseDto,
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: string,
  ): Promise<PaginatedConversationsResponseDto> {
    return this.conversationsService.findAll(page, limit, status);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get conversation statistics' })
  @ApiResponse({
    status: 200,
    description: 'Conversation statistics',
    schema: {
      type: 'object',
      properties: {
        totalActive: { type: 'number', example: 15 },
        totalArchived: { type: 'number', example: 3 },
        total: { type: 'number', example: 18 },
      },
    },
  })
  getStats() {
    return this.conversationsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get conversation by ID' })
  @ApiParam({ name: 'id', description: 'Conversation ID (MongoDB ObjectId)' })
  @ApiResponse({
    status: 200,
    description: 'Conversation found',
    type: ConversationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  findById(@Param('id') id: string): Promise<ConversationResponseDto> {
    return this.conversationsService.findById(id);
  }

  @Patch(':id/title')
  @ApiOperation({ summary: 'Update conversation title' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'Title updated successfully',
    type: ConversationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  updateTitle(
    @Param('id') id: string,
    @Body('title') title: string,
  ): Promise<ConversationResponseDto> {
    return this.conversationsService.updateTitle(id, title);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'Conversation archived successfully',
    type: ConversationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  archive(@Param('id') id: string): Promise<ConversationResponseDto> {
    return this.conversationsService.archive(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete conversation permanently' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({ status: 204, description: 'Conversation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  delete(@Param('id') id: string): Promise<void> {
    return this.conversationsService.delete(id);
  }
}
