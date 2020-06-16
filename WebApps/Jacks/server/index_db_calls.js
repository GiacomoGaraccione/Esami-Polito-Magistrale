'use strict';

const sqlite = require('sqlite3').verbose();

const DBSOURCE = './db/data.db';

const app = express();

const db = new sqlite.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }
});

app.get('/', (req, res) => {
    // read from database all the courses
    const sql = 'SELECT * FROM Vehicles';
    db.all(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows);
        const courses = rows.map((row) => ({
            code: row.code,
            name: row.name,
            CFU: row.CFU,
        }));
        // ALTERNATIVE:: const courses = rows.map((row)=>(row.code));
        res.json(courses);
    });
});