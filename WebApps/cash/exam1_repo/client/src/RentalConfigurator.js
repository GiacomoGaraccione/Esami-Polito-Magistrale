import React from 'react';
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import FormResults from './FormResults.js'
import Col from 'react-bootstrap/Col'

export default class RentalConfigurator extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            category: 'A',
            age: 'Under 25',
            kmPerDay: 'Less than 50 km/day',
            beginningDate: undefined,
            endDate: undefined,
            extraDrivers: 0,
            insurance: false
        };
    }
    render(){
        return <>
        <Col className='col-4'>
        <Form>
            <Form.Group controlId='beginningDate'>
                <Form.Label>Beginning date:</Form.Label>
                <Form.Control type='date' onChange={(event) => {this.onChangeBeginningDate(event);}}></Form.Control>
            </Form.Group>

            <Form.Group controlId='endDate'>
                <Form.Label>End date:</Form.Label>
                <Form.Control type='date' onChange={(event) => {this.onChangeEndDate(event);}}></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
                <Form.Label>Car category:</Form.Label>
                <Dropdown>
                    <Dropdown.Toggle>{this.state.category}</Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={(event) => {this.dropdownClickCategory(event)}}>A</Dropdown.Item>
                        <Dropdown.Item onClick={(event) => {this.dropdownClickCategory(event)}}>B</Dropdown.Item>
                        <Dropdown.Item onClick={(event) => {this.dropdownClickCategory(event)}}>C</Dropdown.Item>
                        <Dropdown.Item onClick={(event) => {this.dropdownClickCategory(event)}}>D</Dropdown.Item>
                        <Dropdown.Item onClick={(event) => {this.dropdownClickCategory(event)}}>E</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Form.Group>

            <Form.Group controlId='age'>
                <Form.Label>Driver's age:</Form.Label>
                <Dropdown>
                    <Dropdown.Toggle>{this.state.age}</Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={(event) => {this.dropdownClickAge(event)}}>Under 25</Dropdown.Item>
                        <Dropdown.Item onClick={(event) => {this.dropdownClickAge(event)}}>Between 25 and 65</Dropdown.Item>
                        <Dropdown.Item onClick={(event) => {this.dropdownClickAge(event)}}>Over 65</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Form.Group>

            <Form.Group controlId='extraDrivers'>
                <Form.Label>Number of extra drivers:</Form.Label>
                <Form.Control type='number' min='0' value={this.state.extraDrivers} onChange={(event) => {this.onChangeDrivers(event);}}></Form.Control>
            </Form.Group>

            <Form.Group controlId='kmPerDay'>
                <Form.Label>Estimated km per day:</Form.Label>
                <Dropdown>
                    <Dropdown.Toggle>{this.state.kmPerDay}</Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={(event) => {this.dropdownClickKm(event)}}>Less than 50 km/day</Dropdown.Item>
                        <Dropdown.Item onClick={(event) => {this.dropdownClickKm(event)}}>Less than 150 km/day</Dropdown.Item>
                        <Dropdown.Item onClick={(event) => {this.dropdownClickKm(event)}}>Unlimited</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Form.Group>

            <Form.Group controlId='insurance'>
                <Form.Check type='checkbox' label='Extra insurance' onChange={() => {this.onChangeCheck();}}></Form.Check>
            </Form.Group>
        </Form>
        </Col>

        <FormResults data={this.state} user={this.props.user} setLoggedIn={this.props.setLoggedIn}/>
        </>;
    }

    dropdownClickCategory = (event) => {
        this.setState({category: event.target.innerText});
    }

    dropdownClickAge = (event) => {
        this.setState({age: event.target.innerText});
    }

    dropdownClickKm = (event) => {
        this.setState({kmPerDay: event.target.innerText});
    }

    onChangeBeginningDate = (event) => {
        this.setState({beginningDate: event.target.value});
    }

    onChangeEndDate = (event) => {
        this.setState({endDate: event.target.value});
    }

    onChangeDrivers = (event) => {
        this.setState({extraDrivers: event.target.value});
    }

    onChangeCheck = () => {
        this.setState({insurance: !this.state.insurance});
    }
}