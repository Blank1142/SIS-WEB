 
  const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const client = require('twilio')(accountSid, authToken); 
 exports.sms=(number,otp)=>{
     
client.messages 
      .create({ 
         body: ` SIS OTP   
        
         Your OTP :${otp}

         your OPT expires in 2 min.
         `
         ,  
         messagingServiceSid: 'MG3ad943ef166279b864a1a44701c73ac5',      
         to:`+91${number}`
       }) 
      .then(message => console.log(message.sid)) 
      .done();
 }
