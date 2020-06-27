import Vehicle from "./Vehicle.js";

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
            resolve(user);
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

const API = {
  getVehicles,
  getBrands,
  login,
  getAvailableVehicles,
  getUser,
  getVehiclesInCategory,
};
export default API;
