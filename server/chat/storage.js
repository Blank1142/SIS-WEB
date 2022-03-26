const jwt=require('jsonwebtoken');

const activeusers=[];
const allMessages=[];
const chatOnlineUsers=[];
//AddMessages
const addMessages=(rid,message,sender,reciver,time,type)=>{
    const messageroomexist=allMessages.find((e)=>{
       

       return e.rID == rid
    })

if(!messageroomexist){
const data={rID:rid,message:message,sender:sender,reciver:reciver,time:time,type:type,senderStatus:'false',reciverStatus:'false'};

allMessages.push(data);
}

}
//text Message or new messages
const textMessage=(rid,message,sender,reciver,time,type,senderStatus,reciverStatus)=>{
 
const data={rID:rid,message:message,sender:sender,reciver:reciver,time:time,type:type,senderStatus:senderStatus,reciverStatus:reciverStatus};

allMessages.push(data);


}

//AddUsers
const addActiveusers=(id,data)=>{
const userExist=activeusers.find((e)=>e.id == id
)


if(!userExist){
    const decoder=jwt.verify(data,process.env.JWT_SECREAT);
  
    const user=decoder.name;
const value={id:id,name:user}
    activeusers.push(value);  
}


};


const addchatOnline=(id,data)=>{
    const userExist=chatOnlineUsers.find((e)=>(e.id == id)||(e.sender == data.sender))
    

    if(!userExist){
    const value={id:id,room:data.rID,sender:data.sender}
    
    chatOnlineUsers.push(value);
    }
}

const removeUser=(id)=>{
    const index=activeusers.findIndex((e)=>e.id === id);

    if(index !== -1){
        activeusers.splice(index,1)[0]
    }
   
}

const removechatOnline=(data)=>{
     const decoder=jwt.verify(data,process.env.JWT_SECREAT);
  
    const user=(decoder.name).toUpperCase().replace(/\s+/g, '');;
   
    const index=chatOnlineUsers.findIndex((e)=>e.sender === user);

    if(index !== -1){
        chatOnlineUsers.splice(index,1)[0]
    }
   
}

const allUsers=()=>{
    return activeusers;
}

const chatOnline=()=>{
return chatOnlineUsers;
}

const getAllMessages=(id)=>{
    
  
    return allMessages.filter((e)=>e.rID == id);
}

//unread messages
const unreadMessages=(sender,reciver)=>{
    
    return allMessages.filter((e)=>{return (e.sender == sender)&&(e.reciver == reciver)&&(e.reciverStatus=='false')});
}

//made unread messages read
const makeMessageRead=(sender,reciver)=>{
    for(const obj of allMessages)
    {
        if((obj.sender === sender)&&(obj.reciver === reciver))
        {
            obj.reciverStatus='true';
        }
    }
}

module.exports={
    addActiveusers,removeUser,allUsers,addMessages,getAllMessages,textMessage,chatOnline,addchatOnline,removechatOnline,unreadMessages,makeMessageRead

};
