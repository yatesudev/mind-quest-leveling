const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  character: {
    class: { type: String, default: null },
    level: { type: Number, default: 1 },
    stats: {
      xp: { type: Number, default: 0 },
    }
  },
  inventory: [
    {
      itemId: { type: Number, required: true },
      rarity: { type: Number, required: true },
      quantity: { type: Number, default: 1 } // Make quantity optional with a default value
    }
  ],
  activeQuest: {
    id: { type: String },
    name: { type: String },
    description: { type: String },
    xp: { type: Number },
    startTime: { type: Date }, // Add startTime field
    endTime: { type: Date },   // Add endTime field
    status: { type: String, default: 'nil' }
  }
}, { collection: 'users' });

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
