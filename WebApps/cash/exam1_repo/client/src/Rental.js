export default class Rental {
    constructor(id, carId, dateBeginning, dateEnd, userId){
        this.id = id;
        this.carId = carId;
        this.dateBeginning = dateBeginning;
        this.dateEnd = dateEnd;
        this.userId = userId;
    }
}