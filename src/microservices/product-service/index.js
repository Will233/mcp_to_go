#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListResourcesRequestSchema, ListToolsRequestSchema, McpError, ReadResourceRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
// Mock database for products
const products = [
    { id: 1, name: 'Laptop', price: 1299.99, category: 'Electronics', stock: 50 },
    { id: 2, name: 'Smartphone', price: 799.99, category: 'Electronics', stock: 100 },
    { id: 3, name: 'Headphones', price: 199.99, category: 'Audio', stock: 75 }
];
class ProductServiceMcpServer {
    constructor() {
        this.server = new Server({
            name: 'enterprise-product-service',
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
                    uri: `product://all`,
                    name: `All Products`,
                    mimeType: 'application/json',
                    description: 'List of all products in the system',
                },
                {
                    uri: `product://category/Electronics`,
                    name: `Electronics Products`,
                    mimeType: 'application/json',
                    description: 'List of all electronics products',
                },
                {
                    uri: `product://category/Audio`,
                    name: `Audio Products`,
                    mimeType: 'application/json',
                    description: 'List of all audio products',
                },
            ],
        }));
        // Read resources
        this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
            const uri = request.params.uri;
            if (uri === 'product://all') {
                return {
                    contents: [
                        {
                            uri: uri,
                            mimeType: 'application/json',
                            text: JSON.stringify(products, null, 2),
                        },
                    ],
                };
            }
            const categoryMatch = uri.match(/^product:\/\/category\/(.+)$/);
            if (categoryMatch) {
                const category = categoryMatch[1];
                const filteredProducts = products.filter(p => p.category === category);
                return {
                    contents: [
                        {
                            uri: uri,
                            mimeType: 'application/json',
                            text: JSON.stringify(filteredProducts, null, 2),
                        },
                    ],
                };
            }
            const productIdMatch = uri.match(/^product:\/\/(\d+)$/);
            if (productIdMatch) {
                const productId = parseInt(productIdMatch[1]);
                const product = products.find(p => p.id === productId);
                if (!product) {
                    throw new McpError(ErrorCode.InvalidParams, `Product with ID ${productId} not found`);
                }
                return {
                    contents: [
                        {
                            uri: uri,
                            mimeType: 'application/json',
                            text: JSON.stringify(product, null, 2),
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
                    name: 'get_product',
                    description: 'Get product by ID',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'number',
                                description: 'Product ID',
                            },
                        },
                        required: ['id'],
                    },
                },
                {
                    name: 'get_products_by_category',
                    description: 'Get products by category',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            category: {
                                type: 'string',
                                description: 'Product category',
                            },
                        },
                        required: ['category'],
                    },
                },
                {
                    name: 'create_product',
                    description: 'Create a new product',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                description: 'Product name',
                            },
                            price: {
                                type: 'number',
                                description: 'Product price',
                            },
                            category: {
                                type: 'string',
                                description: 'Product category',
                            },
                            stock: {
                                type: 'number',
                                description: 'Product stock quantity',
                            },
                        },
                        required: ['name', 'price', 'category', 'stock'],
                    },
                },
                {
                    name: 'update_product',
                    description: 'Update an existing product',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'number',
                                description: 'Product ID',
                            },
                            name: {
                                type: 'string',
                                description: 'Product name',
                            },
                            price: {
                                type: 'number',
                                description: 'Product price',
                            },
                            category: {
                                type: 'string',
                                description: 'Product category',
                            },
                            stock: {
                                type: 'number',
                                description: 'Product stock quantity',
                            },
                        },
                        required: ['id'],
                    },
                },
                {
                    name: 'update_stock',
                    description: 'Update product stock',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'number',
                                description: 'Product ID',
                            },
                            stock: {
                                type: 'number',
                                description: 'New stock quantity',
                            },
                        },
                        required: ['id', 'stock'],
                    },
                },
                {
                    name: 'delete_product',
                    description: 'Delete a product',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'number',
                                description: 'Product ID',
                            },
                        },
                        required: ['id'],
                    },
                },
            ],
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case 'get_product': {
                    const { id } = request.params.arguments;
                    const product = products.find(p => p.id === id);
                    if (!product) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Product with ID ${id} not found`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(product, null, 2),
                            },
                        ],
                    };
                }
                case 'get_products_by_category': {
                    const { category } = request.params.arguments;
                    const filteredProducts = products.filter(p => p.category === category);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(filteredProducts, null, 2),
                            },
                        ],
                    };
                }
                case 'create_product': {
                    const { name, price, category, stock } = request.params.arguments;
                    const newId = Math.max(...products.map(p => p.id)) + 1;
                    const newProduct = { id: newId, name, price, category, stock };
                    products.push(newProduct);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(newProduct, null, 2),
                            },
                        ],
                    };
                }
                case 'update_product': {
                    const { id, ...updates } = request.params.arguments;
                    const productIndex = products.findIndex(p => p.id === id);
                    if (productIndex === -1) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Product with ID ${id} not found`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    const updatedProduct = { ...products[productIndex], ...updates };
                    products[productIndex] = updatedProduct;
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(updatedProduct, null, 2),
                            },
                        ],
                    };
                }
                case 'update_stock': {
                    const { id, stock } = request.params.arguments;
                    const productIndex = products.findIndex(p => p.id === id);
                    if (productIndex === -1) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Product with ID ${id} not found`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    products[productIndex].stock = stock;
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(products[productIndex], null, 2),
                            },
                        ],
                    };
                }
                case 'delete_product': {
                    const { id } = request.params.arguments;
                    const productIndex = products.findIndex(p => p.id === id);
                    if (productIndex === -1) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Product with ID ${id} not found`,
                                },
                            ],
                            isError: true,
                        };
                    }
                    products.splice(productIndex, 1);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({ success: true, message: `Product with ID ${id} deleted` }),
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
        console.error('Product Service MCP server running on stdio');
    }
}
const server = new ProductServiceMcpServer();
server.run().catch(console.error);
