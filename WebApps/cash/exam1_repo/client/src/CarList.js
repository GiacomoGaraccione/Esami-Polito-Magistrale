import React from 'react';
import Table from 'react-bootstrap/Table'

export default class CarList extends React.Component {
    render(){
        return <Table borderless={true} hover={true} striped={true}>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Model</th>
                </tr>
            </thead>

            <tbody>
                {this.props.cars.map(c => createCarItem(c))}
            </tbody>
        </Table>;
    }
}

function createCarItem(c){
    return <tr key={c.id}>
        <td>{c.category}</td>
        <td>{c.brand}</td>
        <td>{c.model}</td>
    </tr>;
}