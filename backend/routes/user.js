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

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: 'Error registering user', details: error.message });
    }
});


//Login user

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({
                success: false,
                code: 'INVALID CREDENTIALS',
                message: 'Correo o contraseña incorrectas'
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET,
            {
                expiresIn: '7d'

            });


        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                birthDate: user.birthDate,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({
            success: false,
            code: 'SERVER ERROR',
            message: 'Hubo un problema en el servidor. Intenta nuevamente más tarde',
        });

    }
});

//List users (only admin)

router.get('/', authMiddleware, async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

module.exports = router;



