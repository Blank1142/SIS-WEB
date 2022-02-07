let inst= document.getElementById('alertcheck');
async function  checkid (){
    const value=document.getElementById('emp_id').value;
    const url=`/Admin/User_check?id=${value}`
    const res=await fetch(url);
    const data=await res.json();
   
    if(data.length === 1)
{
  
    document.getElementById('alertcheck').innerHTML= '<div class="alert alert-' + 'danger' + ' alert-dismissible" role="alert">' + 'Employee ID is used' + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
document.getElementById('setfloatingPassword').setAttribute("disabled", "disabled");
    document.getElementById('Phone').setAttribute("disabled", "disabled")
     document.getElementById('role').setAttribute("disabled", "disabled")
       document.getElementById('manager').setAttribute("disabled", "disabled")
      setTimeout(function() {
  location.reload();
}, 2000);
}
}
async function checkemail(){
    const value=document.getElementById('Email').value;
    const url=`/Admin/User_check?value=${value}`;
    const res=await fetch(url);
 const data=await res.json();
  
      if(data.length === 1)
{
  
   inst.innerHTML='<div class="alert alert-' + 'danger' + ' alert-dismissible" role="alert">' + "This Email ID Exist's in Our DataBase" + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    document.getElementById('setfloatingPassword').setAttribute("disabled", "disabled");
    document.getElementById('Phone').setAttribute("disabled", "disabled")
     document.getElementById('role').setAttribute("disabled", "disabled")
       document.getElementById('manager').setAttribute("disabled", "disabled")
      setTimeout(function() {
  location.reload();
}, 2000);

}
}

document.getElementById('Name').addEventListener('click',checkid);
document.getElementById('role').addEventListener('click',checkemail)