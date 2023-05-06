const express=require('express')
const router=express.Router()

const controller=require('../controller/expense')
const auth=require('../middleware/auth')

router.use('/expense/addItem',auth.authenticate,controller.postItem)
router.use('/expense/getItem',auth.authenticate,controller.getItem)
router.use('/expense/deleteItem/:id',auth.authenticate,controller.deleteItem)
router.use('/expense/download',auth.authenticate,controller.download)

module.exports=router