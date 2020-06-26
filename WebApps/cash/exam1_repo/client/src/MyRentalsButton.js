import React from 'react';
import Button from 'react-bootstrap/Button';

export default class MyRentalsButton extends React.Component {
    render(){
        return <Button className='ml-auto mr-3' variant='outline-info' onClick={() => {this.onClick();}}>
            My rentals
        </Button>;
    }

    onClick = () => {
        this.props.setMyRentals(true);
    }
}