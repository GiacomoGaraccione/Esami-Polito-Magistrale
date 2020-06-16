'use strict';

const Vehicle = require('./vehicle.js');
const db = require('./db');

const createVehicle = function (row) {
    return new Vehicle(row.id, row.cathegory, row.brand, row.model)
}

exports.getVehicles = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT v.Id, v.Cathegory, v.Brand, v.Model FROM Vehicle as v";
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let vehicles = rows.map((row) => createVehicle(row));
                resolve(vehicles);
            }
        });
    });
}