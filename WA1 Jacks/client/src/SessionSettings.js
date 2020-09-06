import React from "react";
import Form from "react-bootstrap/Form";
import moment from "moment";

class SessionSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prevDuration: 0,
      examDate: undefined,
      today: undefined,
      startingHour: undefined,
    };
  }

  componentDidMount() {
    let today = moment().format("YYYY-MM-DD");
    this.setState({ today: today }); //fa si che il calendario da cui scegliere le date non prenda giorni precedenti alla data attuale
  }

  onChangeExamDay = (event) => {
    this.setState({ examDate: event.target.value });
    this.props.sessionDays[this.props.sessionNumber] = event.target.value;
  };

  onChangeHour = (event) => {
    this.setState({ startingHour: event.target.value });
    this.props.startingHours[this.props.sessionNumber] = event.target.value;
  };

  onChangeDuration = (event) => {
    let duration = event.target.value;
    let oldDuration = parseInt(this.state.prevDuration, 10);
    this.props.sessionLengths[this.props.sessionNumber] = event.target.value;
    this.props.sessionInfo[this.props.sessionNumber] = duration; //assegna il numero di ore alla posizione corrispondente al componente
    if (duration > oldDuration) {
      this.props.increaseTotal(true, duration);
    } else {
      this.props.increaseTotal(false, duration);
    }

    this.setState({ prevDuration: duration });
  };

  componentDidUpdate(prevProps) {
    let duration = this.props.examDuration;
    let selectedStudents = this.props.selectedStudents;
    let slotDuration = this.props.slotDuration;
    let sessionNumber = this.props.sessions;
    if (
      duration === prevProps.examDuration &&
      selectedStudents === prevProps.selectedStudents &&
      slotDuration === prevProps.slotDuration
    ) {
      return;
    } else {
      if (sessionNumber === prevProps.sessions) {
        //se le sessioni non sono cambiate aggiorna il conto slot liberi
        if (
          duration > this.state.prevDuration ||
          duration.length > this.state.prevDuration.length
        ) {
          this.props.increaseTotal(true);
        } else {
          this.props.increaseTotal(false);
        }
      }

      this.setState({ prevDuration: duration });
    }
  }

  render() {
    if (this.props.slotDuration > 0 && this.props.selectedStudents > 0) {
      return (
        <>
          <Form>
            <Form.Group controlId="date">
              <Form.Label> Day of Exam Session </Form.Label>
              <Form.Control
                type="date"
                min={this.state.today}
                onChange={(event) => {
                  this.onChangeExamDay(event);
                }}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="time">
              <Form.Label> Starting Hour of Exam Session </Form.Label>
              <Form.Control
                type="time"
                onChange={(event) => {
                  this.onChangeHour(event);
                }}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="duration">
              <Form.Label> Duration of Exam Session </Form.Label>
              <Form.Control
                type="number"
                step={this.props.slotDuration} //permette di scegliere solo multipli della lunghezza di uno slot
                onChange={(event) => this.onChangeDuration(event)}
              ></Form.Control>
            </Form.Group>
          </Form>
        </>
      );
    } else {
      return null;
    }
  }
}

export default SessionSettings;
