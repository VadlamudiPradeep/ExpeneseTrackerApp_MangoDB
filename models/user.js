const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isPremiumUser:{
    type: Boolean,
    required: true
  },
  // totalExpenses :{
  //           type:String,
  //           defaultValue:0,
  //           required:true
  //       }
})

module.exports = mongoose.model('User', userSchema);






// let Sequelize = require('sequelize');
// let sequelize = require('../util/database');

// require('dotenv').config();

// let User = sequelize.define('user',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true,
//     },
//     name:Sequelize.STRING,
//     email:{
//         type:Sequelize.STRING,
//         allowNull:false,
//         unique:true,
//     },
//     phone:Sequelize.STRING,
//     password:Sequelize.STRING,
//     ispremiumuser: Sequelize.BOOLEAN,
//     totalExpenses :{
//         type:Sequelize.STRING,
//         defaultValue:0,
//     }
// });

// module.exports = User;