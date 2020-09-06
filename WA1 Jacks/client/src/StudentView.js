import React from "react";
import API from "./API/API.js";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

class StudentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      freeSlots: [],
      showFree: false,
      haveExam: true,
      booked: false,
      showModal: false,
    };
  }

  componentDidMount() {
    API.getFreeSlots(this.props.teacherName, this.props.studentId).then((s) => {
      this.setState({ freeSlots: s, showFree: true });
      if (s.length === 0) {
        //se non ci sono slot liberi si controlla se è perchè lo studente non è stato scelto per fare un esame orale (diverso messaggio mostrato in pagina)
        API.getHasExam(this.props.teacherName, this.props.studentId).then(
          (s) => {
            if (s.length === 0) {
              this.setState({ haveExam: false });
            }
          }
        );
      }
    });
    API.getBooked(this.props.teacherName, this.props.studentId).then((s) => {
      if (s.length > 0) {
        this.setState({ booked: true });
      }
    });
  }

  createRow = (s) => {
    return (
      <tr>
        <td> {s.SlotInfo} </td>
        <td> {s.SlotLength} </td>
        <td>
          {" "}
          <Button onClick={() => this.onClickBook(s.SlotInfo)}>
            {" "}
            Book Slot{" "}
          </Button>
        </td>
      </tr>
    );
  };

  onClickBook = (slotInfo) => {
    //API di update della tabella
    API.bookSlot(slotInfo, this.props.teacherName, this.props.studentId).then(
      () => {
        this.setState({ showModal: true, booked: true });
      }
    );
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      freeSlots: [],
      showFree: false,
    });
  };

  render() {
    if (!this.props.passedExam) {
      //controllo su superamento esame è prioritario rispetto a controllo scelto/prenotato
      if (!this.state.booked && this.state.freeSlots.length > 0) {
        return (
          <>
            <h4> Book an exam slot for the course {this.props.courseName} </h4>
            {this.state.freeSlots.length > 0 && (
              <Table hover={true} bordered striped={true} size="sm">
                <thead>
                  <tr>
                    <th> Slot Date and Time</th>
                    <th> Slot Duration </th>
                    <th> Book Slot </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.freeSlots.map((s) => this.createRow(s))}
                </tbody>
              </Table>
            )}
          </>
        );
      } else if (this.state.booked) {
        return (
          <h4>
            {" "}
            You have already booked an exam slot for the course{" "}
            {this.props.courseName}
          </h4>
        );
      } else if (this.state.freeSlots.length === 0 && this.state.haveExam) {
        return (
          <Alert variant="danger">
            {" "}
            There are no more exam slots left for the course{" "}
            {this.props.courseName}
          </Alert>
        );
      } else if (!this.state.haveExam) {
        return (
          <h4>
            {" "}
            You haven't been selected to take an oral exam for the course{" "}
            {this.props.courseName}
          </h4>
        );
      }
    } else {
      return (
        <Alert variant="success">
          {" "}
          You already have passed the course {this.props.courseName}
        </Alert>
      );
    }
  }
}

export default StudentView;
