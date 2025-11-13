import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { MessagesService } from './messages.service';
import { MessageRepository } from './repositories/message.repository';
import { ConversationRepository } from '../conversations/repositories/conversation.repository';
import { MessageDocument } from './schemas/message.schema';
import { ConversationDocument } from '../conversations/schemas/conversation.schema';

describe('MessagesService', () => {
  let service: MessagesService;
  let messageRepository: MessageRepository;
  let conversationRepository: ConversationRepository;

  const mockConversationId = '507f1f77bcf86cd799439011';
  const mockMessageId = '507f1f77bcf86cd799439022';

  const mockConversation = {
    _id: new Types.ObjectId(mockConversationId),
    title: 'Test Conversation',
    messageCount: 0,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as ConversationDocument;

  const mockMessage = {
    _id: new Types.ObjectId(mockMessageId),
    conversationId: new Types.ObjectId(mockConversationId),
    role: 'user',
    content: 'Test message',
    timestamp: new Date('2025-11-13T10:00:00.000Z'),
    metadata: undefined,
  } as unknown as MessageDocument;

  const mockMessageRepository = {
    create: jest.fn(),
    findByConversation: jest.fn(),
    findLastByConversation: jest.fn(),
    findById: jest.fn(),
    countByConversation: jest.fn(),
    deleteByConversation: jest.fn(),
    delete: jest.fn(),
    getConversationHistory: jest.fn(),
  };

  const mockConversationRepository = {
    findById: jest.fn(),
    updateMessageCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: MessageRepository,
          useValue: mockMessageRepository,
        },
        {
          provide: ConversationRepository,
          useValue: mockConversationRepository,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    messageRepository = module.get<MessageRepository>(MessageRepository);
    conversationRepository = module.get<ConversationRepository>(ConversationRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should create a user message successfully', async () => {
      mockConversationRepository.findById.mockResolvedValue(mockConversation);
      mockMessageRepository.create.mockResolvedValue(mockMessage);
      mockConversationRepository.updateMessageCount.mockResolvedValue(undefined);

      const result = await service.sendMessage(mockConversationId, {
        content: 'Test message',
      });

      expect(conversationRepository.findById).toHaveBeenCalledWith(mockConversationId);
      expect(messageRepository.create).toHaveBeenCalled();
      expect(conversationRepository.updateMessageCount).toHaveBeenCalledWith(
        mockConversationId,
        1,
      );
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('content', 'Test message');
      expect(result).toHaveProperty('role', 'user');
    });

    it('should throw NotFoundException when conversation does not exist', async () => {
      mockConversationRepository.findById.mockResolvedValue(null);

      await expect(
        service.sendMessage(mockConversationId, { content: 'Test' }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.sendMessage(mockConversationId, { content: 'Test' }),
      ).rejects.toThrow(`Conversation with ID ${mockConversationId} not found`);
    });
  });

  describe('createAssistantMessage', () => {
    it('should create an assistant message successfully', async () => {
      const assistantMessage = {
        ...mockMessage,
        role: 'assistant',
        content: 'AI response',
        metadata: {
          model: 'gemini-pro',
          processingTime: 1500,
        },
      };

      mockConversationRepository.findById.mockResolvedValue(mockConversation);
      mockMessageRepository.create.mockResolvedValue(assistantMessage);
      mockConversationRepository.updateMessageCount.mockResolvedValue(undefined);

      const result = await service.createAssistantMessage(
        mockConversationId,
        'AI response',
        {
          model: 'gemini-pro',
          processingTime: 1500,
        },
      );

      expect(conversationRepository.findById).toHaveBeenCalledWith(mockConversationId);
      expect(messageRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'assistant',
          content: 'AI response',
          metadata: {
            model: 'gemini-pro',
            processingTime: 1500,
          },
        }),
      );
      expect(result.role).toBe('assistant');
      expect(result.metadata).toBeDefined();
    });
  });

  describe('getConversationMessages', () => {
    it('should return paginated messages', async () => {
      const mockData = {
        data: [mockMessage],
        total: 1,
      };

      mockConversationRepository.findById.mockResolvedValue(mockConversation);
      mockMessageRepository.findByConversation.mockResolvedValue(mockData);

      const result = await service.getConversationMessages(mockConversationId, 1, 50);

      expect(conversationRepository.findById).toHaveBeenCalledWith(mockConversationId);
      expect(messageRepository.findByConversation).toHaveBeenCalledWith(
        mockConversationId,
        1,
        50,
      );
      expect(result.messages).toHaveLength(1);
      expect(result.pagination).toHaveProperty('total', 1);
    });

    it('should throw NotFoundException when conversation does not exist', async () => {
      mockConversationRepository.findById.mockResolvedValue(null);

      await expect(service.getConversationMessages(mockConversationId, 1, 50)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should limit to maximum 100 messages per page', async () => {
      const mockData = {
        data: [],
        total: 0,
      };

      mockConversationRepository.findById.mockResolvedValue(mockConversation);
      mockMessageRepository.findByConversation.mockResolvedValue(mockData);

      await service.getConversationMessages(mockConversationId, 1, 200);

      // Should be capped at 100
      expect(messageRepository.findByConversation).toHaveBeenCalledWith(
        mockConversationId,
        1,
        100,
      );
    });
  });

  describe('getLastMessage', () => {
    it('should return the last message of a conversation', async () => {
      mockMessageRepository.findLastByConversation.mockResolvedValue(mockMessage);

      const result = await service.getLastMessage(mockConversationId);

      expect(messageRepository.findLastByConversation).toHaveBeenCalledWith(mockConversationId);
      expect(result).toHaveProperty('id', mockMessageId);
    });

    it('should return null when conversation has no messages', async () => {
      mockMessageRepository.findLastByConversation.mockResolvedValue(null);

      const result = await service.getLastMessage(mockConversationId);

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a message when found', async () => {
      mockMessageRepository.findById.mockResolvedValue(mockMessage);

      const result = await service.findById(mockMessageId);

      expect(messageRepository.findById).toHaveBeenCalledWith(mockMessageId);
      expect(result).toHaveProperty('id', mockMessageId);
    });

    it('should throw NotFoundException when message not found', async () => {
      mockMessageRepository.findById.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a message and decrement message count', async () => {
      mockMessageRepository.findById.mockResolvedValue(mockMessage);
      mockMessageRepository.delete.mockResolvedValue(undefined);
      mockConversationRepository.updateMessageCount.mockResolvedValue(undefined);

      await service.delete(mockMessageId);

      expect(messageRepository.findById).toHaveBeenCalledWith(mockMessageId);
      expect(messageRepository.delete).toHaveBeenCalledWith(mockMessageId);
      expect(conversationRepository.updateMessageCount).toHaveBeenCalledWith(
        mockConversationId,
        -1,
      );
    });

    it('should throw NotFoundException when message not found', async () => {
      mockMessageRepository.findById.mockResolvedValue(null);

      await expect(service.delete('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getConversationHistory', () => {
    it('should return conversation history for AI', async () => {
      const messages = [
        mockMessage,
        {
          ...mockMessage,
          _id: new Types.ObjectId(),
          role: 'assistant',
          content: 'AI response',
        },
      ];

      mockMessageRepository.getConversationHistory.mockResolvedValue(messages);

      const result = await service.getConversationHistory(mockConversationId, 50);

      expect(messageRepository.getConversationHistory).toHaveBeenCalledWith(
        mockConversationId,
        50,
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('role', 'user');
      expect(result[1]).toHaveProperty('role', 'assistant');
    });
  });
});
