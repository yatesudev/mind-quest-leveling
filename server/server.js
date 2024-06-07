const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');

require('dotenv').config(); // Load environment variables from .env file

const mongoURI = process.env.MONGODB_URI;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../dist/mind-quest-leveling/browser')));

// Use auth routes
app.use('/auth', authRoutes);

// Catch-all route to serve Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/mind-quest-leveling/browser/index.html'));
});

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('Could not connect to MongoDB', err));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});