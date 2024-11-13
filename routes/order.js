const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.post('/checkout', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.user._id;
        const cart = req.session.cart;
        
        if (!cart || Object.keys(cart).length === 0) {
            return res.redirect('/cart');
        }

        let totalAmount = 0;
        const items = Object.keys(cart).map(productId => {
            const item = cart[productId];
            totalAmount += item.price * item.quantity;
            return {
                productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            };
        });

        const order = new Order({
            userId,
            items,
            totalAmount,
            paymentMethod: 'COD',
        });

        await order.save();

        // Clear the cart after successful order placement
        req.session.cart = {};

        res.redirect('/order-history');
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send('Error placing order');
    }
});

// In routes/order.js
router.get('/order-history', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.user._id;
        const orders = await Order.find({ userId }).populate('items.productId');

        res.render('order-history', { orders });
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).send('Error fetching order history');
    }
});


module.exports = router;
