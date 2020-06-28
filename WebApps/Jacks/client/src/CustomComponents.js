import React from "react";
import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

import "./App.css";

function AppTitle(props) {
  console.log("App TItle");
  console.log(props.loggedIn);
  if (props.loggedIn === true) {
    return (
      <Container fluid>
        <Navbar bg="light" className="mb-3">
          <h2 className="text-dark" href="/logged">
            Jack's Car Rental
          </h2>
          <NavLink to="/rental" className="RentalAreaButton">
            <Button variant="info"> Rental Area </Button>
          </NavLink>
        </Navbar>
      </Container>
    );
  } else {
    return (
      <Container fluid>
        <Navbar bg="light" className="mb-3">
          <h2 className="text-dark" href="/home">
            Jack's Car Rental
          </h2>

          <NavLink to="/login">
            <Button variant="success">Login</Button>
          </NavLink>
        </Navbar>
      </Container>
    );
  }
}

export { AppTitle };
