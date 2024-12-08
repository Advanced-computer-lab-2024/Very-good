const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Create a new order
exports.createOrder = async (req, res) => {
    const { products } = req.body;

    try {
        // Calculate total price
        let totalPrice = 0;
        for (const productId of products) {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product with ID ${productId} not found.` });
            }
            totalPrice += product.price;
        }

        // Create the order
        const order = new Order({
            products,
            totalPrice
        });

        await order.save();
        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create order', error });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('products');
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch orders', error });
    }
};

exports.getOrderById = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId).populate('products');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch order', error });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update order status', error });
    }
};

exports.deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete order', error });
    }
};

exports.getCurrentOrders = async (req, res) => {
    const { touristId } = req.params; // Assuming `touristId` is passed in the request

    try {
        // Find orders where the status is not 'Delivered' or 'Cancelled'
        const currentOrders = await Order.find({
            status: { $nin: ['Delivered', 'Cancelled'] }
        })
        .populate('products'); // Populate products for details

        res.status(200).json({ success: true, currentOrders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch current orders', error });
    }
};


exports.getPastOrders = async (req, res) => {
    const { touristId } = req.params; // Assuming `touristId` is passed in the request

    try {
        // Find orders where the status is 'Delivered' or 'Cancelled'
        const pastOrders = await Order.find({
            status: { $in: ['Delivered', 'Cancelled'] }
        })
        .populate('products'); // Populate products for details

        res.status(200).json({ success: true, pastOrders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch past orders', error });
    }
};


exports.cancelOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        // Find the order by ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check if the order status is not already cancelled
        if (order.status === 'Cancelled') {
            return res.status(400).json({ success: false, message: 'Order is already cancelled' });
        }

        // Update the order status to 'Cancelled'
        order.status = 'Cancelled';
        await order.save();

        res.status(200).json({ success: true, message: 'Order cancelled successfully', order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to cancel order', error });
    }
};

