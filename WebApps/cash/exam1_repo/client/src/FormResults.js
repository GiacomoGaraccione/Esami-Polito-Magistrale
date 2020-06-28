import React from 'react';
import * as api from './api.js'
import moment from 'moment';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import PaymentModal from './PaymentModal.js'

export default class FormResults extends React.Component {
    constructor(props){
        super(props);

        this.state = {availableCars: [], totCarsInCategory: undefined, allCars: [], userRentals: [], showPayModal: false};
    }

    render(){
        if(this.checkValid()){
        return <> 
        <Col className='text-center col-2'>
            {
                this.isUserFrequent() && this.state.availableCars.length > 0 && 
                <Alert variant='success'>Since you are a frequent customer, you got a 10% discount!</Alert>
            }
        </Col>

        <Col className='text-center col-4'>
            <Alert variant={this.state.availableCars.length > 0 ? 'info' : 'danger'}>
                Available cars: {this.state.availableCars.length}
            </Alert>

            <Alert variant='info'>
                {this.calculateRentalPrice()}
            </Alert>

            {this.state.availableCars.length > 0 && <Button variant='success' onClick={() => {this.setShowPayModal(true);}}>Submit</Button>}

            <PaymentModal 
                show={this.state.showPayModal} 
                user={this.props.user} 
                availableCars={this.state.availableCars} 
                setShow={this.setShowPayModal} 
                dateBeg={this.props.data.beginningDate} 
                dateEnd={this.props.data.endDate}
                setLoggedIn={this.props.setLoggedIn}
            />

        </Col>

        <Col className='text-center col-2'>
            {
                this.state.availableCars.length > 0 && 100*this.state.availableCars.length/this.state.totCarsInCategory < 10 &&
                <Alert variant='danger'>Less than 10% of vehicles of this category available: price is increased 10%!</Alert>
            }
        </Col>
        </>;
        }
        else{
            return <>
            <Col className='col-2'/>

            <Col className='text-center col-4'> 
                <Alert variant='danger'>
                    Please correctly fill out all the fields!
                </Alert>
            </Col>

            <Col className='col-2'/>
            </>;
        }
    }

    componentDidMount = () => {
        //this component has the list of all cars, to know the ratio of the remaining ones
        api.getAllCars().then( (res) => {
            this.setState({
                allCars: res
            });
        } );

        this.updateUserRentals();
    }

    updateUserRentals = () => {
        api.getUserRentals(this.props.user)
        .then((res) => {
            this.setState({userRentals: res});
        })
        .catch((err) => {
            console.log('error in getting rentals of user', err);
            if(err.status === 401){
                console.log('cookie expired, logging out');
                this.props.setLoggedIn(false);
            }
        })
    }

    componentDidUpdate = (prevProps) => {
        let cat = this.props.data.category;
        let beg = this.props.data.beginningDate;
        let end = this.props.data.endDate;

        let prevCat = prevProps.data.category;
        let prevBeg = prevProps.data.beginningDate;
        let prevEnd = prevProps.data.endDate;

        if(cat === undefined || beg === undefined || end === undefined){
            return; //if at least one of the props is still undefined do nothing
        }

        if(cat.localeCompare(prevCat) === 0 && beg.localeCompare(prevBeg) === 0 && end.localeCompare(prevEnd) === 0){
            return; //if those props haven't changed, do nothing (otherwise, infinite loop)
        }

        if (!this.checkDates(beg, end)){
            return;
        }

        this.updateAvailableCars();
    }

    updateAvailableCars = () => {
        let cat = this.props.data.category;
        let beg = this.props.data.beginningDate;
        let end = this.props.data.endDate;

        api.getAvailableCars(cat, beg, end)
        .then((response) => {
            this.setState({
                availableCars: response,
                totCarsInCategory: this.state.allCars.filter(c => c.category.localeCompare(cat) === 0).length //total number of cars in category
            });
        })
        .catch((err) => {
            console.log('error in getting results from server:', err);
            if (err.status === 401){
                console.log('login token expired');
                this.props.setLoggedIn(false);
            }
        });
    }

    checkValid = () => {
        if(this.props.data.beginningDate === undefined || this.props.data.endDate === undefined){
            return false;
        }

        if(this.props.data.extraDrivers === ''){
            return false;
        }

        return this.checkDates(this.props.data.beginningDate, this.props.data.endDate);
    }

    checkDates = (begDate, endDate) => {
        let beg = moment(begDate, 'YYYY-MM-DD');
        let end = moment(endDate, 'YYYY-MM-DD');
        let today = moment().format('YYYY-MM-DD');

        if(beg.isSameOrBefore(end) && beg.isSameOrAfter(today)){
            return true;
        }
        return false;
    }

    calculateRentalPrice = () => {
        if(this.state.availableCars.length === 0){
            return <p>Price: N/A</p>;
        }

        let percRemainingCars = 100*this.state.availableCars.length/this.state.totCarsInCategory;
        let cat = this.props.data.category;
        let kmPerDay = this.props.data.kmPerDay;
        let age = this.props.data.age;
        let extraDrivers = this.props.data.extraDrivers;
        let insurance = this.props.data.insurance;

        let price = 0;

        //category
        if(cat.localeCompare('A') === 0){
            price = 80;
        }
        else if(cat.localeCompare('B') === 0){
            price = 70;
        }
        else if(cat.localeCompare('C') === 0){
            price = 60;
        }
        else if(cat.localeCompare('D') === 0){
            price = 50;
        }
        else if(cat.localeCompare('E') === 0){
            price = 40;
        }

        // kms/day
        if(kmPerDay.localeCompare('Less than 50 km/day') === 0){
            price = price * 0.95;
        }
        else if(kmPerDay.localeCompare('Unlimited') === 0){
            price = price * 1.05;
        }

        //drivers's age
        if(age.localeCompare('Under 25') === 0){
            price = price * 1.05;
        }
        else if(age.localeCompare('Over 65') === 0){
            price = price * 1.1;
        }

        //extra drivers
        if(extraDrivers > 0){
            price = price * 1.15;
        }

        //insurance
        if(insurance){
            price = price * 1.2;
        }

        //percentage of remaining cars
        if(percRemainingCars < 10){
            price = price * 1.1;
        }

        //frequent customer
        if(this.isUserFrequent()){
            price = price * 0.9;
        }

        let pricePerDay = price;
    
        let beg = moment(this.props.data.beginningDate, 'YYYY-MM-DD');
        let end = moment(this.props.data.endDate, 'YYYY-MM-DD');
        let nDays = end.diff(beg, 'days') + 1;

        //return pricePerDay.toFixed(2) + ' € / day\n' + 'Total price: ' + (nDays * pricePerDay).toFixed(2) + ' €';
        return <>
            {pricePerDay.toFixed(2) + ' € / day'}
            <br/>
            <br/>
            Total: {(nDays * pricePerDay).toFixed(2) + ' €'}
        </>;
    }

    isUserFrequent = () => {
        let today = moment().format('YYYY-MM-DD');
        let numRentals = this.state.userRentals.filter( r => moment(r.dateEnd, 'YYYY-MM-DD').isBefore(today) ).length;

        return numRentals >= 3;
    }

    setShowPayModal = (bool) => {
        this.setState({showPayModal: bool});

        //if it's closing the modal, update the data (it could have changed if a new rental was successful)
        if(bool === false){
            this.updateAvailableCars();
            this.updateUserRentals();
        }
    }
}
