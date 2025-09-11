const express = require('express');
const router = express.Router();
const { Report, User, Employee } = require('../models');
const auth = require('../middlewares/auth');

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const e = require('express');

//Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
        cb(null, `${base}_${Date.now()}${ext}`);
    }
});

const upload = multer({ storage });

//Create report
router.post('/', auth, upload.single('evidence'), async (req, res) => {
    try {
        const {
            documentNumber,
            firstName,
            lastName,
            industry,
            description,
            incidentDate,
            city,
        } = req.body;

        if (!documentNumber || !firstName || !lastName || !industry || !description || !incidentDate || !city) {
            return res.status(400).json({ error: 'Faltan campos requeridos', details: 'documentNumber, firstName, lastName, industry, description, incidentDate y city son obligatorios' });
        }

        //Find or create employee
        let employee = await Employee.findOne({
            where: { documentNumber }
        });
        if (!employee) {
            employee = await Employee.create({
                documentNumber,
                firstName,
                lastName,
                city,
                industry,
            }
            );
        }
        const evidenceUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const report = await Report.create({
            userId: req.user.id,
            employeeId: employee.id,
            description,
            incidentDate: new Date(incidentDate),
            city,
            evidenceUrl,
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