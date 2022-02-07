
const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const client = require('twilio')(accountSid, authToken); 
 exports.twil=(number,id,password)=>{
client.messages 
      .create({ 
         body: `Welcome to SIS  
         Your User ID :${id} .
         Your Password :${password}
         `
         ,  
         messagingServiceSid: 'MG3ad943ef166279b864a1a44701c73ac5',      
         to:`+91${number}`
       }) 
      .then(message => console.log(message.sid)) 
      .done();
 }
