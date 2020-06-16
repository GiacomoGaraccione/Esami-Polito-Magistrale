import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CustomNavBar from './CustomNavBar.js'
import InteractableCarList from './InteractableCarList.js'

class App extends React.Component {
  render(){
    return (
      <Container fluid>
        <Row>
          <Col><CustomNavBar/></Col>
        </Row>

        <Row>
          <InteractableCarList/>
        </Row>
    </Container>
    );
  }
}

export default App;
