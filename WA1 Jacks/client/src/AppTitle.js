import React from "react";
import API from "./API/API.js";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

class AppTitle extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickButton = () => {
    this.props.setCreate(false);
    this.props.setExecute(false);
    this.props.setView(false);
    this.props.clearStudents();
  };

  onClickReturn = () => {
    this.props.studentOut();
  };

  doLogout = () => {
    API.logout()
      .then(() => {
        this.props.doLogout();
      })
      .catch((err) => {
        console.log("error: could not logout", err);
      });
  };

  render() {
    if (!this.props.loggedIn && !this.props.studentAccess) {
      return (
        <Navbar bg="light" className="mb-3">
          <h2 className="text-info">Exam Scheduling - Homepage </h2>
        </Navbar>
      );
    } else if (this.props.loggedIn && !this.props.studentAccess) {
      return (
        <>
          <Navbar bg="light" className="mb-3">
            <Nav className="container-fluid">
              <Nav.Item>
                <h2 className="text-info"> Exam Scheduling - Teacher Page </h2>
              </Nav.Item>
              <Nav.Item className="ml-auto">
                <Button
                  variant="outline-success"
                  onClick={() => this.onClickButton()}
                >
                  {" "}
                  Home{" "}
                </Button>
              </Nav.Item>
              <Nav.Item className="ml-auto">
                <Button
                  variant="outline-danger"
                  onClick={() => this.doLogout()}
                >
                  {" "}
                  Logout{" "}
                </Button>
              </Nav.Item>
            </Nav>
          </Navbar>
        </>
      );
    } else if (!this.props.loggedIn && this.props.studentAccess) {
      return (
        <>
          <Navbar bg="light" className="mb-3">
            <Nav className="container-fluid">
              <Nav.Item>
                <h2 className="text-info">Exam Scheduling - Student Page </h2>
              </Nav.Item>
              <Nav.Item className="ml-auto">
                <Button
                  variant="outline-danger"
                  onClick={() => this.onClickReturn()}
                >
                  {" "}
                  Go Back{" "}
                </Button>
              </Nav.Item>
            </Nav>
          </Navbar>
        </>
      );
    }
  }
}

export default AppTitle;
