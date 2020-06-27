class Rent {
    constructor(userEmail,id,startingDay,endDay,carPlate,driversAge,extraDrivers,kilometers,insurance,price){
        this.userEmail=userEmail;
        this.id=id;
        this.startingDay=startingDay;
        this.endDay=endDay;
        this.carPlate=carPlate;
        this.driversAge=driversAge;
        this.extraDrivers=extraDrivers;
        this.kilometers=kilometers;
        this.insurance=insurance;
        this.price=price;
    }
}

module.exports= Rent;