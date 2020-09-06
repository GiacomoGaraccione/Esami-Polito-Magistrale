async function getCourses(studentId) {
  let url = "/api/courses?student=" + studentId;

  const response = await fetch(url);
  const coursesJson = await response.json();

  if (response.ok) {
    return coursesJson;
  } else {
    let err = { status: response.status, errObj: coursesJson };
    throw err;
  }
}

async function getFreeSlots(username, studentId) {
  let url = "/api/slots/free?teacher=" + username + "&student=" + studentId;

  const response = await fetch(url);
  const slotsJson = await response.json();

  if (response.ok) {
    return slotsJson;
  } else {
    let err = { status: response.status, errObj: slotsJson };
    throw err;
  }
}

async function bookSlot(slotInfo, username, studentId) {
  return new Promise((resolve, reject) => {
    let url = "/api/slots/book?teacher=" + username;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ slotInfo: slotInfo, studentId: studentId }),
    })
      .then((res) => {
        if (res.ok) {
          resolve();
        } else {
          reject(res);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function getBooked(username, studentId) {
  let url = "/api/slots/booked?teacher=" + username + "&student=" + studentId;

  const response = await fetch(url);
  const bookedJson = await response.json();

  if (response.ok) {
    return bookedJson;
  } else {
    let err = { status: response.status, errObj: bookedJson };
    throw err;
  }
}

async function getCompletedExams(studentId) {
  let url = "/api/exams/completed?student=" + studentId;

  const response = await fetch(url);
  const examsJson = await response.json();

  if (response.ok) {
    return examsJson;
  } else {
    let err = { status: response.status, errObj: examsJson };
    throw err;
  }
}

async function getFutureExams(studentId) {
  let url = "/api/exams/future?student=" + studentId;

  const response = await fetch(url);
  const examsJson = await response.json();

  if (response.ok) {
    return examsJson;
  } else {
    let err = { status: response.status, errObj: examsJson };
    throw err;
  }
}

async function deleteAppointment(slotInfo, teacherName, studentId) {
  return new Promise((resolve, reject) => {
    let url = "/api/slots/cancel?teacher=" + teacherName;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ slotInfo: slotInfo, studentId: studentId }),
    })
      .then((res) => {
        if (res.ok) {
          resolve();
        } else {
          reject(res);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function getHasExam(teacherName, studentId) {
  let url =
    "/api/exams/selected?student=" + studentId + "&teacher" + teacherName;

  const response = await fetch(url);
  const examJson = await response.json();

  if (response.ok) {
    return examJson;
  } else {
    let err = { status: response.status, errObj: examJson };
    throw err;
  }
}

async function login(username, password) {
  return new Promise((resolve, reject) => {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => {
        if (response.ok) {
          resolve();
        } else {
          reject(response);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function logout() {
  return new Promise((resolve, reject) => {
    fetch("/api/logout", {
      method: "POST",
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        reject(response);
      }
    });
  });
}

async function getCourse(username) {
  let url = "/api/course?name=" + username;

  const response = await fetch(url);
  const courseJson = await response.json();

  if (response.ok) {
    return courseJson;
  } else {
    let err = { status: response.status, errObj: courseJson };
    throw err;
  }
}

async function getStudents(username) {
  let url = "/api/students?teacher=" + username;

  const response = await fetch(url);
  const studentsJson = await response.json();

  if (response.ok) {
    return studentsJson;
  } else {
    let err = { status: response.status, errObj: studentsJson };
    throw err;
  }
}

async function postNewSlot(username, date, slotDuration) {
  return new Promise((resolve, reject) => {
    let url = "/api/slots?teacher=" + username;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ date: date, slotDuration: slotDuration }),
    })
      .then((res) => {
        if (res.ok) {
          resolve();
        } else {
          reject(res);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function postNewStudent(username, id) {
  return new Promise((resolve, reject) => {
    let url = "/api/appoint?teacher=" + username;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => {
        if (res.ok) {
          resolve();
        } else {
          reject(res);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function getPassedStudents(username) {
  let url = "/api/students/passed?teacher=" + username;

  const response = await fetch(url);
  const studentsJson = await response.json();

  if (response.ok) {
    return studentsJson;
  } else {
    let err = { status: response.status, errObj: studentsJson };
    throw err;
  }
}

async function getNotPassedStudents(username) {
  let url = "/api/students/failed?teacher=" + username;

  const response = await fetch(url);
  const studentsJson = await response.json();

  if (response.ok) {
    return studentsJson;
  } else {
    let err = { status: response.status, errObj: studentsJson };
    throw err;
  }
}

async function getNotBookedStudents(username) {
  let url = "/api/students/missing?teacher=" + username;

  const response = await fetch(url);
  const studentsJson = await response.json();

  if (response.ok) {
    return studentsJson;
  } else {
    let err = { status: response.status, errObj: studentsJson };
    throw err;
  }
}

async function getBookedStudents(username) {
  let url = "/api/students/booked?teacher=" + username;

  const response = await fetch(url);
  const studentsJson = await response.json();

  if (response.ok) {
    return studentsJson;
  } else {
    let err = { status: response.status, errObj: studentsJson };
    throw err;
  }
}

async function markAbsent(studentId, date, username) {
  return new Promise((resolve, reject) => {
    let url = "/api/evaluate/absent";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        studentId: studentId,
        date: date,
        teacher: username,
      }),
    })
      .then((res) => {
        if (res.ok) {
          resolve();
        } else {
          reject(res);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function assignMark(studentId, date, username, mark) {
  return new Promise((resolve, reject) => {
    let url = "/api/evaluate/present";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        studentId: studentId,
        date: date,
        teacher: username,
        mark: mark,
      }),
    })
      .then((res) => {
        if (res.ok) {
          resolve();
        } else {
          reject(res);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

const API = {
  login,
  logout,
  getCourse,
  getStudents,
  postNewSlot,
  postNewStudent,
  getCourses,
  getFreeSlots,
  bookSlot,
  getBooked,
  getCompletedExams,
  getFutureExams,
  deleteAppointment,
  getHasExam,
  getPassedStudents,
  getNotPassedStudents,
  getNotBookedStudents,
  getBookedStudents,
  markAbsent,
  assignMark,
};

export default API;
