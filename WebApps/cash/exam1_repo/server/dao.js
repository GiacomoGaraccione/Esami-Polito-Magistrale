'use strict';

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
There is a nested query that selects all the cars with rentals either beginning or ending inside the timeframe of the requested rental.

select count(*) from cars where cars.category = 'A' and cars.id NOT IN (
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
        const sql = 'select count(*) from cars where cars.category = ? and cars.id NOT IN (' + 
            'select cars.id from rentals, cars ' + 
            'where cars.id = rentals.carId AND (' + 
            '(rentals.dateBeginning >= ? AND rentals.dateBeginning <= ?) OR (rentals.dateEnd >= ? AND rentals.dateEnd <= ?)' + 
            ' OR (rentals.dateBeginning <= ? AND rentals.dateEnd >= ?) ))';


        db.get(sql, [category, begDate, endDate, begDate, endDate, begDate, endDate], (err, row) => {
            if(err){
                console.log('error during available cars query', err);
                reject(err);
            }
            else{
                console.log('result', row['count(*)']);
                resolve(row['count(*)']);
            }
        });
    } );
}