let express = require('express');

let app = express();

let fs = require('fs');
let path = require('path');
let mongoose = require('mongoose');

let bodyParser = require('body-parser');

let cors = require('cors');
app.use(cors());

 app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//models
// let userModels  = require('./models/user');
// let expensesModels = require('./models/expenses');
// let ordersModels = require('./models/orders');
// const ForgotPasswordModels = require('./models/forgotPassword');

//routes
let userRoutes = require('./routes/userRoutes');
let expensesRoutes =  require('./routes/expensesRoutes');
let purchaseRoutes = require('./routes/purchaseRoutes');
let premiumFeaturesRoutes = require('./routes/premiumFeaturesRoutes');
let forgotPasswordRoutes = require('./routes/resetpasswordRoutes')

// accesslogs
// let accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log')
// ,{flags:'a'}
// );

const dotenv = require('dotenv');


// get config 
dotenv.config();

app.use('/user', userRoutes);
app.use('/expenses' , expensesRoutes);

app.use('/purchase',purchaseRoutes);
app.use('/premium' , premiumFeaturesRoutes);
app.use('/password',forgotPasswordRoutes)


var DBName = 'expenses'
const connectionString = `mongodb+srv://vadlamudipradeep2000:02062000@cluster0.99ucuts.mongodb.net/${DBName}`

mongoose.connect(connectionString)
.then(result=>{
    app.listen(3000, ()=>{
        console.log("Server started running on Port: 3000")
    })
})


// //Asociation 
// userModels.hasMany(expensesModels);
// expensesModels.belongsTo(userModels);
// userModels.hasMany(ordersModels);
// ordersModels.belongsTo(userModels);
// userModels.hasMany(ForgotPasswordModels);
// ForgotPasswordModels.belongsTo(userModels)



// sequelize
// //.sync({force:true})// to create a new table in existed database scema w euse force is to true
// .sync()
// .then(response =>{
//     app.listen(process.env.PORT,()=>{
//         console.log('Port is  running on 3000')
//     });
// })
// .catch(err=>{
//     console.log(err);
// })