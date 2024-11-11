const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.send('Error registering user');

    const newUser = new User({ username, password });
    await newUser.save();
    res.redirect('/login'); // Redirect to login after successful registration
  } catch (error) {
    res.send('Error registering user');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.send('Incorrect Username/Password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send('Incorrect Username/Password');

    req.session.user = user; // Store user in session
    res.redirect('/'); // Redirect to home or dashboard page after login
  } catch (error) {
    res.send('Error logging in');
  }
});

module.exports = router;
