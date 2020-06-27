import Car from "./car";
import Rent from "./rent";
let comp =0;
function compare(A,B){

    const a= A.category;
    const b=B.category;
    if(a>b){
        comp=1;
    }
    if(a<b){
        comp=-1;
    }
    return comp;
}

async function getCars(){
    let url ="/cars"
    const response = await fetch(url)
    const carsJson = await response.json();
    if(response.ok){
        carsJson.map((c)=> new Car(c.category,c.brand,c.model,c.plate,c.seat));
        return carsJson.sort(compare);
    }
    else{
        let err ={status: response.status, errObj:carsJson}
        throw err;
    }
}
 
async function getBrands(){
   let url ="/brands"
   const response = await fetch(url);
   const brandsJson = await response.json();
   if(response.ok){
       return (brandsJson.map((b)=>b.brand ))
   }
   else{
    let err ={status: response.status, errObj:brandsJson}
    throw err;
}
}

async function getRents(mail){
    return new Promise((resolve,reject)=>{
        fetch('/rent',{method:'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({mail:mail})
    }).then((response)=>{
        if(response.ok){
            response.json().then((rents)=> {rents.map((r)=> new Rent(r))
            resolve(rents);
        })
        }
        else{
            // return error status
            reject(response.status);
                
        }
    }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    })
}

async function computeAvailability(category,start,end){
    return new Promise((resolve,reject)=>{
        fetch('/availability',{method:'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({category:category,start:start,end:end})
    }).then((response)=>{
        if(response.ok){
            response.json().then((cars)=> {cars.map((c)=> new Car(c.category,c.brand,c.model,c.plate,c.seat))
            resolve(cars);
        })
        }
        else{
            // return error status
            reject(response.status);
                
        }
    }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    })
}

async function userLogin(username, password) {
    return new Promise((resolve, reject) => {
        fetch('/login', {method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify({mail: username, pw: password}),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function deleteRent(rentId){
    return new Promise((resolve,reject)=>{
        fetch("/rent/delete/"+rentId, {method: 'DELETE'})
        .then((response)=>{
            if(response.ok){
                resolve(null);
            }
            else{
                // return error status
                reject(response.status);
                    
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
        })
    }

async function addRent(rent){
    console.log(rent);
    return new Promise((resolve,reject)=>{
        fetch('/rent/add', {method:'POST',headers: {'Content-Type': 'application/json'}, body: JSON.stringify(rent),
        })
        .then((response)=>{
            if(response.ok){
                resolve("true");
            }
            else{
                // return error status
                reject(response.status);
                    
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
        })
    }
async function pay(amount){
    let url ="/payment"
    const response = await fetch(url);
      if(response.ok){
        const res = await response.json();
        return (res);
    }
    else{
     let err =response.status;
     console.log(err);
     throw err;
 }
}

async function userLogout() {
    return new Promise((resolve, reject) => {
        fetch('/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}


const API={getCars,getBrands,userLogin,getRents,computeAvailability,deleteRent,addRent,pay,userLogout}

export default API;