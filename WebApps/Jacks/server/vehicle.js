class Vehicle {


    constructor(id, cathegory, brand, model) {
        if (id) {
            this.id = id;
        }

        this.cathegory = cathegory;
        this.brand = brand;
        this.model = model;
    }
}

module.exports = Vehicle;