async function signIn(e){
    try{
     e.preventDefault();
  
     let loginDetails = {
        email:e.target.email.value,
        password:e.target.password.value,
     };
  
     if(loginDetails.email.length < 0){
      alert('Enter a valid email');
      return;
     }else if(loginDetails.password.length < 8){
      alert('Enter A strong password')
     };
  
  let response = await axios.post('http://localhost:3000/user/signIn', loginDetails);
          alert(response.data.message);
          localStorage.setItem('token' , response.data.token);
          if(response.data.success === true ){
              window.location.href = '../Expenses/expenses.html';
          }else{
              throw new Error('Login is failed')
          }
    }
    catch(err){
      document.body.innerHTML += `<div style="color:black">${err.message}<div>`;
    }
  };
  
  function forgotpassword(){
      window.location.href = '../ForgotPassword/forgotPassword.html';
  }