const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');
const Product = require('./models/Product');
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

app.get('/',authMiddleware, async (req, res) => {

  const username = req.session.user.username;

  try {
    const products = await Product.find();
    res.render('index', { title: 'Nasi Kepal Nusantara', products, username});
  }catch(error) {
    console.error('Error fetch the product', error);
    res.status(500).send("Error Fetching products")
  }
});