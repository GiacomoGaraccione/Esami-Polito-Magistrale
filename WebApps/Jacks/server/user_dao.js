'use strict'

const User = require('./user');
const db = require('./db');
const bcrypt = require('bcrypt');


/**
 * Funzione che crea un utente partendo da una riga della tabella 'User'
 * @param {*} row 
 */
const createUser = function (row) {
    const id = row.Id;
    const username = row.Username;
    const hash = row.Hash;
    const frequent = row.Frequent;

    return new User(id, username, hash, frequent);
}


exports.getUser = function (username) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM User WHERE Username = ?" //viene scelto un utente in base al suo username (assunto unico per ciascun user)
        db.all(sql, [username], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const user = createUser(rows[0]); //crea un oggetto User con parametri ricavati grazie alla query sql
                resolve(user);
            }
        });
    });
};


exports.checkPassword = function (user, password) {
    let hash = bcrypt.hashSync(password, 10); //hashing della password ricevuta in fase di login

    return bcrypt.compareSync(password, user.hash); //confronto tra hash della password ricevuta e quello corrispondente all'utente nel database
}