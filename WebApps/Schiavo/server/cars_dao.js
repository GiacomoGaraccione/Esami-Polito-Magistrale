'use strict'

const Car = require('./car');
const db = require('./db');

const createCar = function(car){
    const category = car.category;
    const brand = car.brand;
    const model = car.model;
    const plate = car.plate;
    const seat = car.seat;
    return new Car(category,brand,model,plate,seat);
}



/*public methods*/

exports.getAllCars = function(){
    return new Promise((resolve,reject)=>{
        const sql = "SELECT * FROM car";
        db.all(sql,(err,rows)=>{
            if(err){
                reject(err);
            }
            else{
                let cars = rows.map((row)=> createCar(row))
                resolve(cars);
            }
            
        })
    })
}

exports.getCarsBrands = function(){
    return new Promise((resolve,reject)=>{
        const sql ="SELECT DISTINCT brand FROM car";
        db.all(sql,(err,rows)=>{
            if(err){
                reject(err);
            }
            else if(rows.length===0){
                resolve(undefined);
            }
            else{
                const brands = rows.map((row)=> row);
                resolve(brands);
            }
        });
    });
}

exports.getAvailableCars = function(category,start,end){
    return new Promise((resolve,reject)=>{
        const sql ='select * from car where car.category = ? and car.plate NOT IN ('+
                    'select car.plate from rent, car'+ 
                    ' where car.plate = rent.car_plate AND ('+
                    '(rent.starting_date >= ? AND rent.starting_date <= ?)'+
                    'OR'+
                    '(rent.end_date >= ? AND rent.end_date <= ?)'+
                    'OR'+
                    '(rent.starting_date <= ? AND rent.end_date >= ?)))';
        db.all(sql,[category,start,end,start,end,start,end],(err,rows)=>{
            if(err){
                reject(err);
            }
            else if(rows.length === 0){
                resolve(undefined);
            }
            else{
                const cars = rows.map((row)=> createCar(row));
                resolve(cars);
            }
        })
    })
}