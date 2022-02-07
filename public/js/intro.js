let intro= document.querySelector('.intro');
let logo=document.querySelector('.login_header');
let logoout=document.querySelectorAll('.info');
let icon= document.querySelector('.logo')

window.addEventListener('DOMContentLoaded',()=>{
    setTimeout(()=>{
icon.classList.add('active')
        logoout.forEach((span,index)=>{
            setTimeout(()=>{
               span.classList.add('active');
            },(index+1)*600);
        });
        setTimeout(()=>{
            //icon.classList.remove('active');
           // icon.classList.add('fade')
            /*logoout.forEach((span,idx)=>{
                setTimeout(()=>{
                    span.classList.remove('active');
                    span.classList.add('fade')
                },(idx+1)*100);
            })*/
        },2000);
        setTimeout(()=>{
            intro.style.top='-100vh'
        },2500);
    })
})