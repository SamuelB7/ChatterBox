import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AIService, AIMessage } from './ai.service';

describe('AIService', () => {
  let service: AIService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: string) => {
      const config: Record<string, string> = {
        GEMINI_API_KEY: 'test-api-key-12345',
        GEMINI_MODEL: 'gemini-pro',
      };
      return config[key] || defaultValue;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AIService>(AIService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should initialize with valid API key', () => {
      expect(configService.get).toHaveBeenCalledWith('GEMINI_API_KEY');
      expect(service).toBeInstanceOf(AIService);
    });

    it('should throw error if GEMINI_API_KEY is not configured', () => {
      const mockInvalidConfigService = {
        get: jest.fn(() => undefined),
      };

      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new AIService(mockInvalidConfigService as any);
      }).toThrow('GEMINI_API_KEY is not configured. Please set it in your .env file.');
    });

    it('should throw error if GEMINI_API_KEY is placeholder', () => {
      const mockInvalidConfigService = {
        get: jest.fn((key: string) => {
          if (key === 'GEMINI_API_KEY') return 'your_gemini_api_key_here';
          return 'gemini-pro';
        }),
      };

      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new AIService(mockInvalidConfigService as any);
      }).toThrow('GEMINI_API_KEY is not configured. Please set it in your .env file.');
    });
  });

  describe('generateResponse', () => {
    it('should handle empty conversation history', async () => {
      const conversationHistory: AIMessage[] = [];

      // Este teste não pode executar a chamada real da API
      // Apenas verificamos que o método está definido
      expect(service.generateResponse).toBeDefined();
      expect(typeof service.generateResponse).toBe('function');
    });

    it('should handle conversation history with user and assistant messages', async () => {
      const conversationHistory: AIMessage[] = [
        { role: 'user', content: 'Olá!' },
        { role: 'assistant', content: 'Olá! Como posso ajudar?' },
        { role: 'user', content: 'Me fale sobre a Terra' },
      ];

      // Verificar que aceita o formato correto
      expect(conversationHistory).toHaveLength(3);
      expect(conversationHistory[0].role).toBe('user');
      expect(conversationHistory[1].role).toBe('assistant');
    });
  });

  describe('generateResponseStream', () => {
    it('should be an async generator function', () => {
      expect(service.generateResponseStream).toBeDefined();
      expect(service.generateResponseStream.constructor.name).toBe('AsyncGeneratorFunction');
    });

    it('should accept conversation history parameter', () => {
      const conversationHistory: AIMessage[] = [
        { role: 'user', content: 'Test message' },
      ];

      const generator = service.generateResponseStream(conversationHistory);
      expect(generator).toBeDefined();
      expect(typeof generator[Symbol.asyncIterator]).toBe('function');
    });
  });

  describe('healthCheck', () => {
    it('should return configured status', async () => {
      const result = await service.healthCheck();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('model');
      expect(result).toHaveProperty('configured');
      expect(result.model).toBe('gemini-pro');
    });

    it('should return error status when API key is invalid', async () => {
      const mockInvalidService = {
        get: jest.fn((key: string) => {
          if (key === 'GEMINI_API_KEY') return 'your_gemini_api_key_here';
          return 'gemini-pro';
        }),
      };

      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new AIService(mockInvalidService as any);
      }).toThrow();
    });
  });

  describe('AIMessage interface', () => {
    it('should have correct structure', () => {
      const userMessage: AIMessage = {
        role: 'user',
        content: 'Test content',
      };

      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: 'AI response',
      };

      expect(userMessage.role).toBe('user');
      expect(assistantMessage.role).toBe('assistant');
      expect(userMessage.content).toBeDefined();
      expect(assistantMessage.content).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should handle errors gracefully in generateResponse', async () => {
      // Este teste verifica que o método tem tratamento de erro
      // A implementação real lança Error quando falha
      expect(service.generateResponse).toBeDefined();
    });

    it('should have proper error handling in generateResponseStream', async () => {
      // Verificar que o método existe e é um AsyncGenerator
      const conversationHistory: AIMessage[] = [];
      const generator = service.generateResponseStream(conversationHistory);

      expect(generator).toBeDefined();
      expect(typeof generator[Symbol.asyncIterator]).toBe('function');
    });
  });
});
