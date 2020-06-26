import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CustomNavBar from './CustomNavBar.js'
import InteractableCarList from './InteractableCarList.js'
import RentalConfigurator from './RentalConfigurator.js'
import MyRentals from './MyRentals.js';

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {loggedIn: false, user: undefined, myRentalsPage: false};
  }
  
  render(){
    if(this.state.myRentalsPage && this.state.loggedIn){
      return <Container fluid>
          <Row>
            <Col>
              <CustomNavBar 
                loggedIn={this.state.loggedIn} 
                setLoggedIn={this.setLoggedIn} 
                myRentals={this.state.myRentalsPage} 
                setMyRentals={this.setMyRentalsPage}
              />
            </Col>
          </Row>

          <Row>
            <MyRentals user={this.state.user}/>
          </Row>

  </Container>;
    }
    else if(this.state.loggedIn){
      return <Container fluid>
          <Row>
            <Col>
              <CustomNavBar 
                loggedIn={this.state.loggedIn} 
                setLoggedIn={this.setLoggedIn} 
                myRentals={this.state.myRentalsPage} 
                setMyRentals={this.setMyRentalsPage}
              />
            </Col>
          </Row>

          <Row className='align-items-center'>
            <RentalConfigurator user={this.state.user}/>
          </Row>

      </Container>;
    }
    else{
      return (
        <Container fluid>
          <Row>
            <Col>
              <CustomNavBar 
                loggedIn={this.state.loggedIn} 
                setLoggedIn={this.setLoggedIn}
                myRentals={this.state.myRentalsPage} 
                setMyRentals={this.setMyRentalsPage}
              />
            </Col>
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

  setMyRentalsPage = (bool) => {
    this.setState({myRentalsPage: bool});
  }
}

export default App;
