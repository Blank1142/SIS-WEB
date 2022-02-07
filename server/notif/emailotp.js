
const sgMail = require('@sendgrid/mail')
const apikey=process.env.EMAIL_KEY||"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";
sgMail.setApiKey(apikey)

exports.email=(mail,otp)=>{
  
    sgMail
  .send({
  to: mail, // Change to your recipient
  from: 'mouhith@nuron.co.in', // Change to your verified sender
  subject: 'SIS Application OTP',
 /* text: `Welcome To SIS    
   Login Credential
   Userid :${userid} .
   Password:${password}

  `,*/
  html:`<h2>Welcome To SIS    </h2>
   <h3>Forgot Password OTP</h3>
 .
   <h4>OTP:</h4>${otp}
   <p>OTP Expires in 2Min </p>

  `,
  
})
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  }) 
}

