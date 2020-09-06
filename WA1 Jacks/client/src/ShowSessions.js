import React from "react";
import Container from "react-bootstrap/Container";
import SlotResults from "./SlotResults.js";

class ShowSessions extends React.Component {
  render() {
    return (
      <Container fluid>
        {this.props.arraySessions}
        <SlotResults
          availableSlots={this.props.availableSlots}
          totalSlots={this.props.totalSlots}
          sessions={this.props.sessions}
          sessionDays={this.props.sessionDays}
          startingHours={this.props.startingHours}
          sessionInfo={this.props.sessionInfo}
          username={this.props.username}
          selectedStudents={this.props.selectedStudents}
          setCreate={this.props.setCreate}
          studentIds={this.props.studentIds}
          clearStudents={this.props.clearStudents}
          slotDuration={this.props.slotDuration}
          totalDuration={this.props.totalDuration}
        ></SlotResults>
      </Container>
    );
  }
}

export default ShowSessions;
