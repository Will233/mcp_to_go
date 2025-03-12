import { MCPCore } from '../core/MCPCore.js';
import { OpenAI } from 'openai';
import { config } from 'dotenv';

config();

export class AIService {
  constructor(config) {
    this.modelId = config.modelId || 'gpt-4';
    this.openai = new OpenAI({ apiKey: config.apiKey });
    this.mcpCore = new MCPCore(config.mcpServerUrl);
    this.conversationHistory = [];
  }

  async initialize() {
    await this.mcpCore.initialize();
  }

  async processMessage(message) {
    try {
      this.conversationHistory.push({
        role: 'user',
        content: message
      });

      const completion = await this.openai.chat.completions.create({
        model: this.modelId,
        messages: this.conversationHistory
      });

      const response = completion.choices[0]?.message?.content || '';

      this.conversationHistory.push({
        role: 'assistant',
        content: response
      });

      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }

  getConversationContext() {
    return this.conversationHistory;
  }

  clearContext() {
    this.conversationHistory = [];
  }

  async close() {
    await this.mcpCore.close();
  }
} 