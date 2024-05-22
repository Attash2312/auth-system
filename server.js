const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/auth-db');

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(400).send('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id }, 'secret_key');
    res.send({ token });
});

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied');
    try {
        const verified = jwt.verify(token, 'secret_key');
        req.user = verified;
        next();
    } catch {
        res.status(400).send('Invalid token');
    }
};

app.get('/protected', authMiddleware, (req, res) => {
    res.send('This is protected content');
});

app.listen(3000, () => console.log('Server running on port 3000'));
