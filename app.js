const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const authMiddleware = require('./middlewares/auth');

const app = express();
// Middleware to parse URL-encoded form data
// Middleware to parse JSON data (useful if any data is sent as JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch(err => {
        console.log('Error connecting to MongoDB:', err);
    });
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
app.use(cartRoutes);

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
  
app.get('/',authMiddleware, async (req, res) => {

  try {
      const username = req.session.user.username;
      const products = await Product.find();
      const cart = req.session.cart || {};

      let itemCount = 0;
      if (req.session.cart) {
          for (let productId in req.session.cart) {
              itemCount += req.session.cart[productId].quantity;
          }
      }
      res.render('index', { title: 'Nasi Kepal Nusantara', products, username, itemCount});
    }catch(error) {
      console.error('Error fetch the product', error);
      res.status(500).send("Error Fetching products")
    }
});
