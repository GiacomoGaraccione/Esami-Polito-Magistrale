import React from 'react'
import * as api from './api.js'
import Table from 'react-bootstrap/Table'
import moment from 'moment';
import CancelRentButton from './CancelRentButton.js'

export default class MyRentals extends React.Component {
    constructor(props){
        super(props);

        this.state = {rentals: [], cars: []};
    }

    render(){
        if(this.state.cars.length === 0){
            return <p>Loading cars...</p>;
        }
        else{
            return <>
                <h4>Current rentals:</h4>
                {this.createRentalList(this.filterCurrentRentals(), false)}

                <h4>Future rentals:</h4>
                {this.createRentalList(this.filterFutureRentals(), true)}

                <h4>Past rentals:</h4>
                {this.createRentalList(this.filterPastRentals(), false)}
            </>;
        }
    }

    createRentalList = (rentals, isFuture) => {
        return <Table borderless={true} hover={true} striped={true}>
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
            {isFuture && <td><CancelRentButton rentalId={r.id} updateUserRentals={this.updateUserRentals}/></td>}
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
        })
    }
}