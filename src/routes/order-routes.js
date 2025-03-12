import express from 'express';
const router = express.Router();
// GET all orders
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'This endpoint would normally fetch orders from the order microservice via MCP',
        mockData: [
            {
                id: 1,
                userId: 1,
                status: 'completed',
                items: [
                    { productId: 1, quantity: 2, price: 1299.99 },
                    { productId: 3, quantity: 1, price: 199.99 }
                ],
                total: 2799.97,
                createdAt: '2025-03-10T10:30:00Z'
            },
            {
                id: 2,
                userId: 2,
                status: 'processing',
                items: [
                    { productId: 2, quantity: 1, price: 799.99 }
                ],
                total: 799.99,
                createdAt: '2025-03-11T09:15:00Z'
            }
        ]
    });
});
// GET order by ID
router.get('/:id', (req, res) => {
    const orderId = req.params.id;
    res.status(200).json({
        message: `This endpoint would normally fetch order ${orderId} from the order microservice via MCP`,
        mockData: {
            id: parseInt(orderId),
            userId: 1,
            status: 'completed',
            items: [
                { productId: 1, quantity: 2, price: 1299.99 },
                { productId: 3, quantity: 1, price: 199.99 }
            ],
            total: 2799.97,
            createdAt: '2025-03-10T10:30:00Z'
        }
    });
});
// POST create order
router.post('/', (req, res) => {
    res.status(201).json({
        message: 'This endpoint would normally create an order via the order microservice using MCP',
        receivedData: req.body,
        mockResponse: {
            id: 3,
            status: 'pending',
            createdAt: new Date().toISOString(),
            ...req.body
        }
    });
});
// PUT update order status
router.put('/:id/status', (req, res) => {
    const orderId = req.params.id;
    res.status(200).json({
        message: `This endpoint would normally update order ${orderId} status via the order microservice using MCP`,
        receivedData: req.body,
        mockResponse: {
            id: parseInt(orderId),
            status: req.body.status,
            updatedAt: new Date().toISOString()
        }
    });
});
// GET orders by user ID
router.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    res.status(200).json({
        message: `This endpoint would normally fetch orders for user ${userId} from the order microservice via MCP`,
        mockData: [
            {
                id: 1,
                userId: parseInt(userId),
                status: 'completed',
                items: [
                    { productId: 1, quantity: 2, price: 1299.99 },
                    { productId: 3, quantity: 1, price: 199.99 }
                ],
                total: 2799.97,
                createdAt: '2025-03-10T10:30:00Z'
            }
        ]
    });
});
export default router;
