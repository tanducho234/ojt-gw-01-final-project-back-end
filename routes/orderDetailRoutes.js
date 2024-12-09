const express = require('express');
const router = express.Router();
const orderDetailController = require('../controllers/orderDetailController');
const { authenticate, authorize } = require('../middleware/auth');

// Get all orders (admin only)
router.get('/admin',authenticate,authorize(["admin"]), orderDetailController.getAllOrders);
// Create a new order
router.post('/', authenticate,orderDetailController.createOrder);

// Get orders for the authenticated user
router.get('/', orderDetailController.getUserOrders);

// Get a specific order by ID
router.get('/:id', orderDetailController.getOrderById);

// Update an order (e.g., status or payment)
router.put('/:id', orderDetailController.updateOrder);

// Delete an order (optional)
router.delete('/:id', orderDetailController.deleteOrder);

module.exports = router;
