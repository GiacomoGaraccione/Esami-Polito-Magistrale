'use strict';

const express = require('express');
const dao = require('./dao.js');

const PORT = 3001;
const app = new express();

app.use(express.json());

//GET all cars
app.get('/api/cars', (req, res) => {
    dao.getAllCars()
    .then((cars) => {
        res.json(cars);
    })
    .catch((err) => {
        res.status(500).json({errors: [{'msg': err}]});
    });
});

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));