const togglepassword= document.getElementById('togglePassword');
const togglePasswords=document.getElementById('togglePasswords')
const floatingPassword=document.getElementById('floatingPassword');
const password=document.getElementById('Password')
togglepassword.addEventListener('click', () => {
  
          
            const type = password
                .getAttribute('type') === 'password' ?
                'text' : 'password';
                  
            password.setAttribute('type', type);
  
           
            togglepassword.classList.toggle('bi-eye')
        });
togglePasswords.addEventListener('click', () => {
  
          
            const type = floatingPassword
                .getAttribute('type') === 'password' ?
                'text' : 'password';
                  
            floatingPassword.setAttribute('type', type);
  
           
            togglePasswords.classList.toggle('bi-eye')
        });