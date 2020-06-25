import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CustomNavBar from './CustomNavBar.js'
import InteractableCarList from './InteractableCarList.js'
import RentalConfigurator from './RentalConfigurator.js'

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {loggedIn: false, user: undefined};
  }
  
  render(){
    if(this.state.loggedIn){
      return <Container fluid>
          <Row>
            <Col><CustomNavBar loggedIn={this.state.loggedIn} setLoggedIn={this.setLoggedIn}/></Col>
          </Row>

          <Row>
            <RentalConfigurator user={this.state.user}/>
          </Row>

      </Container>;
    }
    else{
      return (
        <Container fluid>
          <Row>
            <Col><CustomNavBar loggedIn={this.state.loggedIn} setLoggedIn={this.setLoggedIn}/></Col>
          </Row>

          <Row>
            <InteractableCarList/>
          </Row>
      </Container>
      );
    }
  }

  setLoggedIn = (bool, user) => {
    this.setState({loggedIn: bool, user: user});
  }
}

export default App;
