import React from "react";
import Table from "react-bootstrap/Table";

function ShowVehicles(props) {
  return (
    <Table striped={true}>
      <thead>
        <tr>
          <th className="col-2">Category</th>
          <th className="col-2">Brand</th>
          <th className="col-2">Model</th>
        </tr>
      </thead>
      <tbody>
        {props.vehiclesShow.map((c) => (
          <VehicleRow key={c.id} vehiclesShow={c} />
        ))}
      </tbody>
    </Table>
  );
}

function VehicleRow(props) {
  return (
    <tr>
      <td>{props.vehiclesShow.category}</td>
      <td>{props.vehiclesShow.brand}</td>
      <td>{props.vehiclesShow.model}</td>
    </tr>
  );
}

export { ShowVehicles };
