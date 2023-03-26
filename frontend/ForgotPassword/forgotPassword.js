
async function forgotPassword(e){
    try{
    e.preventDefault();

    let form = new FormData(e.target);

    let userDetails = {
        email : e.target.email.value,
    }

    let response = await axios.post('http://localhost:3000/password/forgotPassword',userDetails);
    if(response.status === 200){
        alert('Mail is successfully sent');
    }else{
        throw new Error('Something went wrong');
    }
    }
    catch(err){
        showError(err);
    }
}
function showError(err){
    document.body.innerHTML += `<h3 style="color:black">${err}</h3>`
}