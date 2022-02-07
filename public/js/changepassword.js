const togglepassword= document.getElementById('togglePassword');
const togglePasswordnew=document.getElementById('togglePasswordnew')
const togglePasswordsetnew=document.getElementById('togglePasswordsetnew')
const oldpassword=document.getElementById('oldpassword');
const changePassword=document.getElementById('changePassword');
const floatingPasswordd=document.getElementById('floatingPasswordd');
togglepassword.addEventListener('click', () => {
  
          
            const typeold = oldpassword
                .getAttribute('type') === 'password' ?
                'text' : 'password';
                  
            oldpassword.setAttribute('type', typeold);
             
             
  
           
            togglepassword.classList.toggle('bi-eye')
        });

togglePasswordnew.addEventListener('click',()=>{
            const typenew = changePassword
                .getAttribute('type') === 'password' ?
                'text' : 'password';
                  
            changePassword.setAttribute('type', typenew);
            togglePasswordnew.classList.toggle('bi-eye');

        })



        togglePasswordsetnew.addEventListener('click',()=>{
            const typesetnew = floatingPasswordd
                .getAttribute('type') === 'password' ?
                'text' : 'password';
                  
            floatingPasswordd.setAttribute('type', typesetnew);
          togglePasswordsetnew  . classList.toggle('bi-eye');
            
        })