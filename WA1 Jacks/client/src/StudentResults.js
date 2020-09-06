import React from "react";
import API from "./API/API.js";
import Table from "react-bootstrap/Table";

class StudentResults extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      passedStudents: [],
      notPassedStudents: [],
      notBookedStudents: [],
    };
  }

  componentDidMount() {
    API.getPassedStudents(this.props.username).then((s) => {
      this.setState({ passedStudents: s });
    });
    API.getNotPassedStudents(this.props.username).then((s) => {
      console.log(s);
      this.setState({ notPassedStudents: s });
    });
    API.getNotBookedStudents(this.props.username).then((s) => {
      console.log(s);
      this.setState({ notBookedStudents: s });
    });
  }

  createRowPassed = (s) => {
    return (
      <tr>
        <td> {s.StudentId} </td>
        <td> {s.Mark} </td>
      </tr>
    );
  };

  createRowFuture = (s) => {
    return (
      <tr>
        <td> {s.StudentId} </td>
        <td> {s.Date} </td>
      </tr>
    );
  };

  createRowMissing = (s) => {
    return (
      <tr>
        <td> {s.StudentId} </td>
      </tr>
    );
  };

  render() {
    return (
      <>
        {this.state.passedStudents.length > 0 && (
          <>
            <h4> Students that have already taken an oral exam</h4>
            <Table hover={true} bordered striped={true} size="sm">
              <thead>
                <tr>
                  <th> Student Id </th>
                  <th> Mark</th>
                </tr>
              </thead>
              <tbody>
                {this.state.passedStudents.map((s) => this.createRowPassed(s))}
              </tbody>
            </Table>
          </>
        )}
        {this.state.notPassedStudents.length > 0 && (
          <>
            <h4> Students that have yet to take an oral exam</h4>
            <Table hover={true} bordered striped={true} size="sm">
              <thead>
                <tr>
                  <th> Student Id </th>
                  <th> Exam Date </th>
                </tr>
              </thead>
              <tbody>
                {this.state.notPassedStudents.map((s) =>
                  this.createRowFuture(s)
                )}
              </tbody>
            </Table>
          </>
        )}
        {this.state.passedStudents.length === 0 && (
          <h4> There are no students that have already taken an oral exam</h4>
        )}
        {this.state.notPassedStudents.length === 0 && (
          <h4> There are no students that have yet to take an oral exam</h4>
        )}
        {this.state.notBookedStudents.length > 0 && (
          <>
            <h4> Students that have yet to book a slot for an oral exam </h4>
            <Table hover={true} bordered striped={true} size="sm">
              <thead>
                <tr>
                  <th> Student Id </th>
                </tr>
              </thead>
              <tbody>
                {this.state.notBookedStudents.map((s) =>
                  this.createRowMissing(s)
                )}
              </tbody>
            </Table>
          </>
        )}
      </>
    );
  }
}

export default StudentResults;
