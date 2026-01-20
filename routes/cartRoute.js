import express from 'express';
import fetchUser from '../middleware/fetchuser.js';
import { Cart } from '../models/cartModel.js';
import { Medicine } from '../models/medicineModel.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// ROUTE 1: Get user's cart - GET "/api/cart/". Login required.
router.get('/', fetchUser, async (req, res) => {
    try {
        // Fetch all cart items for the logged-in user and populate medicine details
        const cartItems = await Cart.find({ user: req.user.id })
            .populate('medicine', 'title price description imgUrl category stockQuantity')
            .sort({ createdAt: -1 });

        // Calculate total price and total items
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cartItems.reduce((sum, item) => {
            const price = item.medicine?.price || 0;
            return sum + (price * item.quantity);
        }, 0);

        res.json({
            success: true,
            cartItems,
            totalItems,
            totalPrice: totalPrice.toFixed(2)
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
});

// ROUTE 2: Add item to cart - POST "/api/cart/add". Login required.
router.post('/add', 
    fetchUser,
    [
        body('medicineId').isMongoId().withMessage('Invalid medicine ID'),
        body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
    ],
    async (req, res) => {
        try {
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    success: false, 
                    errors: errors.array() 
                });
            }

            const { medicineId, quantity = 1 } = req.body;

            // Check if medicine exists and has sufficient stock
            const medicine = await Medicine.findById(medicineId);
            if (!medicine) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Medicine not found' 
                });
            }

            if (medicine.stockQuantity < quantity) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Only ${medicine.stockQuantity} units available in stock` 
                });
            }

            // Check if item already exists in cart
            let cartItem = await Cart.findOne({ 
                user: req.user.id, 
                medicine: medicineId 
            });

            if (cartItem) {
                // Update quantity if item already exists
                const newQuantity = cartItem.quantity + quantity;
                
                if (medicine.stockQuantity < newQuantity) {
                    return res.status(400).json({ 
                        success: false, 
                        message: `Cannot add more. Only ${medicine.stockQuantity} units available in stock` 
                    });
                }

                cartItem.quantity = newQuantity;
                await cartItem.save();

                return res.json({
                    success: true,
                    message: 'Cart updated successfully',
                    cartItem
                });
            }

            // Create new cart item
            cartItem = new Cart({
                user: req.user.id,
                medicine: medicineId,
                quantity
            });

            await cartItem.save();

            // Populate medicine details before sending response
            await cartItem.populate('medicine', 'title price description imgUrl category stockQuantity');

            res.status(201).json({
                success: true,
                message: 'Item added to cart successfully',
                cartItem
            });

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Internal Server Error',
                error: error.message 
            });
        }
    });

// ROUTE 3: Remove item from cart - DELETE "/api/cart/remove/:itemId". Login required.
router.delete('/remove/:itemId', fetchUser, async (req, res) => {
    try {
        const { itemId } = req.params;

        // Find and delete the cart item
        const cartItem = await Cart.findOneAndDelete({
            _id: itemId,
            user: req.user.id
        });

        if (!cartItem) {
            return res.status(404).json({ 
                success: false, 
                message: 'Cart item not found or you do not have permission to remove it' 
            });
        }

        res.json({ 
            success: true,
            message: 'Item removed from cart successfully' 
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
});

// ROUTE 4: Update item quantity in cart - PUT "/api/cart/update". Login required.
router.put('/update',
    fetchUser,
    [
        body('itemId').isMongoId().withMessage('Invalid item ID'),
        body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
    ],
    async (req, res) => {
        try {
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    success: false, 
                    errors: errors.array() 
                });
            }

            const { itemId, quantity } = req.body;

            // Find the cart item
            const cartItem = await Cart.findOne({
                _id: itemId,
                user: req.user.id
            }).populate('medicine');

            if (!cartItem) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Cart item not found or you do not have permission to update it' 
                });
            }

            // Check if medicine has sufficient stock
            if (cartItem.medicine.stockQuantity < quantity) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Only ${cartItem.medicine.stockQuantity} units available in stock` 
                });
            }

            // Update quantity
            cartItem.quantity = quantity;
            await cartItem.save();

            res.json({
                success: true,
                message: 'Cart updated successfully',
                cartItem
            });

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Internal Server Error',
                error: error.message 
            });
        }
    }); 

export default router;