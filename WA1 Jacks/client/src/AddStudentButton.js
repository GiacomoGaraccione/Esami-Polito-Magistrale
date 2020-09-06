import React from "react";
import Form from "react-bootstrap/Form";

class AddStudentButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonPressed: false,
    };
  }

  onClick = (event) => {
    if (this.state.buttonPressed) {
      this.setState({ buttonPressed: false });
      this.props.updateSelected(false, this.props.id);
    } else {
      this.setState({ buttonPressed: true });
      this.props.updateSelected(true, this.props.id);
    }
  };

  render() {
    if (this.props.show) {
      return (
        <Form>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Select"
              onClick={(event) => this.onClick(event)}
            />
          </Form.Group>
        </Form>
      );
    }
  }
}

export default AddStudentButton;
