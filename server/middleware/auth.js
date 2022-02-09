const jwt = require('jsonwebtoken')
const { promisify } = require('util');
const sql = require('mysql')

/*
const pool = sql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true
});

*/
const pool = sql.createPool({
  connectionLimit: 100,
  host: process.env.DEMO_DB_HOST,
  user: process.env.DEMP_DB_USER,
  password: process.env.DEMO_DB_PASSWORD,
  database: process.env.DEMO_DB,
  multipleStatements: true,
});





///Auth

exports.islogin = async (req, res, next) => {

//checking for Cookie
    if (req.cookies.sis) {
        try {
            
            const decode = await promisify(jwt.verify)(req.cookies.sis, process.env.JWT_SECREAT);
            
            //connecting to DB
            pool.getConnection((error, connection) => {
                if (error) throw error;
                //Sql query to check employee
                pool.query("SELECT emp_id,emp_name,emp_email,role_name FROM Employee_info WHERE emp_id=? && emp_status='Active'", [decode.id], (err, result) => {
                    connection.release();
 
 console.log(err)
                    if (!result) {
                      
                        return next();
                    }
                    req.user = result[0];
                    return (next());
                })
            })
        } catch (err) {
            console.log(err);
            return next();

        }
    }

    else {
        next();
    }

}