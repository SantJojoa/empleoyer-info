require('dotenv').config();
const express = require('express');
const db = require('./models');
const app = express();
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/user');
const employeeRoutes = require('./routes/employees');
const reportRoutes = require('./routes/reports');
const searchLogRoutes = require('./routes/searchlogs');
const subscriptionRoutes = require('./routes/subscriptions');
const paymentRoutes = require('./routes/payments');

const allowedOrigins = [
    'http://localhost:5173',
    'https://ts2ze9-ip-161-18-57-123.tunnelmole.net '
]

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (allowedOrigins.some(a => origin.endsWith('.tunnelmole.net')) || allowedOrigins.includes(origin)) {
            return cb(null, true);
        }
        return cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));


app.use(express.json());

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//Routes

app.use('/users', userRoutes);
app.use('/employees', employeeRoutes);
app.use('/reports', reportRoutes);
app.use('/searchLogs', searchLogRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/payments', paymentRoutes);




// Sincronice db and start server

db.sequelize.sync({ alter: true }).then(() => {
    console.log('-- Server.js : Tables synchronized')
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => console.log(`-- Server.js : Server running on port ${PORT}`));
}).catch(err => console.log('-- Server.js : Error synchronizing tables', err));
