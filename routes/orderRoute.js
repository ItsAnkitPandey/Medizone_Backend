import express from 'express';
import fetchUser from '../middleware/fetchuser.js';
import { Order } from '../models/OrderModel.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// ROUTE 1: Create an order - POST "/order/create" or "/orders". Login required.
router.post('/create', fetchUser, [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.id').notEmpty().withMessage('Item ID is required'),
    body('items.*.name').notEmpty().withMessage('Item name is required'),
    body('items.*.price').isNumeric().withMessage('Item price must be a number'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Item quantity must be at least 1'),
    body('shippingAddress').isObject().withMessage('Shipping address is required'),
    body('shippingAddress.street').notEmpty().withMessage('Street address is required'),
    body('shippingAddress.city').notEmpty().withMessage('City is required'),
    body('shippingAddress.state').notEmpty().withMessage('State is required'),
    body('shippingAddress.postalCode').notEmpty().withMessage('Postal code is required'),
    body('shippingAddress.country').notEmpty().withMessage('Country is required'),
    body('shippingAddress.phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('paymentMode').isIn(['COD', 'UPI', 'CARD']).withMessage('Invalid payment mode'),
    body('totalAmount').isNumeric().withMessage('Total amount must be a number')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { items, shippingAddress, paymentMode, totalAmount } = req.body;
        
        // Transform items to match schema (frontend sends id, backend needs medicine)
        const orderItems = items.map(item => ({
            medicine: item.id, // Map frontend id to backend medicine field
            quantity: item.quantity,
            price: item.price
        }));

        const newOrder = await Order.create({
            user: req.user.id,
            items: orderItems,
            shippingAddress,
            paymentMode,
            totalAmount,
            status: 'Pending'
        });

        // Populate order with user and medicine details
        const populatedOrder = await Order.findById(newOrder._id)
            .populate('user', 'name email')
            .populate('items.medicine', 'name price');

        res.status(201).json({ 
            success: true,
            message: 'Order created successfully',
            order: populatedOrder
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Alternative route for frontend compatibility
router.post('/', fetchUser, [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('shippingAddress').isObject().withMessage('Shipping address is required'),
    body('paymentMode').isIn(['COD', 'UPI', 'CARD']).withMessage('Invalid payment mode'),
    body('totalAmount').isNumeric().withMessage('Total amount must be a number')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { items, shippingAddress, paymentMode, totalAmount } = req.body;
        
        // Transform items if needed
        const orderItems = items.map(item => ({
            medicine: item.id || item.medicine,
            quantity: item.quantity,
            price: item.price
        }));

        const newOrder = await Order.create({
            user: req.user.id,
            items: orderItems,
            shippingAddress,
            paymentMode,
            totalAmount,
            status: 'Pending'
        });

        const populatedOrder = await Order.findById(newOrder._id)
            .populate('user', 'name email')
            .populate('items.medicine', 'name price');

        res.status(201).json({ 
            success: true,
            message: 'Order created successfully',
            order: populatedOrder
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// ROUTE 2: Get user's order history - GET "/order/history" or "/orders". Login required.
router.get('/history', fetchUser, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.medicine', 'name price')
            .sort({ createdAt: -1 });
        
        res.json({ 
            success: true,
            count: orders.length,
            orders 
        });
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Alternative route for frontend compatibility
router.get('/', fetchUser, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.medicine', 'name price')
            .sort({ createdAt: -1 });
        
        res.json({ 
            success: true,
            count: orders.length,
            orders 
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ROUTE 3: Get a specific order by ID - GET "/order/:id" or "/orders/:id". Login required.
router.get('/:id', fetchUser, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.medicine', 'name price description');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ensure user can only access their own orders (unless admin)
        if (order.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({ 
            success: true,
            order 
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ROUTE 4: Cancel an order - PUT "/order/:id/cancel". Login required.
router.put('/:id/cancel', fetchUser, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ensure user can only cancel their own orders
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Only allow cancellation of pending orders
        if (order.status !== 'Pending') {
            return res.status(400).json({ 
                message: `Cannot cancel order with status: ${order.status}` 
            });
        }

        order.status = 'Cancelled';
        await order.save();

        res.json({ 
            success: true,
            message: 'Order cancelled successfully',
            order 
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;