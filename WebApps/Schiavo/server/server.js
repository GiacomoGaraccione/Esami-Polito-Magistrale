const express = require('express');
const carDao = require("./cars_dao");
const userDao = require("./user_dao.js")
const rentDao = require("./rent_Dao.js");
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const jwt = require('express-jwt');
const morgan = require('morgan');
const PORT = 3001;
const expireTime=10; //seconds =20 min
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
                //CHECK IF USER HAS BECOME Frequent
                if(user.frequentCustomer==="false"){
                    rentDao.countRent(username).then((r)=>{
                        console.log(r)
                        if(r.count>=3){
                            user.frequentCustomer="true" // update user passed to client
                            userDao.updateFrequent(username); // update user in database

                        }
                    })
                }
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

app.use(
    jwt({
      secret: jwtSecret,
      getToken: req => req.cookies.token
    })
  );

  app.post('/rent',(req,res)=>{
    const mail = req.body.mail; 
    rentDao.getUserRent(mail)
    .then((rents)=>{
         res.json(rents);
    })
    .catch((err)=>{
        res.status(500).json({
            errors: [{'msg':err}]
        });
    });
  })
  app.post('/rent/add',(req,res)=>{
      const mail = req.body.userEmail;
      const start = req.body.startingDay;
      const end = req.body.endDay;
      const car = req.body.carPlate
      const extraDriver = req.body.extraDrivers;
      const insurance = req.body.insurance;
      const age = req.body.driversAge;
      const kilometers = req.body.kilometers;
      const price = req.body.price;
      rentDao.createRent(mail,start,end,car,extraDriver,insurance,age,kilometers,price)
      .then((r)=>{
          res.json(r)
      })
      .catch((err)=>{
        res.status(500).json({
            errors:[{"msg":err}]
        })
    }) 
  })

  app.delete('/rent/delete/:rentId', (req,res)=>{
      rentDao.deleteRent(req.params.rentId)
      .then((result)=> res.status(204).end())
      .catch((err)=> res.status(500).json({
          errors: [{"param":"serevr","msg":err}]
      }))
  })

  app.post('/availability',(req,res)=>{
    const category = req.body.category;
    const start = req.body.start;
    const end = req.body.end;
    carDao.getAvailableCars(category,start,end)
    .then((cars)=>{
        res.json(cars)
    })
    .catch((err)=>{
        res.status(500).json({
            errors:[{"msg":err}]
        })
    })
  })

  
  app.get('/payment', (req,res)=>{
      res.json("true");
  })
