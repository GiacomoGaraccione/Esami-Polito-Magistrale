import React from "react";
import API from "./API/API.js";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

class GradeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      marks: [],
      assignedMark: 0,
    };
  }

  componentDidMount() {
    let marks = [
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      "30L",
      "Fail",
      "Withdraw",
    ];
    this.setState({ marks: marks });
  }

  onChangeMark = (event) => {
    let mark = event.target.value;
    if (mark === 31) {
      this.setState({ assignedMark: "30L" });
    } else {
      this.setState({ assignedMark: mark });
    }
  };

  onClickMark = () => {
    API.assignMark(
      this.props.studentId,
      this.props.date,
      this.props.username,
      this.state.assignedMark
    ).then(this.props.updateEvaluation(this.state.assignedMark));
  };

  onClickFail = () => {
    this.setState({ assignedMark: "Fail" });
    let mark = "Fail";
    API.assignMark(
      this.props.studentId,
      this.props.date,
      this.props.username,
      mark
    ).then(this.props.updateEvaluation(mark));
  };

  onClickWithdraw = () => {
    this.setState({ assignedMark: "Withdraw" });
    let mark = "Withdraw";
    API.assignMark(
      this.props.studentId,
      this.props.date,
      this.props.username,
      mark
    ).then(this.props.updateEvaluation(mark));
  };

  render() {
    return (
      <Modal show={this.props.showModal}>
        <Modal.Body>
          <Form>
            <Form.Group controlId="mark">
              <Form.Label> Numeric Evaluation </Form.Label>
              <Form.Control
                type="number"
                min={18}
                max={31}
                onChange={(event) => this.onChangeMark(event)}
              ></Form.Control>
              <Button variant="success" onClick={() => this.onClickMark()}>
                {" "}
                Confirm Mark{" "}
              </Button>
            </Form.Group>
            <Form.Group>
              <Button variant="danger" onClick={() => this.onClickFail()}>
                {" "}
                Mark {this.props.studentId} as Failed{" "}
              </Button>
            </Form.Group>
            <Form.Group>
              <Button variant="danger" onClick={() => this.onClickWithdraw()}>
                {" "}
                Mark {this.props.studentId} as Withdrawn{" "}
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

export default GradeModal;
