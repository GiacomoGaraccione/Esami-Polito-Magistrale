import React from "react";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Container from "react-bootstrap/Container";
import ConfiguratorResults from "./ConfiguratorResults.js";

export default class RentalConfigurator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startingDay: undefined,
      endingDay: undefined,
      category: "Choose a Category",
      driverAge: "Choose an Age Range",
      extraDrivers: 0,
      kmPerDay: "Choose an estimation",
      extraInsurance: false,
    };
  }

  onChangeStartingDay = (event) => {
    this.setState({ startingDay: event.target.value });
  };

  onChangeEndingDay = (event) => {
    this.setState({ endingDay: event.target.value });
  };

  onClickCategory = (event) => {
    this.setState({ category: event.target.innerText });
  };

  onClickAge = (event) => {
    this.setState({ driverAge: event.target.innerText });
  };

  onChangeExtraDrivers = (event) => {
    this.setState({ extraDrivers: event.target.value });
    console.log(this.state);
  };

  onClickKmPerDay = (event) => {
    this.setState({ kmPerDay: event.target.innerText });
  };

  onChangeInsurance = (event) => {
    this.setState({ extraInsurance: !this.state.extraInsurance });
  };

  render() {
    return (
      <Container fluid>
        <Form>
          <Form.Group controlId="startingDay">
            <Form.Label>Starting Day of Rental:</Form.Label>
            <Form.Control
              type="date"
              onChange={(event) => {
                this.onChangeStartingDay(event);
              }}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="endingDay">
            <Form.Label>Final Day of Rental:</Form.Label>
            <Form.Control
              type="date"
              onChange={(event) => {
                this.onChangeEndingDay(event);
              }}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="category">
            <Form.Label>Car Category:</Form.Label>
            <DropdownButton
              id="dropdown-basic-button"
              title={this.state.category}
            >
              <Dropdown.Item
                onClick={(event) => {
                  this.onClickCategory(event);
                }}
              >
                A
              </Dropdown.Item>
              <Dropdown.Item
                onClick={(event) => {
                  this.onClickCategory(event);
                }}
              >
                B
              </Dropdown.Item>
              <Dropdown.Item
                onClick={(event) => {
                  this.onClickCategory(event);
                }}
              >
                C
              </Dropdown.Item>
              <Dropdown.Item
                onClick={(event) => {
                  this.onClickCategory(event);
                }}
              >
                D
              </Dropdown.Item>
              <Dropdown.Item
                onClick={(event) => {
                  this.onClickCategory(event);
                }}
              >
                E
              </Dropdown.Item>
            </DropdownButton>
          </Form.Group>

          <Form.Group controlId="driverAge">
            <Form.Label>Driver's age:</Form.Label>
            <DropdownButton title={this.state.driverAge}>
              <Dropdown.Item
                onClick={(event) => {
                  this.onClickAge(event);
                }}
              >
                Under 25
              </Dropdown.Item>
              <Dropdown.Item
                onClick={(event) => {
                  this.onClickAge(event);
                }}
              >
                Between 25 and 65
              </Dropdown.Item>
              <Dropdown.Item
                onClick={(event) => {
                  this.onClickAge(event);
                }}
              >
                Over 65
              </Dropdown.Item>
            </DropdownButton>
          </Form.Group>

          <Form.Group controlId="extraDrivers">
            <Form.Label>Number of extra drivers:</Form.Label>
            <Form.Control
              type="number"
              onChange={(event) => {
                this.onChangeExtraDrivers(event);
              }}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="kmPerDay">
            <Form.Label>Estimated km per day:</Form.Label>
            <DropdownButton title={this.state.kmPerDay}>
              <Dropdown.Item
                onClick={(event) => {
                  this.onClickKmPerDay(event);
                }}
              >
                Less than 50 km/day
              </Dropdown.Item>
              <Dropdown.Item
                onClick={(event) => {
                  this.onClickKmPerDay(event);
                }}
              >
                Less than 150 km/day
              </Dropdown.Item>
              <Dropdown.Item
                onClick={(event) => {
                  this.onClickKmPerDay(event);
                }}
              >
                Unlimited
              </Dropdown.Item>
            </DropdownButton>
          </Form.Group>

          <Form.Group controlId="insurance">
            <Form.Check
              type="checkbox"
              label="Extra insurance"
              onChange={() => {
                this.onChangeInsurance();
              }}
            ></Form.Check>
          </Form.Group>
        </Form>

        <ConfiguratorResults
          input={this.state}
          username={this.props.username}
        />
      </Container>
    );
  }
}
