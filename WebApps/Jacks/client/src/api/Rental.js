class Rental {
  constructor(Id, UserId, VehicleId, StartingDay, EndingDay) {
    if (Id) {
      this.Id = Id;
    }

    this.UserId = UserId;
    this.VehicleId = VehicleId;
    this.StartingDay = StartingDay;
    this.EndingDay = EndingDay;
  }
}

module.exports = Rental;
