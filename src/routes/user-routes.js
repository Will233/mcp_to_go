import express from 'express';
const router = express.Router();
// GET all users
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'This endpoint would normally fetch users from the user microservice via MCP',
        mockData: [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
        ]
    });
});
// GET user by ID
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    res.status(200).json({
        message: `This endpoint would normally fetch user ${userId} from the user microservice via MCP`,
        mockData: { id: parseInt(userId), name: 'John Doe', email: 'john@example.com', role: 'admin' }
    });
});
// POST create user
router.post('/', (req, res) => {
    res.status(201).json({
        message: 'This endpoint would normally create a user via the user microservice using MCP',
        receivedData: req.body,
        mockResponse: { id: 4, ...req.body }
    });
});
// PUT update user
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    res.status(200).json({
        message: `This endpoint would normally update user ${userId} via the user microservice using MCP`,
        receivedData: req.body,
        mockResponse: { id: parseInt(userId), ...req.body }
    });
});
// DELETE user
router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    res.status(200).json({
        message: `This endpoint would normally delete user ${userId} via the user microservice using MCP`,
        success: true
    });
});
export default router;
