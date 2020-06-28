import React from "react";
import "./App.css";
import API from "./api/API.js";
import Container from "react-bootstrap/Container";
import { Route } from "react-router-dom";
import { Switch } from "react-router";
import { AppTitle } from "./CustomComponents.js";
import { ShowVehicles } from "./VehicleComponents.js";
import { Filters } from "./Filters.js";
import LoginForm from "./LoginForm.js";
import RentalConfigurator from "./RentalConfigurator.js";
import ShowRentals from "./ShowRentals.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicles: [],
      brands: [],
      vehiclesFiltered: [],
      vehiclesShow: [],
      activeCatFilters: [],
      activeBrandFilters: [],
      loggedIn: false,
      username: undefined,
      password: undefined,
    };
  }

  componentDidMount() {
    API.getVehicles().then((v) =>
      this.setState({ vehicles: v, vehiclesShow: v })
    );
    API.getBrands().then((b) => this.setState({ brands: b }));
  }

  onClickCatFilter = (c) => {
    let aCF = this.state.activeCatFilters;
    let aBF = this.state.activeBrandFilters;
    let vF = [];

    console.log("aCF", aCF);
    if (this.state.activeCatFilters.includes(c.value)) {
      let i = aCF.indexOf(c);
      aCF.splice(i, 1);
      vF = this.filterCars(aCF, aBF);
    } else {
      aCF.push(c.value);
      vF = this.filterCars(aCF, aBF);
    }
    this.setState(() => ({
      vehiclesShow: vF,
      activeCatFilters: aCF,
      activeBrandFilters: aBF,
    }));
  };

  onClickBrandFilter = (b) => {
    let aCF = this.state.activeCatFilters;
    let aBF = this.state.activeBrandFilters;
    let vF = [];

    console.log("aBF", aBF);
    if (this.state.activeBrandFilters.includes(b.Brand)) {
      let i = aBF.indexOf(b.Brand);
      aBF.splice(i, 1);
      vF = this.filterCars(aCF, aBF);
    } else {
      aBF.push(b.Brand);
      vF = this.filterCars(aCF, aBF);
    }
    this.setState(() => ({
      vehiclesShow: vF,
      activeCatFilters: aCF,
      activeBrandFilters: aBF,
    }));
  };

  filterCars = (activeCatFilters, activeBrandFilters) => {
    let vF = [];
    let vehicles = this.state.vehicles;

    vF = vehicles.filter(
      (v) =>
        this.isCatCorrect(activeCatFilters, v) &&
        this.isBrandCorrect(activeBrandFilters, v)
    );
    return vF;
  };

  isCatCorrect = (activeCatFilters, v) => {
    if (activeCatFilters.length === 0) {
      return true;
    }
    let i = activeCatFilters.findIndex(
      (cat) => cat.localeCompare(v.category) === 0
    );
    if (i === -1) {
      return false;
    }
    return true;
  };

  isBrandCorrect = (activeBrandFilters, v) => {
    if (activeBrandFilters === 0) {
      return true;
    }
    let i = activeBrandFilters.findIndex(
      (br) => br.localeCompare(v.brand) === 0
    );
    if (i === -1) {
      return false;
    }
    return true;
  };

  doLogin = (username, password) => {
    this.setState({
      username: username,
      password: password,
      loggedIn: true,
    });
  };

  render() {
    if (this.state.loggedIn === true) {
      return (
        <Container fluid>
          <Switch>
            <Route path="/logged">
              <AppTitle loggedIn={this.state.loggedIn} />
              <Filters
                vehicles={this.state.vehicles}
                vehiclesFiltered={this.state.vehiclesFiltered}
                brands={this.state.brands}
                onClickCatFilter={this.onClickCatFilter}
                onClickBrandFilter={this.onClickBrandFilter}
              />
              <ShowVehicles vehiclesShow={this.state.vehiclesShow} />
            </Route>
            <Route path="/login">
              <AppTitle loggedIn={this.state.loggedIn} />
              <ShowRentals username={this.state.username} />
            </Route>
            <Route path="/rental">
              <AppTitle loggedIn={this.state.loggedIn} />
              <RentalConfigurator username={this.state.username} />
            </Route>
          </Switch>
        </Container>
      );
    } else {
      return (
        <Container fluid>
          <Switch>
            <Route path="/home">
              <AppTitle loggedIn={this.state.loggedIn} />
              <Filters
                vehicles={this.state.vehicles}
                vehiclesFiltered={this.state.vehiclesFiltered}
                brands={this.state.brands}
                onClickCatFilter={this.onClickCatFilter}
                onClickBrandFilter={this.onClickBrandFilter}
              />
              <ShowVehicles vehiclesShow={this.state.vehiclesShow} />
            </Route>
            <Route path="/login">
              <LoginForm doLogin={this.doLogin} />
            </Route>
          </Switch>
        </Container>
      );
    }
  }
}
export default App;
