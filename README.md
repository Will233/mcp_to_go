# Enterprise Microservice with MCP Integration

This project demonstrates the implementation of Model Context Protocol (MCP) in an enterprise-level microservice architecture using Node.js. The goal is to enhance AI capabilities and coverage across the application.

## Project Structure

```
.
├── src/
│   ├── core/           # Core MCP implementation
│   ├── services/       # Microservices
│   ├── routes/         # API routes
│   ├── protocols/      # MCP protocols
│   ├── contexts/       # Context definitions
│   └── utils/          # Utility functions
├── tests/              # Test files
└── config/             # Configuration files
```

## Features

- Enterprise-grade microservice architecture
- MCP (Model Context Protocol) integration
- Context-aware AI capabilities
- Scalable service communication
- Type-safe implementation using TypeScript

## Prerequisites

- Node.js (v18+)
- TypeScript
- Docker (for containerization)
- MongoDB (for data persistence)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## MCP Implementation

The project implements MCP with the following key components:

1. Context Definitions: Define the context structure for AI interactions
2. Protocol Handlers: Manage communication between services and AI models
3. Model Integration: Connect with various AI models through standardized interfaces

## Validating MCP Integration

### 1. Basic Functionality Testing

Test the basic MCP functionality using the provided example:

```bash
# Run the example script
npx ts-node src/examples/mcpExample.ts
```

Expected output should show:
- Successful MCP server startup
- Client connection establishment
- Context management operations
- Tool invocations
- Prompt template usage

### 2. API Endpoint Testing

Test the MCP-enabled endpoints:

```bash
# Health check
curl http://localhost:3000/health

# Get business rules via MCP
curl http://localhost:3000/api/v1/rules

# Process data with MCP tools
curl -X POST http://localhost:3000/api/v1/process \
  -H "Content-Type: application/json" \
  -d '{"data": "test data", "options": {"format": "json"}}'
```

### 3. Context Management Validation

Verify context management:

```bash
# Get current context
curl http://localhost:3000/api/v1/context

# Add new context
curl -X POST http://localhost:3000/api/v1/context \
  -H "Content-Type: application/json" \
  -d '{
    "content": "test message",
    "contextType": "user"
  }'

# Clear context
curl -X DELETE http://localhost:3000/api/v1/context
```

### 4. Tool Integration Testing

Test MCP tools:

```bash
# List available tools
curl http://localhost:3000/api/v1/tools

# Execute a tool
curl -X POST http://localhost:3000/api/v1/tools/process-data \
  -H "Content-Type: application/json" \
  -d '{
    "data": "sample data",
    "options": {
      "format": "json",
      "validate": true
    }
  }'
```

### 5. Performance Monitoring

Monitor MCP performance:

```bash
# Get performance metrics
curl http://localhost:3000/metrics

# Check MCP protocol statistics
curl http://localhost:3000/api/v1/stats
```

### 6. Integration Testing Scenarios

Test complete business flows:

1. **Customer Onboarding Flow**:
   ```bash
   # 1. Start customer onboarding
   curl -X POST http://localhost:3000/api/v1/onboarding \
     -H "Content-Type: application/json" \
     -d '{"customerId": "123", "data": {...}}'

   # 2. Verify MCP context preservation
   curl http://localhost:3000/api/v1/context/customer/123

   # 3. Check processing results
   curl http://localhost:3000/api/v1/onboarding/123/status
   ```

2. **Data Processing Flow**:
   ```bash
   # 1. Submit data for processing
   curl -X POST http://localhost:3000/api/v1/process \
     -H "Content-Type: application/json" \
     -d '{"data": "..."}'

   # 2. Check processing status
   curl http://localhost:3000/api/v1/process/{jobId}

   # 3. Get results
   curl http://localhost:3000/api/v1/process/{jobId}/results
   ```

### 7. Error Handling Validation

Test error scenarios:

```bash
# Invalid context format
curl -X POST http://localhost:3000/api/v1/context \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'

# Unauthorized tool access
curl http://localhost:3000/api/v1/tools/restricted-tool

# Invalid tool parameters
curl -X POST http://localhost:3000/api/v1/tools/process-data \
  -H "Content-Type: application/json" \
  -d '{"invalid": "parameters"}'
```

### 8. Load Testing

Perform load testing:

```bash
# Install artillery
npm install -g artillery

# Run load test
artillery run tests/load/mcp-test.yml
```

## Monitoring and Debugging

1. **Logs Analysis**:
   - Check MCP operation logs: `tail -f logs/mcp.log`
   - Monitor error logs: `tail -f logs/error.log`

2. **Metrics Dashboard**:
   - Access metrics: `http://localhost:3000/metrics`
   - Grafana dashboard: `http://localhost:3001`

3. **Debug Mode**:
   ```bash
   # Start server in debug mode
   DEBUG=mcp:* npm run dev
   ```

## Common Issues and Solutions

1. **Connection Issues**:
   - Verify MCP server is running
   - Check port configurations
   - Ensure correct API keys

2. **Context Management**:
   - Verify context format
   - Check context persistence
   - Monitor context size

3. **Tool Integration**:
   - Validate tool parameters
   - Check tool availability
   - Verify tool permissions

## Best Practices

1. **Context Management**:
   - Keep contexts focused and relevant
   - Regularly clear unused contexts
   - Monitor context size limits

2. **Tool Usage**:
   - Use appropriate tool timeouts
   - Implement retry mechanisms
   - Validate tool inputs

3. **Error Handling**:
   - Implement proper error recovery
   - Log relevant error details
   - Provide clear error messages

## Architecture

The microservice architecture consists of:

- API Gateway
- Authentication Service
- Context Management Service
- Model Service
- Data Processing Service

Each service implements MCP for enhanced AI capabilities and context awareness.

## Development

```bash
# Run tests
npm test

# Build project
npm run build

# Start production server
npm start
```

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

