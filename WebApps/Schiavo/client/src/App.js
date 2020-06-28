import React from 'react';
import Container from 'react-bootstrap/Container';
import LoginForm from './loginForm.js'
import RentForm from "./rentForm.js"
import PrivateForm from "./privateForm.js"
import Payment from "./payment";
import {Route} from 'react-router-dom';
import {Switch,withRouter} from 'react-router-dom';
import './App.css';
import {AppTitle,DisplayCar, ShowPic} from "./reactComponents";
import API from "./API";


class App extends React.Component {

  constructor(props){
    super(props);
    this.state= {DBCars:[], cars:[], brands:[], selectedCategories:[],selectedBrands:[], login: false, rent:"", payed:false};
  }

  componentDidMount(){
    API.getCars().then((c)=> this.setState({cars:c}));
    API.getCars().then((c)=> this.setState({DBCars:c}));
    API.getBrands().then((b)=> this.setState({brands:b}));
    
  }
  
  filterByCategory = (c) => {
    let categoriesArray = Array.from(this.state.selectedCategories);
    let brandsArray = Array.from(this.state.selectedBrands);
    var carsFiltered =[];
    var tmp=[];
    if(categoriesArray.indexOf(c) === -1){
      categoriesArray.push(c);
    }
    else{
      let i= categoriesArray.indexOf(c);
      categoriesArray.splice(i,1);
    }

    if(categoriesArray.length !== 0){ //if some category is selected
      if(brandsArray.length === 0){   //but any brand in selected
        for(let i=0; i<categoriesArray.length;i++){
            let tmp=(this.state.DBCars.filter((car)=> car.category === categoriesArray[i]));// category filter only
            carsFiltered.push(...tmp);
        }
      
      this.setState(()=>({cars:carsFiltered,selectedCategories:categoriesArray}));
           
      }
      if(brandsArray.length !== 0){ //if some brand is selected
        if(categoriesArray.length === 0){   //but any category in selected
          for(let i=0; i<brandsArray.length;i++){
              let tmp=(this.state.DBCars.filter((car)=> car.brand === brandsArray[i]));// brands filter only
              carsFiltered.push(...tmp);
          }
        
        this.setState(()=>({cars:carsFiltered,selectedCategories:categoriesArray}));
             
        }
        if(brandsArray.length !== 0){   //if some brand is selected
          for(let i=0; i<categoriesArray.length;i++){
            let temp=(this.state.DBCars.filter((car)=> car.category === categoriesArray[i]));// filter by category
            carsFiltered.push(...temp);
        }
          for(let i=0; i<brandsArray.length;i++){
            let temp=(this.state.DBCars.filter((car)=> car.brand === brandsArray[i]));// and also by brand
            tmp.push(...temp)
          }
          
          carsFiltered=carsFiltered.filter(c=> tmp.includes(c));  //compute the intersection with the previus arrays
        this.setState(()=>({cars:carsFiltered,selectedCategories:categoriesArray}));
        }
      }
    }
    if(categoriesArray.length === 0){ //if no categoty is selected
      if(brandsArray.length ===0){  // and any branb in selected
        this.setState(()=>({cars:this.state.DBCars, selectedCategories:categoriesArray})); // return all cars;
      }
      if(brandsArray.length !==0){ //if some brand is selected
        for(let i=0; i<brandsArray.length;i++){
          let tmp=(this.state.DBCars.filter((car)=> car.brand === brandsArray[i]));// brands filter only
          carsFiltered.push(...tmp);
      }
    
        this.setState(()=>({cars:carsFiltered,selectedCategories:categoriesArray}));
      }
    }
  }
  filterByBrand = (b) => {
    let categoriesArray = Array.from(this.state.selectedCategories);
    let brandsArray = Array.from(this.state.selectedBrands);
    var carsFiltered =[];
    var tmp=[];
    if(brandsArray.indexOf(b)=== -1){
      brandsArray.push(b);
    }
    else{
      let i= brandsArray.indexOf(b);
      brandsArray.splice(i,1);
    }
    if(brandsArray.length !== 0){ //if some brand is selected
      if(categoriesArray.length === 0){   //but any category in selected
        for(let i=0; i<brandsArray.length;i++){
            let tmp=(this.state.DBCars.filter((car)=> car.brand === brandsArray[i]));// brands filter only
            carsFiltered.push(...tmp);
        }
      
      this.setState(()=>({cars:carsFiltered,selectedBrands:brandsArray}));
           
      }
      if(categoriesArray.length !== 0){   //if some category is selected
        for(let i=0; i<categoriesArray.length;i++){
          let temp=(this.state.DBCars.filter((car)=> car.category === categoriesArray[i]));// filter by category
          carsFiltered.push(...temp);
      }
        for(let i=0; i<brandsArray.length;i++){
          let temp=(this.state.DBCars.filter((car)=> car.brand === brandsArray[i]));// and also by brand
          tmp.push(...temp)
        }
        
        carsFiltered=carsFiltered.filter(c=> tmp.includes(c));  //compute the intersection with the previus arrays
      this.setState(()=>({cars:carsFiltered,selectedBrands:brandsArray}));
      }
    }
    if(brandsArray.length === 0){ //if no brand is selected
      if(categoriesArray.length ===0){  // and any category in selected
        this.setState(()=>({cars:this.state.DBCars, selectedBrands:brandsArray})); // return all cars;
      }
      if(categoriesArray.length !==0){ //if some category is selected
        for(let i=0; i<categoriesArray.length;i++){
          let tmp=(this.state.DBCars.filter((car)=> car.category === categoriesArray[i]));// category filter only
          carsFiltered.push(...tmp);
      }
    
        this.setState(()=>({cars:carsFiltered,selectedBrands:brandsArray}));
      }
    }
    
  }

  unauthorized=()=>{
    this.props.history.push("/login");
  }

  addRent=(rent)=>{
    API.addRent(rent).then(()=>{
      this.props.history.push("/private");
      console.log("rent aggiunto, dovrebbe settare a true")
      this.setState({payed:true})
    }).catch((r)=>{
      if(r ===401){
      this.unauthorized()} 
     });
    
}
  paymentComplete=()=>{
    this.setState({payed:false});
  }

  payment=(rent)=>{
    this.setState(()=> ({rent:rent}))
      if(rent.price> 0){
        this.props.history.push("/private/payment");
    }
}
  //LOGIN
  login =(username,password) =>{
    API.userLogin(username,password).then((user)=>{
      this.setState({login:user});
      if(username === user.mail){
        this.props.history.push("/private");
      }
    })
    
  }

  logout=()=>{
    this.setState({login:""});
    this.props.history.push("/home");
  }

  render() {
    return(
      <Container fluid>
        <Switch>

        <Route path="/private/payment">
            <Payment addRent={this.addRent} rent={this.state.rent} payed={this.state.payed} unauthorized={this.unauthorized}/>
        </Route>
        <Route path="/private/rent">
            <RentForm user={this.state.login} unauthorized={this.unauthorized}/>
        </Route>
        <Route path="/private">
            <PrivateForm  unauthorized={this.unauthorized} payed={this.state.payed} paymentComplete={this.paymentComplete} price={this.state.price} user={this.state.login} cars={this.state.cars} payment={this.payment} logout={this.logout}/>
          </Route>
          <Route path="/login">
            <LoginForm login={this.login}/>
          </Route> 
          <Route path="/home">
            <AppTitle/>
            <ShowPic/>
            <DisplayCar cars={this.state.cars} brands={this.state.brands} filterByCategory={this.filterByCategory} filterByBrand={this.filterByBrand}/>
          </Route>
        </Switch>
  
      </Container>
    )
  };

}
export default withRouter(App);
