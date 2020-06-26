import React from 'react'
import Button from 'react-bootstrap/Button'

export default class NewRentalButton extends React.Component {
    render(){
        return <Button className='ml-auto mr-3' variant='outline-info' onClick={() => {this.onClick();}}>
            New rental
        </Button>;
    }

    onClick = () => {
        this.props.setMyRentals(false);
    }
}