const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');
const authMiddleware = require('./middlewares/auth');

const app = express();
// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON data (useful if any data is sent as JSON)
app.use(express.json());

require('dotenv').config()
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> console.log('Connected to Atlas')).catch((error)=> console.error('Connection error', error))

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(session({
    secret: process.env.SECRET_KEY, // replace this with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,                    
        secure: false 
    }
}));
app.use(authRoutes);

//Login 
app.get('/login', (req, res) => res.render('login'));
//Register
app.get('/register', (req, res) => res.render('register'));
//Logout
// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.send('Error logging out');
      }
      res.redirect('/login'); // Redirect to login page after logging out
    });
  });
  

const products = [
    { id:1, name: 'Tongkol Kemangi Pedas', description: 'Olahan Tongkol dengan Rasa Pedas dan Aroma Khas Daun Kemangi', price: 8000, image: 'https://via.placeholder.com/150' },
    { id:2, name: 'Ayam Balado', description: 'Olahan Ayam Suwir dengan Bumbu Cabai', price: 49000, image: 'https://via.placeholder.com/150' },
    { id:3, name: 'Product 3', description: 'Description for product 3', price: 19000, image: 'https://via.placeholder.com/150' },
    { id:4, name: 'Product 4', description: 'Description for product 4', price: 19000, image: 'https://via.placeholder.com/150' },
    { id:5, name: 'Product 5', description: 'Description for product 5', price: 19000, image: 'https://via.placeholder.com/150' },
    { id:6, name: 'Product 5', description: 'Description for product 5', price: 19000, image: 'https://via.placeholder.com/150' }
  ];

app.get('/',authMiddleware, (req, res) => {
    const username = req.session.user.username;
    res.render('index', { title: 'Nasi Kepal Nusantara', products, username});
});
  
app.post('/cart/add/:productId', (req, res) => {
const productId = req.params.productId;

// Initialize cart if it doesn't exist
if (!req.session.cart) {
    req.session.cart = {};
}

// Update cart quantity for the product
req.session.cart[productId] = (req.session.cart[productId] || 0) + 1;

res.json({ success: true, cart: req.session.cart });
});
app.listen(process.env.PORT, ()=>{
    console.log(`Running on http://zeroctf.me:${process.env.PORT}`);
});
