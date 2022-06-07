const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

dotenv.config({ path: './config.env' });
require('./db/connect');
// const User=require('./model/userSchema');
app.use(express.json());
app.use(require('./router/auth'));
const PORT = process.env.PORT;

//Middleware
const middleware = (req, res, next) => {
  console.log('My middleware');
  next();
};
app.get('/', (req, res) => {
  res.send('Hello from server');
});

app.get('/about', middleware, (req, res) => {
  console.log('hello about');
  res.send('Hello About from server');
});

app.get('/contact', (req, res) => {
  res.cookie('Test', 'thapa');
  res.send('hello from the contatct server');
});

app.get('/login', (req, res) => {
  res.send('Hello Login from server');
});

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
