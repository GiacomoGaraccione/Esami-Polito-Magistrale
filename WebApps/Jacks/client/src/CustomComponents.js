import React from "react";
import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";

import "./App.css";

function AppTitle(props) {
  console.log("App TItle");
  console.log(props.loggedIn);
  if (props.loggedIn === true) {
    return (
      <Container fluid>
        <nav className="navbar">
          <a className="navbar-brand" href="/logged">
            Car Rental
          </a>
        </nav>

        <form className="form-inline">
          <NavLink to="/rental" className="RentalAreaButton">
            Rental Area
          </NavLink>
        </form>
      </Container>
    );
  } else {
    return (
      <nav className="navbar">
        <a className="navbar-brand" href="/home">
          Car Rental
        </a>
      </nav>
    );
  }
}

function LoginButton(props) {
  if (props.loggedIn === false) {
    return (
      <form className="form-inline">
        <NavLink to="/login" className="LoginButton">
          Login
        </NavLink>
      </form>
    );
  }
}

export { AppTitle, LoginButton };
