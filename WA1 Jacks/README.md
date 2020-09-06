# Exam #3: "Exam Scheduling"
## Student: s280101 Garaccione Giacomo 

## React client application routes

- Route `/home`: the entire application


## REST API server

- GET `/api/courses`
  - Request parameters: id of a student
  - Request body content: none
  - Response body content: list of courses where the student is enrolled
- GET `/api/slots/free`
  - Request parameters: username of a teacher, id of a student
  - Request body content: none
  - Response body content: list of free slots for an exam taught by the teacher in a course in which the student is enrolled
- POST `/api/slots/book`
  - Request parameters: username of a teacher
  - Request body content: id of a student, information about a slot(date and time)
  - Response body content: none
- GET `/api/slots/booked`
  - Request parameters: username of a teacher, id of a student
  - Request body content: none
  - Response body content: slot information(date and time) for a slot booked by the student in the course taught by the teacher
- GET `/api/exams/completed`
  - Request parameters: id of a student
  - Request body content: none
  - Response body content: list of all exams completed by the student
- GET `/api/exams/future`
  - Request parameters: id of a student
  - Request body content: none
  - Response body content: list of all exams booked by the student but not yet passed
- POST `/api/slots/cancel`
  - Request parameters: username of a teacher
  - Request body content: id of a student, information about a slot(date and time)
  - Response body content: none
- GET `/api/exams/selected`
  - Request parameters: username of a teacher, id of a student
  - Request body content: none
  - Response body content: information whether a student is selected by the teacher to take an oral exam or not
- POST `/login`
  - Request parameters: none
  - Request body content: username of a teacher, password of said teacher
  - response body content: none
- POST `/logout`
  - Request parameters: none
  - Request body content: none
  - response body content: none
All APIs from here on require authentication
- GET `/api/course`
  - Request parameters: username of a teacher
  - Request body content: none
  - Response body content: the name of the course taught by the teacher
- GET `/api/students`
  - Request parameters: username of a teacher
  - Request body content: none
  - Response body content: the list of all students that haven't passed yet the course of the teacher and that have not been picked yet for an oral exam
- POST `/api/slots`
  - Request parameters: username of a teacher
  - Request body content: date of the oral exam and length of a slot
  - Response body content: none
- POST `/api/appoint`
  - Request parameters: username of a teacher
  - Request body content: id of a student
  - Response body content: none
- GET `/api/students/passed`
  - Request parameters: username of a teacher
  - Request body content: none
  - Response body content: the list of all students that have already passed the course of the teacher
- GET `/api/students/failed`
  - Request parameters: username of a teacher
  - Request body content: none
  - Response body content: the list of all students that have already booked a slot for an exam but have yet to receive a mark
- GET `/api/students/missing`
  - Request parameters: username of a teacher
  - Request body content: none
  - Response body content: the list of all students that have been chosen for an oral exam but have yet to book a slot
- GET `/api/students/booked`
  - Request parameters: username of a teacher
  - Request body content: none
  - Response body content: the list of all students that have already booked a slot for an exam but have yet to receive a mark
- POST `/api/evaluate/absent`
  - Request parameters: none
  - Request body content: username of a teacher, id of a student, date and time of an exam slot
  - Response body content: none
- POST `/api/evaluate/present`
  - Request parameters: none
  - Request body content: username of a teacher, id of a student, date and time of an exam slot, mark assigned to the student
  - Response body content: none

## Server database

- Table `CourseInfo` - Contains information about teacher-student pairs to know which students are enrolled in which course, if a student has already passed that course or if he/she has been picked to take the oral exam.
- Table `Exam` - Contains information about exams, specifically: student and teacher associated, chosen date and time for the exam(NULL if a student has not chosen a slot yet) and mark assigned to the student(NULL if a teacher has not assigned a mark yet).
- Table `Slot` - Contains information about exam slots (date, length, student and the name of the teacher that created it). The StudentId field is NULL if a slot is still available to be chosen by students.
- Table `Student` - Contains the student Id for each registered student.
- Table `Teacher` - Contains login information about Teachers (username and password) and the name of the course taught by each teacher.



## Main React Components

- `AbsentButton` (in `AbsentButton.js`): button used in the exam evaluation page to mark a student as Absent.
- `AddStudentButton` (in `AddStudentButton.js`): checkbox used in the beginning of the page defining an exam slot to select/deselect a student from the list of eligible students to take the oral exam.
- `ExamExecution` (in `ExamExecution.js`): a table containing all the students that booked a slot for an oral exam, shows for each student the booked slot, buttons to assign a mark and said mark, after it has been assigned.
- `GradeModal` (in `GradeModal.js`): modal that pops up when choosing to assign a mark to a student. Allows the teacher to choose a vote and confirm it, or to mark a student with 'Fail' or 'Withdraw'. Assigning one of these grades removes the modal.
- `HomepageStudent` (in `HomepageStudent.js`): page shown after a student logs in. Renders the buttons that allow to book an exam slot and to view booked slots (showing both slots with a mark and slots yet to come), as well as the pages that implement said functionalities. The page showing all booked slots contains a table of all results obtained and a table of all slots that are booked but without a mark, with a button that allows to delete the appointment.
- `HomepageTeacher` (in `HomepageTeacher.js`): page shown after a teacher logs in. Renders the buttons that lead to the three teacher functions (creating a new exam, executing an oral exam and viewing an overview of the results).
- `LoginForm` (in `LoginForm.js`): form used to allow login for a teacher.
- `PresentButton` (in `PresentButton.js`): button used in the exam evaluation page to show the modal that allows deciding a mark for a student.
- `SessionCount` (in `SessionCount.js`): allows a teacher to decide the number of exam sessions, creating an array of `SessionSettings`, one for each different session 
- `SessionSettings` (in `SessionSettings.js`): form that allows a teacher to choose date, starting hour and length (multiple of the chosen slot length). Every time the session length changes the number of available slots gets updated, counting different sessions together in the calculation of available slots.
- `ShowBooking` (in `ShowBooking.js`): returns, for each course followed by a student, the table created by `StudentView`.
- `ShowSessions` (in `ShowSessions.js`): returns the array of `SessionSettings` for all the sessions decided by the teacher.
- `SlotResults` (in `SlotResuls.js`): returns the difference between selected students and available exam slot, updating in real time when a teacher changes the length of one or more sessions. If the difference is 0 or greater it also shows a button that allows saving of the defined slots.
- `SlotSettings` (in `SlotSettings.js`): allows the definition of slot length (in minutes). Once said length is greater than 0 it shows a button used to confirm the chosen lenght and selected students, while an error message is shown if there are no students selected.
- `StudentForm` (in `StudentForm.js`): form used to allow login for a student. Does not require authentication but simply the student ID.
- `StudentList` (in `StudentList.js`): returns a table containing all the students that follow a course and that haven't been yet selected to take an oral exam (and thus have not yet passed the exam). `AddStudentButton` is present for each student to pick/unpick a student for the oral exam.
- `StudentResults` (in `AbsentButton.js`): page that shows the results overview for a teacher. Contains a table of all students that have passed the exam, one of all selected students that have booked a slot but have yet to receive a mark and one of all students that are selected to take an oral exam but have not yet picked a slot.
- `StudentView` (in `StudentView.js`): returns, for a single course followed by a student, the table of all available slots for a course the student has been picked to take the oral exam and the button to book said slot, or a message if the student has alreay passed the exam, has already booked a slot for the course or has not been picked for the oral exam.
- `ShowSessions` (in `ShowSessions.js`): returns the array of `SessionSettings` for all the sessions decided by the 


## Screenshot

![Configurator Screenshot](./img/Slot_Screenshot.png)

## Test users

### Teachers
* ProfName1, Password1
* ProfName2, Password2

### Students, first course
* 280101
* 280114
* 250000
### Students, second course
* 233694
* 249064
* 260321
