const express = require('express');
const router = express.Router();
const { SearchLog, User, Employee } = require('../models');
const auth = require('../middlewares/auth');

//Create search log

router.post('/', auth, async (req, res) => {
    try {
        const log = await SearchLog.create({
            ...req.body,
            userId: req.user.id
        });
        res.json(log);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


//List search logs with user and employee

router.post('/', auth, async (req, res) => {
    try {
        const log = await SearchLog.create({
            ...req.body,
            userId: req.user.id
        });
        res.json(log);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;