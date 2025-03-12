import { Router } from 'express';
import orderRoutes from './order-routes.js';
import userRoutes from './user-routes.js';
import productRoutes from './product-routes.js';
const router = Router();
// API version prefix
const API_PREFIX = '/api/v1';
// Mount routes
router.use(`${API_PREFIX}/orders`, orderRoutes);
router.use(`${API_PREFIX}/users`, userRoutes);
router.use(`${API_PREFIX}/products`, productRoutes);
// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API documentation endpoint
router.get('/', (req, res) => {
    res.json({
        name: 'MCP Enterprise API',
        version: '1.0.0',
        endpoints: {
            orders: `${API_PREFIX}/orders`,
            users: `${API_PREFIX}/users`,
            products: `${API_PREFIX}/products`,
            health: '/health'
        },
        documentation: '/docs'
    });
});
export default router;
