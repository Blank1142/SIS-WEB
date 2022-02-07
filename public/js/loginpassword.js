const togglepassword= document.getElementById('togglePassword');
const floatingPassword=document.getElementById('floatingPassword');
 let inst= document.getElementById('liveAlertPlaceholder');
togglepassword.addEventListener('click', () => {
  
          
            const type = floatingPassword
                .getAttribute('type') === 'password' ?
                'text' : 'password';
                  
            floatingPassword.setAttribute('type', type);
  
           
            togglepassword.classList.toggle('bi-eye');
        });



floatingPassword.addEventListener('click',async()=>{
const value=document.getElementById('Email').value;
const res=await fetch(`/loginfilter?id=${value}`);
const data=await res.json();
if(data.length === 0)
{
  
   inst.innerHTML='<div class="alert alert-' + 'danger' + ' alert-dismissible" id="alertbox" role="alert">' + 'User does not exist in the Data Base contact Admin are check your UserID' + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
 $("#alertbox").fadeTo(5000, 0);
}


});
