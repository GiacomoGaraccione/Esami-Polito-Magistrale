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
        ContentType: "application/json",
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

const API = { getVehicles, getBrands, login };
export default API;
