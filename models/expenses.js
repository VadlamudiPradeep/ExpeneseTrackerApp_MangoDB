const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    expenses:{type:String, required:true},
    description:{type:String , required:true},
    category:{type:String,required:true},
    userId:{type:mongoose.Types.ObjectId, ref:'User', required:true}
});
module.exports = mongoose.model('Expenses' , User);


// let Sequelize = require('sequelize');
// let sequelize = require('../util/database');

// let User = sequelize.define('expenses',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true,
//     },
//     expenses:Sequelize.INTEGER,
//     description:Sequelize.STRING,
//     category:Sequelize.STRING,
  
// });

// module.exports = User;