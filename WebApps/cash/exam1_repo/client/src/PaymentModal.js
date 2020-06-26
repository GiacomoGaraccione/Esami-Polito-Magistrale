import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import * as api from './api.js';
import Alert from 'react-bootstrap/Alert';

export default class PaymentModal extends React.Component {
    constructor(props){
        super(props);

        this.state = {cardNumber: '', name: '', cvv: '', paymentDone: false};
    }

    render(){
        if(this.state.paymentDone){
            return <Modal show={this.props.show} animation={false} onHide={() => {this.props.setShow(false);}}>
                <Modal.Body>
                    <Alert variant='success'>Payment accepted!</Alert>
                </Modal.Body>
            </Modal>;
        }
        else{
            return <> 
            <Modal show={this.props.show} animation={false} onHide={() => {this.props.setShow(false);}}>
                <Modal.Header>Payment</Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group controlId='cardNumber'>
                            <Form.Label>Credit card number:</Form.Label>
                            <Form.Control type='text' onChange={(event) => {this.onChangeCardNumber(event);}}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='name'>
                            <Form.Label>Full name:</Form.Label>
                            <Form.Control type='text' onChange={(event) => {this.onChangeName(event);}}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='cvv'>
                            <Form.Label>CVV code:</Form.Label>
                            <Form.Control type='text' onChange={(event) => {this.onChangeCvv(event);}}></Form.Control>
                        </Form.Group>

                        <Button type='submit' disabled={!this.checkValidFields()} onClick={(event) => {this.onSubmit(event);}}>
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            </>;
        }
    }

    onChangeCardNumber = (event) => {
        this.setState({cardNumber: event.target.value});
    }

    onChangeName = (event) => {
        this.setState({name: event.target.value});
    }

    onChangeCvv = (event) => {
        this.setState({cvv: event.target.value});
    }

    checkValidFields = () => {
        return ( this.state.cardNumber.length > 0 && this.state.name.length > 0 && this.state.cvv.length > 0 )
    }

    onSubmit = (event) => {
        event.preventDefault();

        api.sendPaymentInformation(this.state.cardNumber, this.state.name, this.state.cvv)
        .then(() => {
            this.setState({paymentDone: true});

            api.postNewRental(this.props.availableCars[0], this.props.dateBeg, this.props.dateEnd, this.props.user)
            .then(() => {
                console.log('new rental posted successfully');
            }) 
            .catch(() => {
                console.log('error in posting new rental');
            })
        })
        .catch(() => {
            console.log('error in sending payment information');
        });
    }
}