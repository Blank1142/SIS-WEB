// <a href="#" type="button" class="btn btn-light btn-small"><i class="bi bi-eye"></i> </a>
////////////////////////////////////////

async function getmanagementdata() {
  let value = document.getElementById("role").value;
  if (value === "DST") {
    value = "ASM";
  } else if (value === "ASM") {
    value = "TL";
  } else if (value === "TL") {
    value = "CM";
  } else if (value === "CM") {
    value = "SFH";
  } else if (value === "SFH") {
    value = "RH";
  } else if (value === "SEH") {
    value = "RH";
  } else {
    value = value;
  }

  let url = `/getmanagerdata/${value}`;
  let resp = await fetch(url);
  let data = await resp.json();

  let htm = `<option value="" name="manager">--None--</option>`;
  if (data.length === 0) {
    document.querySelector("#manager").innerHTML = htm;
  } else {
    data.forEach((data) => {
      let arra = [data.emp_id, data.emp_name];

      htm += `<option value="${arra}" name="manager">${data.emp_name}</option>`;
    });

    document.querySelector("#manager").innerHTML = htm;
  }
}

document.querySelector("#role").addEventListener("change", getmanagementdata);

// let response = await fetch(`http://localhost:5000/getmanagerdata/${value}`);
//  let data = await response.json();
//   console.log(data)
//////////////////////////////////////

function getmanagerID() {
  let IDValues = document.querySelector("#manager").value;
  const managerD = IDValues.split(",");

  document.querySelector("#managerid").value = managerD[0];
}

document.querySelector("#manager").addEventListener("change", getmanagerID);

///

var icon = document.getElementById("generate_password");
document
  .querySelector("#generate_password")
  .addEventListener("click", generatepassword);

function generatepassword() {
  let pass = Math.floor(Math.random() * (9999999 - 99999 + 1));
  let password = "Nur" + pass + "oN";

  document.querySelector("#floatigPassword").value = password;
  icon.classList.toggle("bi-toggle2-on");
};
