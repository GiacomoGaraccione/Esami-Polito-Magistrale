const express = require('express');
const db = require ("./db")
const User = require ('./user');
const carDao = require("./cars_dao");
const PORT = 3001;

app = new express();

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

    app.get('/brands',(req,res)=>{
        carDao.getCarsBrands()
        .then((brands)=>{
            res.json(brands);
        })
        .catch((err)=>{
            res.status(500).json({
                errors: [{'msg':err}],
            });
        });
    });

   app.get('/cars',(req,res)=>{
       carDao.getAllCars()
       .then((cars)=>{
            res.json(cars);
       })
       .catch((err)=>{
           res.status(500).json({
               errors: [{'msg':err}],
           });
       });
   });



app.get('/prova',(req,res)=>{
    const sql = 'SELECT * FROM user';
    db.all(sql,(err,rows)=>{
        if(err){
            throw err;
        }
        const users = rows.map((row)=>({
            email: row.email,
            password: row.password,
            frequentCustomer: row.frequent_customer,
        }));
        res.json(users);
    })
    
});