import React from 'react';
import logo from './logo.svg';
import './App.css';
import API from './api/API.js'
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown'
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { BrowserRouter as Router, Redirect, Route, Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Switch } from 'react-router';


class App extends React.Component {



  constructor(props) {
    super(props);
    this.state = { vehicles: [], response: '' };
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/vehicles');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };


  getVehicles = () => {
    API.getVehicles().then((vehicles) => this.setState({ vehicles: vehicles }));
  }

  render() {

    return (

      <Router>
        <Container fluid className="title">
          <Row>
            Car Rental Application
          </Row>
        </Container>
        <Container fluid className="homepageTableHeader">
          <Row>
            Available Vehicles
          </Row>
        </Container>
        <Container fluid>
          <Switch>
            <Route path="/">
              <Table striped bordered hover>
                <thead>
                  <tr>

                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                  </tr>
                </thead>
                <tbody>

                </tbody>
              </Table>
              <Route render={({ match }) => {
                return this.vehicles;
              }} />
            </Route>
          </Switch>

        </Container>
        <Container fluid className="fixed-right-bottom">
          <Button variant="primary" size="lg" className="LoginButton">
            Login
          </Button>{' '}
        </Container>


      </Router >
    );
  }
}
export default App;