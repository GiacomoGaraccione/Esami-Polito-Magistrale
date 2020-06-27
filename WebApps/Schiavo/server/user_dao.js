const User = require('./user');
const db = require('./db');

const createUser = function (row) {
    const email = row.email;
    const password= row.password;
    const frequentCustomer= row.frequent_customer;
    const fullName= row.full_name;
    const cardNumber= row.card_number;
    const cvv = row.cvv;

   
    return new User(email,password,frequentCustomer,fullName,cardNumber,cvv);
}

exports.getUser = function (email) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM user WHERE email = ?"
        db.all(sql, [email], (err, rows) => {
            if (err) 
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
  };

exports.updateFrequent=function(email){
    return new Promise((resolve,reject)=>{
        const sql = "UPDATE user SET frequent_customer = 'true' WHERE email =?"
        db.run(sql,[email],(err)=>{
            if(err){
                reject(err)
            }
            else{
                resolve("update");
            }
        })
    })
}


