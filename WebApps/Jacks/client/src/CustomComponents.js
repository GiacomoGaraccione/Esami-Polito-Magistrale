import React from "react";
import { NavLink } from "react-router-dom";

import "./App.css";

function AppTitle() {
  return (
    <nav className="navbar">
      <a className="navbar-brand" href="/home">
        Car Rental
      </a>
    </nav>
  );
}

function LoginButton() {
  return (
    <form className="form-inline">
      <NavLink to="/login" className="LoginButton">
        Login
      </NavLink>
    </form>
  );
}

export { AppTitle, LoginButton };
