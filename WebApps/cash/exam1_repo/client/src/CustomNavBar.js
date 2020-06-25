import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import AppTitle from './AppTitle.js'
import LoginForm from './LoginForm.js'
import LogoutButton from './LogoutButton.js'

export default class CustomNavBar extends React.Component {
    render(){
        if(this.props.loggedIn){
            return <Navbar bg="dark" className='mb-3'>
                <AppTitle/>
                <LogoutButton setLoggedIn={this.props.setLoggedIn}/>
            </Navbar>;
        }
        else{
            return <Navbar bg="dark" className='mb-3'>
                <AppTitle/>
                <LoginForm setLoggedIn={this.props.setLoggedIn}/>
            </Navbar>;
        }
    }
}