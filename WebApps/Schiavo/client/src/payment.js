import React from 'react';
import API from "./API"
import { Container, Form, Card, Button} from "react-bootstrap";

class Payment extends React.Component{

    
    completeRent=(event)=>{
        event.preventDefault();
        API.pay(this.props.price).then((res)=>{
            if(res==="true"){
                this.props.addRent(this.props.rent);
            }
        }).catch((r)=>{
            if(r ===401){
            this.props.unauthorized()} 
           });
    }

    render(){
        return(
            <Container>
                <nav className="navbar navbar-light bg-primary" href="/private/payment/">
                    <a className="navbar-brand" href="/private/payment/">PayScam</a>
                </nav>
            
                <Form onSubmit={(event)=>{this.completeRent(event)}}>
                    <Form.Label>Amount Due</Form.Label>
                    <Card body>{this.props.rent.price}€</Card>

                <Form.Group>
                    <Form.Label>Full name</Form.Label>
                    <Form.Control placeholder ="Insert here your full name" required/>
                    <Form.Text></Form.Text>
                    <Form.Label>CardNumber</Form.Label>
                    <Form.Control placeholder ="XXXX-XXXX-XXXX-XXXX" required/>
                    <Form.Text>With us your information are safe</Form.Text>
                    <Form.Label>CVV</Form.Label>
                    <Form.Control  placeholder="XXX" required/>
                </Form.Group>
                <Button type="submit" >Confirm and Pay</Button>
                </Form>
            </Container>
        )
    }
    


}

export default Payment;