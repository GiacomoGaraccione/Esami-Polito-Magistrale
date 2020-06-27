class Vehicle {
  constructor(id, category, brand, model) {
    if (id) {
      this.id = id;
    }

    this.category = category;
    this.brand = brand;
    this.model = model;
  }
}

module.exports = Vehicle;
