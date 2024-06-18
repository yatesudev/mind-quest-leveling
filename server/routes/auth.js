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

// Check if user has a character route
router.get('/get-user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user inventory
router.get('/inventory/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ inventory: user.inventory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update user inventory
router.put('/inventory/:userId', async (req, res) => {
  const { userId } = req.params;
  const { inventory } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.inventory = inventory;
    await user.save();

    res.status(200).json({ message: 'Inventory updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Add player item with rarity to inventory
// router.post('/inventory/:userId/add-item', async (req, res) => {
//   const { userId } = req.params;
//   const { itemId, rarity } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Initialize user inventory if it doesn't exist
//     if (!user.inventory) {
//       user.inventory = [];
//     }

//     // Check if the item already exists in the inventory, if so, update its rarity
//     let existingItem = user.inventory.find(item => item.itemId === itemId);
//     if (existingItem) {
//       existingItem.rarity += rarity;
//     } else {
//       // Add the item to the inventory
//       user.inventory.push({ itemId, rarity });
//     }

//     await user.save();

//     res.status(200).json({ message: 'Item added to inventory successfully' });
//   } catch (error) {
//     console.error('Error adding item to inventory:', error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

router.post('/inventory/:userId/add-item', async (req, res) => {
  const { userId } = req.params;
  const { itemId, rarity } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize user inventory if it doesn't exist
    if (!user.inventory) {
      user.inventory = [];
    }

    // Check if the item already exists in the inventory
    let existingItem = user.inventory.find(item => item.itemId === itemId && item.rarity === rarity);
    if (existingItem) {
      // If item exists, increment its quantity
      existingItem.quantity++;
    } else {
      // If item does not exist, add it to the inventory with quantity 1
      user.inventory.push({ itemId, rarity, quantity: 1 });
    }

    await user.save();

    res.status(200).json({ message: 'Item added to inventory successfully' });
  } catch (error) {
    console.error('Error adding item to inventory:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


router.post('/activate-quest', async (req, res) => {
  const { userId, quest } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user already has an active quest
    if (user.activeQuest) {
      if (user.activeQuest.status === 'active') {
        return res.status(400).json({ message: 'User already has an active quest' });
      }
    }

    console.log("manage to activate!");

    const now = new Date();
    const timeDuration = quest.time
    const endTime = new Date(now.getTime() + timeDuration * 60 * 60 * 1000);

    // Set the user's active quest
    user.activeQuest = {
      id: quest.id,
      name: quest.name,
      description: quest.description,
      xp: quest.xp,
      startTime: now,
      endTime: endTime,
      status: 'active'
    };

    await user.save();

    res.status(200).json({ message: 'Quest activated successfully', user });
  } catch (error) {
    console.error('Error activating quest:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


router.get('/get-user-quests/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const activeQuests = user.activeQuest; // Adjust according to your schema

    res.status(200).json(activeQuests);
  } catch (error) {
    console.error('Error retrieving user quests:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


module.exports = router;
