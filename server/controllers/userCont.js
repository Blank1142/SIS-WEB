const sql = require("mysql");
const md5 = require("md5");
const mail = require("../notif/account");
const twil = require("../notif/twil");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const chatusers=require('../chat/storage')

const pool = sql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

/*
const pool = sql.createPool({
  connectionLimit: 100,
  host: process.env.DEMO_DB_HOST,
  user: process.env.DEMP_DB_USER,
  password: process.env.DEMO_DB_PASSWORD,
  database: process.env.DEMO_DB,
  multipleStatements: true,
});
*/


//home page

exports.view = (req, res) => {
  if (req.user) {
    //DB connection
    pool.getConnection((err, connection) => {
      if (err) throw err;
      
      //SQL Query
      pool.query(
        'SELECT * FROM Employee_info WHERE emp_status="Active"',
        (err, rows) => {
          //releasing the db connection
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
    res.render("login", { Message: "",color:'danger' });
  }
};
//GET - addUsers
exports.formGet = (req, res) => {
  if (req.user) {
     //DB connection
    pool.getConnection((err, connection) => {
      
      if (err) throw err;
      
      //sql query
      pool.query("SELECT * FROM Role", (err, rows) => {
        connection.release();
        if (!err) {
          res.render("adduser", { Message: "", role: rows });
        }
        console.log(err);
      });
    });
  } else {
    res.render("login", { Message: "",color:'danger' });
  }
};
//POST - addUsers
exports.formPost = (req, res) => {
  let managername = null;
  let manaherid = null;
 //creating manager name and id
  if (req.body.manager != "" && req.body.manager != undefined) {
    const managerdata = req.body.manager.split(",");
    managername = managerdata[1];
    manaherid = managerdata[0];
    
  } else {
    managername = null;
    manaherid = null;
  }
//generating Date and time
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

  //creating body for sql query
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
 //DB connection
  pool.getConnection((err, connection) => {
    if (err) throw err;
    
//sql query for inserting the user data in Employee_Credentials,Assigned_Role,Dummy_Table
    pool.query(
      "INSERT INTO Employee_info SET ?;INSERT INTO Employee_Credentials SET ?;INSERT INTO Assigned_Role SET ?;INSERT INTO Dummy_Table SET?",
      [data, emp_cred_data, assignroal,dummy],
      (err, rows) => {
        connection.release();

        if (!err) {

          //sending login cred in  mail and sms
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

//GET - Editing the userform
exports.formGetedit = (req, res) => {
  if (req.user) {
    //DB Connection
    pool.getConnection((err, connection) => {
      if (err) throw err;
     //sql query for getting Employee_info and Role
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
    res.render("login", { Message: "",color:'danger' });
  }
};

//POST - edit user form

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
//SQL query Body
  const data = {
    emp_id: req.params.id,
    emp_name: req.body.Name,
    emp_email: req.params.mail,
    phone_no_1: req.body.Phone,
    role_name: req.body.role,
    reporting_manager_name: managername,
    reporting_manager_id: manaherid,
  };
//DB Connection
  pool.getConnection((err, connection) => {
    if (err) throw err;
   
//sql query for updating Employee_info
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

//GET - Role's page
exports.getrole = (req, res) => {
  //DB Connection
  pool.getConnection((err,connection)=>{
    if(err) throw err;
    //sql query for getting Role
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

//POST - Add Role's
exports.addrole = (req, res) => {
  //sql query body
  let data = {
    role_name: req.body.role.toUpperCase(),
  };
//DB Connection
  pool.getConnection((error, connection) => {
    if (error) throw error;
    
//Sql query for inserting the role's and getting the role's
    pool.query("INSERT INTO Role SET ?;SELECT * FROM Role", data, (err, rows) => {
      connection.release();
      if (!err) {
       
        return res.render("addrole", { Message: "Role added Successfuly",url:'add_role',rolename:'',data:rows[1],button:'Add Role' });
      }
      return res.render("addrole", { Message: "Error ",url:'add_role',rolename:'',data:rows[1],button:'Add Role' });
    });
  });
};

//Delet the employee data

exports.foemdelete = (req, res) => {
  //DB Connection
  pool.getConnection((err, connection) => {
    if (err) throw err;
//SQL Query for delete employee info from Employee_Credentials , Dummy_Table and updating the status to deactivate in Employee_info
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

//API - For getting employee details based on role
exports.manager = (req, res) => {
  //DB connection
  pool.getConnection((err, connection) => {
    if (err) throw err;
    
//SQL query for getting employee info based on role's
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


//GET - Login Page
exports.login = (req, res) => {
  if (req.user) {
    return res.redirect('/')
  }
  return res.render("login", { Message: "",color:'danger' });
};

//POST - Login Page
exports.postlogin = (req, res) => {

  //DB Connection
  pool.getConnection((err, connected) => {
    if (err) throw err;
    //Sql Query for getting employee info based on there emailid(emp_username)
    pool.query(
      "SELECT * FROM Employee_Credentials WHERE emp_username=?",
      req.body.Email,
      (error, rores) => {
      
         
        if (!error) {
          if (rores.length === 0) {
            res.render("login", {
              Message:
                "User does not exist in the Data Base contact Admin are check your UserID",color:'danger'
            });
          } else {
            // sql Query for getting the role name of the employee
            pool.query(
              "SELECT role_name,emp_name FROM Employee_info WHERE  emp_email = ?",
              req.body.Email,
              (er, re) => {
                if (er) {
                  res.render("login", { Message: "Invalid User ",color:'danger' });
                } else {
                  if (re[0].role_name === "HR") {
                    //Sql Query for checking if the user id and password are matching from  Employee_Credentials
                    pool.query(
                      `SELECT emp_id FROM Employee_Credentials WHERE emp_username=? && emp_password=?`,
                      [req.body.Email, md5(req.body.floatingPassword)],
                      (err, rows) => {
                        connected.release();
                        if (!err) {
                          if (rows.length === 0) {
                            res.render("login", {
                              Message: "Invalid User Password",color:'danger'
                            });
                          } else {
                            //SQL QUERY for getting Password Status from Dummy_Table
                            pool.query(`SELECT password_status FROM Dummy_Table WHERE emp_username=?`,req.body.Email,(errorss,quearydata)=>{

 
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
                          //Creating the Token's
                              const token = jwt.sign(
                                { id: id, role: role },
                                process.env.JWT_SECREAT,
                                { expiresIn: process.env.jWT_EXPERIATION }
                              );
                              const chatToken=jwt.sign(
                                { name:re[0].emp_name },
                                process.env.JWT_SECREAT,
                                { expiresIn: process.env.jWT_EXPERIATION }
                              );
                              //Creating the coolie Exp Date
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

                               const chatCookieOptions = {
                                expires: new Date(
                                  Date.now() +
                                    process.env.JWT_COOKIE_EXP *
                                      24 *
                                      60 *
                                      60 *
                                      1000
                                )
                              };
                              const tosterName=(re[0].emp_name).toUpperCase().replace(/\s+/g, '');
                              let tosterNameCookiee='';
                              //encode
                              for(let i=0;i<tosterName.length;i++)
                              {
                                const v1=tosterName.charCodeAt(i);
                                const fv=String.fromCharCode(v1-2);
                                tosterNameCookiee += fv
                              }
                              //Sending cookie with name to call
                              res.cookie("sis", token, cookieOptions);
                               res.cookie("sisChat", chatToken, chatCookieOptions);
                               res.cookie('OAEUD',tosterNameCookiee,chatCookieOptions);

                              return res.redirect("/");
                            }
                            });
                            
                          }
                         
                        } else {
                          console.log(err);
                          res.render("login", {
                            Message: "Invalid User ID are Password",color:'danger'
                          });
                        }
                      }
                    );
                  } else {
                    res.render("login", {
                      Message:
                        "User are not authorized to Login , Contact Admin",color:'danger'
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

//Post - SetPassword Page 
exports.setpassword = (req, res) => {

  const data = {
    
    emp_password: md5(req.body.floatingPassword),
  };
  const dummydata={
    password_status: "true"
  }
  //Checking if the pasword is matching
  if (req.body.floatingPassword === req.body.Password) {
    //DB Connection
    pool.getConnection((err, connection) => {
      if (err) throw err;
      //Sql Query for updating the  existing password
      pool.query(
        `UPDATE Employee_Credentials SET ? WHERE emp_id=${req.query.id};UPDATE Dummy_Table SET ? WHERE emp_id=${req.query.id}`,
        [data,dummydata],
        (err, reow) => {
          connection.release();
          if (!err) {
            const employid = req.query.id;
            const rol = req.query.role;
           //creating the token
            const token = jwt.sign(
              { id: employid, role: rol },
              process.env.JWT_SECREAT,
              {
                expiresIn: process.env.jWT_EXPERIATION,
              }
            );
            
            //creating the cookie exp date
            const cookicreation = {
              expires: new Date(
                Date.now() * process.env.JWT_COOKIE_EXP * 24 * 60 * 60 * 1000
              ),
              httpOnly: true,
            };
            //Sending the cookie
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

//Logout 
exports.logout = (req, res) => {
  //making the cookie expire
  res.cookie("sis", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  if(req.user)
  {
    return res.redirect('/')
  }
 return res.status(200).render("login", { Message: "",color:'success'});
};

//changePassword
exports.changePassword = async (req, res) => {
  const data = {
    emp_password: md5(req.body.changePassword),
  };
  
  //checking for the cookie
  if (req.cookies.sis) {
    try {
      const decode = await promisify(jwt.verify)(
        req.cookies.sis,
        process.env.JWT_SECREAT
      );
     
   //DB Connection
      pool.getConnection((error, connection) => {
        if (error) throw error;
//Sql Queary for updating the existing password
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
                .render("login", { Message: "Password Set successfully",color:'success' });
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


// employeefilter for getting deactivate users

exports.employeefilter=(req,res)=>{
if(req.user){
if(req.query.id ==='Deactivate'){
   pool.getConnection((err, connection) => {
      if (err) throw err;
      
//SQL Query for getting all deactivate usere
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
    res.render("login", { Message: "",color:'danger' });
  }
};

//API - loginfilter
exports.loginfilter=(req,res)=>{
  pool.getConnection((error,conection)=>{
    if(error) throw error;
//SQL Query for getting the details based on username
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
/// to delete role
exports.roleDelete=(req,res)=>{
    
    const data=req.params.id;
    //DB Connection
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        //SQL Query for Delete role
        pool.query(`DELETE FROM Role WHERE role_id=?`,data,(error,result)=>{
            connection.release();
            if(!error){
                //res.redirect('/add_role')
                res.render("addrole", { Message: "Role is deleted successfully",rolename:'',url:'add_role',data:result,button:'Add Role' });
            }
            else{
               // console.log(error)
                res.render("error", { error: "403", message: `DataBase Error` })
            }
        })
    })

};
///GET - Edit the Role's
exports.roleedit=(req,res)=>{
   //DB Connection
   
   
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        //sql query for getting all roles
        pool.query(`SELECT * FROM Role `,(error,result)=>{
            connection.release();
            if(req.query.name != "HR"){

            if(!error){
           res.render("addrole", { Message: "",url:`editaddrole?id=${req.query.id}&name=${req.query.name}`,rolename:req.query.name,data:result,button:'Edit' });
            }
            else{
               // console.log(error)
                res.render("error", { error: "403", message: `DataBase Error` });
            }
            }else{
    res.render("addrole", { Message: "You can not change this Role",rolename:'',url:'add_role',data:result,button:'Add Role' });
  }
        })
    })
  

};



//POST - Edit ROLE'S
exports.editaddrole=(req,res)=>{
console.log(req.query)
const rolename={
  role_name:req.body.role.toUpperCase()
}
//DB Connection
pool.getConnection((error,connection)=>{
  if(error) throw error;
  //SQL Query for updating the role based on role id
  pool.query(`UPDATE Role SET ? WHERE role_id=?;UPDATE Employee_info Set ? WHERE role_name =?;UPDATE Assigned_Role Set ? WHERE role_name =?`,[rolename,req.query.id,rolename,req.query.name,rolename,req.query.name],(err,result)=>{
    connection.release();
    if(!err){
      
      res.redirect('/add_role')
            }
            else{
               console.log(err)
                res.render("error", { error: "403", message: err.sqlMessage });
            }
  });
});

};
/// login page forgotPassword
exports.forgotPassword=(req,res)=>{
res.render("forgotPassword");
}

///get - Login page forgotPassword_Passwordchange

exports.forgotPassword_Passwordchange=async (req,res)=>{
  //check for the otp cookie
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
   res.render("login", { Message: "You are not authorised ",color:'danger'  });
}
};

//Post - Login page forgotPassword Post

exports.postforgotPassword_Passwordchange = (req, res) => {

  const data = {
    
    emp_password: md5(req.body.floatingPassword),
  };
  const dummydata={
    password_status: "true"
  }
  //checking for the password
  if (req.body.floatingPassword === req.body.Password) {
    //DB Connection
    pool.getConnection((err, connection) => {
      if (err) throw err;
//SQL Query for updating the password and changing the password Status
      pool.query(
        `UPDATE Employee_Credentials SET ? WHERE emp_id=${req.query.id};UPDATE Dummy_Table SET ? WHERE emp_id=${req.query.id}`,
        [data,dummydata],
        (err, reow) => {
          connection.release();
          if (!err) {
            

             res.render("login", { Message: "you have changed your password successfully",color:'success' });
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



///get-login page forgot password by email-link


exports.forgotPasswordresetmail=async(req,res)=>{

try{
  //verify the token
const check=await promisify(jwt.verify)(req.query.id,md5(process.env.JWT_OTPSECREAT))


  res.render('mailforgot_password',{Message: "",
                                empid: check.id,
                                emprole: check.role,});
}catch{
  res.render("login", { Message: "Your link got expired ! try again...",color:'danger' });
}
};


///post-login page  email link forgetpassword

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
            

            res.render("login", { Message: "you have changed your password successfully",color:'success' });
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

//Profile page

exports.profile=async(req,res)=>{
  //checking for cookie
  
  if(req.user){
    
      const decode = await promisify(jwt.verify)(req.cookies.sis, process.env.JWT_SECREAT);
//DB connection 
      pool.getConnection((error,connecrion)=>{
        if(error) throw error;
        //sql query for selecting employee info
              pool.query("SELECT * FROM Employee_info WHERE emp_id=? && emp_status='Active'", [req.user.emp_id], (err, result) => {
                    connecrion.release();
 
 
                  if(!err){
                res.render('profile',{emp_id:result[0].emp_id,name:result[0].emp_name,email:result[0].emp_email,p1:result[0].phone_no_1,p2:result[0].phone_no_2,role:result[0].role_name,manager:result[0].reporting_manager_name})
                  }
                })
      })

   

  }else{
    res.render("login", { Message: "You are not authorized ",color:'danger' });
  }
}

//test 
exports.test = (req, res) => {}
////chat

exports.chat = (req, res) => {
   if (req.user) {
  pool.getConnection((error,connection)=>{
    if(error) throw error;
    pool.query('SELECT * FROM Employee_info WHERE emp_status="Active"',(err,result)=>{
      connection.release();
      if(!err)
      {
const reciveruser=(req.user.emp_name).toUpperCase().replace(/\s+/g, '');
          const onlineusers=chatusers.allUsers();
          
        const data=[];
        result.forEach((e)=>{
          const status=onlineusers.find((er)=>{return er.name === e.emp_name});
         const unreadmessages=chatusers.unreadMessages((e.emp_name).toUpperCase().replace(/\s+/g, ''),reciveruser)
         
      
         
          let statusValue='';
          if(status)
          {
            statusValue="online";
          }
          else{
            statusValue="offline"
          }
         
          const value={emp_name:e.emp_name,
          role_name:e.role_name,
        status:statusValue,unreadMessages:unreadmessages.length}
        data.push(value)
        });

        const loginUser=req.user.emp_name

         res.render("chat",{data:data,loginUser:loginUser});
      }
    });
  });
 }
   else{
     res.redirect('/login');
   }
};



///chat Room .replace(/\s+/g, '')

exports.chatroom =(req,res)=>{
   if (req.user) {
     const usern=req.user.emp_name.toUpperCase().replace(/\s+/g, '');
     const chatUser=req.params.name.toUpperCase().replace(/\s+/g, '');
     
     const room= [usern,chatUser];
   const roomname=  room.sort().join('-');
   console.log(roomname)
  res.render('chatRoom',{croom:roomname,sender:usern,reciver:chatUser});
   }
   else{
     res.redirect('/login');
   }
}