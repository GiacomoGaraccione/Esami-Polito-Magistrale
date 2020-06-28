import React from 'react'
import Alert from 'react-bootstrap/Alert'

export default class WelcomeUser extends React.Component {
    render(){
        return <Alert variant='dark' className='ml-3 mt-3'>
            Welcome, {this.props.user}!
        </Alert>;
    }
}