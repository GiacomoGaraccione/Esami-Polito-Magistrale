const express = require("express");
const vehicleDao = require("./vehicle_dao.js");
const userDao = require("./user_dao.js");
const cookieParser = require("cookie-parser");
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const expireTime = 1800;
const jwtSecret = "123456789";
const authErrorObj = {
  errors: [{ param: "Server", msg: "Authorization error" }],
};

const PORT = 3001;

app = new express();
app.use(express.json());

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);

//GET of all vehicles in the database
app.get("/vehicles", (req, res) => {
  vehicleDao
    .getVehicles()
    .then((vehicles) => {
      res.json(vehicles);
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: err }],
      });
    });
});

//GET of all distinct brands in the database
app.get("/brands", (req, res) => {
  vehicleDao
    .getBrands()
    .then((brands) => {
      res.json(brands);
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: error }],
      });
    });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  userDao.getUser(username).then((user) => {
    if (user === undefined) {
      res.status(404).send({
        errors: [{ param: "Server", msg: "Username does not exist" }],
      });
    } else {
      if (user.password !== password) {
        res.status(401).send({
          errors: [{ param: "Server", msg: "Password is incorrect" }],
        });
      } else {
        const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, {
          expiresIn: expireTime,
        });
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: true,
          maxAge: 1000 * expireTime,
        });
        res.json({
          username: user.username,
          password: user.password,
          frequent: user.frequent,
        });
      }
    }
  });
});

app.get("/vehicles/available", (req, res) => {
  const category = req.query.category;
  const startingDay = req.query.startingDay;
  const endingDay = req.query.endingDay;

  vehicleDao
    .getAvailableVehicles(category, startingDay, endingDay)
    .then((vehicles) => {
      res.json(vehicles);
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: error }],
      });
    });
});

app.get("/user/present", (req, res) => {
  const username = req.query.username;

  userDao
    .getUser(username)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: error }],
      });
    });
});

app.get("/vehicles/remaining", (req, res) => {
  const category = req.query.category;

  vehicleDao
    .getVehiclesInCategory(category)
    .then((cat) => {
      res.json(cat);
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: error }],
      });
    });
});
