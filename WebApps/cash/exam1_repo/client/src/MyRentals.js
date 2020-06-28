import React from 'react'
import * as api from './api.js'
import Table from 'react-bootstrap/Table'
import moment from 'moment';
import CancelRentButton from './CancelRentButton.js'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'

export default class MyRentals extends React.Component {
    constructor(props){
        super(props);

        this.state = {rentals: [], cars: []};
    }

    render(){
        if(this.state.cars.length === 0){
            return <p>Loading cars...</p>;
        }
        else if(this.state.rentals.length === 0){
            return <> 
            <Col className='col-4'/>

            <Col className='col-4'> 
                <Alert variant='danger' className='text-center'>
                    You have no current, past or future rentals.
                </Alert>
            </Col>

            <Col className='col-4'/>
            </>;
        }
        else{
            return <>
            <Col>
                {this.filterCurrentRentals().length > 0 && this.getCurrentRentals()}

                {this.filterFutureRentals().length > 0 && this.getFutureRentals()}

                {this.filterPastRentals().length > 0 && this.getPastRentals()}
            </Col>
            </>;
        }
    }

    getCurrentRentals = () => {
        return <>
            <h4>Current rentals:</h4>
            {this.createRentalList(this.filterCurrentRentals(), false, 'success')}
        </>;
    }

    getFutureRentals = () => {
        return <>
            <h4>Future rentals:</h4>
            {this.createRentalList(this.filterFutureRentals(), true, 'info')}
        </>;
    }

    getPastRentals = () => {
        return <>
            <h4>Past rentals:</h4>
            {this.createRentalList(this.filterPastRentals(), false, 'secondary')}
        </>;
    }

    createRentalList = (rentals, isFuture, color) => {
        return <Table hover={true} bordered variant={color} striped={true}>
            <thead>
                <tr>
                    <th>Date start</th>
                    <th>Date end</th>
                    <th>Category</th>
                    <th>Car</th>
                    {isFuture && <th>Cancel rent</th>}
                </tr>
            </thead>

            <tbody>
                {rentals.map(r => this.createRentItem(r, isFuture))}
            </tbody>
        </Table>;
    }

    filterCurrentRentals = () => {
        let today = moment().format('YYYY-MM-DD');

        //a rental is current if it has already started and has not yet ended
        let currentRentals = this.state.rentals.filter( 
            r => moment(r.dateBeginning, 'YYYY-MM-DD').isSameOrBefore(today) && moment(r.dateEnd, 'YYYY-MM-DD').isSameOrAfter(today)
            );
        return currentRentals;
    }

    filterPastRentals = () => {
        let today = moment().format('YYYY-MM-DD');

        //a rental is past if it has already ended
        let pastRentals = this.state.rentals.filter( r => moment(r.dateEnd, 'YYYY-MM-DD').isBefore(today) );
        return pastRentals;
    }

    filterFutureRentals = () => {
        let today = moment().format('YYYY-MM-DD');

        //a rental is future if it has not yet begun
        let futureRentals = this.state.rentals.filter( r => moment(r.dateBeginning, 'YYYY-MM-DD').isAfter(today) );
        return futureRentals;
    }

    createRentItem = (r, isFuture) => {
        let car = this.state.cars.find(c => c.id === r.carId);
        const cat = car.category;
        const brand = car.brand;
        const model = car.model;

        return <tr key={r.id}>
            <td>{r.dateBeginning}</td>
            <td>{r.dateEnd}</td>
            <td>{cat}</td>
            <td>{brand + ' - ' + model}</td>
            {isFuture && <td><CancelRentButton 
                                rentalId={r.id} 
                                setLoggedIn={this.props.setLoggedIn} 
                                updateUserRentals={this.updateUserRentals}
                                /></td>}
        </tr>;
    }

    componentDidMount = () => {
        this.updateUserRentals();

        //get also the list of all cars
        api.getAllCars().then( (res) => {
            this.setState({
                cars: res
            });
        } );
    }

    updateUserRentals = () => {
        api.getUserRentals(this.props.user)
        .then((res) => {
            this.setState({rentals: res});
        })
        .catch((err) => {
            console.log('error in getting rentals of user', err);
            if(err.status === 401){
                console.log('cookie expired, logging out');
                this.props.setLoggedIn(false);
            }
        })
    }
}