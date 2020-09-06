"use strict";

const sqlite = require("sqlite3");

const db = new sqlite.Database("./data.db", (err) => {
  if (err) {
    console.log("Error while starting the database");
    throw err;
  }
});

exports.checkPassword = async function (username, password) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Teacher WHERE Name = ? AND Password = ?";
    db.get(sql, [username, password], (err, rows) => {
      if (err) {
        console.log("Error while performing login");
        console.log(err);
        reject(err);
      } else {
        if (rows["count(*)"] === 0) {
          console.log("Wrong credentials");
          reject();
        } else {
          resolve();
        }
      }
    });
  });
};

exports.getCourse = async function (username) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT Course FROM Teacher WHERE Name = ?";
    db.get(sql, [username], (err, rows) => {
      if (err) {
        console.log("Error");
        reject(err);
      } else {
        const name = rows.Course;
        resolve(name);
      }
    });
  });
};

exports.getStudents = async function (username) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT StudentId FROM CourseInfo WHERE TeacherId = (SELECT Id FROM Teacher WHERE Name = ?) AND Picked = FALSE";
    db.all(sql, [username], (err, rows) => {
      if (err) {
        console.log("Error");
        console.log(err);
        reject(err);
      } else {
        let students = rows.map((row) => row.StudentId);
        resolve(students);
      }
    });
  });
};

exports.saveNewSlot = async function (username, date, slotDuration) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Slot(SlotInfo, TeacherName, SlotLength) VALUES(?, ?, ?)";
    db.run(sql, [date, username, slotDuration], (err, row) => {
      if (err) {
        console.log("Error while saving in the database");
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.saveNewStudent = async function (username, id) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO EXAM(TeacherName, StudentId) VALUES(?, ?)";
    db.run(sql, [username, id], (err, row) => {
      if (err) {
        console.log("Error while saving in the database");
        reject(err);
      } else {
        resolve();
      }
      const sql2 =
        "UPDATE CourseInfo SET Picked = TRUE  WHERE StudentId = ? AND TeacherId = (SELECT Id  FROM Teacher WHERE Name = ?)";
      db.run(sql2, [id, username], (err, row) => {
        if (err) {
          console.log("Error while saving in the database");
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};

exports.getCourses = async function (id) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT Name, Course, Passed FROM Teacher, CourseInfo WHERE Teacher.Id = CourseInfo.TeacherId AND StudentId = ?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        console.log("Error");
        console.log(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.getFreeSlots = async function (username, studentId) {
  return new Promise((resolve, reject) => {
    const sql =
      "Select SlotInfo, SlotLength FROM Slot WHERE StudentId IS NULL AND TeacherName = ? AND TeacherName IN (SELECT TeacherName FROM Exam WHERE StudentId = ?)";
    db.all(sql, [username, studentId], (err, rows) => {
      if (err) {
        console.log("Error");
        console.log(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.bookSlot = async function (username, slotInfo, studentId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Slot SET StudentId = ? WHERE SlotInfo = ? AND TeacherName = ?";
    db.run(sql, [studentId, slotInfo, username], (err, row) => {
      if (err) {
        console.log("Error while saving a booked slot in the database");
        reject(err);
      } else {
        resolve();
      }
    });
    const sql2 =
      "UPDATE Exam SET Date = ? WHERE TeacherName = ? AND StudentId = ?";
    db.run(sql2, [slotInfo, username, studentId], (err, row) => {
      if (err) {
        console.log("Error while saving a booked slot in the database");
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.getBookedSlot = async function (username, studentId) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT SlotInfo FROM Slot WHERE TeacherName = ? AND StudentId = ?";
    db.all(sql, [username, studentId], (err, rows) => {
      if (err) {
        console.log("Error");
        console.log(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.getCompletedExams = async function (studentId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Exam WHERE StudentId = ? AND Mark IS NOT NULL";
    db.all(sql, [studentId], (err, rows) => {
      if (err) {
        console.log("Error");
        console.log(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.getFutureExams = async function (studentId) {
  //SELECT *
  //FROM Exam
  //WHERE StudentId = 280101 AND Mark IS NULL AND StudentId NOT IN (SELECT StudentId FROM Slot WHERE StudentID IS NOT NULL)
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM Exam WHERE StudentId = ? AND Mark IS NULL AND Date IS NOT NULL";
    db.all(sql, [studentId], (err, rows) => {
      if (err) {
        console.log("Error");
        console.log(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.deleteAppointment = async function (teacherName, slotInfo, studentId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Slot SET StudentId = NULL WHERE StudentId = ? AND TeacherName = ? AND SlotInfo = ?";
    const sql2 =
      "UPDATE Exam SET Date = NULL WHERE StudentId = ? AND TeacherName = ? AND Date = ?";
    db.run(sql, [studentId, teacherName, slotInfo], (err, row) => {
      if (err) {
        console.log("Error while cancelling a booked slot in the database");
        reject(err);
      } else {
        resolve();
      }
    });
    db.run(sql2, [studentId, teacherName, slotInfo], (err, row) => {
      if (err) {
        console.log("Error while cancelling a booked slot in the database");
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.getHasExam = async function (teacherName, studentId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT Id FROM Exam WHERE TeacherName = ? AND StudentId = ?";
    db.all(sql, [teacherName, studentId], (err, rows) => {
      if (err) {
        console.log("Error");
        console.log(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.getPassedStudents = async function (username) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT StudentId, Mark FROM Exam WHERE TeacherName = ? AND Mark IS NOT NULL";
    db.all(sql, [username], (err, rows) => {
      if (err) {
        console.log("Error");
        console.log(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.getNotPassedStudents = async function (username) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT StudentId, Date FROM Exam WHERE TeacherName = ? AND Mark IS NULL AND Date IS NOT NULL";
    db.all(sql, [username], (err, rows) => {
      if (err) {
        console.log("Error");
        console.log(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.getNotBookedStudents = async function (username) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT StudentId, Date FROM Exam WHERE TeacherName = ? AND Mark IS NULL AND Date IS NULL";
    db.all(sql, [username], (err, rows) => {
      if (err) {
        console.log("Error");
        console.log(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.getBookedStudents = async function (username) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT StudentId, Date FROM Exam WHERE TeacherName = ? AND Mark IS NULL AND Date IS NOT NULL ";
    db.all(sql, [username], (err, rows) => {
      if (err) {
        console.log("Error");
        console.log(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.markAbsent = async function (studentId, date, username) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Exam SET Mark = 'Absent' WHERE Date = ? AND StudentId = ? AND TeacherName = ?";
    const sql2 =
      "UPDATE CourseInfo SET Picked = FALSE WHERE StudentId = ? AND TeacherId = (SELECT TeacherId FROM Teacher WHERE Name = ?)";
    db.run(sql, [date, studentId, username], (err, row) => {
      if (err) {
        console.log("Error while registering a mark");
        reject(err);
      } else {
        resolve();
      }
    });
    db.run(sql2, [studentId, username], (err, row) => {
      if (err) {
        console.log("Error while registering a mark");
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.assignMark = async function (studentId, date, username, mark) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Exam SET Mark = ? WHERE Date = ? AND StudentId = ? AND TeacherName = ?";
    db.run(sql, [mark, date, studentId, username], (err, row) => {
      if (err) {
        console.log("Error while registering a mark");
        reject(err);
      } else {
        resolve();
      }
    });
    if (mark !== "Fail" && mark !== "Withdraw") {
      const sql2 =
        "UPDATE CourseInfo SET Passed = TRUE WHERE StudentId = ? AND TeacherId = (SELECT Id  FROM Teacher WHERE Name = ?)";
      db.run(sql2, [studentId, username], (err, row) => {
        if (err) {
          console.log("Error while registering a mark");
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      const sql2 =
        "UPDATE CourseInfo SET Picked = False WHERE StudentId = ? AND TeacherId = (SELECT Id  FROM Teacher WHERE Name = ?)";
      db.run(sql2, [studentId, username], (err, row) => {
        if (err) {
          console.log("Error while registering a mark");
          reject(err);
        } else {
          resolve();
        }
      });
    }
  });
};
