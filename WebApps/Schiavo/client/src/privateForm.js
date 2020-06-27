import React from "react"
import { Container, Form, Card, Button} from "react-bootstrap";
import {NavLink} from 'react-router-dom';
import API from "./API";
import Rent from "./rent"
import moment from "moment"

class PrivateForm extends React.Component{
    constructor(props){
        super(props);
        this.state={carsDB:this.props.cars, user:this.props.user, availableCars:[], start:"" ,end:"",extraDriver:"0",insurace:"0",category:"A",age:"less",kilometers:"few", price:this.props.price};
    }

    componentDidUpdate(prevProps,prevState){
        if((prevState.start !== this.state.start && this.state.start !=="")  || (prevState.end !== this.state.end && this.state.end !=="") || prevState.category !== this.state.category){
            API.computeAvailability(this.state.category,this.state.start,this.state.end).then((c)=>{
                this.setState({availableCars:c})
            }).catch((r)=>{
                if(r ===401){
                this.props.unauthorized()} 
               });
        }
    }


    onChangeStartDate(event){
        let today = moment();
        console.log(event.target.value)
        if(moment(event.target.value).isAfter(today,'day')){
            this.setState({start : event.target.value},this.calculateAvailability);
        }
        else if (moment(event.target.value).isBefore(today,'day')){
            console.log("data di partenza è nel passato.")
        }
        else if (moment(event.target.value).isSame(today,'day')){
            console.log("Spiacente, non è possibile iniziare un noleggio in data odierna")
        }
    }
    onChangeEndDate(event){
        if(this.state.start !==""){
            if(moment(event.target.value).isAfter(this.state.start,'day')){
                this.setState({end : event.target.value},this.calculateAvailability);
            }
             else if (moment(event.target.value).isBefore(this.state.start,'day')){
                 console.log("data di arrivo è nel passato rispetto a partenza.")
            }
            else if (moment(event.target.value).isSame(this.state.start,'day')){
               console.log("Spiacente, non è possibile fare noleggio di un solo giorno")
            }
        }   
        else{
            console.log("inserire prima data di partenza")
            return
        }
    }
    onChangeExtraDriver(event){
        this.setState({extraDriver : event.target.value},this.calculateAvailability);
        
    }
    onChangeInsurance(event){
        this.setState({insurace: event.target.value},this.calculateAvailability);
    }
    onChangeCategory(event){
        this.setState({category : event.target.value},this.calculateAvailability);
    }
    onChangeAge(event){
        this.setState({age : event.target.value},this.calculateAvailability);
    }
    onChangeKilometers(event){
        this.setState({kilometers : event.target.value},this.calculateAvailability);
    }

    calculateAvailability(){
        if(this.state.start === "" || this.state.end === "" || this.state.category === "" || this.state.extraDriver === "" || this.state.insurace === "" || this.state.age === "" || this.state.kilometers === ""){
            return
        }

        const numberOfCarPerCategory = this.state.carsDB.filter((c)=> c.category === this.state.category);
        let start = moment(this.state.start);
        let end = moment(this.state.end);
        var days= end.diff(start,'days')+1;
        var price=0;
        var modifier=0;
        switch (this.state.category) {
            case "A":
                price=days*80.0;
                break;
            case "B":
                price=days*70.0;
                break;
            case "C":
                price=days*60.0;
                break;
            case "D":
                price=days*50.0;
                break;
            case "E":
                price=days*40.0;
                break;
        
            default:
                break;
        }
        switch (this.state.kilometers) {
            case "few":
                modifier+= -0.05
                break;
            case "unlimited":
                modifier+= 0.05
                break;
        
            default:
                break;
        }
        switch (this.state.age) {
            case "less":
                modifier+= 0.05
                break;
            case "more":
                modifier+= 0.1
                break;
        
            default:
                break;
        }
        if(this.state.insurace ==="1"){
            modifier += 0.2;
        }
        if(this.state.extraDriver >0 ){
            modifier += 0.15;
        }
        console.log(this.state.user);
        if(this.state.user.frequent ==="true"){
            modifier += -0.1;
        }
        if(this.state.availableCars.length/numberOfCarPerCategory <= 0.1){
            modifier += 0.1;
        }
        
        price+=price*modifier;
        this.setState(()=>({price: price}));

    }

    render(){
        return(
            
            < Container fluid>
                <nav className="navbar navbar-light bg-light" href="/home">
                    <a className="navbar-brand" href="/home">EZRental</a>
                    <Form className="form-inline">
                        <NavLink to="/private/rent">My rent</NavLink>
                        <Button onClick={()=> API.userLogout().then(()=> this.props.logout())}>Logout</Button>
                    </Form>
                </nav>
                
                <Form>
                    <Form.Group>
                        <Form.Label> Start </Form.Label>
                        <Form.Control type='date' onChange={(ev) => this.onChangeStartDate(ev)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label> End </Form.Label>
                        <Form.Control type='date' onChange={(ev) => this.onChangeEndDate(ev)}/>
                    </Form.Group>
                    <Form.Group controlId="selectExtraDrivers">
                        <Form.Label>How many extra drivers?</Form.Label>
                        <Form.Control as="select" onChange={(ev) => this.onChangeExtraDriver(ev)}>
                        <option value ="0">0</option>
                        <option value ="1">1</option>
                        <option value ="2">2</option>
                        <option value ="3">3</option>
                        <option value ="4">4</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="selectExtraInsurance">
                        <Form.Label>Do you want extra insurance?</Form.Label>
                        <Form.Control as="select" onChange={(ev) => this.onChangeInsurance(ev)}>
                        <option value ="0">No</option>
                        <option value ="1">Yes</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="selectCategory">
                        <Form.Label>Select category</Form.Label>
                        <Form.Control as="select" onChange={(ev) => this.onChangeCategory(ev)}>
                        <option value ="A">A</option>
                        <option value ="B">B</option>
                        <option value ="C">C</option>
                        <option value ="D">D</option>
                        <option value ="E">E</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="selectAge">
                        <Form.Label>Select driver's age</Form.Label>
                        <Form.Control as="select" onChange={(ev) => this.onChangeAge(ev)}>
                        <option value ="less">Driver has less than 25 yo</option>
                        <option value ="between">Driver has more tha 25, but less than 65 yo</option>
                        <option value ="more">Driver has more than 65 yo</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="selectKilometer">
                        <Form.Label>Select kilometers</Form.Label>
                        <Form.Control as="select" onChange={(ev) => this.onChangeKilometers(ev)}>
                        <option value ="few">less than 50 km/day</option>
                        <option value ="normal">less than 150 km/day</option>
                        <option value ="unlimited">unlimited distance</option>
                        </Form.Control>
                    </Form.Group>

                    <Card body>{this.state.price}</Card>
                    <Card body>{this.state.availableCars.length}</Card>
                    <Button type="submit" onClick={()=> {
                        const rent = new Rent(this.state.user.mail,null,this.state.start,this.state.end,this.state.availableCars[0].plate,this.state.age,this.state.extraDriver,this.state.kilometers,this.state.insurace,this.state.price);
                        this.props.payment(rent)}}>
                        Confirm And Pay
                    </Button>

                </Form> 
                
            </Container>


        );
    }
}

export default PrivateForm;

//addRent(this.state.user.mail,this.state.start,this.state.end,this.state.availableCars[0].plate,this.state.age,this.state.extraDriver,this.state.kilometers,this.state.insurace,this.state.price)