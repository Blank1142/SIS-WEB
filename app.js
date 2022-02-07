require("dotenv").config();
const express = require("express");
const sql = require("mysql");
const ejs = require("ejs");
const path = require("path");
const bodyparser = require("body-parser");
const cookieParese=require('cookie-parser');

const session=require('express-session')
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParese());
app.use(bodyparser.json());
app.set("view engine", "ejs");


//connection
/*
const pool = sql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true,
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


//ccc
pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("connection ID " + connection.threadId);
  connection.release();

});

const routes = require("./server/routs/user");
app.use("/", routes);


const admin=require('./server/routs/admin');
app.use('/Admin',admin)

//

app.listen(process.env.PORT || 5000, () => {
  console.log("connected to server");
});
