import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import moment from "moment";
import API from "./API/API.js";

class SlotResults extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      correctDateTime: true,
    };
  }

  onClickButton = () => {
    let slotDuration = 60 / this.props.slotsPerHour;
    if (
      this.props.sessionDays.length < this.props.sessions ||
      this.props.startingHours.length < this.props.sessions
    ) {
      this.setState({ correctDateTime: false });
    } else {
      for (let i = 0; i < this.props.sessions; i++) {
        //ogni singola sessione ha la sua lunghezza in ore
        let date = this.props.sessionDays[i];
        let startingHour = this.props.startingHours[i];
        let totalDuration = this.props.totalDuration;
        let slotDuration = this.props.slotDuration;
        //let hours = this.props.hoursPerSession[i];
        let dateHour = date + " " + startingHour;
        for (let j = 0; j < totalDuration / slotDuration; j++) {
          if (j === 0) {
            //primo slot, non serve sommare slotDuration
            API.postNewSlot(this.props.username, dateHour, slotDuration)
              .then(() => {
                console.log("Slot saved succesfully");
              })
              .catch((err) => {
                console.log("Error while saving slots");
              });
          } else {
            //sommare slotDuration per slot successivi
            let newHour = moment(dateHour, "YYYY-MM-DD HH:mm")
              .add(slotDuration, "minutes")
              .format("YYYY-MM-DD HH:mm");
            dateHour = newHour;
            API.postNewSlot(this.props.username, newHour, slotDuration)
              .then(() => {
                console.log("Slot saved succesfully");
              })
              .catch((err) => {
                console.log("Error while saving slots");
              });
          }
        }
      }
      //dopo aver salvato gli slot bisogna registrare gli studenti scelti
      for (let i = 0; i < this.props.studentIds.length; i++) {
        API.postNewStudent(this.props.username, this.props.studentIds[i])
          .then(() => {
            console.log("Student correctly appointed to oral exam");
          })
          .catch((err) => {
            console.log("Error while appointing a student");
          });
      }
      this.props.clearStudents();
      this.props.setCreate(false); //dopo aver salvato gli slot si viene reindirizzati alla homepage del professore
      this.setState({ correctDateTime: true });
    }
  };

  render() {
    if (this.props.totalSlots > 0 && this.props.sessions > 0) {
      if (this.props.availableSlots < 0) {
        return (
          <Alert variant="danger">
            {" "}
            Number of slots is not enough! ({this.props.availableSlots})
          </Alert>
        );
      } else {
        return (
          <>
            <Alert variant="success">
              {" "}
              Number of available slots: {this.props.availableSlots}{" "}
            </Alert>
            <Button onClick={() => this.onClickButton()}>Save exam</Button>
            {!this.state.correctDateTime && (
              <Alert variant="danger">
                {" "}
                Please insert date and starting hour for all exam sessions{" "}
              </Alert>
            )}
          </>
        );
      }
    } else {
      return null;
    }
  }
}

export default SlotResults;
