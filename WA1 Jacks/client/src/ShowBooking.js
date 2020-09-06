import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

class ShowBooking extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickHome = () => {
    this.props.toHome();
  };

  render() {
    if (this.props.showBook) {
      return (
        <>
          <Container fluid>{this.props.arrayBook}</Container>
          <Button onClick={() => this.onClickHome()}> Return home </Button>
        </>
      );
    } else {
      return null;
    }
  }
}

export default ShowBooking;
