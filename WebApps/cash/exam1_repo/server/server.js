'use strict';

const express = require('express');
const dao = require('./dao.js');
const cookieParser = require('cookie-parser');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');

const jwtSecret = 'nfRdfLgEKmpveusyJttWgisRR3ZkYaVsSOagpbLPgCNjH6BDOvS01vBkEL6HXlZIqTl1lbrJYvniVRECcU1TIuO8xExiWiAKRtG0BOAEc3aEQDvaZszXsovzAAr0rP';
const expireTime = 1800;

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

//login
app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const pwd = req.body.password;

    dao.checkUserPwd(username, pwd).then(() => {
        const token = jsonwebtoken.sign({user: username}, jwtSecret, {expiresIn: expireTime});
        res.cookie('token', token, {httpOnly: true, sameSite: true, maxAge: 1000*expireTime});
        res.end();
    }).catch((err) => {
        console.log('error in dao.checkUserPwd', err);
        res.status(401).end();
    });
});

//logout
app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});

//APIs that require authorization
app.use(cookieParser());

app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token
    })
);

//GET /api/cars/available?category={c}&begDate={bd}&endDate={ed}
//example: localhost:3000/api/cars/available?category=A&begDate=2020-06-23&endDate=2020-06-24
app.get('/api/cars/available', (req, res) => {
    const cat = req.query.category;
    const beg = req.query.begDate;
    const end = req.query.endDate;

    dao.getAvailableCars(cat, beg, end)
    .then((cars) => {
        res.json(cars);
    })
    .catch((err) => {
        res.status(500).json({errors: [{'msg': err}]});
    });
});

//GET rentals of a user
app.get('/api/users/:username/rentals', (req, res) => {
    const username = req.params.username;
    
    dao.getUserRentals(username)
    .then((rentals) => {
        res.json(rentals);
    })
    .catch((err) => {
        res.status(500).json({errors: [{'msg': err}]});
    });
});


app.post('/api/payment', (req, res) => {
    const cardNumber = req.body.cardNumber;
    const name = req.body.name;
    const cvv = req.body.cvv;

    if(cardNumber.length > 0 && name.length > 0 && cvv.length > 0){
        res.end();
    }
    else{
        res.status(500).json({error: 'fields must not be empty'});
    }
});

//POST new rental
app.post('/api/rentals', (req, res) => {
    const carId = req.body.carId;
    const dateBeg = req.body.dateBeginning;
    const dateEnd = req.body.dateEnd;
    const username = req.body.username;

    dao.saveNewRental(carId, dateBeg, dateEnd, username)
    .then(() => {
        res.end();
    })
    .catch(() => {
        res.status(500).json({error: 'error in saving the rentals'});
    });

    
});

//DELETE a rental
app.delete('/api/rentals/:id', (req, res) => {
    const id = req.params.id;
    
    dao.deleteRental(id)
    .then(() => {
        res.end();
    })
    .catch(() => {
        console.log('error in server.js deleting rental');
        res.status(500).json({error: 'error in deleting the rental'});
    })
});

//GET /user
//returns the current user
app.get('/api/user', (req, res) => {
    const user = req.user && req.user.user; 

    res.json(user);
});

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));
