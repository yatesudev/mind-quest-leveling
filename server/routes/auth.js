const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register route
router.post('/register', async (req, res) => {
  
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      if (user.email === email) {
        return res.status(400).json({ msg: 'Email already in use' });
      } else if (user.username === username) {
        return res.status(400).json({ msg: 'Username already in use' });
      }
    }

    // Create new user
    user = new User({ username, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Email or password is incorrect.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Email or password is incorrect.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Token verification route
router.post('/verify-token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ valid: false, msg: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ valid: true, decoded });
  } catch (err) {
    return res.status(400).json({ valid: false, msg: 'Token is not valid.' });
  }
});

// Assign character class route
router.post('/assign-class', async (req, res) => {
  const { userId, characterClass } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.character.class = characterClass;
    await user.save();

    res.status(200).json({ message: 'Character class assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Check if user has a character route
router.get('/has-character/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ hasCharacter: !!user.character.class });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if user has a character route
router.get('/get-character/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ character: user.character });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
