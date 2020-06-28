import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "./api/API.js";

export default class PaymentModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      cardNumber: "",
      cvv: "",
      paymentAccepted: false,
    };
  }

  onChangeName = (event) => {
    this.setState({ name: event.target.value });
    console.log(this.props);
  };

  onChangeCardNumber = (event) => {
    let cardNumber = event.target.value;
    if (cardNumber.length === 16) {
      this.setState({ cardNumber: cardNumber });
    }
  };

  onChangeCVV = (event) => {
    let cvv = event.target.value;
    if (cvv.length === 3) {
      this.setState({ cvv: cvv });
    }
  };

  performPayment = () => {
    let userId = this.props.user.id;
    let category = this.props.category;
    let name = this.state.name;
    let cardNumber = this.state.cardNumber;
    let cvv = this.state.cvv;
    let vehicleId = this.props.vehicleIds[0];
    let startingDay = this.props.startingDay;
    let endingDay = this.props.endingDay;

    API.performPayment(name, cardNumber, cvv)
      .then(() => {
        this.setState({ paymentAccepted: true });

        API.postRental(userId, vehicleId, startingDay, endingDay)
          .then(() => {
            console.log("Rental successful");
          })
          .catch(() => {
            console.log("Error in rental saving");
          });
      })
      .catch(() => {
        console.log("Error during payment");
      });
    console.log(this.props);
  };

  render() {
    if (this.state.paymentAccepted) {
      return null;
    } else {
      return (
        <Modal
          show={this.props.canShow}
          animation={false}
          onHide={() => {
            this.props.setShow(false);
          }}
        >
          <Modal.Body>
            <Form>
              <Form.Group controlId="Name">
                <Form.Label> Full Name of Credit Card Owner</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(event) => {
                    this.onChangeName(event);
                  }}
                  required
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="Number">
                <Form.Label> Credit Card Number</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(event) => {
                    this.onChangeCardNumber(event);
                  }}
                  required
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="CVV">
                <Form.Label> CVV </Form.Label>
                <Form.Control
                  type="text"
                  onChange={(event) => {
                    this.onChangeCVV(event);
                  }}
                  required
                ></Form.Control>
              </Form.Group>
              <Button
                type="submit"
                onClick={() => {
                  this.performPayment();
                }}
              >
                {" "}
                Submit Payment
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      );
    }
  }
}
