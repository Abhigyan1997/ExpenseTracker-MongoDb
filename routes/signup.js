const express=require('express')
const router=express.Router()
const controller= require('../controller/signup')

// signUp and Login route
router.post('/user/signup',controller.signUp)
router.post('/user/login',controller.isUser)

module.exports=router