import React from 'react';
import { NavLink } from 'react-router-dom';

function AppTitle(){
    return  <nav className="navbar navbar-light bg-light" href="/home">
             <a className="navbar-brand" href="/#">EZRental</a>
                  <form className="form-inline">
                         <NavLink to="/login">Login</NavLink>
                  </form>
        </nav>;

};

function DisplayCarFilters(props){
    return <div className={'filters'}>
    <div className={'category filter'}>
        <label htmlFor='selectCategory'>Select Category</label>
        <select id='selectCategory' className={'form-control'} onChange={(ev) => props.filterByCategory(ev.target.value)}>
            <option value ="no">All Categories</option>
            {props.categories.map((c)=> <option key={c.value} value={c.value}>{c.value}</option>)}
        </select>
        </div>
    <div className={'Brand filter'}>
        <label htmlFor='selectBrand'>Select Brand</label>
        <select id='selectBrand' className={'form-control'} onChange={(ev) => props.filterByBrand(ev.target.value)}>
        <option  value ="no" >All Brands</option>
            {props.brands.map((b)=> <option key={b} value={b}>{b}</option>)}
        </select>
     </div>   
    </div>
}

function CarList(props){

        return <table className='table ' style={{marginBottom: 0}}>
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
    </table>



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
    const categories = [{id:"a" ,value:"A"},{id:"b" ,value:"B"},{id:"c" ,value:"C"},{id:"d" ,value:"D"},{id:"e" ,value:"E"}];
    return <>
    <DisplayCarFilters categories={categories}  brands={props.brands} filterByCategory={props.filterByCategory} filterByBrand={props.filterByBrand}/>
    <CarList cars ={props.cars}/>
    </>;
 };


 export {DisplayCar,AppTitle}