const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const userController = require('./controllers/userController');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/auth-system')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.post('/users', userController.createUser);
app.post('/users/login', userController.loginUser);
app.get('/users', userController.getUsers);
app.get('/users/:id', userController.getUserById);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
