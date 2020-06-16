'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('./data/car_rental.db', (err) => {
    if(err){
        console.log('error in starting the database');
        throw err;
    }
});

exports.getAllCars = async function() {
    const cars = [];
    cars[cars.length] = new Car(1, 'A', 'Audi', 'A1');
    cars[cars.length] = new Car(2, 'A', 'KIA', 'K89');
    cars[cars.length] = new Car(3, 'A', 'Adjasdh', 'hdskhsdkjk');

    return cars;
}