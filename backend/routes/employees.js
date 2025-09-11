const express = require('express');
const router = express.Router();
const { Employee, Report } = require('../models');
const auth = require('../middlewares/auth');


//Create employee

router.post('/', auth, async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.json(employee);
    } catch (error) {
        res.status(400).json({ error: 'Error creating employee', details: error.message });
    }
});

//List employees with reports

router.get('/', auth, async (req, res) => {
    const employees = await Employee.findAll({
        include: { model: Report }
    });
    res.json(employees);
});

module.exports = router;

