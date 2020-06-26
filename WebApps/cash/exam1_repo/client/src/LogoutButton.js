import React from 'react'
import Button from 'react-bootstrap/Button'
import * as api from './api.js'

export default class LogoutButton extends React.Component {
    render(){
        return <Button variant="outline-danger" onClick={() => {this.logout()}}>
            Logout
        </Button>;
    }

    logout = () => {
        api.logout()
        .then(() => {
            this.props.setLoggedIn(false, undefined);
        })
        .catch((err) => {
            console.log('error: could not logout', err);
        })
    }
}