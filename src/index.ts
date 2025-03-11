import express from 'express';
import { join } from 'path';

// Import routes
import userRoutes from './client/user-routes';
import productRoutes from './client/product-routes';
import orderRoutes from './client/order-routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(join(__dirname, 'public')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Service is healthy' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'MCP Enterprise Demo API',
    version: '1.0.0',
    endpoints: [
      '/api/users',
      '/api/products',
      '/api/orders',
      '/health'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API documentation: http://localhost:${PORT}/`);
});

export default app;
