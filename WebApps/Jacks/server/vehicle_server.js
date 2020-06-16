'use strict';

const express = require('express');
const vehicleDao = require('./vehicle_dao');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const jwtSecret = '12345';
const expireTime = 300; //seconds
// Authorization error
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };

//create application
const app = express();
const port = 3001;

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());


//GET /vehicles
app.get('/api/vehicles', (req, res) => {
    vehicleDao.getVehicles().then((vehicles) => {
        res.json(vehicles);
    }).catch((err) => {
        res.status(500).json({
            errors: [{ 'msg': err }],
        });
    });
});