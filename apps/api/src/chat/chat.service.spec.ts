import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { MessagesService } from '../messages/messages.service';
import { AIService, AIMessage } from '../ai/ai.service';

describe('ChatService', () => {
  let service: ChatService;
  let messagesService: MessagesService;
  let aiService: AIService;

  const mockConversationId = '507f1f77bcf86cd799439011';
  const mockUserMessageId = '507f1f77bcf86cd799439022';
  const mockAssistantMessageId = '507f1f77bcf86cd799439033';

  const mockUserMessage = {
    id: mockUserMessageId,
    conversationId: mockConversationId,
    role: 'user',
    content: 'Olá! Como você está?',
    timestamp: new Date().toISOString(),
  };

  const mockAssistantMessage = {
    id: mockAssistantMessageId,
    conversationId: mockConversationId,
    role: 'assistant',
    content: 'Olá! Estou bem, obrigado por perguntar!',
    timestamp: new Date().toISOString(),
    metadata: {
      model: 'gemini-pro',
      processingTime: 1500,
    },
  };

  const mockMessagesService = {
    sendMessage: jest.fn(),
    createAssistantMessage: jest.fn(),
    getConversationHistory: jest.fn(),
    getConversationMessages: jest.fn(),
  };

  const mockAIService = {
    generateResponse: jest.fn(),
    generateResponseStream: jest.fn(),
    healthCheck: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
        {
          provide: AIService,
          useValue: mockAIService,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    messagesService = module.get<MessagesService>(MessagesService);
    aiService = module.get<AIService>(AIService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have messagesService injected', () => {
      expect(messagesService).toBeDefined();
    });

    it('should have aiService injected', () => {
      expect(aiService).toBeDefined();
    });
  });

  describe('processMessage', () => {
    it('should process user message and generate AI response', async () => {
      const userMessage = 'Olá! Como você está?';
      const aiResponse = {
        content: 'Olá! Estou bem, obrigado!',
        metadata: {
          model: 'gemini-pro',
          processingTime: 1500,
        },
      };

      const conversationHistory = [
        { role: 'user', content: userMessage, timestamp: new Date().toISOString() },
      ];

      mockMessagesService.sendMessage.mockResolvedValue(mockUserMessage);
      mockMessagesService.getConversationHistory.mockResolvedValue(conversationHistory);
      mockAIService.generateResponse.mockResolvedValue(aiResponse);
      mockMessagesService.createAssistantMessage.mockResolvedValue(mockAssistantMessage);

      const result = await service.processMessage(mockConversationId, userMessage);

      expect(messagesService.sendMessage).toHaveBeenCalledWith(mockConversationId, {
        content: userMessage,
      });
      expect(messagesService.getConversationHistory).toHaveBeenCalledWith(
        mockConversationId,
        50,
      );
      expect(aiService.generateResponse).toHaveBeenCalled();
      expect(messagesService.createAssistantMessage).toHaveBeenCalled();

      expect(result).toHaveProperty('userMessageId', mockUserMessageId);
      expect(result).toHaveProperty('assistantMessageId', mockAssistantMessageId);
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('processingTime');
    });

    it('should handle errors gracefully', async () => {
      mockMessagesService.sendMessage.mockRejectedValue(new Error('Database error'));

      await expect(service.processMessage(mockConversationId, 'Test')).rejects.toThrow();

      expect(messagesService.sendMessage).toHaveBeenCalled();
    });
  });

  describe('processMessageStream', () => {
    it('should be an async generator function', () => {
      expect(service.processMessageStream).toBeDefined();
      expect(service.processMessageStream.constructor.name).toBe('AsyncGeneratorFunction');
    });

    it('should yield events during message processing', async () => {
      const userMessage = 'Test message';

      mockMessagesService.sendMessage.mockResolvedValue(mockUserMessage);
      mockMessagesService.getConversationHistory.mockResolvedValue([]);

      // Mock do stream generator da IA
      async function* mockStream() {
        yield 'Hello ';
        yield 'world!';
      }
      mockAIService.generateResponseStream.mockReturnValue(mockStream());
      mockMessagesService.createAssistantMessage.mockResolvedValue(mockAssistantMessage);

      const generator = service.processMessageStream(mockConversationId, userMessage);

      // Coletar todos os eventos
      const events = [];
      for await (const event of generator) {
        events.push(event);
      }

      // Verificar que eventos foram emitidos
      expect(events.length).toBeGreaterThan(0);

      // Deve ter evento userMessage
      const userMessageEvent = events.find((e) => e.type === 'userMessage');
      expect(userMessageEvent).toBeDefined();

      // Deve ter eventos chunk
      const chunkEvents = events.filter((e) => e.type === 'chunk');
      expect(chunkEvents.length).toBeGreaterThan(0);

      // Deve ter evento complete
      const completeEvent = events.find((e) => e.type === 'complete');
      expect(completeEvent).toBeDefined();
    });

    it('should handle stream errors gracefully', async () => {
      mockMessagesService.sendMessage.mockResolvedValue(mockUserMessage);
      mockMessagesService.getConversationHistory.mockResolvedValue([]);

      async function* mockErrorStream() {
        yield 'Start';
        throw new Error('Stream error');
      }
      mockAIService.generateResponseStream.mockReturnValue(mockErrorStream());

      const generator = service.processMessageStream(mockConversationId, 'Test');

      await expect(async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const event of generator) {
          // Iterar até o erro
        }
      }).rejects.toThrow();
    });
  });

  describe('conversationExists', () => {
    it('should return true when conversation exists', async () => {
      mockMessagesService.getConversationMessages.mockResolvedValue({
        messages: [],
        pagination: {},
      });

      const result = await service.conversationExists(mockConversationId);

      expect(result).toBe(true);
      expect(messagesService.getConversationMessages).toHaveBeenCalledWith(
        mockConversationId,
        1,
        1,
      );
    });

    it('should return false when conversation does not exist', async () => {
      mockMessagesService.getConversationMessages.mockRejectedValue(new Error('Not found'));

      const result = await service.conversationExists(mockConversationId);

      expect(result).toBe(false);
    });
  });

  describe('integration with MessagesService', () => {
    it('should save user message before processing', async () => {
      const userMessage = 'Test message';

      mockMessagesService.sendMessage.mockResolvedValue(mockUserMessage);
      mockMessagesService.getConversationHistory.mockResolvedValue([]);
      mockAIService.generateResponse.mockResolvedValue({
        content: 'Response',
        metadata: { model: 'gemini-pro', processingTime: 1000 },
      });
      mockMessagesService.createAssistantMessage.mockResolvedValue(mockAssistantMessage);

      await service.processMessage(mockConversationId, userMessage);

      expect(messagesService.sendMessage).toHaveBeenCalled();
      expect(aiService.generateResponse).toHaveBeenCalled();
    });

    it('should convert message history to AI format', async () => {
      const history = [
        { role: 'user', content: 'Hello', timestamp: new Date().toISOString() },
        { role: 'assistant', content: 'Hi', timestamp: new Date().toISOString() },
      ];

      mockMessagesService.sendMessage.mockResolvedValue(mockUserMessage);
      mockMessagesService.getConversationHistory.mockResolvedValue(history);
      mockAIService.generateResponse.mockResolvedValue({
        content: 'Response',
        metadata: { model: 'gemini-pro', processingTime: 1000 },
      });
      mockMessagesService.createAssistantMessage.mockResolvedValue(mockAssistantMessage);

      await service.processMessage(mockConversationId, 'New message');

      const aiHistoryCall = (aiService.generateResponse as jest.Mock).mock.calls[0][0];
      expect(aiHistoryCall).toBeInstanceOf(Array);
      expect(aiHistoryCall[0]).toHaveProperty('role');
      expect(aiHistoryCall[0]).toHaveProperty('content');
    });
  });
});
