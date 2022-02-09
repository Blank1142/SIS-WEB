const sql=require('mysql')
const md5 = require('md5');
const mail=require('../notif/account')
const twil=require('../notif/twil');
const jwt=require('jsonwebtoken')
const {promisify}=require('util');
const { connect } = require('http2');
const mailotp=require('../notif/emailotp');
const smsotp=require('../notif/smsotp')
const linkmail=require('../notif/linkmail')
/*
const pool=sql.createPool({
    connectionLimit:100,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,
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


// Admin route to add employee
exports.adduser=(req,res)=>{
   
//DB Connection
    pool.getConnection((err,connection)=>{
        if(err) throw err;
  //sql query to get role
        pool.query('SELECT * FROM Role',(err,rows)=>{
          
            connection.release();
            if(!err){
                
                  res.render('adminAddUsers' ,{Message:'',role:rows})
            }
            console.log(err)
         
        })
    })
   
};

//Post Admin Route add user
exports.postaddusers=(req,res)=>{
    let managername=null;
    let manaherid=null;
    
    if(req.body.manager != '' && req.body.manager != undefined){
const managerdata=req.body.manager.split(',');
 managername=managerdata[1];
 manaherid=managerdata[0];
 
    }
    else{
          managername=null;
    manaherid=null;
    }
   //generating Date and time
const currentdate = new Date(); 
const date =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear();
const time=currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();


   const data={emp_id:req.body.emp_id,emp_name:req.body.Name,emp_email:req.body.Email,set_password:md5(req.body.floatingPassword),phone_no_1:req.body.Phone,role_name:req.body.role,reporting_manager_name:managername ,reporting_manager_id:manaherid
}
const emp_cred_data={emp_id:req.body.emp_id,emp_username:req.body.Email,emp_password:md5(req.body.floatingPassword)
}

const assignroal={emp_id:req.body.emp_id,role_name:req.body.role,date:date,time:time

}
const dummy={
emp_id:req.body.emp_id,
password_status:'false',
tag:'e',
emp_username:req.body.Email
}
    //DB Connection
    pool.getConnection((err,connection)=>{
    if(err) throw err;

//Sql Query for inserting the employee data
    pool.query('INSERT INTO Employee_info SET ?;INSERT INTO Employee_Credentials SET ?;INSERT INTO Assigned_Role SET ?;INSERT INTO Dummy_Table SET?',[data,emp_cred_data,assignroal,dummy],(err,rows)=>{
        connection.release();

        if(!err){
            //sending mail and sms
       mail.addusermail(req.body.Email,req.body.Email,req.body.floatingPassword);
       twil.twil(req.body.Phone,req.body.Email,req.body.floatingPassword);
res.redirect('/Admin/a-d-d_users');

        }
        else{
            console.log(err)

            res.render('error',{error:'403',message:err.sqlMessage})
        }
   
})
});

};

//change password
exports.changepassword=async(req,res)=>{
    

    if(req.cookies.sis){
        try{

            const decode=await promisify(jwt.verify)(req.cookies.sis,process.env.JWT_SECREAT);
            console.log(decode.id);
//DB Connecttion
            pool.getConnection((error,connection)=>{

                if(error) throw error;
//Swl Query for getting emp data
                pool.query(`SELECT emp_id FROM Employee_Credentials WHERE emp_id=? && emp_password=?`,[decode.id,md5(req.params.id)],(err,result)=>{
                   //&& emp_password=? md5(req.params.id)
                    console.log(connection)
                    connection.release();
                    if(!err){
                        console.log(req.params.id)
                        console.log(result)
                        res.json(result)
                    }
                    else{
                        console.log(err)
                    }
                })

            });
        

        }catch(err){
            res.send(err)
        }

    }
    else{
         res.json({message:'You are not authorized' });
    } 
     
};



//Usercheck
exports.Usercheck=(req,res)=>{
    var checkdata='';
    console.log(req.query)
    if(req.query.id){
        
checkdata={
    emp_id:req.query.id
};

    }
    if(req.query.value){
        checkdata={
            emp_email:req.query.value
        };
    }
    console.log(checkdata)
    pool.getConnection((error,connect)=>{
        if(error) throw connect;
        pool.query(`SELECT * FROM Employee_info WHERE ?`,checkdata,(err,result)=>{
            connect.release();
            if(!err){
                res.json(result)
            }
        })
    })

};
///otp

exports.send_otp=(req,res)=>{
 
    pool.getConnection((error,connection)=>{
        if(error) throw error;
//Sql query for hetting emp data
           pool.query(`SELECT * FROM Employee_info WHERE emp_email=? && emp_status="Active"`,req.params.id,(err,result)=>{
            connection.release();
            if(!err){
                if(result.length !=0)
                {
                    const id=result[0].emp_id;
                    const role=result[0].role_name;
                    //creating otp
                      const otp=Math.floor(Math.random()*(9999999 - 999999 + 1));
                      //creating token
                   const token = jwt.sign({id:id,role:role,check:otp},process.env.JWT_OTPSECREAT,{expiresIn:process.env.JWT_OTPEXPERIATION});


const cookioperate={expires:new Date(Date.now()+2*60*1000), httpOnly: true};
//sending cookie
res.cookie('onetimep',token,cookioperate);
mailotp.email(req.params.id,otp);
smsotp.sms(result[0].phone_no_1,otp);

                    res.json(result)

                }else{

                
                res.json(result)
                }
            }
        })
    })
};

//Check otp
exports.check_otp=async(req,res)=>{
    
//Checking for cookie and otp
    if (req.cookies.onetimep) {
        const decode = await promisify(jwt.verify)(req.cookies.onetimep, process.env.JWT_OTPSECREAT);
        console.log(decode);
        console.log(decode.check == req.params.id);
        if(decode.check == req.params.id)
        {
            const token = jwt.sign({id:decode.id,role:decode.role},process.env.JWT_OTPSECREAT,{expiresIn:process.env.JWT_OTPEXPERIATION});
            const cookioperate={expires:new Date(Date.now()+10*60*1000), httpOnly: true};
res.cookie('ForhotPasswordCheck',token,cookioperate);
 
 res.json({Check:'Success'})
        }else{
            res.json({Check:'Not_Matched'})
        }
       
        
    }
    else{
        res.json({Check:'Time_out'});
    }

}
/// send link to your g-mail forgot password

exports.sendforgotpasswordmail=(req,res)=>{
    console.log(req.params)
    pool.getConnection((error,connection)=>{
        if(error) throw error;
//sQL QUERY FOR get user data
               pool.query(`SELECT * FROM Employee_info WHERE emp_email=? && emp_status="Active"`,req.params.id,(err,result)=>{
            connection.release();
            if(!err){
                if(result.length !=0)
                {
                    const id=result[0].emp_id;
                    const role=result[0].role_name;
                     //creating token
                   const token = jwt.sign({id:id,role:role},md5(process.env.JWT_OTPSECREAT),{expiresIn:process.env.JWT_OTPEXPERIATION});
//sending link
const link=`https://demo-si.herokuapp.com/forgotPasswordresetmail?id=${token}`

linkmail.linkgmail(req.params.id,link);


                    res.json(result)

                }else{

                
                res.json(result)
                }
            }
        })
    })

}