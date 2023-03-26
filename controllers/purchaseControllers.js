const Razorpay = require('razorpay');
const Order = require('../models/orders')
const userControllers = require('./userControllers')
const User = require('../models/user')

const purchasePremium =async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID ,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
            
        })
        const amount = 10000;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            try {
                if (err) {
                    throw new Error(JSON.stringify(err));
                }
                const successOrder = new Order({ orderId: order.id, status: 'PENDING' , userId : req.user._id , paymentId: 'null'} );
                await successOrder.save();
                console.log(`user's orderID ==> ${order.id}`);
                return res.status(201).json({ success : true , order, key_id: rzp.key_id });
            } catch (err) {
                console.log(`error ==>`, err);
                return res.status(404).json({success : false , message : 'Something went wrong' });
            }
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err})
    }
}

 const updateTransactionStatus = async (req, res ) => {
    try {
        const userId = req.user.id;
        const { payment_id, order_id} = req.body;
       // const order  = await Order.findOneAndUpdate({where : {orderid : order_id} }) //2
        const promise1 = Order.findOneAndUpdate( {orderId : order_id} ,{paymentid: payment_id, status: 'SUCCESSFUL'}) 
        const promise2 = User.findByIdAndUpdate({_id:req.user.id},{ isPremiumUser: true }) 

        await Promise.all([promise1, promise2])
            return res.status(202).json({success: true, message: "Transaction Successful", token: userControllers.GenerateAccessToken(userId ,undefined , true) });
                
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Something went wrong' })

    }
}

module.exports = {
    purchasePremium,
    updateTransactionStatus
}