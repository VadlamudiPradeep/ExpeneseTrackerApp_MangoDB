var token = localStorage.getItem('token');
var list = document.getElementById('list');
const numberOfRows = localStorage.getItem('numberOfRows');
var message = document.getElementById('message')
const pagination = document.getElementById('pagination');
let logout = document.getElementById('logout');
logout.addEventListener('click', lg)
function lg(){
    localStorage.removeItem('token');
    localStorage.removeItem('rzp_device_id')
    localStorage.removeItem('rzp_checkout_anon_id');
    window.location.href='../Signup/signup.html'
}
async function saveToDB(e) {
    try{
        e.preventDefault();
        console.log(e.target.description.value);

        const addExpense = {
            expenses: e.target.amount.value,
            description: e.target.description.value,
            category: e.target.category.value
        }
        console.log(addExpense);

    
        await axios.post('http://localhost:3000/expenses/addExpenses', addExpense , {headers:{'Authorization': token}} ).then(response => {
                alert(response.data.message)
                addNewExpensetoUI(response.data.expense);
              
        })
        
    } catch(err) {
        document.body.innerHTML += `<div style="color:red;">${err} </div>`
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}



// // // DOMContentLoaded
window.addEventListener('DOMContentLoaded',  async () => {
    // const token  = localStorage.getItem('token')
    const decodeToken = parseJwt(token)
    console.log(decodeToken)
    const isPremiumUser = decodeToken.isPremiumUser
    if(isPremiumUser){
        showPremiumuserMessage()
        showLeaderboard();
    }
   const page = 1
    let response = await axios.get(`http://localhost:3000/expenses/getExpenses?page=${page}&numberOfRows=${numberOfRows}`,{headers:{'Authorization': token}})
  
    console.log(response.data)
    if(response.data.expenses && response.data.expenses.length){
        response.data.expenses.forEach(expense=>{
            addNewExpensetoUI(expense);
          
            // changePages();
            });
            // showPagination(response.data);
            showPagination(response.data)

           
    }else{
        console.log('No data is found')
    }
  

  

})

// // Show Expense to DOM / UI
function addNewExpensetoUI(expense) {
    try{
    // After submit clear input field
    document.getElementById("amount").value = '';
    document.getElementById("description").value = '';
    document.getElementById("category").value = '';
   
    // const parentElement = document.getElementById('expenseTracker');
  
   // const expenseElemId = `expense-${expense._id}`;
   const li = document.createElement('li');
   li.setAttribute('id',expense._id)
    li.innerHTML += `
            ${expense.expenses} - ${expense.category} - ${expense.description}
        `;
        const del = document.createElement('button');
        del.className= 'delete';
        del.id = 'del'
        del.innerText='Delete';
        li.appendChild(del)
        list.appendChild(li)
    } catch(err){
        // console.log(err)
        showError(err);
    }
}


list.addEventListener('click', deleteExpense);
async function deleteExpense(event){
   // console.log('event.target.id ==del ', event.target.id == 'del')
  if(event.target.id=='del'){
    console.log('event.target.id ==del ', event.target.id == 'del')
       
            const li = event.target.parentNode; 
            const id = li.id
           let response = await axios.delete(`http://localhost:3000/expenses/deleteExpense/${id}`,{headers:{'Authorization': token}})
             console.log(response);
             list.removeChild(li)
  }else{

    console.log('not able to delete');
    alert('Cant able to delete form the screen')
  }

};


//setROws 

let row = document.getElementById('setRows');
row.addEventListener('click', ()=>{
    const numberOfRow = document.getElementById('rows').value;
    localStorage.setItem('numberOfRows',numberOfRow);
    return window.location.reload();
});




document.getElementById('premium1').onclick = async function (e) {
 try{
    e.preventDefault();
    const response  = await axios.get('http://localhost:3000/purchase/premiumMembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "order_id": response.data.order.id,// For one time payment
     // This handler function will handle the success payment
     "prefill": {
        "name": "pradeep naidu",
        "email": "vadlamudipradeep2000@gmail.com",
        "contact": "0000000"
      },
     "theme":{
        "color":"#3399c",
     },
     
     "handler": async function (response) {
        const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
             
         }, { headers: {"Authorization" : token} })
        
        console.log(res)
         alert('You are a Premium User Now')
         document.getElementById('premium1').style.visibility = "hidden"
         document.getElementById('message').innerHTML = "You are a premium user "
         localStorage.setItem('token', res.data.token)
         showLeaderboard();
        download();
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
    console.log(response)
    alert(response.error.code);
  alert(response.error.description);
  alert(response.error.source);
  alert(response.error.step);
  alert(response.error.reason);
  alert(response.error.metadata.order_id);
  alert(response.error.metadata.payment_id);
 });

 }catch(err){
    console.log('error')
 }
    
}
// Show Error
function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
};  
//Show prime user
function showPremiumuserMessage() {
    document.getElementById('premium1').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "You are a premium user "
}


///leaderBoard 

function showLeaderboard(){
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = 'Show Leaderboard';
    inputElement.onclick = async() => {
     
        const response= await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: {"Authorization" : token} })
        console.log("response ===>" + response)
        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += '<h1> Leader Board </<h1>'
        response.data.data.forEach((Data) => {
            console.log('data ===> '+ Data)
            leaderboardElem.innerHTML += `<li>Name -${Data.name} Total Expense - ${Data.total_amount} </li>`;
        })
    }
    message.appendChild(inputElement);
   

};
function download(){
     let token = localStorage.getItem('token');
    axios.get('http://localhost:3000/expenses/download',{headers:{'Authorization':token}}).then(response=>{
       if(response.status === 200){
        let a = document.createElement('a');
        a.href = response.data.fileURL;
        a.download = 'myexpenses.csv';
        a.click();
       }else{
        alert('Failed to Download the file')
       }
    
        // const href = URL.createObjectURL(response.data);
        // const link = document.createElement('a');
        // link.href = href;
        // link.setAttribute('download', 'expense.txt'); //or any other extension
        // document.body.appendChild(link);
        // link.click();
        // // clean up "a" element & remove ObjectURL
        // document.body.removeChild(link);
        // URL.revokeObjectURL(href);
        // console.log(response)
    }).catch(err=>console.log(err))
};


// //function of pagination
function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage ,
    previousPage ,
    lastPage ,
}) {
    pagination.innerHTML = "" ;
    if(currentPage !=1 && previousPage!=1){
        const btn = document.createElement('button');
        btn.innerText = 1;
        btn.className = "pagination";
        btn.addEventListener('click' , () => {
            list.innerHTML = "";
            gettingAllExpence(1);
        })
        const span = document.createElement('span');
        span.innerText = '......';
        pagination.appendChild(btn);
        pagination.appendChild(span);
    } 
    if(hasPreviousPage){
        const btn = document.createElement('button');
        btn.innerText = previousPage;
        btn.className = "pagination";
        btn.addEventListener('click' , () => {
            list.innerHTML = "";
            gettingAllExpence(previousPage);
        })
        pagination.appendChild(btn);
    }
    const btn2 = document.createElement('button');
    btn2.className = "pagination";
    btn2.innerHTML = `<h3>${currentPage}</h3>`;
    btn2.addEventListener('click' , () => {
        list.innerHTML = "";
        gettingAllExpence(currentPage);
    })
    pagination.appendChild(btn2);
    if(hasNextPage){
        const btn = document.createElement('button');
        btn.innerText = nextPage;
        btn.className = "pagination";
        btn.addEventListener('click' , () => {
            list.innerHTML = "";
            gettingAllExpence(nextPage);
        })
        pagination.appendChild(btn);
    }
    if(nextPage != lastPage && currentPage != lastPage){
        const btn = document.createElement('button');
        btn.innerText = lastPage;
        btn.className = "pagination";
        btn.addEventListener('click' , () => {
            list.innerHTML = "";
            gettingAllExpence(lastPage);
        })
        const span = document.createElement('span');
        span.innerText = '......';
        pagination.appendChild(span);
        pagination.appendChild(btn);
    } 
}

// //in pagination when we call again gettingAllExpence
async function gettingAllExpence(page){
    const result = await axios.get(`http://localhost:3000/expenses/getExpenses?page=${page}&numberOfRows=${numberOfRows}` , 
    
    {headers: { "Authorization": token} });
    result.data.expenses.forEach(element => {
        // console.log(element);
        addNewExpensetoUI(element);
    });
    showPagination(result.data)

}




// // Dynamic Pagination

// // Records per page
// function changePages(){
//     let rows = document.getElementById('rows')
//     const val=parseInt(rows.value)
//     axios.get(`http://localhost:3000/expenses/pages/${val}`,{headers:{'Authorization':token}} ).then(response=>{
//         displayList()
//     }).catch(err=>console.log(err))
// }