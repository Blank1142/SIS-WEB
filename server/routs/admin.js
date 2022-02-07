const express=require('express');
const router=express.Router();
const admin=require('../controllers/admincontroller');

router.get('/a-d-d_users',admin.adduser);


router.post('/a-d-d_users',admin.postaddusers)

router.get('/changePassword/:id',admin.changepassword)
//
router.get('/User_check',admin.Usercheck)
//send otp
router.get('/send_otp/:id',admin.send_otp)
router.get('/check_otp/:id',admin.check_otp)
router.get('/forgotpassword_mail/:id',admin.sendforgotpasswordmail)

module.exports=router;