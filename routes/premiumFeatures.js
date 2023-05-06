const express=require('express')
const router=express.Router()

const auth=require('../middleware/auth')
const controller=require('../controller/premiumFeatures')

router.use('/premium/leaderboard',auth.authenticate,controller.getUserLeaderBoard)

module.exports=router