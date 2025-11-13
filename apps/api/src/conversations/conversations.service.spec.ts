import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationRepository } from './repositories/conversation.repository';
import { ConversationDocument } from './schemas/conversation.schema';

describe('ConversationsService', () => {
  let service: ConversationsService;
  let repository: ConversationRepository;

  const mockConversationDocument = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Conversation',
    messageCount: 0,
    status: 'active',
    createdAt: new Date('2025-11-13T10:00:00.000Z'),
    updatedAt: new Date('2025-11-13T10:00:00.000Z'),
  } as unknown as ConversationDocument;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateMessageCount: jest.fn(),
    updateTitle: jest.fn(),
    archive: jest.fn(),
    delete: jest.fn(),
    countByStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        {
          provide: ConversationRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
    repository = module.get<ConversationRepository>(ConversationRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new conversation with default title', async () => {
      mockRepository.create.mockResolvedValue(mockConversationDocument);

      const result = await service.create({});

      expect(repository.create).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('messageCount', 0);
      expect(result).toHaveProperty('status', 'active');
    });

    it('should create conversation with custom title', async () => {
      const customTitle = 'My Custom Title';
      const customConversation = {
        ...mockConversationDocument,
        title: customTitle,
      };

      mockRepository.create.mockResolvedValue(customConversation);

      const result = await service.create({ title: customTitle });

      expect(repository.create).toHaveBeenCalledWith({ title: customTitle });
      expect(result.title).toBe(customTitle);
    });
  });

  describe('findAll', () => {
    it('should return paginated conversations', async () => {
      const mockData = {
        data: [mockConversationDocument],
        total: 1,
      };

      mockRepository.findAll.mockResolvedValue(mockData);

      const result = await service.findAll(1, 20);

      expect(repository.findAll).toHaveBeenCalledWith(1, 20, undefined);
      expect(result.conversations).toHaveLength(1);
      expect(result.pagination).toHaveProperty('total', 1);
      expect(result.pagination).toHaveProperty('page', 1);
      expect(result.pagination).toHaveProperty('limit', 20);
    });

    it('should return conversations filtered by status', async () => {
      const mockData = {
        data: [mockConversationDocument],
        total: 1,
      };

      mockRepository.findAll.mockResolvedValue(mockData);

      const result = await service.findAll(1, 20, 'active');

      expect(repository.findAll).toHaveBeenCalledWith(1, 20, 'active');
    });
  });

  describe('findById', () => {
    it('should return a conversation when found', async () => {
      mockRepository.findById.mockResolvedValue(mockConversationDocument);

      const result = await service.findById('507f1f77bcf86cd799439011');

      expect(repository.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toBeDefined();
      expect(result.id).toBe('507f1f77bcf86cd799439011');
      expect(result.title).toBe('Test Conversation');
    });

    it('should throw NotFoundException when conversation not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
      await expect(service.findById('nonexistent')).rejects.toThrow(
        'Conversation with ID nonexistent not found',
      );
    });
  });

  describe('updateTitle', () => {
    it('should update conversation title successfully', async () => {
      const newTitle = 'Updated Title';
      const updatedConversation = {
        ...mockConversationDocument,
        title: newTitle,
      };

      mockRepository.findById.mockResolvedValueOnce(mockConversationDocument);
      mockRepository.updateTitle.mockResolvedValue(undefined);
      mockRepository.findById.mockResolvedValueOnce(updatedConversation);

      const result = await service.updateTitle('507f1f77bcf86cd799439011', newTitle);

      expect(repository.updateTitle).toHaveBeenCalledWith('507f1f77bcf86cd799439011', newTitle);
      expect(result.title).toBe(newTitle);
    });

    it('should throw NotFoundException when updating non-existent conversation', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.updateTitle('nonexistent', 'New Title')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('archive', () => {
    it('should archive conversation successfully', async () => {
      const archivedConversation = {
        ...mockConversationDocument,
        status: 'archived',
      };

      mockRepository.findById.mockResolvedValueOnce(mockConversationDocument);
      mockRepository.archive.mockResolvedValue(undefined);
      mockRepository.findById.mockResolvedValueOnce(archivedConversation);

      const result = await service.archive('507f1f77bcf86cd799439011');

      expect(repository.archive).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result.status).toBe('archived');
    });
  });

  describe('delete', () => {
    it('should delete conversation successfully', async () => {
      mockRepository.findById.mockResolvedValue(mockConversationDocument);
      mockRepository.delete.mockResolvedValue(undefined);

      await service.delete('507f1f77bcf86cd799439011');

      expect(repository.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(repository.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException when deleting non-existent conversation', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('should return conversation statistics', async () => {
      mockRepository.countByStatus.mockResolvedValueOnce(10); // active
      mockRepository.countByStatus.mockResolvedValueOnce(5); // archived

      const result = await service.getStats();

      expect(repository.countByStatus).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        total: 15,
        totalActive: 10,
        totalArchived: 5,
      });
    });
  });
});
