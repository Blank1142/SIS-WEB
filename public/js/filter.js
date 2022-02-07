
document.getElementById('status').addEventListener('change',()=>{
    const value=document.getElementById('status').value;
    console.log(value);
    window.location.replace(`/filter?id=${value}`);
})