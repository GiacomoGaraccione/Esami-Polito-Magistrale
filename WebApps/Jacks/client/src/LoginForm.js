import React from "react";
import Form from "react-bootstrap/Form";
import API from "./api/API.js";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";

export default class LoginForm extends React.Component {
  render() {
    return (
      <>
        <Navbar bg="light" className="mb-3">
          <h2 className="text-dark" href="/home">
            Car Rental
          </h2>
        </Navbar>
        <Form method="POST" onSubmit={(event) => this.doLogin(event)}>
          <Form.Group controlId="loginFormUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter your username" />
          </Form.Group>
          <Form.Group controlId="loginFormPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Button type="submit" variant="success">
            Login
          </Button>
        </Form>
      </>
    );
  }

  doLogin = (event) => {
    event.preventDefault();
    console.log(event.target.elements.loginFormUsername.value);
    console.log(event.target.elements.loginFormPassword.value);
    const username = event.target.elements.loginFormUsername.value;
    const password = event.target.elements.loginFormPassword.value;

    API.login(username, password).then(() => {
      this.props.doLogin(username, password);
    });
  };
}
