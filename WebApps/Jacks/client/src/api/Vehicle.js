class Vehicle {


    constructor(id, cathegory, brand, model) {
        if (id) {
            this.id = id;
        }

        this.cathegory = cathegory;
        this.brand = brand;
        this.model = model;
    }

    static from(json) {
        const t = Object.assign(new Vehicle, json);
        return t;
    }
}

export default Vehicle;