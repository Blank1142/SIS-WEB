var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
  return new bootstrap.Dropdown(dropdownToggleEl)
})


//
async function checkpassword(){
  const pass=document.getElementById('oldpassword').value;
  const url=`/Admin/changePassword/${pass}`

  const res=await fetch(url);
  const data=await res.json();
  if(data.length === 0)
  {
     document.getElementById('liveAlertPlaceholder').innerHTML= '<div class="alert alert-' + 'danger' + ' alert-dismissible" id="alertbox" role="alert">' + 'Password is Not Matching' + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
     $("#alertbox").fadeTo(5000, 0);
     document.getElementById('changePassword').setAttribute("disabled", "disabled");
      document.getElementById('floatingPasswordd').setAttribute("disabled", "disabled");
      setTimeout(function() {
  location.reload();
}, 1000);
  };
} 

document.getElementById('changePassword').addEventListener('click',checkpassword);

///function 

function checkPassword(){
  const newpass=document.getElementById('changePassword').value;
  const checknew=document.getElementById('floatingPasswordd').value;
  if(newpass === checknew){
    return true;
  }
  else{
     document.getElementById('liveAlertPlaceholder').innerHTML= '<div class="alert alert-' + 'danger' + ' alert-dismissible" id="alertbox" role="alert">' + 'New Password is Not Matching' + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    $("#alertbox").fadeTo(5000, 0);
     return false;
  }
};





