import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error-handler.js';
import { ApiGateway } from './services/ApiGateway.js';

// Load environment variables
config();

// Create Express app
const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Mount routes
app.use(routes);

// Error handling
app.use(errorHandler);

// Create and start the API Gateway
const gateway = new ApiGateway(PORT);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API documentation: http://localhost:${PORT}/`);
  
  // Start MCP Gateway
  gateway.start().catch(err => {
    console.error('Failed to start MCP Gateway:', err);
    process.exit(1);
  });
});

export default app; 