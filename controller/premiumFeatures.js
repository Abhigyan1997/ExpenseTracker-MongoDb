const User=require('../models/signup')

const getUserLeaderBoard=async(req,res,next)=>{
    try{
        const total_amount = await User.find().sort({total_amount:-1})

        res.status(201).json(total_amount)

    }catch(err){
        console.log(err)
        res.status(501).json({err:err})
    }
}

module.exports ={
    getUserLeaderBoard
}