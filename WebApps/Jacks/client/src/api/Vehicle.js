class Vehicle {
  constructor(Id, Category, Brand, Model) {
    if (Id) {
      this.Id = Id;
    }

    this.Category = Category;
    this.Brand = Brand;
    this.Model = Model;
  }
}

module.exports = Vehicle;
