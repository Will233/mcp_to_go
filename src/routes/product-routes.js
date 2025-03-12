import express from 'express';
const router = express.Router();
// GET all products
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'This endpoint would normally fetch products from the product microservice via MCP',
        mockData: [
            { id: 1, name: 'Laptop', price: 1299.99, category: 'Electronics', stock: 50 },
            { id: 2, name: 'Smartphone', price: 799.99, category: 'Electronics', stock: 100 },
            { id: 3, name: 'Headphones', price: 199.99, category: 'Audio', stock: 75 }
        ]
    });
});
// GET product by ID
router.get('/:id', (req, res) => {
    const productId = req.params.id;
    res.status(200).json({
        message: `This endpoint would normally fetch product ${productId} from the product microservice via MCP`,
        mockData: { id: parseInt(productId), name: 'Laptop', price: 1299.99, category: 'Electronics', stock: 50 }
    });
});
// POST create product
router.post('/', (req, res) => {
    res.status(201).json({
        message: 'This endpoint would normally create a product via the product microservice using MCP',
        receivedData: req.body,
        mockResponse: { id: 4, ...req.body }
    });
});
// PUT update product
router.put('/:id', (req, res) => {
    const productId = req.params.id;
    res.status(200).json({
        message: `This endpoint would normally update product ${productId} via the product microservice using MCP`,
        receivedData: req.body,
        mockResponse: { id: parseInt(productId), ...req.body }
    });
});
// DELETE product
router.delete('/:id', (req, res) => {
    const productId = req.params.id;
    res.status(200).json({
        message: `This endpoint would normally delete product ${productId} via the product microservice using MCP`,
        success: true
    });
});
// GET products by category
router.get('/category/:category', (req, res) => {
    const category = req.params.category;
    res.status(200).json({
        message: `This endpoint would normally fetch products in category ${category} from the product microservice via MCP`,
        mockData: [
            { id: 1, name: 'Laptop', price: 1299.99, category: category, stock: 50 },
            { id: 2, name: 'Smartphone', price: 799.99, category: category, stock: 100 }
        ]
    });
});
export default router;
