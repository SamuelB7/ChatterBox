import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  FLAT_EARTH_SYSTEM_PROMPT,
  buildConversationContext,
  isFirstMessage,
} from './prompts/flat-earth.prompt';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  metadata: {
    model: string;
    tokensUsed?: number;
    processingTime: number;
  };
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private genAI: GoogleGenerativeAI;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private model: any; // Gemini SDK não exporta tipo específico do model
  private readonly modelName: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      this.logger.warn(
        '⚠️  GEMINI_API_KEY não configurada! Configure no arquivo .env para usar a IA.',
      );
      throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env file.');
    }

    this.modelName = this.configService.get<string>('GEMINI_MODEL', 'gemini-pro');

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: this.modelName,
      });
      this.logger.log(`✅ Google Gemini AI initialized with model: ${this.modelName}`);
    } catch (error) {
      this.logger.error('❌ Failed to initialize Google Gemini AI:', error);
      throw error;
    }
  }

  /**
   * Gerar resposta da IA baseada no histórico da conversa
   */
  async generateResponse(conversationHistory: AIMessage[]): Promise<AIResponse> {
    try {
      const startTime = Date.now();

      // Construir contexto da conversa
      const context = buildConversationContext(conversationHistory);
      const isFirst = isFirstMessage(conversationHistory);

      // Construir prompt completo
      let prompt = `${FLAT_EARTH_SYSTEM_PROMPT}\n\n--- HISTÓRICO DA CONVERSA ---\n${context}\n\n--- FIM DO HISTÓRICO ---\n\n`;

      if (isFirst) {
        prompt +=
          'Esta é a primeira mensagem do usuário. Cumprimente-o de forma amigável e introduza sutilmente o tema da forma da Terra. Seja breve e conversacional.\n\n';
      } else {
        prompt +=
          'Responda ao usuário de forma persuasiva e natural, seguindo o objetivo de convencê-lo de que a Terra é plana:\n\n';
      }

      this.logger.debug(
        `Gerando resposta para conversa com ${conversationHistory.length} mensagens`,
      );

      // Gerar resposta
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const processingTime = Date.now() - startTime;

      this.logger.log(`✅ Resposta gerada em ${processingTime}ms (${text.length} caracteres)`);

      return {
        content: text,
        metadata: {
          model: this.modelName,
          processingTime,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('❌ Erro ao gerar resposta da IA:', errorMessage);
      throw new Error(`Failed to generate AI response: ${errorMessage}`);
    }
  }

  /**
   * Gerar resposta da IA com streaming (para WebSocket - Fase 5)
   * Retorna um AsyncGenerator que emite chunks de texto
   */
  async *generateResponseStream(
    conversationHistory: AIMessage[],
  ): AsyncGenerator<string, void, unknown> {
    try {
      const context = buildConversationContext(conversationHistory);
      const isFirst = isFirstMessage(conversationHistory);

      let prompt = `${FLAT_EARTH_SYSTEM_PROMPT}\n\n--- HISTÓRICO DA CONVERSA ---\n${context}\n\n--- FIM DO HISTÓRICO ---\n\n`;

      if (isFirst) {
        prompt +=
          'Esta é a primeira mensagem do usuário. Cumprimente-o de forma amigável e introduza sutilmente o tema da forma da Terra. Seja breve e conversacional.\n\n';
      } else {
        prompt +=
          'Responda ao usuário de forma persuasiva e natural, seguindo o objetivo de convencê-lo de que a Terra é plana:\n\n';
      }

      this.logger.debug(
        `Iniciando streaming de resposta para conversa com ${conversationHistory.length} mensagens`,
      );

      const result = await this.model.generateContentStream(prompt);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        yield chunkText;
      }

      this.logger.log('✅ Streaming de resposta concluído');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('❌ Erro no streaming de resposta:', errorMessage);
      throw new Error(`Failed to stream AI response: ${errorMessage}`);
    }
  }

  /**
   * Verificar se o serviço de IA está configurado e funcionando
   */
  async healthCheck(): Promise<{
    status: 'ok' | 'error';
    model: string;
    configured: boolean;
  }> {
    try {
      const apiKey = this.configService.get<string>('GEMINI_API_KEY');
      const configured = apiKey !== 'your_gemini_api_key_here';

      if (!configured) {
        return {
          status: 'error',
          model: this.modelName,
          configured: false,
        };
      }

      // Teste simples
      await this.model.generateContent('Hello');

      return {
        status: 'ok',
        model: this.modelName,
        configured: true,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('❌ Health check falhou:', errorMessage);
      return {
        status: 'error',
        model: this.modelName,
        configured: false,
      };
    }
  }
}
