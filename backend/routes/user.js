const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth');


//Register user

router.post('/register', async (req, res) => {

    try {
        const { password, ...rest } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ ...rest, passwordHash });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: 'Error registering user', details: error.message });
    }
});


//Login user

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: 'User not found or wrong password' });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(401).json({ message: 'User not found or wrong password' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: err.message });

    }
});

//List users (only admin)

router.get('/', authMiddleware, async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

module.exports = router;



