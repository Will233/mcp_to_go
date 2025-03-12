import { MCPServerImpl } from '../services/MCPServer';
import { AIClient } from '../clients/AIClient';
import dotenv from 'dotenv';
dotenv.config();
async function runExample() {
    try {
        // Start MCP server
        const server = new MCPServerImpl(3001);
        await server.start();
        console.log('MCP server started');
        // Initialize AI client
        const client = new AIClient({
            openaiApiKey: process.env.OPENAI_API_KEY || '',
            mcpServerUrl: 'http://localhost:3001'
        });
        await client.initialize();
        console.log('AI client initialized');
        // Example 1: Process with AI
        const result1 = await client.processWithAI('What tools are available to me?');
        console.log('Example 1 result:', result1);
        // Example 2: Process with prompt
        const result2 = await client.processWithPrompt('How can I analyze this data: [1, 2, 3, 4, 5]?');
        console.log('Example 2 result:', result2);
        // Example 3: Use prompt template
        const result3 = await client.getPromptFromTemplate('data-analysis', {
            data: '[1, 2, 3, 4, 5]',
            context: 'statistical analysis'
        });
        console.log('Example 3 result:', result3);
        // Example 4: Use another prompt template
        const result4 = await client.getPromptFromTemplate('situation-response', {
            situation: 'High server load',
            constraints: 'budget, time, resources'
        });
        console.log('Example 4 result:', result4);
        // Cleanup
        await client.close();
        await server.stop();
        console.log('Example completed successfully');
    }
    catch (error) {
        console.error('Error running example:', error);
        process.exit(1);
    }
}
runExample().catch(console.error);
