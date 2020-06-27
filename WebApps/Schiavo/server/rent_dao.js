'use strict'
const Rent = require("./rent");
const db = require("./db");
var moment = require('moment');

const createRent = function(row){
    const user = row.user;
    const id =row.id;
    const startingDay=row.starting_date;
    const endDay =row.end_date;
    const carPlate = row.car_plate;
    const driversAge = row.age;
    const extraDrivers= row.extra_drivers;
    const kilometers= row.kilometers;
    const insurance = row.insurance;
    const price = row.price;
    return new Rent(user,id,startingDay,endDay,carPlate,driversAge,extraDrivers,kilometers,insurance,price);
}

exports.getUserRent= function(mail){
    return new Promise((resolve,reject)=>{
        const sql = "SELECT * FROM rent WHERE user = ?"
        db.all(sql,[mail], (err,rows)=>{
            if(err){
                reject(err);
            }
            else if (rows.length === 0){
                resolve(undefined);
            }
            else{
                console.log(rows);  
                const rents = rows.map((row)=> createRent(row))
                resolve(rents);
            }
        })
    })
}

exports.deleteRent= function(id){
return new Promise((resolve,reject)=>{
    const sql = "DELETE FROM rent WHERE id = ?";
    db.run(sql,[id],(err)=>{
        if(err){
            reject(err);
        }
        else{
            resolve(null);
        }
    })
})

}

exports.createRent = function(mail,start,end,car,extraDriver,insurance,age,kilometers,price){
    return new Promise((resolve,reject)=>{
        const sql ="INSERT INTO rent(user,starting_date,end_date,car_plate,age,extra_drivers,kilometers,insurance,price) VALUES(?,?,?,?,?,?,?,?,?)"
        db.run(sql,[mail,start,end,car,age,extraDriver,kilometers,insurance,price], (err)=>{
            if(err){
                reject(err);
            }
            else{
                resolve("true");
            }
        })
    })
}


exports.countRent = function(mail){
    return new Promise((resolve,reject)=>{
        const today = moment().format("YYYY-MM-DD");
        const sql = "SELECT count(*) as count FROM rent  where user = ? and end_date < ?";
        db.get(sql,[mail,today],(err,row)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(row);
            }
        })
    })
}