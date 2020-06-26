import React from 'react'
import Button from 'react-bootstrap/Button'
import * as api from './api.js'

export default class CancelRentButton extends React.Component {
    render(){
        return <Button variant='danger' onClick={() => {this.onClick();}}>
            Cancel
        </Button>;
    }

    onClick = () => {
        const id = this.props.rentalId;
        
        api.deleteRental(id)
        .then(() => {
            this.props.updateUserRentals();
        })
        .catch(() => {
            console.log('error in deleting rental');
        });
    }
}