import React from "react";
import moment from "moment";
import API from "./API.js";
import {Table,Container, Button} from 'react-bootstrap';


function RentRow(props){
    let today=moment().format("YYYY-MM-DD");
    if(moment(props.rent.startingDay).isAfter(today,'day')){
    return(<tr>
            <td>{props.rent.id}</td>
            <td>{props.rent.startingDay}</td>
            <td>{props.rent.endDay}</td>
            <td>{props.rent.carPlate}</td>
            <td>{props.rent.price}</td>
    <td> Reserved Rent <Button onClick ={()=>{props.deleteRent(props.rent.id)}}>Delete</Button></td>
            </tr>
    )}
    else if(moment(props.rent.endDay).isBefore(today,"day")){
    return(<tr>
            <td>{props.rent.id}</td>
            <td>{props.rent.startingDay}</td>
            <td>{props.rent.endDay}</td>
            <td>{props.rent.carPlate}</td>
            <td>{props.rent.price}</td>
            <td>Completed</td>
            </tr>
            )
    }
    else{
        return(<tr>
            <td>{props.rent.id}</td>
            <td>{props.rent.startingDay}</td>
            <td>{props.rent.endDay}</td>
            <td>{props.rent.carPlate}</td>
            <td>{props.rent.price}</td>
            <td>In progress</td>
            </tr>
            )
    }
}

class RentForm extends React.Component{
    constructor(props){
        super(props);
        this.state={rents:[]};
    }
    componentDidMount(){
        API.getRents(this.props.user.mail).then((r) =>{
            this.setState({rents:r})
        })
        .catch((r)=>{
             if(r ===401){
             this.props.unauthorized()} 
            });
    }


    deleteRent=(id)=>{
        API.deleteRent(id)
        .then(()=>{
            API.getRents(this.props.user.mail).then((r)=>{
                this.setState({rents:r})
            }).catch((r)=>{
                if(r ===401){
                this.props.unauthorized()} 
               });
        }).catch((r)=>{
             if(r ===401){
             this.props.unauthorized()} 
            });
    }

    render(){
        return (
            <Container fluid>
            <nav className="navbar navbar-light bg-light" href="/home">
             <a className="navbar-brand" href="/home">EZRental</a>
            </nav>
            <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th className='col-1'>#</th>
                <th className='col-2'>Starting Day</th>
                <th className='col-2'>Ending Day</th>
                <th className='col-2'>Car</th>
                <th className='col-2'>Price</th>
                <th className='col-1'>Delete rent</th>
              </tr>
            </thead>
            <tbody>{
                this.state.rents.map((r)=><RentRow rent={r} deleteRent={this.deleteRent}/>)     
            }
            </tbody>
          </Table>
          </Container>
        )
    }
    

}
export default RentForm;