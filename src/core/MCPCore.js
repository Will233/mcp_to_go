import { Client as MCPClient } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
// @modelcontextprotocol/sdk/client/index.js
export class MCPCore {
  constructor(serverUrl) {
    this.transport = new SSEClientTransport({ url: serverUrl });
    this.client = new MCPClient(this.transport);
  }

  async initialize() {
    await this.client.connect();
  }

  async readResource(uri, meta) {
    return this.client.readResource({ uri, _meta: meta });
  }

  async callTool(name, args, meta) {
    return this.client.callTool({ name, arguments: args, _meta: meta });
  }

  async getPrompt(name, args, meta) {
    return this.client.getPrompt({ name, arguments: args, _meta: meta });
  }

  async listTools() {
    return this.client.listTools();
  }

  async close() {
    await this.transport.close();
  }
} 