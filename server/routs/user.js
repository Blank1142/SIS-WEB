const express=require('express');
const router=express.Router();
const user=require('../controllers/userCont');
const auth=require('../middleware/auth')
const admin=require('../controllers/admincontroller');

router.get('/',auth.islogin,user.view);
router.get('/adduser',auth.islogin,user.formGet);
router.post('/adduser',user.formPost);
router.get('/adduseredit',auth.islogin,user.formGetedit);
//router.get('/test',adminuser.test);

router.post('/update/:id/:mail',user.foemupdate);
router.get('/add_role',user.getrole);
router.post('/add_role',user.addrole);
router.get('/delete/:id',user.foemdelete);
router.get('/getmanagerdata/:id',user.manager);
router.get('/login',auth.islogin,user.login);
router.post('/postlogin',user.postlogin);
router.post('/setpassword',user.setpassword);
router.get('/logout',auth.islogin,user.logout)
///test
router.get('/test',user.test);
//
router.post('/changepassword',user.changePassword)
//filter
router.get('/filter',auth.islogin,user.employeefilter)
router.get('/loginfilter',user.loginfilter)

//roles

router.get('/roledelete/:id',user.roleDelete);
router.get('/roleedit',user.roleedit);
router.post('/editaddrole',user.editaddrole);

//forgotPassword_Passwordchange
router.get('/forgotPassword',user.forgotPassword);
router.get('/forgotPassword_Passwordchange',user.forgotPassword_Passwordchange)
router.post('/postforgotPassword_Passwordchange',user.postforgotPassword_Passwordchange);
router.get('/forgotPasswordresetmail',user.forgotPasswordresetmail)
router.post('/forgotPasswordresetmail',user.forgotPasswordresetmailpost)
module.exports=router;



