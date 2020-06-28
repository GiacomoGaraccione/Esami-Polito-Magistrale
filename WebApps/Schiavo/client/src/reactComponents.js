import React from 'react';
import { NavLink} from 'react-router-dom';
import { Button,ButtonGroup ,Form,Table, Carousel,Alert} from 'react-bootstrap';


function AppTitle(){
    return  <nav className="navbar navbar-light bg-light" href="/home">
             <a className="navbar-brand" href="/#">EZRental</a>
                  <form className="form-inline">
                         <NavLink to="/login">Login</NavLink>
                  </form>
        </nav>;

};

function ShowPic(){
    return(
        <Carousel align="center" interval ={2000} slide={false} keyboard={true}> 
            <Carousel.Item>
                <img src={require("./img/1.jpg")} alt=""/>
            </Carousel.Item>
            <Carousel.Item>
                <img src={require("./img/2.jpg")} alt=""/>
            </Carousel.Item>
            <Carousel.Item>
                <img src={require("./img/3.jpg")} alt=""/>
            </Carousel.Item>
            <Carousel.Item>
                <img src={require("./img/4.jpg")} alt=""/>
            </Carousel.Item>
            <Carousel.Item>
                <img src={require("./img/5.jpg")} alt=""/>
            </Carousel.Item>
            <Carousel.Item>
                <img src={require("./img/6.jpg")} alt=""/>
            </Carousel.Item>
            <Carousel.Item>
                <img src={require("./img/7.jpg")} alt=""/>
            </Carousel.Item>
            <Carousel.Item>
                <img src={require("./img/8.jpg")} alt=""/>
            </Carousel.Item>
            <Carousel.Item>
                <img src={require("./img/9.jpg")} alt=""/>
            </Carousel.Item>
            <Carousel.Item>
                <img src={require("./img/10.jpg")} alt=""/>
            </Carousel.Item>
            <Carousel.Item>
                <img src={require("./img/11.jpg")} alt=""/>
            </Carousel.Item>
            <Carousel.Item>
                <img src={require("./img/12.jpg")} alt=""/>
            </Carousel.Item>
            <Carousel.Item>
                <img src={require("./img/13.jpg")} alt=""/>
            </Carousel.Item>
            <Carousel.Item>
                <img src={require("./img/14.jpg")} alt=""/>
            </Carousel.Item>
            <Carousel.Item>
                <img src={require("./img/15.jpg")} alt=""/>
            </Carousel.Item>
            <Carousel.Item>
                <img src={require("./img/16.jpg")} alt=""/>
            </Carousel.Item>
            <Carousel.Item>
                <img src={require("./img/17.jpg")} alt=""/>
            </Carousel.Item>
        </Carousel>
    )
}

function DisplayCarFilters(props){
    return( 
        <Form>
            <Form.Label>Select one or more categories :</Form.Label>
            <ButtonGroup onClick={(ev) => {
                props.filterByCategory(ev.target.value);
                if(ev.target.classList.contains('active')){
                    ev.target.classList.remove('active')
                }
                else{
                    ev.target.classList.add('active');
                }
                }}>
                <Button variant="outline-primary" value="A">Category A</Button>
                <Button variant="outline-primary" value="B">Category B</Button>
                <Button variant="outline-primary" value="C">Category C</Button>
                <Button variant="outline-primary" value="D">Category D</Button>
                <Button variant="outline-primary" value="E">Category E</Button>
            </ButtonGroup>
            
            <Form.Label>Select one or more brands :</Form.Label>
            <ButtonGroup onClick={(ev) => {
                props.filterByBrand(ev.target.value);
                if(ev.target.classList.contains('active')){
                    ev.target.classList.remove('active')
                }
                else{
                    ev.target.classList.add('active');
                }
                }}>
                {props.brands.map((b)=> <Button variant="outline-primary" key ={b} value ={b}> {b}</Button>)}
            </ButtonGroup>
            
    </Form>
    )}

function CarList(props){
        if(props.cars.length === 0){
            return(
                <Alert variant="warning">
                    <Alert.Heading>No cars available with selected filters</Alert.Heading>
                </Alert>
            )
        }
        else{
            return( 
            <Table bordered responsive>
                <thead>
                    <tr>
                        <th className='col-2'>Brand</th>
                        <th className='col-2'>Model</th>
                        <th className='col-2'>Category</th>
                        <th className='col-2'>Seats</th>
                    </tr>
                </thead>
                <tbody>{
                    props.cars.map((c) => <CarRow key={c.plate} cars={c}/>)}
                </tbody>
            </Table>


            )}
}

function CarRow(props){
    return <tr>
        <td>{props.cars.brand}</td>
        <td>{props.cars.model}</td>
        <td>{props.cars.category}</td>
        <td>{props.cars.seat}</td>
    </tr>
}

 function DisplayCar(props) {
    return <>
    <DisplayCarFilters brands={props.brands} filterByCategory={props.filterByCategory} filterByBrand={props.filterByBrand}/>
    <CarList cars ={props.cars}/>
    </>;
 };


 export {DisplayCar,AppTitle,ShowPic}