const sql = require("mysql");
const md5 = require("md5");
const mail = require("../notif/account");
const twil = require("../notif/twil");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
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




//

exports.view = (req, res) => {
  if (req.user) {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("connection ID " + connection.threadId);

      pool.query(
        'SELECT * FROM Employee_info WHERE emp_status="Active"',
        (err, rows) => {
          
          connection.release();

          if (!err) {
            res.render("home", { Name: req.user.emp_name, data: rows });
          } else {
            console.log(err);
          }
        }
      );
    });
  } else {
    res.render("login", { Message: "" });
  }
};

exports.formGet = (req, res) => {
  if (req.user) {
    pool.getConnection((err, connection) => {
      
      if (err) throw err;
      console.log("connection ID " + connection.threadId);
      pool.query("SELECT * FROM Role", (err, rows) => {
        connection.release();
        if (!err) {
          res.render("adduser", { Message: "", role: rows });
        }
        console.log(err);
      });
    });
  } else {
    res.render("login", { Message: "" });
  }
};

exports.formPost = (req, res) => {
  let managername = null;
  let manaherid = null;
  console.log(req.body.manager);
  if (req.body.manager != "" && req.body.manager != undefined) {
    const managerdata = req.body.manager.split(",");
    managername = managerdata[1];
    manaherid = managerdata[0];
    console.log(manaherid);
  } else {
    managername = null;
    manaherid = null;
  }

  const currentdate = new Date();
  const date =
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear();
  const time =
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();

  console.log(date, time);
  const data = {
    emp_id: req.body.emp_id,
    emp_name: req.body.Name,
    emp_email: req.body.Email,
    set_password: md5(req.body.floatingPassword),
    phone_no_1: req.body.Phone,
    role_name: req.body.role,
    reporting_manager_name: managername,
    reporting_manager_id: manaherid,
  };
  const emp_cred_data = {
    emp_id: req.body.emp_id,
    emp_username: req.body.Email,
    emp_password: md5(req.body.floatingPassword),
  };

  const assignroal = {
    emp_id: req.body.emp_id,
    role_name: req.body.role,
    date: date,
    time: time,
  };
const dummy={
emp_id:req.body.emp_id,
password_status:'false',
tag:'e',
emp_username:req.body.Email
}
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connection ID " + connection.threadId);

    pool.query(
      "INSERT INTO Employee_info SET ?;INSERT INTO Employee_Credentials SET ?;INSERT INTO Assigned_Role SET ?;INSERT INTO Dummy_Table SET?",
      [data, emp_cred_data, assignroal,dummy],
      (err, rows) => {
        connection.release();

        if (!err) {
          mail.addusermail(
            req.body.Email,
            req.body.Email,
            req.body.floatingPassword
          );
          twil.twil(req.body.Phone, req.body.Email, req.body.floatingPassword);
          res.redirect("/");
        } else {
          console.log(err);

          res.render("error", { error: "403", message: err.sqlMessage });
        }
      }
    );
  });
};

exports.formGetedit = (req, res) => {
  if (req.user) {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("connection ID " + connection.threadId);

      pool.query(
        "SELECT * FROM Employee_info WHERE emp_id = ?;SELECT * FROM Role",
        [req.query.id],
        (errs, rows) => {
          connection.release();

          if (!errs) {
            res.render("editPage", {
              Message: "",
              data: rows[0],
              role: rows[1],
            });
          } else {
            console.log(errs);
            res.render("error", { error: "403", message: errs.sqlMessage });
          }
        }
      );
    });
  } else {
    res.render("login", { Message: "" });
  }
};

exports.foemupdate = (req, res) => {
  let managername = null;
  let manaherid = null;
 
  if (req.body.manager != "" && req.body.manager != undefined) {
    const managerdata = req.body.manager.split(",");
    managername = managerdata[1];
    manaherid = managerdata[0];
    
  } else {
    managername = null;
    manaherid = null;
  }

  const data = {
    emp_id: req.params.id,
    emp_name: req.body.Name,
    emp_email: req.params.mail,
    phone_no_1: req.body.Phone,
    role_name: req.body.role,
    reporting_manager_name: managername,
    reporting_manager_id: manaherid,
  };

  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connection ID " + connection.threadId);

    pool.query(
      "UPDATE Employee_info SET ? WHERE emp_id=?",
      [data, req.params.id],
      (err, rows) => {
        connection.release();

        if (!err) {
          res.redirect("/");
        } else {
        
          res.render("error", { error: "403", message: err.sqlMessage });
        }
      }
    );
  });
};

exports.getrole = (req, res) => {
  pool.getConnection((err,connection)=>{
    if(err) throw err;
    pool.query(`SELECT * FROM Role`,(error,result)=>{
      connection.release();
      if(!error){
       res.render("addrole", { Message: "",rolename:'',url:'add_role',data:result,button:'Add Role' });
      }
      else{
         res.render("error", { error: "403", message: `DataBase Error` });
      }
    })
  })
  
};

exports.addrole = (req, res) => {
  let data = {
    role_name: req.body.role.toUpperCase(),
  };

  pool.getConnection((error, connection) => {
    if (error) throw error;
    console.log("connection ID " + connection.threadId);

    pool.query("INSERT INTO Role SET ?;SELECT * FROM Role", data, (err, rows) => {
      connection.release();
      if (!err) {
       
        return res.render("addrole", { Message: "Role added Successfuly",url:'add_role',rolename:'',data:rows[1],button:'Add Role' });
      }
      return res.render("addrole", { Message: "Error ",url:'add_role',rolename:'',data:rows[1],button:'Add Role' });
    });
  });
};

exports.foemdelete = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    pool.query(
      `UPDATE Employee_info SET emp_status="Deactivate" WHERE emp_id=${req.params.id};DELETE FROM Employee_Credentials WHERE emp_id=${req.params.id};DELETE FROM Dummy_Table WHERE emp_id=${req.params.id}`,
      (err, rows) => {
        connection.release();
        if (!err) {
          return res.redirect("/");
        }

        return res.render("error", { error: "403", message: err.sqlMessage });
      }
    );
  });
};

//API
exports.manager = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connection ID " + connection.threadId);

    pool.query(
      'SELECT * FROM Employee_info WHERE role_name = ? && emp_status="Active"',
      [req.params.id],
      (err, rows) => {
        connection.release();

        if (!err) {
          return res.send(rows);
        } else {
          console.log(err);
          res.render("error", { error: "403", message: err.sqlMessage });
        }
      }
    );
  });
};

exports.login = (req, res) => {
  if (req.user) {
    return res.redirect('/')
  }
  return res.render("login", { Message: "" });
};

exports.postlogin = (req, res) => {
  console.log(req.body);
  pool.getConnection((err, connected) => {
    if (err) throw err;
    pool.query(
      "SELECT * FROM Employee_Credentials WHERE emp_username=?",
      req.body.Email,
      (error, rores) => {
      
         
        if (!error) {
          if (rores.length === 0) {
            res.render("login", {
              Message:
                "User does not exist in the Data Base contact Admin are check your UserID",
            });
          } else {
            //
            pool.query(
              "SELECT role_name FROM Employee_info WHERE  emp_email = ?",
              req.body.Email,
              (er, re) => {
                if (er) {
                  res.render("login", { Message: "Invalid User " });
                } else {
                  if (re[0].role_name === "HR") {
                    pool.query(
                      `SELECT emp_id FROM Employee_Credentials WHERE emp_username=? && emp_password=?`,
                      [req.body.Email, md5(req.body.floatingPassword)],
                      (err, rows) => {
                        connected.release();
                        if (!err) {
                          if (rows.length === 0) {
                            res.render("login", {
                              Message: "Invalid User Password",
                            });
                          } else {
                            pool.query(`SELECT password_status FROM Dummy_Table WHERE emp_username=?`,req.body.Email,(errorss,quearydata)=>{
console.log(quearydata[0].password_status);
 
                            if (quearydata[0].password_status === "false") {
                              res.render("newpassword", {
                                Message: "",
                                empid: rows[0].emp_id,
                                emprole: re[0].role_name,
                              });
                            }
                            if (quearydata[0].password_status === "true") {
                              const id = rows[0].emp_id;
                              const role = re[0].role_name;
                              console.log(id);
                              const token = jwt.sign(
                                { id: id, role: role },
                                process.env.JWT_SECREAT,
                                { expiresIn: process.env.jWT_EXPERIATION }
                              );
                              console.log("TOKEN IS  " + token);
                              const cookieOptions = {
                                expires: new Date(
                                  Date.now() +
                                    process.env.JWT_COOKIE_EXP *
                                      24 *
                                      60 *
                                      60 *
                                      1000
                                ),
                                httpOnly: true,
                              };
                              res.cookie("sis", token, cookieOptions);

                              return res.redirect("/");
                            }
                            });
                            
                          }
                          console.log(rows);
                        } else {
                          console.log(err);
                          res.render("login", {
                            Message: "Invalid User ID are Password",
                          });
                        }
                      }
                    );
                  } else {
                    res.render("login", {
                      Message:
                        "User are not authorized to Login , Contact Admin",
                    });
                  }
                }
              }
            );
          }
        } else {
          console.log(error);
        }
      }
    );
  });
};

exports.setpassword = (req, res) => {

  const data = {
    
    emp_password: md5(req.body.floatingPassword),
  };
  const dummydata={
    password_status: "true"
  }
  if (req.body.floatingPassword === req.body.Password) {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      pool.query(
        `UPDATE Employee_Credentials SET ? WHERE emp_id=${req.query.id};UPDATE Dummy_Table SET ? WHERE emp_id=${req.query.id}`,
        [data,dummydata],
        (err, reow) => {
          connection.release();
          if (!err) {
            const employid = req.query.id;
            const rol = req.query.role;
           
            const token = jwt.sign(
              { id: employid, role: rol },
              process.env.JWT_SECREAT,
              {
                expiresIn: process.env.jWT_EXPERIATION,
              }
            );
            const cookicreation = {
              expires: new Date(
                Date.now() * process.env.JWT_COOKIE_EXP * 24 * 60 * 60 * 1000
              ),
              httpOnly: true,
            };
            res.cookie("sis", token, cookicreation);

            res.redirect("/");
          }
          console.log(err);
        
        }
      );
    });
  } else {
    res.render("newpassword", {
      Message: "Password is not maching",
      empid: req.query.id,
      emprole: req.query.role,
    });
  }
};

exports.logout = (req, res) => {
  res.cookie("sis", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  if(req.user)
  {
    return res.redirect('/')
  }
 return res.status(200).render("login", { Message: "" });
};

//changePassword

exports.changePassword = async (req, res) => {
  const data = {
    emp_password: md5(req.body.changePassword),
  };
  console.log(req.body);
  console.log(req.cookies);
  if (req.cookies.sis) {
    try {
      const decode = await promisify(jwt.verify)(
        req.cookies.sis,
        process.env.JWT_SECREAT
      );
      console.log(decode.id);

      pool.getConnection((error, connection) => {
        if (error) throw error;

        pool.query(
          `UPDATE Employee_Credentials SET ? WHERE emp_id=${decode.id}`,
          data,
          (err, result) => {
            //&& emp_password=? md5(req.params.id)
            connection.release();
            if (!err) {
              console.log(result, "hello");
              res.cookie("sis", "logout", {
                expires: new Date(Date.now() + 2 * 1000),
                httpOnly: true,
              });
              res
                .status(200)
                .render("login", { Message: "Password Set successfully" });
            } else {
              return res.render("error", {
                err: "403",
                message: err.sqlMessage,
              });
            }
          }
        );
      });
    } catch (err) {
      res.send(err);
    }
  } else {
    res.json({ message: "You are not authorized" });
  }
};

////test

exports.test = (req, res) => {
  res.render("demohome");
};

////employeefilter

exports.employeefilter=(req,res)=>{
if(req.user){
if(req.query.id ==='Deactivate'){
   pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("connection ID " + connection.threadId);

      pool.query(
        'SELECT * FROM Employee_info WHERE emp_status=?',req.query.id,
        (err, rows) => {
          connection.release();

          if (!err) {
            res.render("DeactivateUser", { Name: req.user.emp_name, data: rows });
          } else {
            console.log(err);
          }
        }
      );
    });
}
else{
  res.redirect('/');
}



 } else {
    res.render("login", { Message: "" });
  }
};

///loginfilter
exports.loginfilter=(req,res)=>{
  pool.getConnection((error,conection)=>{
    if(error) throw error;

    pool.query('SELECT * FROM Employee_Credentials WHERE emp_username=?',req.query.id,(err,result)=>{
      conection.release();
if(!err){
res.json(result)
}
else{
  console.log(err)
}
      
    })
  })
}
///roleDelete

exports.roleDelete=(req,res)=>{
    
    const data=req.params.id;
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        pool.query(`DELETE FROM Role WHERE role_id=?`,data,(error,result)=>{
            connection.release();
            if(!error){
                res.redirect('/add_role')
            }
            else{
               // console.log(error)
                res.render("error", { error: "403", message: `DataBase Error` })
            }
        })
    })

};
///adduseredit
exports.roleedit=(req,res)=>{
   
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        pool.query(`SELECT * FROM Role `,(error,result)=>{
            connection.release();
            if(!error){
           res.render("addrole", { Message: "",url:`editaddrole?id=${req.query.id}`,rolename:req.query.name,data:result,button:'Edit' });
            }
            else{
               // console.log(error)
                res.render("error", { error: "403", message: `DataBase Error` });
            }
        })
    })


};



//Role-editaddrole
exports.editaddrole=(req,res)=>{
console.log(req.body.role);
const rolename={
  role_name:req.body.role.toUpperCase()
}

pool.getConnection((error,connection)=>{
  if(error) throw error;
  pool.query(`UPDATE Role SET ? WHERE role_id=?`,[rolename,req.query.id],(err,result)=>{
    connection.release();
    if(!err){
      console.log(result)
     res.redirect('/add_role');
            }
            else{
               console.log(err)
                res.render("error", { error: "403", message: err.sqlMessage });
            }
  });
});

};
///forgotPassword
exports.forgotPassword=(req,res)=>{
res.render("forgotPassword");
}

///forgotPassword_Passwordchange

exports.forgotPassword_Passwordchange=async (req,res)=>{
if(req.cookies.ForhotPasswordCheck)
{
  try{
     const decoded = await promisify(jwt.verify)(req.cookies.ForhotPasswordCheck, process.env.JWT_OTPSECREAT);
res.render("change_forgotPassword", {
                                Message: "",
                                empid: decoded.id,
                                emprole: decoded.role,
                              });
  }catch(error){
console.log(error);
res.render("error", { error: "403", message:"" });
  }
  
}
else{
   res.render("login", { Message: "You are not authorised " });
}
};

//forgotPassword Post

exports.postforgotPassword_Passwordchange = (req, res) => {

  const data = {
    
    emp_password: md5(req.body.floatingPassword),
  };
  const dummydata={
    password_status: "true"
  }
  if (req.body.floatingPassword === req.body.Password) {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      pool.query(
        `UPDATE Employee_Credentials SET ? WHERE emp_id=${req.query.id};UPDATE Dummy_Table SET ? WHERE emp_id=${req.query.id}`,
        [data,dummydata],
        (err, reow) => {
          connection.release();
          if (!err) {
            

            res.redirect("/login");
          }
          console.log(err);
        
        }
      );
    });
  } else {
    res.render("change_forgotPassword", {
      Message: "Password is not maching",
      empid: req.query.id,
      emprole: req.query.role,
    });
  };
};



///get bemailforgetpassword


exports.forgotPasswordresetmail=async(req,res)=>{

try{
const check=await promisify(jwt.verify)(req.query.id,md5(process.env.JWT_OTPSECREAT))


  res.render('mailforgot_password',{Message: "",
                                empid: check.id,
                                emprole: check.role,});
}catch{
  res.render("login", { Message: "Your link got expired ! try again..." });
}
};


///post emailforgetpassword

exports.forgotPasswordresetmailpost=(req,res)=>{
  const data = {
    
    emp_password: md5(req.body.floatingPassword),
  };
  const dummydata={
    password_status: "true"
  }
  if (req.body.floatingPassword === req.body.Password) {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      pool.query(
        `UPDATE Employee_Credentials SET ? WHERE emp_id=${req.query.id};UPDATE Dummy_Table SET ? WHERE emp_id=${req.query.id}`,
        [data,dummydata],
        (err, reow) => {
          connection.release();
          if (!err) {
            

            res.render("login", { Message: "you have changed your password successfully" });
          }
          console.log(err);
        
        }
      );
    });
  } else {
    res.render("mailforgot_password", {
      Message: "Password is not maching",
      empid: req.query.id,
      emprole: req.query.role,
    });
  };
};


