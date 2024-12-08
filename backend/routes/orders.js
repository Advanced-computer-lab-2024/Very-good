const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders
router.get('/', orderController.getAllOrders);

// Get an order by ID
router.get('/:orderId', orderController.getOrderById);

// Update order status
router.patch('/:orderId', orderController.updateOrderStatus);

// Delete an order
router.delete('/:orderId', orderController.deleteOrder);

// Get current orders
router.get('/orders/current/:touristId', orderController.getCurrentOrders);

// Get past orders
router.get('/orders/past/:touristId', orderController.getPastOrders);

router.put('/orders/cancel/:orderId', orderController.cancelOrder);


module.exports = router;
