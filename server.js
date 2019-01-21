const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// BRING IN ROUTE FILES
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

// INITIALIZE EXPRESS
const app = express();

// BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// USE ROUTES
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// PORT
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on ${port}...`);
});
