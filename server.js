const express = require('express');
const mongoose = require('mongoose');

// INITIALIZE EXPRESS
const app = express();

// DB CONFIG
const db = require('./config/keys').mongoURI;

// CONNECT TO MONGODB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('Mongodb Connected'))
  .catch(err => console.log(err));

// ROUTES
app.get('/', (req, res) => res.send('Hi!'));

// PORT
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on ${port}...`);
});
