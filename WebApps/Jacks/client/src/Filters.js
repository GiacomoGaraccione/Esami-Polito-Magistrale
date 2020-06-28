import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

function Filters(props) {
  const categories = [
    { id: "a", value: "A" },
    { id: "b", value: "B" },
    { id: "c", value: "C" },
    { id: "d", value: "D" },
    { id: "e", value: "E" },
  ];

  return (
    <ListGroup>
      <h4>Categories:</h4>
      <ButtonGroup className="catFilterButtons">
        {categories.map((c) => (
          <Button onClick={() => props.onClickCatFilter(c)}> {c.value} </Button>
        ))}
      </ButtonGroup>
      <h4>Brands:</h4>
      <ButtonGroup className="brandFilterButtons">
        {props.brands.map((b) => (
          <Button onClick={() => props.onClickBrandFilter(b)}>
            {" "}
            {b.Brand}
          </Button>
        ))}
      </ButtonGroup>
    </ListGroup>
  );
}

export { Filters };
