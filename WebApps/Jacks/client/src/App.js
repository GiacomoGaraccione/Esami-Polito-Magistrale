import React from "react";
import "./App.css";
import API from "./api/API.js";
import Container from "react-bootstrap/Container";
import { Route } from "react-router-dom";
import { Switch } from "react-router";
import { AppTitle, LoginButton } from "./CustomComponents.js";
import { ShowVehicles } from "./VehicleComponents.js";
import { Filters } from "./Filters.js";
import LoginForm from "./LoginForm.js";
import RentalConfigurator from "./RentalConfigurator.js";

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

    if (this.state.activeCatFilters.includes(c.value)) {
      let i = aCF.indexOf(c);
      aCF.splice(i, 1);
      if (aCF.length === 0 && aBF.length === 0) {
        vF = this.state.vehicles;
      } else {
        for (let [i, v] of this.state.vehicles.entries()) {
          let br = v.brand;
          let cat = v.category;
          if (v.category === c.value) {
            if (aBF.length === 0) {
              vF.push(v);
            } else if (aBF.includes(br)) {
              vF.push(v);
            }
          } else if (aCF.includes(cat)) {
            if (aBF.length === 0) {
              vF.push(v);
            } else if (aBF.includes(br)) {
              vF.push(v);
            }
          }
        }
      }
    } else {
      aCF.push(c.value);
      for (let [i, v] of this.state.vehicles.entries()) {
        let br = v.brand;
        let cat = v.category;
        if (v.category === c.value) {
          if (aBF.length === 0) {
            vF.push(v);
          } else if (aBF.includes(br)) {
            vF.push(v);
          }
        } else if (aCF.includes(cat)) {
          if (aBF.length === 0) {
            vF.push(v);
          } else if (aBF.includes(br)) {
            vF.push(v);
          }
        }
      }
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

    if (this.state.activeBrandFilters.includes(b.Brand)) {
      let i = aBF.indexOf(b.Brand);
      aBF.splice(i, 1);
      if (aBF.length === 0 && aCF.length === 0) {
        vF = this.state.vehicles;
      } else {
        for (let [i, v] of this.state.vehicles.entries()) {
          let br = v.brand;
          let cat = v.category;
          if (v.brand === b.Brand) {
            if (aCF.length === 0) {
              vF.push(v);
            } else if (aCF.includes(cat)) {
              vF.push(v);
            }
          } else if (aBF.includes(br)) {
            if (aCF.length === 0) {
              vF.push(v);
            } else if (aCF.includes(cat)) {
              vF.push(v);
            }
          }
        }
      }
    } else {
      aBF.push(b.Brand);
      for (let [i, v] of this.state.vehicles.entries()) {
        let br = v.brand;
        let cat = v.category;
        if (v.brand === b.Brand) {
          if (aCF.length === 0) {
            vF.push(v);
          } else if (aCF.includes(cat)) {
            vF.push(v);
          }
        } else if (aBF.includes(br)) {
          if (aCF.length === 0) {
            vF.push(v);
          } else if (aCF.includes(cat)) {
            vF.push(v);
          }
        }
      }
    }
    this.setState(() => ({
      vehiclesShow: vF,
      activeCatFilters: aCF,
      activeBrandFilters: aBF,
    }));
  };

  doLogin = (username, password) => {
    this.setState({
      username: username,
      password: password,
      loggedIn: true,
    });
  };

  render() {
    console.log("Home: ");
    console.log(this.state.loggedIn);
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
              <LoginButton loggedIn={this.state.loggedIn} />
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
              <LoginForm doLogin={this.doLogin} />
            </Route>
          </Switch>
        </Container>
      );
    }
  }
}
export default App;
