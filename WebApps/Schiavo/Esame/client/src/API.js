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

const API={getCars,getBrands}

export default API;