const express = require('express');
const router = express.Router();
const { Subscription, User } = require('../models');
const auth = require('../middlewares/auth');

//Create subscription

router.post('/', auth, async (req, res) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            userId: req.user.id
        });
        res.json(subscription);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//List subscriptions with user

router.get('/', auth, async (req, res) => {
    const subscriptions = await Subscription.findAll({ include: User });
    res.json(subscriptions);
});

module.exports = router;