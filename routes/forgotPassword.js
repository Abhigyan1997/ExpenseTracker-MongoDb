const express=require('express')
const router=express.Router()
const resetpasswordController=require('../controller/resetPassword')

router.get('/password/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)

router.get('/password/resetpassword/:id', resetpasswordController.resetpassword)

router.use('/password/forgotpassword', resetpasswordController.forgotpassword)

module.exports = router;