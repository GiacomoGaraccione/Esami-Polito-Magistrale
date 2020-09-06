import React from "react";
import API from "./API/API.js";
import Table from "react-bootstrap/Table";
import PresentButton from "./PresentButton";
import AbsentButton from "./AbsentButton";

class ExamExecution extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bookedStudents: [],
      evaluated: [],
      marks: [],
    };
  }

  componentDidMount() {
    API.getBookedStudents(this.props.username).then((s) => {
      this.setState({ bookedStudents: s });
    });
    let evaluated = this.state.evaluated;
    for (let i = 0; i < this.state.bookedStudents.length; i++) {
      evaluated[i] = false;
    }
    this.setState({ evaluated: evaluated });
  }

  isStudentEvaluated = (s) => {
    let evaluated = this.state.evaluated;
    let students = this.state.bookedStudents;
    let i = students.indexOf(s);
    return evaluated[i];
  };

  updateEvaluation = (s, mark) => {
    let evaluated = this.state.evaluated;
    let students = this.state.bookedStudents;
    let marks = this.state.marks;
    let i = students.indexOf(s);
    evaluated[i] = true;
    marks[i] = mark;
    this.setState({ evaluated: evaluated, marks: marks });
  };

  getStudentMark = (s) => {
    let marks = this.state.marks;
    let students = this.state.bookedStudents;
    let i = students.indexOf(s);
    return marks[i];
  };

  isStudentPresent = (s) => {
    let evaluated = this.isStudentEvaluated(s);
    let marks = this.state.marks;
    let students = this.state.bookedStudents;
    let i = students.indexOf(s);
    let mark = marks[i];
    let passed = true;
    if (mark === "Absent") {
      passed = false;
    }
    return evaluated && passed;
  };

  isStudentAbsent = (s) => {
    let evaluated = this.isStudentEvaluated(s);
    let marks = this.state.marks;
    let students = this.state.bookedStudents;
    let i = students.indexOf(s);
    let mark = marks[i];
    let absent = false;
    if (mark === "Absent") {
      absent = true;
    }
    return evaluated && absent;
  };

  createRow = (s) => {
    return (
      <tr>
        <td> {s.StudentId} </td>
        <td> {s.Date} </td>
        <td>
          {!this.isStudentEvaluated(s) && (
            <PresentButton
              student={s}
              username={this.props.username}
              updateEvaluation={this.updateEvaluation}
            ></PresentButton>
          )}
          {this.isStudentPresent(s) && <h4>{this.getStudentMark(s)}</h4>}
        </td>
        <td>
          {!this.isStudentEvaluated(s) && (
            <AbsentButton
              student={s}
              username={this.props.username}
              updateEvaluation={this.updateEvaluation}
            ></AbsentButton>
          )}
          {this.isStudentAbsent(s) && <h4> {this.getStudentMark(s)} </h4>}
        </td>
      </tr>
    );
  };

  render() {
    return (
      <Table hover={true} bordered striped={true} size="sm">
        <thead>
          <tr>
            <th> Student ID</th>
            <th> Slot Date </th>
            <th> Student is Present </th>
            <th> Student is Absent </th>
          </tr>
        </thead>
        <tbody>{this.state.bookedStudents.map((s) => this.createRow(s))}</tbody>
      </Table>
    );
  }
}

export default ExamExecution;
