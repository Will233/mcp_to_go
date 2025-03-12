import { Server } from '@modelcontextprotocol/sdk/dist/esm/server.js';
import express from 'express';

export class MCPServerImpl {
  constructor(port) {
    this.port = port;
    this.app = express();
    this.server = new Server({
      port,
      resources: this.setupResources(),
      tools: this.setupTools(),
      prompts: this.setupPrompts()
    });

    this.setupEndpoints();
  }

  setupEndpoints() {
    this.app.get('/mcp/sse', (req, res) => {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const messageHandler = (message) => {
        res.write(`data: ${JSON.stringify(message)}\n\n`);
      };

      this.server.on('message', messageHandler);

      req.on('close', () => {
        this.server.off('message', messageHandler);
      });
    });

    this.app.post('/mcp/messages', express.json(), async (req, res) => {
      try {
        const result = await this.server.processMessage(req.body);
        res.json(result);
      } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  }

  setupResources() {
    return [
      {
        uriPattern: 'rules://enterprise',
        handler: async (uri, context) => ({
          content: [
            {
              type: 'text',
              text: `Enterprise rules for user ${context.userId}:
1. Follow security protocols
2. Validate all inputs
3. Log important operations`
            }
          ]
        })
      },
      {
        uriPattern: 'tools://available',
        handler: async (uri) => ({
          content: [
            {
              type: 'text',
              text: JSON.stringify(this.server.getTools())
            }
          ]
        })
      }
    ];
  }

  setupTools() {
    return [
      {
        name: 'process-data',
        description: 'Process data according to specified options',
        handler: async ({ data, options }) => ({
          content: [
            {
              type: 'text',
              text: `Processed data: ${data} with options: ${JSON.stringify(options)}`
            }
          ]
        })
      },
      {
        name: 'execute-operation',
        description: 'Execute a specific operation with parameters',
        handler: async ({ operation, parameters }) => ({
          content: [
            {
              type: 'text',
              text: `Executed ${operation} with parameters: ${JSON.stringify(parameters)}`
            }
          ]
        })
      }
    ];
  }

  setupPrompts() {
    return [
      {
        name: 'data-analysis',
        handler: ({ data, context }) => ({
          messages: [
            {
              role: 'system',
              content: [
                {
                  type: 'text',
                  text: 'You are a data analysis assistant.'
                }
              ]
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Please analyze this data: ${data}\nContext: ${JSON.stringify(context)}`
                }
              ]
            }
          ]
        })
      }
    ];
  }

  async start() {
    await this.server.start();
    this.app.listen(this.port, () => {
      console.log(`MCP Server listening on port ${this.port}`);
    });
  }

  async stop() {
    await this.server.stop();
    console.log('MCP Server stopped');
  }
} 