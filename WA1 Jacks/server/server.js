const express = require("express");
const dao = require("./dao.js");
const cookieParser = require("cookie-parser");
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const expireTime = 1800;
const jwtSecret =
  "nfRdsLgEKmpveusyJttW4ruRR3ZkYaVsSOagpbLPgCNjH6BDOvS01vBkEL6HXlZIqTl1lbrJYvniVRECcU1TIuO8xExiWiAKRtG0BOAEc3aEQDvaZszXsovzAAr0rP";

const PORT = 3001;

const app = new express();

app.use(express.json());

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);

app.get("/api/courses", (req, res) => {
  dao
    .getCourses(req.query.student)
    .then((courses) => {
      res.json(courses);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: error }] });
    });
});

app.get("/api/slots/free", (req, res) => {
  dao
    .getFreeSlots(req.query.teacher, req.query.student)
    .then((slots) => {
      res.json(slots);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: error }] });
    });
});

app.post("/api/slots/book", (req, res) => {
  dao
    .bookSlot(req.query.teacher, req.body.slotInfo, req.body.studentId)
    .then(() => {
      res.end();
    })
    .catch(() => {
      res.status(500).json({ error: "Error while booking a slot" });
    });
});

app.get("/api/slots/booked", (req, res) => {
  dao
    .getBookedSlot(req.query.teacher, req.query.student)
    .then((slot) => {
      res.json(slot);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: error }] });
    });
});

app.get("/api/exams/completed", (req, res) => {
  dao
    .getCompletedExams(req.query.student)
    .then((exams) => {
      res.json(exams);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: error }] });
    });
});

app.get("/api/exams/future", (req, res) => {
  dao
    .getFutureExams(req.query.student)
    .then((exams) => {
      res.json(exams);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: error }] });
    });
});

app.post("/api/slots/cancel", (req, res) => {
  dao
    .deleteAppointment(req.query.teacher, req.body.slotInfo, req.body.studentId)
    .then(() => {
      res.end();
    })
    .catch(() => {
      res.status(500).json({ error: "Error while cancelling a reserved slot" });
    });
});

app.get("/api/exams/selected", (req, res) => {
  dao
    .getHasExam(req.query.teacher, req.query.student)
    .then((exam) => {
      res.json(exam);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: error }] });
    });
});

app.post("/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  dao
    .checkPassword(username, password)
    .then(() => {
      const token = jsonwebtoken.sign({ user: username }, jwtSecret, {
        expiresIn: expireTime,
      });
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 1000 * expireTime,
      });
      res.end();
    })
    .catch((err) => {
      console.log("Error in dao.checkPassword", err);
      res.status(401).end();
    });
});

//logout
app.post("/api/logout", (req, res) => {
  res.clearCookie("token").end();
});

app.use(cookieParser());

app.use(
  jwt({
    secret: jwtSecret,
    getToken: (req) => req.cookies.token,
    algorithms: ["HS256"],
  })
);

app.get("/api/course", (req, res) => {
  dao
    .getCourse(req.query.name)
    .then((course) => {
      res.json(course);
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: error }],
      });
    });
});

app.get("/api/students", (req, res) => {
  dao
    .getStudents(req.query.teacher)
    .then((students) => {
      res.json(students);
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: error }],
      });
    });
});

app.post("/api/slots", (req, res) => {
  //slot arrivano caricati correttamente
  dao
    .saveNewSlot(req.query.teacher, req.body.date, req.body.slotDuration)
    .then(() => {
      res.end();
    })
    .catch(() => {
      res.status(500).json({ error: "Error while saving a slot" });
    });
});

app.post("/api/appoint", (req, res) => {
  dao
    .saveNewStudent(req.query.teacher, req.body.id)
    .then(() => {
      res.end();
    })
    .catch(() => {
      res.status(500).json({ error: "Error while saving a slot" });
    });
});

app.get("/api/students/passed", (req, res) => {
  dao
    .getPassedStudents(req.query.teacher)
    .then((students) => {
      res.json(students);
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: error }],
      });
    });
});

app.get("/api/students/failed", (req, res) => {
  dao
    .getNotPassedStudents(req.query.teacher)
    .then((students) => {
      res.json(students);
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: error }],
      });
    });
});

app.get("/api/students/missing", (req, res) => {
  dao
    .getNotBookedStudents(req.query.teacher)
    .then((students) => {
      res.json(students);
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: error }],
      });
    });
});

app.get("/api/students/booked", (req, res) => {
  dao
    .getBookedStudents(req.query.teacher)
    .then((students) => {
      res.json(students);
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: error }],
      });
    });
});

app.post("/api/evaluate/absent", (req, res) => {
  dao
    .markAbsent(req.body.studentId, req.body.date, req.body.teacher)
    .then(() => {
      res.end();
    })
    .catch(() => {
      res.status(500).json({ error: "Error while saving a slot" });
    });
});

app.post("/api/evaluate/present", (req, res) => {
  dao
    .assignMark(
      req.body.studentId,
      req.body.date,
      req.body.teacher,
      req.body.mark
    )
    .then(() => {
      res.end();
    })
    .catch(() => {
      res.status(500).json({ error: "Error while saving a slot" });
    });
});
