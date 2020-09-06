import React from "react";
import "./App.css";
import Container from "react-bootstrap/Container";
import LoginForm from "./LoginForm.js";
import StudentForm from "./StudentForm.js";
import HomepageTeacher from "./HomepageTeacher.js";
import Alert from "react-bootstrap/Alert";
import StudentList from "./StudentList.js";
import AppTitle from "./AppTitle.js";
import SlotSettings from "./SlotSettings.js";
import SessionCount from "./SessionCount.js";
import ShowSessions from "./ShowSessions.js";
import HomepageStudent from "./HomepageStudent.js";
import StudentResults from "./StudentResults.js";
import ExamExecution from "./ExamExecution.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      studentAccess: false,
      username: null,
      createExam: false,
      executeExam: false,
      viewResults: false,
      selectedStudents: 0,
      slotDuration: 0,
      sessions: 0,
      totalDuration: 0,
      slotSet: false,
      arraySessions: [],
      totalSlots: 0,
      availableSlots: 0,
      sessionInfo: [],
      sessionDays: [],
      startingHours: [],
      sessionLengths: [],
      studentIds: [],
      studentId: null,
    };
  }

  doLogin = (username, password) => {
    this.setState({
      username: username,
      loggedIn: true,
    });
  };

  doLogout = () => {
    this.setState({
      username: null,
      loggedIn: false,
      createExam: false,
      executeExam: false,
      viewResults: false,
    });
  };

  setCreate = (val) => {
    this.setState({
      createExam: val,
    });
  };

  setExecute = (val) => {
    this.setState({
      executeExam: val,
    });
  };

  setView = (val) => {
    this.setState({
      viewResults: val,
    });
  };

  updateSelected = (bool, id) => {
    if (bool) {
      let count = this.state.selectedStudents;
      count++;
      let availableSlots = this.state.availableSlots;
      availableSlots--;
      let ids = this.state.studentIds;
      ids.push(id);
      this.setState({
        selectedStudents: count,
        availableSlots: availableSlots,
        studentIds: ids,
      });
    } else {
      let count = this.state.selectedStudents;
      count--;
      let availableSlots = this.state.availableSlots;
      availableSlots++;
      let i = this.state.studentIds.indexOf(id);
      let ids = this.state.studentIds;
      ids.splice(i, 1);
      this.setState({
        selectedStudents: count,
        availableSlots: availableSlots,
        studentIds: ids,
      });
    }
  };

  setSlot = (time) => {
    this.setState({
      slotDuration: time,
      slotSet: true, //mostra impostazioni solo dopo aver premuto pulsante
    });
  };

  setSessions = (num) => {
    this.setState({ sessions: num });
  };

  setArraySessions = (vett, sessionInfo) => {
    this.setState({ arraySessions: vett, sessionInfo: sessionInfo });
  };

  increaseTotal = (bool, duration) => {
    //let newDuration = parseInt(duration, 10);
    //newDuration = newDuration + this.state.duration;
    //let slots = newDuration / this.state.slotDuration;
    if (bool) {
      //let totalSlots = 0; //slots;
      let oldTotal = parseInt(this.state.totalDuration, 10);
      let slotDuration = parseInt(this.state.slotDuration, 10);
      let totalDuration = oldTotal + slotDuration;
      let slots = totalDuration / slotDuration;
      /*if (this.state.totalSlots > 0) {
        totalSlots = this.state.totalSlots + 1;
      } else {
        totalSlots = slots;
      }*/
      let availableSlots = slots - this.state.selectedStudents;
      this.setState({
        totalSlots: slots,
        availableSlots: availableSlots,
        totalDuration: totalDuration,
      });
    } else {
      //let totalSlots = slots;
      //console.log(totalSlots);
      let oldTotal = parseInt(this.state.totalDuration, 10);
      let slotDuration = parseInt(this.state.slotDuration, 10);
      let totalDuration = oldTotal - slotDuration;
      let slots = totalDuration / slotDuration;
      console.log("TOTAL", totalDuration);
      console.log("SLOTS", slots);
      let availableSlots = slots - this.state.selectedStudents;
      this.setState({
        totalSlots: slots,
        availableSlots: availableSlots,
        totalDuration: totalDuration,
      });
    }
  };

  updateSlots = (bool) => {
    if (bool) {
      let length = this.state.sessionInfo.length;
      let hoursToRemove = this.state.sessionInfo[length - 1];
      //let totalHours = this.state.totalHours - hoursToRemove;
      //let totalSlots = this.state.slotsPerHour * totalHours;
      let availableSlots = this.state.totalSlots - this.state.selectedStudents;
      this.setState({
        //totalHours: totalHours,
        //totalSlots: totalSlots,
        availableSlots: availableSlots,
      });
    } else {
      let availableSlots = this.state.totalSlots - this.state.selectedStudents;
      console.log("AV");
      console.log(availableSlots);
      console.log("TotalSlots");
      console.log(this.state.totalSlots);
      let totalSlots = this.state.totalSlots;

      this.setState({ availableSlots: availableSlots, totalSlots: totalSlots });
    }
  };

  clearStudents = () => {
    this.setState({
      selectedStudents: 0,
      studentIds: [],
      slotDuration: 0,
      sessions: 0,
      arraySessions: [],
      totalDuration: 0,
      slotSet: false,
    });
  };

  studentAccess = (id) => {
    this.setState({ studentAccess: true, studentId: id });
  };

  studentOut = () => {
    this.setState({ studentAccess: false, studentId: null });
  };

  render() {
    if (!this.state.loggedIn && !this.state.studentAccess) {
      return (
        <Container fluid>
          <AppTitle
            loggedIn={this.state.loggedIn}
            studentAccess={this.state.studentAccess}
          ></AppTitle>
          <LoginForm doLogin={this.doLogin}></LoginForm>
          <StudentForm studentAccess={this.studentAccess}></StudentForm>
        </Container>
      );
    } else if (this.state.loggedIn && !this.state.studentAccess) {
      if (
        !this.state.createExam &&
        !this.state.executeExam &&
        !this.state.viewResults
      ) {
        return (
          <Container fluid>
            <AppTitle
              loggedIn={this.state.loggedIn}
              studentAccess={this.state.studentAccess}
              setCreate={this.setCreate}
              setExecute={this.setExecute}
              setView={this.setView}
              clearStudents={this.clearStudents}
              doLogout={this.doLogout}
            ></AppTitle>
            <HomepageTeacher
              username={this.state.username}
              setCreate={this.setCreate}
              setExecute={this.setExecute}
              setView={this.setView}
            ></HomepageTeacher>
          </Container>
        );
      } else if (
        this.state.createExam &&
        !this.state.executeExam &&
        !this.state.viewResults
      ) {
        return (
          <>
            <AppTitle
              loggedIn={this.state.loggedIn}
              studentAccess={this.state.studentAccess}
              setCreate={this.setCreate}
              setExecute={this.setExecute}
              setView={this.setView}
              clearStudents={this.clearStudents}
              doLogout={this.doLogout}
            ></AppTitle>
            <Alert variant="success"> Create a New Exam </Alert>
            {!this.state.slotSet && (
              <StudentList
                username={this.state.username}
                updateSelected={this.updateSelected}
              ></StudentList>
            )}
            {!this.state.slotSet && (
              <SlotSettings
                selectedStudents={this.state.selectedStudents}
                setSlot={this.setSlot}
              ></SlotSettings>
            )}
            {this.state.slotSet && (
              <SessionCount
                selectedStudents={this.state.selectedStudents}
                increaseTotal={this.increaseTotal}
                slotDuration={this.state.slotDuration}
                setSessions={this.setSessions}
                setArraySessions={this.setArraySessions}
                updateSlots={this.updateSlots}
                sessionDays={this.state.sessionDays}
                startingHours={this.state.startingHours}
                sessionLengths={this.state.sessionLengths}
              ></SessionCount>
            )}
            <ShowSessions
              arraySessions={this.state.arraySessions}
              availableSlots={this.state.availableSlots}
              totalSlots={this.state.totalSlots}
              sessions={this.state.sessions}
              sessionDays={this.state.sessionDays}
              sessionInfo={this.state.sessionInfo}
              startingHours={this.state.startingHours}
              username={this.state.username}
              selectedStudents={this.state.selectedStudents}
              setCreate={this.setCreate}
              studentIds={this.state.studentIds}
              clearStudents={this.clearStudents}
              slotDuration={this.state.slotDuration}
              totalDuration={this.state.totalDuration}
            ></ShowSessions>
          </>
        );
      } else if (
        !this.state.createExam &&
        this.state.executeExam &&
        !this.state.viewResults
      ) {
        return (
          <>
            <AppTitle
              loggedIn={this.state.loggedIn}
              studentAccess={this.state.studentAccess}
              setCreate={this.setCreate}
              setExecute={this.setExecute}
              setView={this.setView}
              clearStudents={this.clearStudents}
              doLogout={this.doLogout}
            ></AppTitle>
            <Alert variant="success"> Execute New Exam </Alert>;
            <ExamExecution username={this.state.username}></ExamExecution>
          </>
        );
      } else if (
        !this.state.createExam &&
        !this.state.executeExam &&
        this.state.viewResults
      ) {
        return (
          <>
            <AppTitle
              loggedIn={this.state.loggedIn}
              studentAccess={this.state.studentAccess}
              setCreate={this.setCreate}
              setExecute={this.setExecute}
              setView={this.setView}
              clearStudents={this.clearStudents}
              doLogout={this.doLogout}
            ></AppTitle>
            <Alert variant="success"> View Results Overview</Alert>;
            <StudentResults username={this.state.username}></StudentResults>
          </>
        );
      }
    } else if (!this.state.loggedIn && this.state.studentAccess) {
      return (
        <>
          <AppTitle
            loggedIn={this.state.loggedIn}
            studentAccess={this.state.studentAccess}
            setCreate={this.setCreate}
            setExecute={this.setExecute}
            setView={this.setView}
            studentOut={this.studentOut}
          ></AppTitle>
          <HomepageStudent studentId={this.state.studentId}></HomepageStudent>
        </>
      );
    }
  }
}

export default App;
