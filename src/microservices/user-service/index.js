#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListResourcesRequestSchema, ListToolsRequestSchema, McpError, ReadResourceRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
// Mock database for users
const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
];
class UserServiceMcpServer {
    constructor() {
        this.server = new Server({
            name: 'enterprise-user-service',
            version: '1.0.0',
        }, {
            capabilities: {
                resources: {},
                tools: {},
            },
        });
        this.setupResourceHandlers();
        this.setupToolHandlers();
        // Error handling
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupResourceHandlers() {
        // List available resources
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
            resources: [
                {
                    uri: `user://all`,
                    name: `All Users`,
                    mimeType: 'application/json',
                    description: 'List of all users in the system',
                },
            ],
        }));
        // Read resources
        this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
            const uri = request.params.uri;
            if (uri === 'user://all') {
                return {
                    contents: [
                        {
                            uri: uri,
                            mimeType: 'application/json',
                            text: JSON.stringify(users, null, 2),
                        },
                    ],
                };
            }
            const userIdMatch = uri.match(/^user:\/\/(\d+)$/);
            if (userIdMatch) {
                const userId = parseInt(userIdMatch[1]);
                const user = users.find(u => u.id === userId);
                if (!user) {
                    throw new McpError(ErrorCode.InvalidParams, `User with ID ${userId} not found`);
                }
                return {
                    contents: [
                        {
                            uri: uri,
                            mimeType: 'application/json',
                            text: JSON.stringify(user, null, 2),
                        },
                    ],
                };
            }
            throw new McpError(ErrorCode.InvalidRequest, `Invalid URI format: ${uri}`);
        });
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'get_user',
                    description: 'Get user by ID',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'number',
                                description: 'User ID',
                            },
                        },
                        required: ['id'],
                    },
                },
                {
                    name: 'create_user',
                    description: 'Create a new user',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                description: 'User name',
                            },
                            email: {
                                type: 'string',
                                description: 'User email',
                            },
                            role: {
                                type: 'string',
                                description: 'User role',
                                enum: ['admin', 'user'],
                            },
                        },
                        required: ['name', 'email', 'role'],
                    },
                },
                {
                    name: 'update_user',
                    description: 'Update an existing user',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'number',
                                description: 'User ID',
                            },
                            name: {
                                type: 'string',
                                description: 'User name',
                            },
                            email: {
                                type: 'string',
                                description: 'User email',
                            },
                            role: {
                                type: 'string',
                                description: 'User role',
                                enum: ['admin', 'user'],
                            },
                        },
                        required: ['id'],
                    },
                },
                {
                    name: 'delete_user',
                    description: 'Delete a user',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'number',
                                description: 'User ID',
                            },
                        },
                        required: ['id'],
                    },
                },
            ],
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case 'get_user': {
                    const { id } = request.params.arguments;
                    const user = users.find(u => u.id === id);
                    if (!user) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `User with ID ${id} not found`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(user, null, 2),
                            },
                        ],
                    };
                }
                case 'create_user': {
                    const { name, email, role } = request.params.arguments;
                    const newId = Math.max(...users.map(u => u.id)) + 1;
                    const newUser = { id: newId, name, email, role };
                    users.push(newUser);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(newUser, null, 2),
                            },
                        ],
                    };
                }
                case 'update_user': {
                    const { id, ...updates } = request.params.arguments;
                    const userIndex = users.findIndex(u => u.id === id);
                    if (userIndex === -1) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `User with ID ${id} not found`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    const updatedUser = { ...users[userIndex], ...updates };
                    users[userIndex] = updatedUser;
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(updatedUser, null, 2),
                            },
                        ],
                    };
                }
                case 'delete_user': {
                    const { id } = request.params.arguments;
                    const userIndex = users.findIndex(u => u.id === id);
                    if (userIndex === -1) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `User with ID ${id} not found`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    users.splice(userIndex, 1);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({ success: true, message: `User with ID ${id} deleted` }),
                            },
                        ],
                    };
                }
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        });
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('User Service MCP server running on stdio');
    }
}
const server = new UserServiceMcpServer();
server.run().catch(console.error);
