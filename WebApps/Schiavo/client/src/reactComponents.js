import React from 'react';
import { NavLink} from 'react-router-dom';
import { Button,ButtonGroup ,Form,Table} from 'react-bootstrap';


function AppTitle(){
    return  <nav className="navbar navbar-light bg-light" href="/home">
             <a className="navbar-brand" href="/#">EZRental</a>
                  <form className="form-inline">
                         <NavLink to="/login">Login</NavLink>
                  </form>
        </nav>;

};

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
                <Button value="A">Category A</Button>
                <Button value="B">Category B</Button>
                <Button value="C">Category C</Button>
                <Button value="D">Category D</Button>
                <Button value="E">Category E</Button>
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
                {props.brands.map((b)=> <Button key ={b} value ={b}> {b}</Button>)}
            </ButtonGroup>
            
    </Form>
    )}

function CarList(props){
        return <Table bordered responsive>
        <thead>
        <tr>
            <th className='col-2'>Brand</th>
            <th className='col-2'>Model</th>
            <th className='col-2'>Category</th>
            <th className='col-2'>Seats</th>
        </tr>
        </thead>
        <tbody>{
               props.cars.map((c) => <CarRow key={c.plate} cars={c}/>)
            }
            </tbody>
    </Table>



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


 export {DisplayCar,AppTitle}