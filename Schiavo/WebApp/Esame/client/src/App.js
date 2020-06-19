import React from 'react';
import Container from 'react-bootstrap/Container';
import LoginForm from './loginForm.js'
import {Route, Redirect} from 'react-router-dom';
import {Switch} from 'react-router-dom';
import './App.css';
import {AppTitle,DisplayCar} from "./reactComponents";
import API from "./API";


class App extends React.Component {

  constructor(props){
    super(props);
    this.state= {DBCars:[], cars:[], brands:[], users:[] ,rents:[], category:"no",brand:"no", login: false};
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

  //LOGIN
  login =(username,password) =>{
    API.userLogin(username,password).then((user)=>{
      this.setState((u)=>({login:u}));
    })
  }

  render() {
    return(
      <Container fluid>
        <Switch>
          <Route path="/login">
            <LoginForm login={this.login}/>
          </Route>

          <Route path="/private">

          </Route>

          <Route path="/home">
            <AppTitle/>
            <DisplayCar cars={this.state.cars} brands={this.state.brands} filterByCategory={this.filterByCategory} filterByBrand={this.filterByBrand}/>
          </Route>
        </Switch>
  
      </Container>
    )
  };

}
export default App;
