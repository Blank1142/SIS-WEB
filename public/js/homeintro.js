let intro= document.querySelector('.intro');
let logo=document.querySelector('.login_header');
let logoout=document.querySelectorAll('.info');

window.addEventListener('DOMContentLoaded',()=>{
    setTimeout(()=>{

        logoout.forEach((span,index)=>{
            setTimeout(()=>{
               span.classList.add('active');
            },(index+1)*600);
        });
        setTimeout(()=>{
           
            logoout.forEach((span,idx)=>{
                setTimeout(()=>{
                    span.classList.remove('active');
                    span.classList.add('fade')
                },(idx+1)*200);
            })
        },2000);
        setTimeout(()=>{
            intro.style.top='-100vh'
        },2500);
    })
})