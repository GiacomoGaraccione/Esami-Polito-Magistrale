import React from 'react';
import * as api from './api.js'
import moment from 'moment';

export default class FormResults extends React.Component {
    constructor(props){
        super(props);

        this.state = {availableCars: 'N/A', totCarsInCategory: undefined, allCars: []};
    }

    render(){
        if(this.checkValid()){
        return <> 
        <p>Available cars: {this.state.availableCars}</p>
        <p>Rental price: {this.calculateRentalPrice()}</p>
        </>;
        }
        else{
            return <p>Please correctly fill out all the fields! (Check also: beginning date must be before or the same date as the end date!)</p>;
        }
    }

    componentDidMount = () => {
        //this component has the list of all cars, to know the ratio of the remaining ones
        api.getAllCars().then( (res) => {
            this.setState({
                allCars: res
            });
        } );
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

        api.getAvailableCars(cat, beg, end)
        .then((response) => {
            this.setState({
                availableCars: response,
                totCarsInCategory: this.state.allCars.filter(c => c.category.localeCompare(cat) === 0).length //total number of cars in category
            });
        })
        .catch((err) => {
            console.log('error in getting results from server:', err);
        });
    }

    checkValid = () => {
        if(this.props.data.beginningDate === undefined || this.props.data.endDate === undefined){
            return false;
        }

        if(this.props.data.extraDrivers === undefined || this.props.data.extraDrivers.localeCompare("") === 0){
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
        //TODO
        let percRemainingCars = 100*this.state.availableCars/this.state.totCarsInCategory;
        return 666;
    }
}