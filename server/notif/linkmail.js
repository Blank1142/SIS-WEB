
const sgMail = require('@sendgrid/mail')
const apikey=process.env.EMAIL_KEY||"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";
sgMail.setApiKey(apikey)

exports.linkgmail=(mail,link)=>{
  
    sgMail
  .send({
  to: mail, // Change to your recipient
  from: 'mouhith@nuron.co.in', // Change to your verified sender
  subject: 'SIS Application ',
 /* text: `Welcome To SIS    
   Login Credential
   Userid :${userid} .
   Password:${password}

  `,*/
  html:`<h2>Welcome To SIS    </h2>
   <h3>Your Password Reset Link</h3>


   <h4>You have requested to reset your sis password</h4>
  
   <a href=${link}>Click to reset your password</a>
   
   <h5 style="color: red;">Your link Expiresin 2 minutes</h5>


  `,
  
})
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  }) 
}

