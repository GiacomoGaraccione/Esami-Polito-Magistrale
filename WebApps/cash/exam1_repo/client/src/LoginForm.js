import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import * as api from './api.js'
import LoginFailedAlert from './LoginFailedAlert.js'

export default class LoginForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {loginFailed: false};
    }

    render(){ //ml-auto is for aligning to the right
        return <>
        <Form inline className='ml-auto' method='POST' onSubmit={(event) => this.doLogin(event)}>
            <Form.Group controlId='username'>
                <Form.Control type='text' placeholder='Username' className='mr-3'></Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
                <Form.Control type='password' placeholder='Password' className='mr-3'></Form.Control>
            </Form.Group>

            <Button variant="outline-success" type='submit'>
                Login
            </Button>
        </Form>
        {this.state.loginFailed && <LoginFailedAlert/>}
        </>;
    }

    doLogin = (event) => {
        event.preventDefault();
        const username = event.target.elements.username.value;
        const pwd = event.target.elements.password.value;
        
        api.login(username, pwd).then(() => {
            this.props.setLoggedIn(true, username);
        }).catch((err) => {
            this.setState({loginFailed: true});
        });
    }
}