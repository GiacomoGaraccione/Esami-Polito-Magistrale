import React from "react";
import API from "./API/API.js";
import Table from "react-bootstrap/Table";
import AddStudentButton from "./AddStudentButton.js";

class StudentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      count: 0,
    };
  }

  componentDidMount() {
    API.getStudents(this.props.username).then((s) => {
      this.setState({ students: s });
    });
  }

  createRow = (s) => {
    return (
      <tr>
        <td> {s} </td>
        {
          <td>
            <AddStudentButton
              show={true}
              updateSelected={this.props.updateSelected}
              id={s}
            />
          </td>
        }
      </tr>
    );
  };

  render() {
    return (
      <Table hover={true} bordered striped={true} size="sm">
        <thead>
          <tr>
            <th className="col-6">Student ID</th>
            <th> Select for oral exam </th>
          </tr>
        </thead>
        <tbody>{this.state.students.map((s) => this.createRow(s))}</tbody>
      </Table>
    );
  }
}

export default StudentList;
