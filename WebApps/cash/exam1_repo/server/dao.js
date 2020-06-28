'use strict';

const moment = require('moment');
const sqlite = require('sqlite3');

const db = new sqlite.Database('./data/car_rental.db', (err) => {
    if(err){
        console.log('error in starting the database');
        throw err;
    }
});

exports.getAllCars = async function() {
    return new Promise( (resolve, reject) => {
        const sql = 'select * from cars';
        db.all(sql, [], (err, rows) => {
            if (err){
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    } );
}

exports.checkUserPwd = async function(username, pwd) {
    return new Promise( (resolve, reject) => {
        const sql = "select count(*) from users where username = ? and password = ?";
        db.get(sql, [username, pwd], (err, rows) => {
            if (err){
                console.log('erorr during login');
                console.log(err);
                reject(err);
            }
            else {
                if(rows['count(*)'] === 0){
                    console.log('wrong credentials');
                    reject();
                }
                else{
                    resolve();
                }
            }
        });
    } );
}


/*
this query selects the ids from the cars available in those dates (and of the right category).
There is a nested query that selects all the cars with rentals overlapping the request dates.

select cars.id from cars where cars.category = 'A' and cars.id NOT IN (
	select cars.id from rentals, cars 
	where cars.id = rentals.carId AND (
        (rentals.dateBeginning >= "2019-12-30" AND rentals.dateBeginning <= "2020-02-13")
        OR
        (rentals.dateEnd >= "2019-12-30" AND rentals.dateEnd <= "2020-02-13")
		OR
		(rentals.dateBeginning <= "2019-12-30" AND rentals.dateEnd >= "2020-02-13")
    )
)
*/
exports.getAvailableCars = async function(category, begDate, endDate){
    return new Promise( (resolve, reject) => {
        const sql = 'select cars.id from cars where cars.category = ? and cars.id NOT IN (' + 
            'select cars.id from rentals, cars ' + 
            'where cars.id = rentals.carId AND (' + 
            '(rentals.dateBeginning >= ? AND rentals.dateBeginning <= ?) OR (rentals.dateEnd >= ? AND rentals.dateEnd <= ?)' + 
            ' OR (rentals.dateBeginning <= ? AND rentals.dateEnd >= ?) ))';


        db.all(sql, [category, begDate, endDate, begDate, endDate, begDate, endDate], (err, rows) => {
            if(err){
                console.log('error during available cars query', err);
                reject(err);
            }
            else{
                resolve(rows);
            }
        });
    } );
}

exports.getUserRentals = async function(user){
    return new Promise( (resolve, reject) => {
        const sql = 'select rentals.id, carId, dateBeginning, dateEnd, userId from rentals, users where rentals.userId = users.id and users.username = ?';

        db.all(sql, [user], (err, rows) => {
            if(err){
                console.log('db error during getUserRentals', err);
                reject(err);
            }
            else{
                resolve(rows);
            }
        })
    } );
}

exports.saveNewRental = async function(carId, dateBeginning, dateEnd, username){
    return new Promise( (resolve, reject) => {
        if( !checkDates(dateBeginning, dateEnd) ){
            console.log('error in dao.js new rental: dates not valid');
            reject();
        }

        const sql = 'select id from users where username = ?';

        db.get(sql, [username], (err, row) => {
            if(err){
                console.log('error: username not found');
                reject(err);
            }
            else{
                let userId = row['id']; 
                
                const sqlInsert = 'insert into rentals(carId, dateBeginning, dateEnd, userId) values(?, ?, ?, ?)';

                db.run(sqlInsert, [carId, dateBeginning, dateEnd, userId], (err) => {
                    if(err){
                        console.log('error inserting rental into database');
                        reject(err);
                    }
                    else{
                        resolve();
                    }
                });
            }
        });
    } );
}

function checkDates(begDate, endDate) {
    let beg = moment(begDate, 'YYYY-MM-DD');
    let end = moment(endDate, 'YYYY-MM-DD');
    let today = moment().format('YYYY-MM-DD');

    if(beg.isSameOrBefore(end) && beg.isSameOrAfter(today)){
        return true;
    }
    return false;
}

exports.deleteRental = async function(id){
    return new Promise( (resolve, reject) => {
        const sql = 'delete from rentals where rentals.id = ?';

        db.run(sql, [id], (err) => {
            if(err){
                console.log('error in dao.js deleteRental', err);
                reject(err);
            }
            else{
                resolve();
            }
        })
    } );
}

exports.isUserPresent = async function(userName){
    return new Promise( (resolve, reject) => {
        const sql = 'select count(*) from users where username = ?';

        db.get(sql, [userName], (err, row) => {
            if(err){
                console.log('dao.js database error in isUserPresent');
                reject(err);
            }
            else{
                if(row['count(*)'] === 0){
                    resolve(false);
                }
                else{
                    resolve(true);
                }
            }
        })
    } )
}