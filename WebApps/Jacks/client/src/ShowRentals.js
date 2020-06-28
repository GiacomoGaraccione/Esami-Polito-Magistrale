import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import API from "./api/API.js";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";

export default class ShowRentals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rentals: [],
      user: undefined,
      vehicles: [],
    };
  }

  componentDidMount() {
    API.getUser(this.props.username).then((u) => {
      console.log("User:");
      console.log(u);
      this.setState({ user: u });
      let id = this.state.user.id;

      API.getRentals(this.state.user.id)
        .then((r) => {
          console.log("API call");
          console.log(r);
          this.setState({ rentals: r });
        })
        .then(() => {
          console.log("Rentals obtained successfully");
        })
        .catch(() => {
          console.log("Error while getting rentals");
        });
    });
    API.getVehicles()
      .then((v) => {
        this.setState({ vehicles: v });
      })
      .then(() => {
        console.log("Vehicles obtained successfully");
      })
      .catch(() => {
        console.log("Error while getting vehicles");
      });
  }

  getRentals = () => {
    return (
      <>
        <h4> Your rentals: </h4>
        {this.createRentalList(this.state.rentals)}
      </>
    );
  };

  createRentalList = (rentals) => {
    return (
      <Table hover={true} bordered striped={true}>
        <thead>
          <tr>
            <th>Date start</th>
            <th>Date end</th>
            <th>Category</th>
            <th>Car</th>
          </tr>
        </thead>

        <tbody>{rentals.map((r) => this.createRentItem(r))}</tbody>
      </Table>
    );
  };

  createRentItem = (rent) => {
    console.log("CreateRentItem");
    console.log(rent);
    let vehicle = this.state.vehicles.find((v) => v.id === rent.VehicleId);
    const category = vehicle.category;
    const brand = vehicle.brand;
    const model = vehicle.model;

    return (
      <tr key={rent.id}>
        <td>{rent.StartingDay}</td>
        <td>{rent.EndingDay}</td>
        <td>{category}</td>
        <td>{brand + " - " + model}</td>
      </tr>
    );
  };

  render() {
    if (this.state.rentals.length === 0) {
      return (
        <>
          <Navbar bg="light" expand="lg">
            <Navbar.Brand> Welcome {this.props.username}</Navbar.Brand>
          </Navbar>
          <Col className="col-4" />

          <Col className="col-4">
            <Alert variant="info" className="text-center">
              You have no rentals registered yet.
            </Alert>
          </Col>

          <Col className="col-4" />
        </>
      );
    } else {
      return (
        <>
          <Col>{this.getRentals()}</Col>
        </>
      );
    }
  }
}
