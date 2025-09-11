const express = require('express');
const router = express.Router();
const { Payment, User } = require('../models');
const auth = require('../middlewares/auth');

//Create payment
router.post('/', auth, async (req, res) => {
    try {
        const payment = await Payment.create({
            ...req.body,
            userId: req.user.id
        });
        res.json(payment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//List payments with user
router.get('/', auth, async (req, res) => {
    const payments = await Payment.findAll({ include: User });
    res.json(payments);
});

module.exports = router;