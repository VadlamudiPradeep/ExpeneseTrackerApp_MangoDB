const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    paymentId:{type:String,required:true},
    orderId:{type:String,required:true},
    status:{type:String,required:true},
    userId:{type:mongoose.Types.ObjectId , required:true}
});

module.exports = mongoose.model('Order', Order);


// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// //id, name , password, phone number, role

// const Order = sequelize.define('order', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     paymentid: Sequelize.STRING,
//     orderid: Sequelize.STRING,
//     status: Sequelize.STRING
// })

// module.exports = Order;