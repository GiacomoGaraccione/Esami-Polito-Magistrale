import React from 'react'
import Col from 'react-bootstrap/Col'
import FilterBar from './FilterBar.js'
import * as api from './api.js'
import CarList from './CarList.js'

export default class InteractableCarList extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            allCars: [],
            activeCars: [],
            activeBrandFilters: [],
            activeCategoryFilters: []
        };
    }

    render(){
        return <> 
                <Col className='col-3'>
                    <FilterBar allCars={this.state.allCars} setBrandFilters={this.setActiveBrandFilters} setCatFilters={this.setActiveCategoryFilters}/>
                </Col>
                
                <Col>
                    <CarList cars={this.state.activeCars}/>
                </Col>
            </>;
    }

    componentDidMount(){
        api.getAllCars().then( (res) => {
            this.setState({
                allCars: res,
                activeCars: res
            });
        } );
    }

    setActiveBrandFilters = (brandFilters) => {
        let newActiveCars = getActiveCars(this.state.allCars, brandFilters, this.state.activeCategoryFilters);
        this.setState({
            activeBrandFilters: brandFilters,
            activeCars: newActiveCars
        });
    }

    setActiveCategoryFilters = (categoryFilters) => {
        let newActiveCars = getActiveCars(this.state.allCars, this.state.activeBrandFilters, categoryFilters);
        this.setState({
            activeCategoryFilters: categoryFilters,
            activeCars: newActiveCars
        });
    }
}

function carIsInSelectedBrands(brands, car){
    if (brands.length === 0){ //if there are no active filters, assume that the user wants to see everything
        return true;
    }

    let i = brands.findIndex(b => b.localeCompare(car.brand) === 0);

    if(i === -1){
        return false;
    }
    return true;
}

function carIsInSelectedCategories(cats, car){
    if (cats.length === 0){ //if there are no active filters, assume that the user wants to see everything
        return true;
    }

    let i = cats.findIndex(cat => cat.localeCompare(car.category) === 0);

    if(i === -1){
        return false;
    }
    return true;
}

function getActiveCars(allCars, brandFilters, categoryFilters){
    let cars = [];

    cars = allCars.filter( c => carIsInSelectedBrands(brandFilters, c) && carIsInSelectedCategories(categoryFilters, c) );

    return cars;
}