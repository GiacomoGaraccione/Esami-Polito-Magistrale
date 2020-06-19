const express = require('express');
const carDao = require("./cars_dao");
const userDao = require("./user_dao.js")
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const jwt = require('express-jwt');
const morgan = require('morgan');
const PORT = 3001;
const expireTime=1200; //seconds =20 min
const jwtSecret="5uCcFWsuN6kVF2ziH6HClGIvZxT_8v8aZQUbfwyJ9fEJwaygawGCZBZpwMhIK79_m0iuUgOKmXRClQSoyJPduOFNzDMEK1oTJruz1gQvutw7UumYBBXFn7wXzcaEDCDkA7siSghUamDKZyMWymF5fnCVx_f_uTueZ4MxCnyRUKc"
const authErrorObj = { errors: [{  'param': 'Server', 'msg': 'Authorization error' }] };

const app = new express();
app.use(morgan('tiny'));
app.use(express.json());

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

   app.post('/login', (req, res) => {
    const password = req.body.pw;
    const username = req.body.mail;
    
    userDao.getUser(username)
      .then((user) => {

        if(user === undefined) {
            res.status(404).send({
                errors: [{ 'param': 'Server', 'msg': 'Invalid e-mail' }] 
              });
        } else {
            if(user.password !== password){
                console.log(user.password)
                res.status(401).send({
                    errors: [{ 'param': 'Server', 'msg': 'Wrong password' }] 
                  });
            } else {
                //AUTHENTICATION SUCCESS
                const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, {expiresIn: expireTime});
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
                res.json({mail: user.email, password:user.password, frequent:user.frequentCustomer, fullname:user.fullName, cardNumber:user.cardNumber, cvv:user.cvv});
            }
        } 
      }).catch(

        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
            new Promise((resolve) => {setTimeout(resolve, 1000)}).then(() => res.status(401).json(authErrorObj))
        }
      );
  });

app.use(cookieParser());

app.post('/logout', (req, res) => {
    res.clearCookie('token').end();
});
