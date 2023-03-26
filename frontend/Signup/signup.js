async function signup(e){
    try{
        e.preventDefault();
    
        let signupDetails ={
            name:e.target.name.value,
            email:e.target.email.value,
            phone:e.target.phone.value,
            password:e.target.password.value
        };
      if(signupDetails.name.length < 4 || signupDetails.name === ''){
        alert('Enter a valid name');
        return ;
      }else if(signupDetails.email === ''){
        alert('Enter a valid email');
        return ;
      }else if(signupDetails.phone.length < 10 || signupDetails.password.length < 8){
        alert('Enter a valid email');
        return ;
      }

        
     let response  = await axios.post('http://localhost:3000/user/signup', signupDetails)
       if(response.data[1] === false){
        alert('This email address in use please login....')
       }else if(response.status === 201){
        window.location.href = '../Login/login.html';
       }else{
        throw new ErrorEvent('Failed to login')
       }
        
    }
catch(err){
       document.body.innerHTML += `<h3 style="color:black">${err}</h3>`
}

}