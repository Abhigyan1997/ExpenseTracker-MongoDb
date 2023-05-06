const razorpay = require('razorpay')
const Order = require('../models/order')
const controller=require("../controller/signup")


const premimumMemberShip = async (req, res, next) => {
    try {
        var rzp = new razorpay({
            key_id:'rzp_test_TWRaANheNLZPAL',
            key_secret:'nmGfBDlN4HuJinLXKvN4y0s9',
        })
        const amount = 2500

        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err))
            }
            const neworder =new Order({ orderid: order.id, status: 'PENDING',userId:req.user._id})
            neworder.save()
            .then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id })
            })
                .catch(err => {
                    console.log(err)
                })
        })
    } catch (err) {
        console.log(err)
    }
}

const updatetransaction = async(req,res,next) => {
    const userId=req.user.id
    try {
        const { payment_id, order_id } = req.body
        const promise1 =  Order.findOneAndUpdate({orderid:order_id},{ paymentid: payment_id, status: 'SUCCESSFUL'})
        const promise2 =  User.findByIdAndUpdate({_id:userId},{ ispremium: true }) 

        Promise.all([promise1,promise2]).then((result)=>{
            const token= controller.generateToken(userId,req.user.Name,true)
            return res.status(201).json({success:true,message:'transaction successfull',token:token})
        }).catch((err)=>{
            console.log(err)
        })
    }
    catch (err) {
        console.log(err)
        res.status(404).json({err:"something went wrong"})
    }
}

module.exports = { premimumMemberShip: premimumMemberShip,
    updatetransaction:updatetransaction}