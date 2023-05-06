const express=require('express')
const router=express.Router()

const auth=require('../middleware/auth')
const controller=require('../controller/purchase')

router.use('/purchase/buyPremium',auth.authenticate,controller.premimumMemberShip)
router.use('/purchase/updatetransaction',auth.authenticate,controller.updatetransaction)

module.exports=router