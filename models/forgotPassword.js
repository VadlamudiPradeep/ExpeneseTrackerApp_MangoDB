
const mongoose = require('mongoose');
const { UUID, UUIDV4 } = require('sequelize');
const Schema = mongoose.Schema;

const forgotpasswordSchema = new Schema({
    isActive : { type : Boolean, required : true},
    email : { type : String , required : true},
    id : { type : String , required : true}
});

module.exports = mongoose.model('Forgotpassword' , forgotpasswordSchema);



// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// //id, name , password, phone number, role
// // create new table -> forgotpassword

// const Forgotpassword = sequelize.define('forgotpassword', {
//     id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//         primaryKey: true
//     },
//     active: Sequelize.BOOLEAN,
//     expiresby: Sequelize.DATE
// })

// module.exports = Forgotpassword;