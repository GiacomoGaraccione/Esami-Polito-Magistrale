import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import AppTitle from './AppTitle.js'

export default class CustomNavBar extends React.Component {
    render(){
        return <Navbar bg="dark" className='mb-3'>
            <AppTitle/>
        </Navbar>;
    }
}