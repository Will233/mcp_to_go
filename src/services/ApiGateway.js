import express from 'express';
import { AIService } from './AIService.js';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
config();
export class ApiGateway {
    constructor(port = 3000) {
        this.app = express();
        this.port = port;
        const aiConfig = {
            apiKey: process.env.OPENAI_API_KEY || '',
            mcpServerUrl: process.env.MCP_SERVER_URL || 'http://localhost:3001',
            modelId: process.env.OPENAI_MODEL_ID
        };
        this.aiService = new AIService(aiConfig);
        this.setupMiddleware();
        this.setupRoutes();
    }
    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(helmet());
    }
    setupRoutes() {
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({ status: 'ok' });
        });
        // Process message endpoint
        this.app.post('/chat', async (req, res) => {
            try {
                const { message } = req.body;
                if (!message) {
                    return res.status(400).json({ error: 'Message is required' });
                }
                const response = await this.aiService.processMessage(message);
                res.json({ response });
            }
            catch (error) {
                console.error('Error processing chat:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        // Get conversation context endpoint
        this.app.get('/context', (req, res) => {
            try {
                const context = this.aiService.getConversationContext();
                res.json({ context });
            }
            catch (error) {
                console.error('Error getting context:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        // Clear conversation context endpoint
        this.app.post('/context/clear', (req, res) => {
            try {
                this.aiService.clearContext();
                res.json({ status: 'ok' });
            }
            catch (error) {
                console.error('Error clearing context:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    async start() {
        await this.aiService.initialize();
        this.app.listen(this.port, () => {
            console.log(`API Gateway running on port ${this.port}`);
        });
    }
    async stop() {
        await this.aiService.close();
    }
}
