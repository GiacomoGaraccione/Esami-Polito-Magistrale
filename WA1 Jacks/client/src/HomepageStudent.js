import React from "react";
import API from "./API/API.js";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import StudentView from "./StudentView.js";
import ShowBooking from "./ShowBooking.js";

class HomepageStudent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      courseNames: [],
      teacherNames: [],
      showBook: false,
      showBooked: false,
      completedExams: [],
      futureExams: [],
      arrayBook: [],
      home: true,
    };
  }

  componentDidMount() {
    API.getCourses(this.props.studentId).then((c) => {
      let rows = [];
      let courseNames = [];
      let teacherNames = [];
      for (let i = 0; i < c.length; i++) {
        rows.push(
          <StudentView
            courseName={c[i].Course}
            teacherName={c[i].Name}
            passedExam={c[i].Passed}
            id={i}
            studentId={this.props.studentId}
          ></StudentView>
        );
        courseNames.push(c[i].Course);
        teacherNames.push(c[i].Name);
      }
      this.setState({
        arrayBook: rows,
        courseNames: courseNames,
        teacherNames: teacherNames,
      });
    });
  }

  onClickViewBook = () => {
    this.setState({ showBook: true, home: false });
  };

  onClickViewBooked = () => {
    this.setState({ showBooked: true, home: false });
    API.getCompletedExams(this.props.studentId).then((e) => {
      this.setState({ completedExams: e });
    });
    API.getFutureExams(this.props.studentId).then((e) => {
      this.setState({ futureExams: e });
    });
  };

  createCompletedExamRow = (e) => {
    return (
      <tr>
        <td> {this.getCourseName(e.TeacherName)} </td>
        <td> {e.Date} </td>
        <td> {e.Mark} </td>
      </tr>
    );
  };

  createFutureExamRow = (e) => {
    return (
      <tr>
        <td> {this.getCourseName(e.TeacherName)} </td>
        <td> {e.Date} </td>
        <td>
          {" "}
          <Button onClick={() => this.deleteAppointment(e)}>
            {" "}
            Delete{" "}
          </Button>{" "}
        </td>
      </tr>
    );
  };

  deleteAppointment = (exam) => {
    API.deleteAppointment(
      exam.Date,
      exam.TeacherName,
      this.props.studentId
    ).then(() => {
      console.log("Appointment deleted succesfully");
      let i = this.state.futureExams.indexOf(exam);
      let newFutureExams = this.state.futureExams;
      newFutureExams.splice(i, 1);
      this.setState({ futureExams: newFutureExams });
    });
  };

  getCourseName = (teacherName) => {
    let i = this.state.teacherNames.indexOf(teacherName);
    return this.state.courseNames[i];
  };

  toHome = () => {
    this.setState({ home: true, showBook: false, showBooked: false });
  };

  render() {
    return (
      <>
        {this.state.home && (
          <Alert variant="success"> Welcome {this.props.studentId} </Alert>
        )}
        {this.state.home && (
          <Button
            variant="outline-primary"
            onClick={() => this.onClickViewBook()}
          >
            {" "}
            Book an exam slot{" "}
          </Button>
        )}
        {this.state.showBook && (
          <Alert variant="info"> Book a new exam slot </Alert>
        )}
        {
          <ShowBooking
            arrayBook={this.state.arrayBook}
            showBook={this.state.showBook}
            toHome={this.toHome}
          ></ShowBooking>
        }
        {this.state.home && (
          <Button
            variant="outline-secondary"
            onClick={() => this.onClickViewBooked()}
          >
            {" "}
            View your currently booked slots{" "}
          </Button>
        )}
        {this.state.showBooked && (
          <Alert variant="info"> Your currently booked slots: </Alert>
        )}
        {this.state.showBooked &&
          this.state.completedExams.length === 0 &&
          this.state.futureExams.length === 0 && (
            <h4>You have no booked slots at the moment </h4>
          )}
        {this.state.showBooked && this.state.completedExams.length > 0 && (
          <Table hover={true} bordered striped={true} size="sm">
            <thead>
              <tr>
                <th> Course Name </th>
                <th> Date </th>
                <th> Mark </th>
              </tr>
            </thead>
            <tbody>
              {this.state.completedExams.map((e) =>
                this.createCompletedExamRow(e)
              )}
            </tbody>
          </Table>
        )}
        {this.state.showBooked && this.state.futureExams.length > 0 && (
          <Table hover={true} bordered striped={true} size="sm">
            <thead>
              <tr>
                <th> Course Name </th>
                <th> Date </th>
                <th> Delete Appointment </th>
              </tr>
            </thead>
            <tbody>
              {this.state.futureExams.map((e) => this.createFutureExamRow(e))}
            </tbody>
          </Table>
        )}
        {this.state.showBooked && (
          <Button variant="outline-success" onClick={() => this.toHome()}>
            {" "}
            Return home{" "}
          </Button>
        )}
      </>
    );
  }
}

export default HomepageStudent;
