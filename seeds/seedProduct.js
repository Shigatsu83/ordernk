const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config()
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define product data
const products = [
    { id: 1, name: 'Tongkol Kemangi Pedas', description: 'Olahan Tongkol dengan Rasa Pedas dan Aroma Khas Daun Kemangi', price: 8000, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Ayam Balado', description: 'Olahan Ayam Suwir dengan Bumbu Cabai dengan Cita Rasa Pedas dan juga Gurih', price: 8000, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Ayam Kecap', description: 'Olahan Ayam dengan tambahan Kecap Membuat Rasa Manis dan Gurih', price: 8000, image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Cumi Asin Pedas', description: 'Olahan dari Cumi yang Telah dikeringkan dan diolah menjadi blablabla', price: 10000, image: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Beef Bulgogi', description: 'Mirip menu di Kolektif IYKYK, kecuali yang pesen Red Hot Chilli', price: 10000, image: 'https://via.placeholder.com/150' },
    // Add other products as needed
];

// Seed function to save products
async function seedProducts() {
    try {
        await Product.insertMany(products);
        console.log('Products saved successfully!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error saving products:', error);
    }
}

seedProducts();
