import React from 'react';
import {Container,Form,Button} from 'react-bootstrap';

class LoginForm extends React.Component{

    constructor(props){
        super(props);
        this.state={username:"",password:""};
    }

    onChangeUsername = (event) => {
        this.setState({username : event.target.value});
    }

    onChangePassword = (event) => {
        this.setState({password : event.target.value});
    };
    
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.login(this.state.username,this.state.password);
    }

    render() {
        return(

            <Container>
                <nav className="navbar navbar-light bg-light" href="/home">
                    <a className="navbar-brand" href="/#">EZRental</a>
                    <form className="form-inline"></form>
                </nav>
                <Form method="POST" onSubmit={(event) => this.handleSubmit(event)}>
                                <Form.Group controlId="username">
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control type="email" name="email" placeholder="E-mail" value = {this.state.username} onChange={(ev) => this.onChangeUsername(ev)} required autoFocus/>
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password" placeholder="Password" value = {this.state.password} onChange={(ev) => this.onChangePassword(ev)} required/>
                                </Form.Group>
                <Button type="submit" className="btn btn-primary">Login</Button>
                </Form>
            </Container>
        );
            
    
        
    }
    
}
export default LoginForm;