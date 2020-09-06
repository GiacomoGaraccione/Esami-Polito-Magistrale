import React from "react";
import API from "./API/API.js";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

class HomepageTeacher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseName: null,
    };
  }

  componentDidMount() {
    API.getCourse(this.props.username).then((c) => {
      this.setState({ courseName: c });
    });
  }

  onClickNew = () => {
    this.props.setCreate(true);
  };

  onClickExecute = () => {
    this.props.setExecute(true);
  };

  onClickView = () => {
    this.props.setView(true);
  };

  render() {
    return (
      <Container fluid>
        <Alert variant="success">Welcome {this.props.username}</Alert>
        <Alert variant="info">
          Possible actions for the course {this.state.courseName}:
        </Alert>
        <Button
          onClick={this.onClickNew}
          variant="outline-primary"
          block="true"
        >
          {" "}
          Create a new exam{" "}
        </Button>{" "}
        <Button
          onClick={this.onClickExecute}
          variant="outline-secondary"
          block="true"
        >
          {" "}
          Execute an oral test{" "}
        </Button>{" "}
        <Button
          onClick={this.onClickView}
          variant="outline-warning"
          block="true"
        >
          {" "}
          View results overview{" "}
        </Button>
      </Container>
    );
  }
}

export default HomepageTeacher;
