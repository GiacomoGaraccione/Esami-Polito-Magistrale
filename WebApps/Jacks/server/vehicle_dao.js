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

exports.getAvailableVehicles = function (category, startingDay, endingDay) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) FROM Vehicle WHERE Vehicle.Category = ? and Vehicle.Id NOT IN (SELECT Vehicle.Id FROM Vehicle, Rental WHERE Vehicle.Id = Rental.VehicleId AND (Rental.StartingDay >= ? AND Rental.StartingDay <= ?) OR (Rental.EndingDay >= ? AND Rental.EndingDay <= ?) OR (Rental.StartingDay <= ? AND Rental.EndingDay >= ?) )";
    db.get(
      sql,
      [
        category,
        startingDay,
        endingDay,
        startingDay,
        endingDay,
        startingDay,
        endingDay,
      ],
      (err, row) => {
        if (err) {
          console.log(
            "There has been an error processing the query from the database"
          );
          reject(err);
        } else {
          resolve(row["COUNT(*)"]);
        }
      }
    );
  });
};

exports.getVehiclesInCategory = function (category) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT COUNT(*) From Vehicle WHERE Vehicle.Category = ?";
    db.get(sql, [category], (err, row) => {
      if (err) {
        console.log(
          "There has been an error processing the query from the database"
        );
        reject(err);
      } else {
        resolve(row["COUNT(*)"]);
      }
    });
  });
};

exports.getAvailableVehiclesId = function (category, startingDay, endingDay) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM Vehicle WHERE Vehicle.Category = ? and Vehicle.Id NOT IN (SELECT Vehicle.Id FROM Vehicle, Rental WHERE Vehicle.Id = Rental.VehicleId AND (Rental.StartingDay >= ? AND Rental.StartingDay <= ?) OR (Rental.EndingDay >= ? AND Rental.EndingDay <= ?) OR (Rental.StartingDay <= ? AND Rental.EndingDay >= ?) )";
    db.all(
      sql,
      [
        category,
        startingDay,
        endingDay,
        startingDay,
        endingDay,
        startingDay,
        endingDay,
      ],
      (err, rows) => {
        if (err) {
          console.log(
            "There has been an error processing the query from the database"
          );
          reject(err);
        } else {
          let vehicles = rows.map((row) => createVehicle(row));
          resolve(vehicles);
        }
      }
    );
  });
};

exports.insertRental = function (userId, vehicleId, startingDay, endingDay) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Rental(UserId, VehicleId, StartingDay, EndingDay) VALUES(?, ?, ?, ?)";
    db.run(sql, [userId, vehicleId, startingDay, endingDay], (err) => {
      if (err) {
        console.log("Error during insertion of rental in database");
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.getUserRentals = function (userId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Rental WHERE UserId = ?";

    db.all(sql, [userId], (err, rows) => {
      if (err) {
        console.log("Error while getting rentals of user");
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
