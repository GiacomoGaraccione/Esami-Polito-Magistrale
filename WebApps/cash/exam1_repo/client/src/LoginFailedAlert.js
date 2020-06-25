import React from 'react'
import Alert from 'react-bootstrap/Alert'

export default class LoginFailedAlert extends React.Component {
    render(){
        return <Alert variant="danger" className="ml-3">
            <p>Login failed!</p>
        </Alert>;
    }
}