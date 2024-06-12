// models/Character.js
const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  class: { type: String, required: true },
  level: { type: Number, default: 1 },
  stats: {
    xp: { type: Number, default: 0 },
  }
}, { collection: 'characters' });

module.exports = mongoose.model('Character', characterSchema);