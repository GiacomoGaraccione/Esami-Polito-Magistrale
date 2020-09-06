import React from "react";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";

class SlotSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slotDuration: 0,
    };
  }

  onChangeDuration = (event) => {
    event.preventDefault();
    this.setState({ slotDuration: event.target.value });
  };

  onClickConfirm = () => {
    this.props.setSlot(this.state.slotDuration);
  };

  render() {
    if (this.props.selectedStudents > 0) {
      return (
        <>
          <Form>
            <Row>
              <Form.Group controlId="timeSlot">
                <Col>
                  <Form.Label> Slot Length (in minutes) </Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    min={0}
                    onChange={(event) => this.onChangeDuration(event)}
                  ></Form.Control>
                </Col>
              </Form.Group>
            </Row>
          </Form>
          {this.state.slotDuration > 0 && (
            <Button onClick={() => this.onClickConfirm()}>
              {" "}
              Confirm students and slot length
            </Button>
          )}
        </>
      );
    } else {
      return <Alert variant="danger"> No student has been selected</Alert>;
    }
  }
}

export default SlotSettings;
