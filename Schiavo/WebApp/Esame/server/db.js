'use strict'
const sqlite = require('sqlite3').verbose();

const DBSOURCE = './carRental-database.sqlite';
const db = new sqlite.Database(DBSOURCE,(err)=>{
    if(err){
        console.error(err.message);
        throw err;
    }
    else{
        console.log("connessione riuscita");
    }
});

module.exports = db;
