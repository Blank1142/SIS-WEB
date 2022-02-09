const express=require('express');
const router=express.Router();
const user=require('../controllers/userCont');
const auth=require('../middleware/auth')
const admin=require('../controllers/admincontroller');
//homepage
router.get('/',auth.islogin,user.view);
//adduser
router.get('/adduser',auth.islogin,user.formGet);
//post add user
router.post('/adduser',user.formPost);
//get-edit info page
router.get('/adduseredit',auth.islogin,user.formGetedit);

//post-edit info page
router.post('/update/:id/:mail',user.foemupdate);
//role page
router.get('/add_role',user.getrole);
//Add role in role page
router.post('/add_role',user.addrole);
//Delete employee 
router.get('/delete/:id',user.foemdelete);
//API
router.get('/getmanagerdata/:id',user.manager);
//Login page
router.get('/login',auth.islogin,user.login);
//Post - Login Page
router.post('/postlogin',user.postlogin);
//Set password
router.post('/setpassword',user.setpassword);
//Logot
router.get('/logout',auth.islogin,user.logout)
///test
router.get('/test',user.test);
//
router.post('/changepassword',user.changePassword)
//employee filter
router.get('/filter',auth.islogin,user.employeefilter)
//loginfilter
router.get('/loginfilter',user.loginfilter)

//roles delete
router.get('/roledelete/:id',user.roleDelete);
//get role edit
router.get('/roleedit',user.roleedit);
//poste role edit
router.post('/editaddrole',user.editaddrole);

//login  forgotPassword_Passwordchange
router.get('/forgotPassword',user.forgotPassword);
router.get('/forgotPassword_Passwordchange',user.forgotPassword_Passwordchange)
router.post('/postforgotPassword_Passwordchange',user.postforgotPassword_Passwordchange);
//login forgot password by email link
router.get('/forgotPasswordresetmail',user.forgotPasswordresetmail)
router.post('/forgotPasswordresetmail',user.forgotPasswordresetmailpost)

//profile
router.get('/profile',auth.islogin,user.profile)


module.exports=router;



