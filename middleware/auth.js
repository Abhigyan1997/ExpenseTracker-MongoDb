const jwt=require('jsonwebtoken')
const User=require('../models/signup')

const authenticate=(req,res,next)=>{
    try{
        const token = req.header('authentication')
        const user=jwt.verify(token,"ThisIsAsecretKeyToEncrpytUserIdForSecureTheDataToHackedWriteAnyThing")

        User.findById(user.userId).then(user=>{
            req.user=user

            next()
        })
        .catch(err=>{
            res.status(500).json({err:err})
        })
    }
    catch(err){
        console.log(err)
        res.status(501).json({err:"something went wrong"})
    }
}

module.exports={authenticate:authenticate}