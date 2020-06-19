import Car from "./car";

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

async function userLogin(username, password) {
    return new Promise((resolve, reject) => {
        fetch('/login', {method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify({mail: username, pw: password}),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    console.log(user);
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



const API={getCars,getBrands,userLogin}

export default API;