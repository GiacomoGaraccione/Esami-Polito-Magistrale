import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class StudentForm extends React.Component {
  onClick = (event) => {
    event.preventDefault();
    this.props.studentAccess(event.target.elements.username.value);
  };

  render() {
    return (
      <Form
        inline
        className="ml-auto"
        onSubmit={(event) => this.onClick(event)}
      >
        <Form.Row>
          <Form.Group controlId="username">
            <Form.Control
              type="text"
              placeholder="Student ID"
              className="mr-3"
            ></Form.Control>
          </Form.Group>
        </Form.Row>
        <Button variant="outline-success" type="submit">
          Access as Student
        </Button>
      </Form>
    );
  }
}

export default StudentForm;
