import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "./API/API.js";

class LoginForm extends React.Component {
  render() {
    return (
      <Form
        inline
        className="ml-auto"
        method="POST"
        onSubmit={(event) => this.doLogin(event)}
      >
        <Form.Row>
          <Form.Group controlId="username">
            <Form.Control
              type="text"
              placeholder="Username"
              className="mr-3"
            ></Form.Control>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group controlId="password">
            <Form.Control
              type="password"
              placeholder="Password"
              className="mr-3"
            ></Form.Control>
          </Form.Group>
        </Form.Row>

        <Button variant="outline-success" type="submit">
          Login
        </Button>
      </Form>
    );
  }

  doLogin = (event) => {
    event.preventDefault();
    const username = event.target.elements.username.value; //username and password are taken to perform login
    const password = event.target.elements.password.value;

    API.login(username, password)
      .then(() => {
        console.log("Login done");
        this.props.doLogin(username, password);
      })
      .catch((err) => {
        console.log("Login error");
      });
  };
}

export default LoginForm;
