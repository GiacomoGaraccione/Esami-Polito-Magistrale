import Car from './Car.js'

export async function getAllCars(){
    const res = await fetch('/api/cars');
    const carsJson = await res.json();
    
    return carsJson.map(cj => carFromJson(cj));
}

function carFromJson(carJson){
    return new Car(carJson.id, carJson.category, carJson.brand, carJson.model);
}

export async function login(username, password){
    return new Promise((resolve, reject) => {
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({username: username, password: password}),
        }).then((response) => {
            if (response.ok){
                resolve();
            }
            else{
                reject(response);
            }
        }).catch((err) => {
            reject(err);
        })
    });
}

export async function logout(){
    return new Promise((resolve, reject) => {
        fetch('/api/logout', {
            method: 'POST',
        }).then((response) => {
            if(response.ok){
                resolve(null);
            }
            else{
                reject(response);
            }
        });
    });
}

//given the form data, returns the number of available cars
export async function getAvailableCars(category, begDate, endDate){
    const res = await fetch('/api/cars/available?category=' + category + '&begDate=' + begDate + '&endDate=' + endDate);
    const resJ = await res.json();
    if(res.ok){
        return resJ;
    }
    
    let err = {status: res.status, errObj:resJ};
    throw err;
}

export async function isFrequentCustomer(user){
    
}