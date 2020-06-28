import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import AppTitle from './AppTitle.js'
import LoginForm from './LoginForm.js'
import LogoutButton from './LogoutButton.js'
import MyRentalsButton from './MyRentalsButton.js'
import NewRentalButton from './NewRentalButton.js'
import WelcomeUser from './WelcomeUser.js'

export default class CustomNavBar extends React.Component {
    render(){
        if(this.props.myRentals && this.props.loggedIn){
            return <Navbar bg="dark" className='mb-3'>
                <AppTitle/>

                <NewRentalButton setMyRentals={this.props.setMyRentals}/>
                <LogoutButton setLoggedIn={this.props.setLoggedIn}/>
                <WelcomeUser user={this.props.user}/>
            </Navbar>;
        }
        else if(this.props.loggedIn){
            return <Navbar bg="dark" className='mb-3'>
                <AppTitle/>

                <MyRentalsButton setMyRentals={this.props.setMyRentals}/>
                <LogoutButton setLoggedIn={this.props.setLoggedIn}/>
                <WelcomeUser user={this.props.user}/>
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