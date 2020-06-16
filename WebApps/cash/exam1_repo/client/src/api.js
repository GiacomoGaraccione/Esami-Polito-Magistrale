import Car from './Car.js'

export async function getAllCars(){
    /*const cars = await fetch('http://localhost:3001/api/cars');
    console.log(cars);

    return cars;*/

    const cars = [];
    cars[cars.length] = new Car(1, 'A', 'Audi', 'A1');
    cars[cars.length] = new Car(2, 'A', 'KIA', 'K89');
    cars[cars.length] = new Car(3, 'A', 'Adjasdh', 'hdskhsdkjk');

    return cars;
}