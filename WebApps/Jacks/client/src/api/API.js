import Vehicle from './Vehicle';
const baseUrl = "/api";

async function getVehicles() {
    let url = "/";

    const response = await fetch(baseUrl + url);
    const vehiclesJson = response.json;

    if (response.ok) {
        return vehiclesJson.map((v) => new Vehicle(v.id, v.cathegory, v.brand, v.model));
    } else {
        let err = { status: response.status, errObj: vehiclesJson };
        throw err;  // An object with the error coming from the server
    }
}

const API = { getVehicles };
export default API;