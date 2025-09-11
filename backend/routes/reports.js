const express = require('express');
const router = express.Router();
const { Report, User, Employee } = require('../models');
const auth = require('../middlewares/auth');

//Create report
router.post('/', auth, async (req, res) => {
    try {
        const report = await Report.create({
            ...req.body,
            userId: req.user.id,
        });
        res.json(report);
    } catch (error) {
        res.status(400).json({ error: 'Error creating report', details: error.message });
    }

});


//List reports with user and employee

router.get('/', auth, async (req, res) => {
    const reports = await Report.findAll({
        include: [User, Employee]
    });
    res.json(reports);
});

module.exports = router;