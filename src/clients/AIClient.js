import { OpenAI } from 'openai';
import { MCPClient, SSEClientTransport } from '@modelcontextprotocol/sdk';
export class AIClient {
    constructor(config) {
        this.openai = new OpenAI({ apiKey: config.openaiApiKey });
        this.transport = new SSEClientTransport({
            url: config.mcpServerUrl
        });
        this.client = new MCPClient(this.transport);
    }
    async initialize() {
        await this.transport.connect();
    }
    async getRules() {
        try {
            const rules = await this.client.readResource({
                uri: 'rules://enterprise',
                _meta: {}
            });
            return rules;
        }
        catch (error) {
            console.error('Error getting rules:', error);
            throw error;
        }
    }
    async getAvailableTools() {
        const tools = await this.client.listTools();
        return tools;
    }
    async processWithAI(input) {
        const tools = await this.getAvailableTools();
        const systemMessage = {
            role: 'system',
            content: `You are an AI assistant with access to the following tools:
Available tools: ${tools.map((t) => t.name).join(', ')}`
        };
        const userMessage = {
            role: 'user',
            content: input
        };
        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: [systemMessage, userMessage],
                functions: tools.map((tool) => ({
                    name: tool.name,
                    description: tool.description,
                    parameters: tool.parameters
                }))
            });
            return completion.choices[0]?.message?.content || '';
        }
        catch (error) {
            console.error('Error processing with AI:', error);
            throw error;
        }
    }
    async processWithPrompt(input) {
        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant.'
                    },
                    {
                        role: 'user',
                        content: input
                    }
                ]
            });
            return completion.choices[0]?.message?.content || '';
        }
        catch (error) {
            console.error('Error processing with prompt:', error);
            throw error;
        }
    }
    async getPromptFromTemplate(promptName, args) {
        try {
            const prompt = await this.client.getPrompt({
                name: promptName,
                arguments: args,
                _meta: {}
            });
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: prompt.messages.map((msg) => ({
                    role: msg.role,
                    content: typeof msg.content === 'string' ? msg.content : msg.content[0].text
                }))
            });
            return completion.choices[0]?.message?.content || '';
        }
        catch (error) {
            console.error('Error getting prompt from template:', error);
            throw error;
        }
    }
    async close() {
        await this.transport.close();
    }
}
