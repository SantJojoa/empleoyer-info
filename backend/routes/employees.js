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

//Search employee by document number

router.get('/search/:documentNumber', auth, async (req, res) => {
    try {
        const { documentNumber } = req.params;
        const employee = await Employee.findOne({
            where: { documentNumber }
        });
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Error searching employee', details: error.message });
    }
})
module.exports = router;

