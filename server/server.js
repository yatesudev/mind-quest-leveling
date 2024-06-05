const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { MongoClient, Db } = require('mongodb');
require('dotenv').config(); // Load environment variables from .env file

const mongoURI = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

app.use(express.static(path.join(__dirname, '../dist/mind-quest-leveling/browser')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/mind-quest-leveling/browser/index.html'));
});

MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async client => {
    console.log('Connected to MongoDB');

    const db = client.db(dbName); // Get the database instance

      /* Insert test data into your collection
      const collection = db.collection("Test"); // Get the collection within the database
      await collection.insertMany([
        { name: 'Test Data 1', value: 123 },
        { name: 'Test Data 2', value: 456 },
        { name: 'Test Data 3', value: 789 }
      ]);*/

    client.close(); // Close the connection once done
  })
  .catch(err => console.error('Could not connect to MongoDB', err));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
