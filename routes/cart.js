const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Add product to cart
router.post('/add-to-cart/:productId', async (req, res) => {
    const productId = req.params.productId;
    const quantity = req.body.quantity || 1;  // Default to 1 if quantity is not provided

    try {
        // Find the product in the database
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Initialize cart if it doesn't exist
        if (!req.session.cart) {
            req.session.cart = {};
        }

        // Check if the product is already in the cart
        if (req.session.cart[productId]) {
            req.session.cart[productId].quantity += quantity; // Increase quantity if product is already in the cart
        } else {
            req.session.cart[productId] = {
                name: product.name,
                price: product.price,
                quantity,
                image: product.image
            };
        }

        let itemCount = 0;
        for (let productId in req.session.cart) {
        itemCount += req.session.cart[productId].quantity;
        
        }

        // Return success response
        res.json({ success: true , itemCount});
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ success: false, message: 'An error occurred while adding the product to the cart' });
    }
});


// View cart
router.get('/cart', (req, res) => {
    const cart = req.session.cart || {};
    let total = 0;

    // Calculate total price
    for (let productId in cart) {
        total += cart[productId].price * cart[productId].quantity;
    }

    res.render('cart', { cart, total });
});

// Update product quantity in cart
router.post('/cart/update/:productId', (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);

    if (req.session.cart && req.session.cart[productId]) {
        req.session.cart[productId].quantity = quantity; // Update quantity
    }

    res.redirect('/cart');
});

// Remove product from cart
router.post('/cart/remove/:productId', (req, res) => {
    const productId = req.params.productId;

    if (req.session.cart && req.session.cart[productId]) {
        delete req.session.cart[productId]; // Remove product from cart
    }

    res.redirect('/cart');
});

module.exports = router;
