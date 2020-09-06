import React from "react";
import API from "./API/API.js";
import Button from "react-bootstrap/Button";

class AbsentButton extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickButton = () => {
    API.markAbsent(
      this.props.student.StudentId,
      this.props.student.Date,
      this.props.username
    ).then(this.props.updateEvaluation(this.props.student, "Absent"));
  };

  render() {
    return (
      <Button variant="danger" onClick={() => this.onClickButton()}>
        {" "}
        Mark as Absent{" "}
      </Button>
    );
  }
}

export default AbsentButton;
