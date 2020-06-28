import Car from './Car.js'
import Rental from './Rental.js'

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

//given the form data, returns the list of available cars (list of ids)
export async function getAvailableCars(category, begDate, endDate){
    const res = await fetch('/api/cars/available?category=' + category + '&begDate=' + begDate + '&endDate=' + endDate);
    if(res.ok){
        const resJ = await res.json();
        return resJ.map(j => j.id);
    }
    
    let err = {status: res.status, errObj:res};
    throw err;
}

export async function getUserRentals(user){
    const res = await fetch('/api/users/' + user + '/rentals');
    if(res.ok){
        const resJ = await res.json();
        return resJ.map(j => rentalFromJson(j));
    }
    
    let err = {status: res.status, errObj:res};
    throw err;
}

function rentalFromJson(j){
    return new Rental(j.id, j.carId, j.dateBeginning, j.dateEnd, j.userId);
}

export async function sendPaymentInformation(cardNumber, name, cvv){
    return new Promise( (resolve, reject) => {
        fetch('/api/payment', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({cardNumber: cardNumber, name: name, cvv: cvv})
        })
        .then((res) => {
            if (res.ok){
                resolve();
            }
            else{
                reject(res);
            }
        })
        .catch((err) => {
            reject(err);
        })
    } );
}

export async function postNewRental(carId, dateBeginning, dateEnd, username){
    return new Promise( (resolve, reject) => {
        fetch('/api/rentals', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({carId: carId, dateBeginning: dateBeginning, dateEnd: dateEnd, username: username})
        })
        .then((res) => {
            if(res.ok){
                resolve();
            }
            else{
                reject(res);
            }
        })
        .catch((err) => {
            reject(err);
        });
    } );
}

export async function deleteRental(id){
    return new Promise( (resolve, reject) => {
        fetch('/api/rentals/' + id, {method: 'DELETE'})
        .then((res) => {
            if(res.ok){
                resolve();
            }
            else{
                console.log('error in api.js in deleting a rental');
                reject(res);
            }
        })
        .catch(() => {
            console.log('error in api.js delete rental');
            reject();
        })
    } );
}

export async function isAuthenticated(){
    const res = await fetch('/api/user');
    if (res.ok){
        const resJ = await res.json();
        return resJ;
    }
    else{
        let err = {status: res.status};
        throw err;
    }
}