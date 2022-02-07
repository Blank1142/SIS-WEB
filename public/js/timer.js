/* function time(){ return setInterval(()=>{
     
var d = new Date();
    var seconds = d.getMinutes() * 60 + d.getSeconds(); 
    var twoMin = 60 * 2; 
    var timeleft = twoMin - seconds % twoMin;
    var result = parseInt(timeleft / 60) + ':' + timeleft % 60; 
    document.getElementById('test').innerHTML = result;
    console.log(result);
 },500);
  

} */


let btn=document.getElementById('otpbutton').value;

var interval;

 
async function countdown() {
    
    console.log(btn===1)
    
  if(btn === 1)
  {
      
let otpvalue=document.getElementById('otp').value;
      
      if(otpvalue.length != 0)
      {
      const otpres=await fetch(`/Admin/check_otp/${otpvalue}`);
      const otpdata=await otpres.json();
      console.log(otpdata)
      console.log(otpdata.Check)
      if(otpdata.Check == "Success")
      {
          window.location.href = "/forgotPassword_Passwordchange";
      }
      if(otpdata.Check == "Time_out")
      {
           document.getElementById('liveAlertPlaceholder').innerHTML='<div class="alert fade-in alert-' + 'danger' + ' alert-dismissible" id="alertbox" role="alert">' + 'OTP has Expired' + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
      $("#alertbox").fadeTo(5000, 0);
      }
      
if(otpdata.Check =="Not_Matched"){
     document.getElementById('liveAlertPlaceholder').innerHTML='<div class="alert fade-in alert-' + 'danger' + ' alert-dismissible" id="alertbox" role="alert">' + 'Your OTP code is incorrect' + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
      $("#alertbox").fadeTo(5000, 0);
}
      }
      else{
           document.getElementById('liveAlertPlaceholder').innerHTML='<div class="alert fade-in alert-' + 'danger' + ' alert-dismissible" id="alertbox" role="alert">' + 'Please Enter OTP ' + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
      $("#alertbox").fadeTo(5000, 0);
      }
  }
 else{
     const email=document.getElementById('Email').value;
     if(email.length != 0)
     {
     const res=await fetch(`/Admin/send_otp/${email}`);
     const data=await res.json();
    
if(data.length!= 0)
{
 document.getElementById('otpbutton').innerText='Submit OTP'

     document.getElementById('Email').setAttribute('type','hidden')
    document.getElementById('otp').setAttribute('type','text')
   document.getElementById('semdmail_div').style.display = "none";
    document.getElementById('otpLable').innerText='OTP';
      btn=document.getElementById('otpbutton').value=1;
    var minutes = 2;
      var seconds = 00;
  clearInterval(interval);
  interval = setInterval( function() {
     
      
      seconds -= 1;
      if (minutes < 0) return;
      else if (seconds < 0 && minutes != 0) {
          minutes -= 1;
          seconds = 59;
      }
      else if (seconds < 10 && length.seconds != 2) seconds = '0' + seconds;

     document.getElementById('test').innerHTML= 'Your OTP expires in :'+minutes + ':' + seconds +"       ";
document.getElementById('resend').innerHTML='<button onclick="resend()" style=" background: none!important;border: none;padding: 0!important;font-family: arial, sans-serif;color: #069;text-decoration: underline;cursor: pointer;pointer;" id="resendotp">Resend OTP</button>';
      if (minutes == 0 && seconds == 0) clearInterval(interval);
  }, 1000);
}
else{
   document.getElementById('liveAlertPlaceholder').innerHTML='<div class="alert fade-in alert-' + 'danger' + ' alert-dismissible" id="alertbox" role="alert">' + 'UserID does not exist' + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
      $("#alertbox").fadeTo(5000, 0);
}
}
else{
    document.getElementById('liveAlertPlaceholder').innerHTML='<div class="alert fade-in alert-' + 'danger' + ' alert-dismissible" id="alertbox" role="alert">' + 'Please enter your UserID' + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
$("#alertbox").fadeTo(5000, 0);
}
 }
}

function resend(){
btn=document.getElementById('otpbutton').value=0;
 document.getElementById('liveAlertPlaceholder').innerHTML='<div class="alert fade-in alert-' + 'danger' + ' alert-dismissible" id="alertbox" role="alert">' + 'OTP is sent' + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
$("#alertbox").fadeTo(5000, 0);
countdown();
}

 document.getElementById('otpbutton').addEventListener('click',countdown);
//

async function sendmail(){
 const gmail=document.getElementById('Email').value;
 if(gmail.length != 0){
const gres=await fetch(`/Admin/forgotpassword_mail/${gmail}`);
const gdata=await gres.json();
if(gdata.length != 0)
{
      document.getElementById('liveAlertPlaceholder').innerHTML='<div class="alert fade-in alert-' + 'success' + ' alert-dismissible" id="alertbox" role="alert">' + 'Link sent successfully to your Gmail' + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
      $("#alertbox").fadeTo(5000, 0);

}else{
      document.getElementById('liveAlertPlaceholder').innerHTML='<div class="alert fade-in alert-' + 'danger' + ' alert-dismissible" id="alertbox" role="alert">' + 'UserID does not exist' + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
      $("#alertbox").fadeTo(5000, 0);
}

 }
 else{
     document.getElementById('liveAlertPlaceholder').innerHTML='<div class="alert fade-in alert-' + 'danger' + ' alert-dismissible" id="alertbox" role="alert">' + 'Please enter your UserID' + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
$("#alertbox").fadeTo(5000, 0);
 }


};






 document.getElementById('send_mail').addEventListener('click',sendmail)