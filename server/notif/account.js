
const sgMail = require('@sendgrid/mail')
const apikey=process.env.EMAIL_KEY||"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";
sgMail.setApiKey(apikey)

exports.addusermail=(mail,userid,password)=>{
    sgMail
  .send({
  to: mail, // Change to your recipient
  from: 'mouhith@nuron.co.in', // Change to your verified sender
  subject: 'SIS Application User credential',
 /* text: `Welcome To SIS    
   Login Credential
   Userid :${userid} .
   Password:${password}

  `,*/
  html:`<h2>Welcome To SIS    </h2>
   <h3>Login Credential</h3>
  <h4> Userid :</h4>${userid} .
   <h4>Password:</h4>${password}

  `,
  
})
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  }) 
}

