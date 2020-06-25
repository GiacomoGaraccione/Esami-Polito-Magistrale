"use strict";

const Vehicle = require("./vehicle.js");
const db = require("./db.js");

const createVehicle = function (row) {
  return new Vehicle(row.Id, row.Category, row.Brand, row.Model);
};

exports.getVehicles = function () {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Vehicle ORDER BY Category";
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        let vehicles = rows.map((row) => createVehicle(row));
        resolve(vehicles);
      }
    });
  });
};

exports.getBrands = function () {
  return new Promise((resolve, reject) => {
    const sql = "SELECT DISTINCT Brand FROM Vehicle";
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        let brands = rows.map((row) => row);
        resolve(brands);
      }
    });
  });
};
