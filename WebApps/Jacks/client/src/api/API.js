import Vehicle from "./Vehicle.js";
import Rental from "./Rental.js";

async function getVehicles() {
  let url = "/vehicles";

  const response = await fetch(url);
  const vehiclesJson = await response.json();

  if (response.ok) {
    vehiclesJson.map((v) => new Vehicle(v.Id, v.Category, v.Brand, v.Model));
    return vehiclesJson;
  } else {
    let err = { status: response.status, errObj: vehiclesJson };
    throw err; // An object with the error coming from the server
  }
}

async function getBrands() {
  let url = "/brands";

  const response = await fetch(url);
  const brandsJson = await response.json();

  if (response.ok) {
    return brandsJson;
  } else {
    let err = { status: response.status, errObj: brandsJson };
    throw err;
  }
}

async function login(username, password) {
  return new Promise((resolve, reject) => {
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((user) => {
            console.log(user);
            resolve();
          });
        } else {
          reject(response);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function getAvailableVehicles(category, startingDay, endingDay) {
  let url =
    "/vehicles/available?category=" +
    category +
    "&startingDay=" +
    startingDay +
    "&endingDay=" +
    endingDay;

  const response = await fetch(url);
  const aVJson = await response.json();

  if (response.ok) {
    return aVJson;
  } else {
    let err = { status: response.status, errObj: aVJson };
    throw err;
  }
}

async function getUser(username) {
  let url = "/user/present?username=" + username;

  const response = await fetch(url);
  const userJson = await response.json();

  if (response.ok) {
    return userJson;
  } else {
    let err = { status: response.status, errObj: userJson };
    throw err;
  }
}

async function getVehiclesInCategory(category) {
  let url = "/vehicles/remaining?category=" + category;

  const response = await fetch(url);
  const vICJson = await response.json();

  if (response.ok) {
    return vICJson;
  } else {
    let err = { status: response.status, errObj: vICJson };
    throw err;
  }
}

async function performPayment(name, cardNumber, cvv) {
  return new Promise((resolve, reject) => {
    fetch("/payment", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name: name, cardNumber: cardNumber, cvv: cvv }),
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function getAvailableVehiclesId(category, startingDay, endingDay) {
  let url =
    "/vehicles/id/available?category=" +
    category +
    "&startingDay=" +
    startingDay +
    "&endingDay=" +
    endingDay;

  const response = await fetch(url);
  const aVJson = await response.json();

  if (response.ok) {
    return aVJson.map((j) => j.id);
  } else {
    let err = { status: response.status, errObj: aVJson };
    throw err;
  }
}

async function postRental(userId, vehicleId, startingDay, endingDay) {
  return new Promise((resolve, reject) => {
    fetch("/rental", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        vehicleId: vehicleId,
        startingDay: startingDay,
        endingDay: endingDay,
      }),
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function getRentals(userId) {
  let url = "/users/" + userId + "/rentals";

  const response = await fetch(url);
  const rentalsJson = await response.json();

  if (response.ok) {
    return rentalsJson;
  } else {
    let err = { status: response.status, errObj: rentalsJson };
    throw err;
  }
}

const API = {
  getVehicles,
  getBrands,
  login,
  getAvailableVehicles,
  getUser,
  getVehiclesInCategory,
  performPayment,
  getAvailableVehiclesId,
  postRental,
  getRentals,
};
export default API;
