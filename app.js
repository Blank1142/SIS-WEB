require("dotenv").config();
const express = require("express");
const sql = require("mysql");
const ejs = require("ejs");
const path = require("path");
const bodyparser = require("body-parser");
const cookieParese=require('cookie-parser');
const http=require('http')
const sockitio=require('socket.io')
const storage=require('./server/chat/storage')
const app = express();
const server=http.createServer(app);
const io=sockitio(server)
//

//
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParese());
app.use(bodyparser.json());
app.set("view engine", "ejs");


//connection

const pool = sql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

/*
const pool = sql.createPool({
  connectionLimit: 100,
  host: process.env.DEMO_DB_HOST,
  user: process.env.DEMP_DB_USER,
  password: process.env.DEMO_DB_PASSWORD,
  database: process.env.DEMO_DB,
  multipleStatements: true,
});
*/

//ccc
pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("connection ID " + connection.threadId);
  connection.release();

});

const routes = require("./server/routs/user");
app.use("/", routes);


const admin=require('./server/routs/admin');

app.use('/Admin',admin)

//Chat 

io.on('connection',(socket)=>{


  //newUser (online)
 socket.on('newUser',(data)=>{
   storage.addActiveusers(socket.id,data);
 }) 

//roomMessage

socket.on('Join',(data)=>{

storage.addMessages(data.rID,data.message,data.sender,data.reciver,new Date().getTime(),data.type);

socket.join(data.rID)
//

//make as read

storage.makeMessageRead(data.reciver,data.sender)
//

socket.emit("Message",{message:storage.getAllMessages(data.rID)})
})

//chat join online
socket.on('chatJoin',(data)=>{
storage.addchatOnline(socket.id,data)
});
//send message
//socket.emit('Message',{name:'admin',message:'Welcome',time:new Date().getTime()})
//socket.broadcast.emit('Message',{name:'admin',message:'New user has Joined the chat',time:new Date().getTime()})
socket.on('textMessage',(message)=>{
 const onlineusers=storage.chatOnline();
  const status=onlineusers.find((er)=>{return er.sender === message.reciver});
if(status)
{

storage.textMessage(message.rID,message.message,message.sender,message.reciver,new Date().getTime(),message.type,"true","true");
}else{
  storage.textMessage(message.rID,message.message,message.sender,message.reciver,new Date().getTime(),message.type,"true","false");
}
  
  
const data={
    sender:message.sender,message:message.message,time:new Date().getTime(),type:message.type
  }
  ///encoding
const tosterName=message.reciver;
let tosterNameCookiee='';
for(let i=0;i<tosterName.length;i++)
                              {
                                const v1=tosterName.charCodeAt(i);
                                const fv=String.fromCharCode(v1-2);
                                tosterNameCookiee += fv
                              }  
  ///
  socket.broadcast.emit('tosterMessage',{message:message.message, sender:message.sender,time:new Date().getTime(),reciver:tosterNameCookiee})
io.to(message.rID).emit('newMessage',{message:data})

})

//send location


socket.on('send_location',(message,callback)=>{
const url=`https://google.com/maps?q=${message.message.latitude},${message.message.longitude}`;

const onlineusers=storage.chatOnline();
  const status=onlineusers.find((er)=>{return er.sender === message.reciver});
if(status)
{

storage.textMessage(message.rID,url,message.sender,message.reciver,new Date().getTime(),message.type,"true","true");
}else{
  storage.textMessage(message.rID,url,message.sender,message.reciver,new Date().getTime(),message.type,"true","false");
}
  

const data={
    sender:message.sender,message:url,time:new Date().getTime(),type:message.type
  }
io.to(message.rID).emit('newMessage',{message:data})
callback('location sent')
})
 //remove chat online
socket.on('chatonlineremove',(data)=>{
 
  storage.removechatOnline(data)
})

//offline
socket.on('disconnect',()=>{
  storage.removeUser(socket.id);
})
});

 
//
server.listen(process.env.PORT || 8000, () => {
  console.log("connected to server");
});










