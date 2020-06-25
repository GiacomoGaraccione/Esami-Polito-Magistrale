import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup'

export default class FilterBar extends React.Component {
    constructor(props){
        super(props);

        this.activeCatFilters = [];
        this.activeBrandFilters = [];
    }

    render(){
        let brands = new Set(this.props.allCars.map(c => c.brand)); 
        let categories = new Set(this.props.allCars.map(c => c.category));

        let brandsArray = Array.from(brands);
        let categoriesArray = Array.from(categories);

        return <ListGroup>
            <h4>Categories:</h4>
            {categoriesArray.map(c => this.createFilterListItem(c, 'category'))}

            <h4>Brands:</h4>
            {brandsArray.map(b => this.createFilterListItem(b, 'brand'))}
        </ListGroup>;
    }

    createFilterListItem = (text, type) => {
        //the prop 'action' is for hover effects
        return <ListGroup.Item action={true} key={text + '-' + type} onClick={(e) => {this.onClickEvent(e, type)}}>{text}</ListGroup.Item>
    }

    onClickEvent = (e, type) => {
        if(e.target.classList.contains('active')){ //if it's aldready active
            e.target.classList.remove('active'); //remove the active

            if(type.localeCompare('category') === 0){ //update the locale list of active filters
                let i = this.activeCatFilters.findIndex(f => f.localeCompare(e.target.innerText) === 0);
                this.activeCatFilters.splice(i, 1);
            }
            else{
                let i = this.activeBrandFilters.findIndex(f => f.localeCompare(e.target.innerText) === 0);
                this.activeBrandFilters.splice(i, 1);
            }
        }
        else{ //if it wasn't active
            e.target.classList.add('active');

            if(type.localeCompare('category') === 0){ //update the local list of active filters
                this.activeCatFilters[this.activeCatFilters.length] = e.target.innerText;
            }
            else{
                this.activeBrandFilters[this.activeBrandFilters.length] = e.target.innerText;
            }
        }

        if(type.localeCompare('category') === 0){
            this.props.setCatFilters(this.activeCatFilters);
        }
        else{
            this.props.setBrandFilters(this.activeBrandFilters);
        }
    }
}