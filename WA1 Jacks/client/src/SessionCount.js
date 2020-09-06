import React from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import SessionSettings from "./SessionSettings.js";

class SessionCount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      oldSessions: 0,
    };
  }

  onChangeValue = (event) => {
    let num = event.target.value;
    let rows = [];
    let sessionInfo = [];
    for (let i = 0; i < num; i++) {
      sessionInfo[i] = 0;
      rows.push(
        <SessionSettings
          selectedStudents={this.props.selectedStudents}
          slotDuration={this.props.slotDuration}
          increaseTotal={this.props.increaseTotal}
          sessionNumber={i}
          sessions={num}
          sessionInfo={sessionInfo}
          sessionDays={this.props.sessionDays}
          startingHours={this.props.startingHours}
          sessionLengths={this.props.sessionLengths}
        />
      );
    }

    this.setState({ oldSessions: num });
    this.props.setArraySessions(rows, sessionInfo);
    this.props.setSessions(num);
  };

  render() {
    if (this.props.selectedStudents > 0 && this.props.slotDuration > 0) {
      return (
        <>
          <Alert variant="info">
            {" "}
            Selected students: {this.props.selectedStudents}{" "}
          </Alert>
          <Alert variant="info">
            {" "}
            Slot length: {this.props.slotDuration} minutes
          </Alert>
          <Form>
            <Form.Group controlId="sessions">
              <Form.Label> Choose number of exam sessions </Form.Label>
              <Form.Control
                type="number"
                min={0}
                onChange={(event) => this.onChangeValue(event)}
              ></Form.Control>
            </Form.Group>
          </Form>
        </>
      );
    } else {
      return null;
    }
  }
}

export default SessionCount;
