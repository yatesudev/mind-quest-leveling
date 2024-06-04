const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');

/*
app.get('/', (req, res) => {
  res.send('Hello World from Node.js server!');
});*/

app.use(express.static(path.join(__dirname, '../dist/mind-quest-leveling/browser')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/mind-quest-leveling/browser/index.html'));
  });

  mongoose.connect('mongodb://ip.bbytes.dev/MindQuestLeveling', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});