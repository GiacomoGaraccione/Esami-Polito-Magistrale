import React from "react";
import moment from "moment";
import API from "./api/API.js";

export default class ConfiguratorResults extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      vehicles: [],
      availableVehicles: undefined,
      canRequestRent: false,
      isUserFrequent: false,
      totalCategoryVehicles: undefined,
    };
  }

  componentDidMount() {
    API.getVehicles().then((v) => {
      this.setState({ vehicles: v });
    });
    API.getUser(this.props.username)
      .then((u) => {
        if (u.frequent === 1) {
          this.setState({ isUserFrequent: true });
        }
      })
      .catch((err) => {
        console.log("There has been an error in contacting the server:", err);
      });
  }

  componentDidUpdate(prevProps) {
    let category = this.props.input.category;
    let startingDay = this.props.input.startingDay;
    let endingDay = this.props.input.endingDay;
    let driverAge = this.props.input.driverAge;
    let kmPerDay = this.props.input.kmPerDay;

    if (
      category === "Choose a Category" ||
      startingDay === undefined ||
      endingDay === undefined ||
      driverAge === "Choose an Age Range" ||
      kmPerDay === "Choose an estimation"
    ) {
      return;
    } else {
      API.getAvailableVehicles(category, startingDay, endingDay)
        .then((v) => {
          this.setState({ availableVehicles: v, canRequestRent: true });
        })
        .catch((err) => {
          console.log("There has been an error in contacting the server:", err);
        });
      API.getVehiclesInCategory(category)
        .then((v) => {
          this.setState({ remainingCategoryVehicles: v });
        })
        .catch((err) => {
          console.log("There has been an error in contacting the server:", err);
        });
    }
  }

  allParametersValid = () => {
    if (
      this.props.input.startingDay === undefined ||
      this.props.input.endingDay === undefined
    ) {
      return false;
    }
    if (
      this.props.input.category === "Choose a Category" ||
      this.props.input.driverAge === "Choose an Age Range" ||
      this.props.input.kmPerDay === "Choose an estimation"
    ) {
      return false;
    }
    return true;
  };

  areDatesCorrect = (startingDay, endingDay) => {
    let start = moment(startingDay, "YYYY-MM-DD");
    let end = moment(endingDay, "YYYY-MM-DD");
    let today = moment().format("YYYY-MM-DD");

    if (start.isSameOrBefore(end) && start.isSameOrAfter(today)) {
      return true;
    } else {
      return false;
    }
  };

  calculateRentPrice = () => {
    let frequent = this.state.isUserFrequent;
    let pricePerDay = 0;
    let kmPerDayPercentage = 0;
    let driverAgePercentage = 0;
    let extraDriversPercentage = 0;
    let extraInsurancePercentage = 0;
    let frequentUserPercentage = 0;
    let category = this.props.input.category;
    let kmPerDay = this.props.input.kmPerDay;
    let driverAge = this.props.input.driverAge;
    let extraDrivers = this.props.input.extraDrivers;
    let extraInsurance = this.props.extraInsurance;
    let finalPrice = 0;
    let totalCV = this.state.totalCategoryVehicles;
    let remainingCVPercentage = 0;
    let availableVehicles = this.state.availableVehicles;

    switch (category) {
      case "A":
        pricePerDay = 80;
        break;
      case "B":
        pricePerDay = 70;
        break;
      case "C":
        pricePerDay = 60;
        break;
      case "D":
        pricePerDay = 50;
        break;
      case "E":
        pricePerDay = 40;
        break;
      default:
        pricePerDay = 0;
    }

    switch (kmPerDay) {
      case "Less than 50 km/day":
        kmPerDayPercentage = -5;
        break;
      case "Unlimited":
        kmPerDayPercentage = 5;
        break;
      default:
        kmPerDayPercentage = 0;
    }

    switch (driverAge) {
      case "Under 25":
        driverAgePercentage = 5;
        break;
      case "Over 65":
        driverAgePercentage = 10;
        break;
      default:
        driverAgePercentage = 0;
    }

    if (extraDrivers > 0) {
      extraDriversPercentage = 15;
    }

    if (extraInsurance) {
      extraInsurancePercentage = 20;
    }

    if (frequent) {
      frequentUserPercentage = -10;
    }

    if ((100 * (availableVehicles - 1)) / totalCV < 10) {
      remainingCVPercentage = 10;
    }

    finalPrice =
      pricePerDay +
      (pricePerDay * kmPerDayPercentage) / 100 +
      (pricePerDay * driverAgePercentage) / 100 +
      (pricePerDay * extraDriversPercentage) / 100 +
      (pricePerDay * extraInsurancePercentage) / 100 +
      (pricePerDay * frequentUserPercentage) / 100 +
      (pricePerDay * remainingCVPercentage) / 100;

    return finalPrice;
  };

  render() {
    if (!this.allParametersValid()) {
      //message shown when parameters are still missing (not inserted by user)
      return <p> Please insert all mandatory parameters</p>;
    } else if (
      //message shown if the end date is set before the starting date
      !this.areDatesCorrect(
        this.props.input.startingDay,
        this.props.input.endingDay
      )
    ) {
      return <p> End date for a rental must come after the starting date</p>;
    } else {
      if (this.state.canRequestRent) {
        return (
          <>
            <p>Available Vehicles: {this.state.availableVehicles}</p>
            <p>Rental Price: {this.calculateRentPrice()}</p>
          </>
        );
      } else {
        return (
          <p>
            There are no available vehicles for your requested configuration.
          </p>
        );
      }
    }
  }
}
