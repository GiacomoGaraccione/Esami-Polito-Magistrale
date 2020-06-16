import React from 'react';
import './App.css';
import {AppTitle,DisplayCar} from "./reactComponents";
import API from "./API";

class App extends React.Component {

  constructor(props){
    super(props);
    this.state= {DBCars:[], cars:[], brands:[], users:[] ,rents:[], category:"no",brand:"no", login: [null]};
  }

  componentDidMount(){
    API.getCars().then((c)=> this.setState({cars:c}));
    API.getCars().then((c)=> this.setState({DBCars:c}));
    API.getBrands().then((b)=> this.setState({brands:b}));
  }
 

  filterByCategory = (c) => {

    if(c !== "no"){
      if(this.state.brand === "no"){
        this.setState(() => ({category:c, cars: this.state.DBCars.filter((car) => (car.category === c))}));
      }
      if(this.state.brand !== "no"){
        this.setState(() => ({category:c, cars: this.state.DBCars.filter((car) => (car.category === c) && (car.brand === this.state.brand))})); 
      }
    }
    if(c === "no"){
      if(this.state.brand === "no"){
        this.setState(() => ({category:c, cars: this.state.DBCars}));
      }
      if(this.state.brand !== "no"){
        this.setState(() => ({category:c, cars: this.state.DBCars.filter((car) =>(car.brand === this.state.brand))}));
      }
    }
}

  filterByBrand = (b) => {
    if(b !== "no"){
      if(this.state.category === "no"){
        this.setState(() => ({brand:b, cars: this.state.DBCars.filter((car) => (car.brand === b))}));
      }
      if(this.state.category !== "no"){
        this.setState(() => ({brand:b, cars: this.state.DBCars.filter((car) => (car.category === this.state.category) && (car.brand === b))})); 
      }
    }
    if(b === "no"){
      if(this.state.category === "no"){
        this.setState(() => ({brand:b, cars: this.state.DBCars}));
      }
      if(this.state.category !== "no"){
        this.setState(() => ({brand:b, cars: this.state.DBCars.filter((car) =>(car.category === this.state.category))}));
      }
    }
}

  

  render() {
    console.log(this.state.brand);
    console.log(this.state.category);
    return <div className="App">
       <AppTitle filterCars/>
       <DisplayCar cars={this.state.cars} brands={this.state.brands} filterByCategory={this.filterByCategory} filterByBrand={this.filterByBrand}/>
    </div>
  }
}
  
export default App;
