import React from "react";
import Button from "react-bootstrap/Button";
import GradeModal from "./GradeModal.js";

class PresentButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };
  }

  onClickButton = () => {
    this.setState({ showModal: true });
  };

  hideModal = () => {
    this.setState({ showModal: false });
  };

  updateEvaluation = (mark) => {
    this.setState({ showModal: false });
    this.props.updateEvaluation(this.props.student, mark);
  };

  render() {
    return (
      <>
        <Button variant="success" onClick={() => this.onClickButton()}>
          {" "}
          Assign Mark{" "}
        </Button>
        <GradeModal
          showModal={this.state.showModal}
          studentId={this.props.student.StudentId}
          date={this.props.student.Date}
          username={this.props.username}
          hideModal={this.hideModal}
          updateEvaluation={this.updateEvaluation}
        ></GradeModal>
      </>
    );
  }
}

export default PresentButton;
