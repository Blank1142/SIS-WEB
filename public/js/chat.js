

const socket=io();
//
const autoscroll=()=>{
     $viewmessages.scrollTop=$viewmessages.scrollHeight
}
$(window).bind("pageshow", function(event) {
 
    if (event.originalEvent.persisted) {
        window.location.reload(); 
    }
});

function sound(){
  const notification=new Audio('./mp3/Notification.mp3')
  const playedPromise=notification.play()
  if (playedPromise) {
                    playedPromise.catch((e) => {
                        console.log(e)
                        if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') {
                            console.log(e.name);
                        }
                    }).then(() => {

                    });
                }
}


    //toster
  socket.on('tosterMessage',(message)=>{
      
document.getElementById('tosterSenderName').innerHTML= message.sender;
document.getElementById('tosterTimeValue').innerHTML=moment(message.time).format('h:mm a');
document.getElementById('tosterMessageValue').innerHTML=message.message;
//  
 const cname1 = 'OAEUD' + "=";
  const cDecoded1 = decodeURIComponent(document.cookie); //to be careful
  const cArr1 = cDecoded1.split('; ');
  let res;
  cArr1.forEach(val => {
    if (val.indexOf(cname1) === 0) res = val.substring(cname1.length);
  })

  
if(message.reciver == res)
{
  sound();

      	// Passing option
        $("#myToast").toast({
            delay: 5000
        }); 
      	
      	// Show toast
      	$("#myToast").toast("show");
      }
  })
   

//new User

 
   const cname = 'sisChat' + "=";
  const cDecoded = decodeURIComponent(document.cookie); //to be careful
  const cArr = cDecoded.split('; ');
  let res;
  cArr.forEach(val => {
    if (val.indexOf(cname) === 0) res = val.substring(cname.length);
  })
  socket.emit('newUser',res)

//chatonlineCheck

if(!(document.getElementById('room')))
{
  
socket.emit('chatonlineremove',res);
}
//user
const room=document.getElementById('room');
const sender=document.getElementById('sender');
const reciver=document.getElementById('reciver');
;
//elements

const $messageform=document.getElementById('message-form');
const $message=document.getElementById('message');
const $sendbtn=document.getElementById('sendbtn')

//templet
const templet=document.getElementById('message-templet').innerHTML;
const recivemessage=document.getElementById('message-templet-reciver').innerHTML;
const $viewmessages=document.getElementById('messages');
const locationsender=document.getElementById('location-templet').innerHTML;
const locationReciver=document.getElementById('location-templet-reciver').innerHTML;
const imagesender=document.getElementById('image-templet').innerHTML;
const imagereciver=document.getElementById('image-templet-reciver').innerHTML
//file Data
let fileStatus=false
let file=''
const fileData=document.getElementById('file-change');
fileData.addEventListener('change',(e)=>{

   file =e.target.files[0];
 fileStatus=true
$message.value=file.name;

   })

//messages
socket.on('Message',({message})=>{

  message.forEach((e)=>{
      
     if(e.type == 'text')
  {
    if(e.sender == sender.innerHTML)
{
 
  const html=Mustache.render(templet,{name:e.sender,message:e.message,createdAt:moment(e.time).format('h:mm a')})
 $viewmessages.insertAdjacentHTML('beforeend',html);
  
}else{
  const html=Mustache.render(recivemessage,{name:e.sender,message:e.message,createdAt:moment(e.time).format('h:mm a')})
 $viewmessages.insertAdjacentHTML('beforeend',html);
}
//location

  }else if(e.type == 'location'){
    if(e.sender == sender.innerHTML)
{
 
  const html=Mustache.render(locationsender,{name:e.sender,messageLocation:e.message,createdAt:moment(e.time).format('h:mm a')})
 $viewmessages.insertAdjacentHTML('beforeend',html);
  
}else{
  const html=Mustache.render(locationReciver,{name:e.sender,messageLocation:e.message,createdAt:moment(e.time).format('h:mm a')})
 $viewmessages.insertAdjacentHTML('beforeend',html);
}

  }
  else if(e.type == "media")
  {
  
 const blob=new Blob([e.message.body],{type:e.message.mimeType})
if(e.sender == sender.innerHTML)
{
 
  const html=Mustache.render(imagesender,{name:e.sender,imageurl:URL.createObjectURL(blob),imagetype:e.message.mimeType,createdAt:moment(e.time).format('h:mm a')})
 $viewmessages.insertAdjacentHTML('beforeend',html);
  
}else{
  const html=Mustache.render(imagereciver,{name:e.sender,imageurl:URL.createObjectURL(blob),imagetype:e.message.mimeType,createdAt:moment(e.time).format('h:mm a')})
 $viewmessages.insertAdjacentHTML('beforeend',html);
 


}
  }
  })

autoscroll();
});
//newmessages
socket.on('newMessage',({message})=>{
  
  if(message.type == 'text')
  {
  if(message.sender == sender.innerHTML)
  {
const html=Mustache.render(templet,{name:message.sender,message:message.message,createdAt:moment(message.time).format('h:mm a')})
 $viewmessages.insertAdjacentHTML('beforeend',html);
  }else{
  const html=Mustache.render(recivemessage,{name:message.sender,message:message.message,createdAt:moment(message.time).format('h:mm a')})
 $viewmessages.insertAdjacentHTML('beforeend',html);
}
  }else if(message.type == 'location'){
    if(message.sender == sender.innerHTML)
{
 
  const html=Mustache.render(locationsender,{name:message.sender,messageLocation:message.message,createdAt:moment(message.time).format('h:mm a')})
 $viewmessages.insertAdjacentHTML('beforeend',html);
  
}else{
  const html=Mustache.render(locationReciver,{name:message.sender,messageLocation:message.message,createdAt:moment(message.time).format('h:mm a')})
 $viewmessages.insertAdjacentHTML('beforeend',html);
}

  }
  else if(message.type == "media")
  {
  
    const blob=new Blob([message.message.body],{type:message.message.mimeType})
if(message.sender == sender.innerHTML)
{
 
  const html=Mustache.render(imagesender,{name:message.sender,imageurl:URL.createObjectURL(blob),imagetype:message.message.mimeType,createdAt:moment(message.time).format('h:mm a')})
 $viewmessages.insertAdjacentHTML('beforeend',html);
  
}else{
  const html=Mustache.render(imagereciver,{name:message.sender,imageurl:URL.createObjectURL(blob),imagetype:message.message.mimeType,createdAt:moment(message.time).format('h:mm a')})
 $viewmessages.insertAdjacentHTML('beforeend',html);



}
  }

 autoscroll();
})
//const html=Mustache.render(templet,{name:message.name,message:message.message,createdAt:moment(message.time).format('h:mm a')}
   //$viewmessages.insertAdjacentHTML('beforeend',html)});


    $messageform.addEventListener('submit',(e)=>{
        e.preventDefault();
$sendbtn.setAttribute('desabled','desabled');

if(fileStatus === true){
const fileValues={
    type:'file',
    body:file,
    mimeType:file.type,
    fileName:file.name
}
const data={rID:room.value,message:fileValues,sender:sender.innerHTML,reciver:reciver.innerHTML,type:'media'}
 socket.emit('textMessage',data)
  fileStatus=false;
    $message.value="";
   $message.focus();
   fileStatus=false;
   $sendbtn.removeAttribute('desabled','desabled')

}else{
const message=e.target.elements.message.value;
const data={rID:room.value,message:message,sender:sender.innerHTML,reciver:reciver.innerHTML,type:'text'}

socket.emit('textMessage',data)
$message.value='';
$message.focus();
$sendbtn.removeAttribute('desabled','desabled')


}


    })

//send location

document.getElementById('send_location').addEventListener('click',()=>{
  //check support
  
  if(!navigator.geolocation){
    return alert('Geolocation is not supported by your browser');
  }
  document.getElementById('send_location').setAttribute('disabled','disabled');
  navigator.geolocation.getCurrentPosition((p)=>{
    socket.emit('send_location',{
      rID:room.value,message:{
        latitude:p.coords.latitude,
        longitude:p.coords.longitude
      },sender:sender.innerHTML,reciver:reciver.innerHTML,type:'location'
    },(message)=>{
      document.getElementById('send_location').removeAttribute('disabled')
    })
  })
})

    //join
    if(room.value && sender.innerHTML && reciver.innerHTML){

   const data={rID:room.value,message:'',sender:sender.innerHTML,reciver:reciver.innerHTML,type:''}
   socket.emit('Join',data);
    }
    else{
      alert('An Error Accrued. Try again !!!')
       location.href='/'
    }

//checkUserCahat Online
if(room.value && sender.innerHTML && reciver.innerHTML){

   const data={rID:room.value,sender:sender.innerHTML,reciver:reciver.innerHTML}
   socket.emit('chatJoin',data);
    }
    else{
      alert('An Error Accrued. Try again !!!')
       location.href='/'
    }




