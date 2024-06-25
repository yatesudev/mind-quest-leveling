const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  personalityType: {type: String, default: "none"},
  password: { type: String, required: true },
  lootboxes: {type: Number, default: 5},
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

userSchema.methods.checkAndUpdateQuestStatus = async function() {
  const now = new Date();
  if (this.activeQuest && this.activeQuest.status === 'active' && new Date(this.activeQuest.endTime) < now) {
    this.character.stats.xp += this.activeQuest.xp;

    if (this.character.stats.xp >= 100000) { // Limit in case someone tries to cheat (Server Security so that it desnt crash)
      this.character.stats.xp = 100000
    }


    // Level up with a delay to avoid server overload
    while (this.character.stats.xp >= 100) {
      this.character.stats.xp -= 100;
      this.character.level += 1;
    }

    this.activeQuest = {
      id: null,
      name: null,
      description: null,
      xp: null,
      startTime: null,
      endTime: null,
      status: 'nil'
    };
    this.lootboxes += 1; // Increment the lootboxes
    await this.save();
  }
};


module.exports = mongoose.model('User', userSchema);
