const bcrypt=require('bcrypt')
const jwt =require('jsonwebtoken')
const User = require('../models/signup')

function isstringvalidate(str) {
    if (str == undefined || str.length === 0) {
        return true
    }
    else {
        return false
    }
}

function generateToken(id,name,ispremium){
    return jwt.sign({userId:id,name:name,ispremium:ispremium},"ThisIsAsecretKeyToEncrpytUserIdForSecureTheDataToHackedWriteAnyThing")
}

const signUp = async (req, res, next) => {

    try{
        const { Name, Number, Email, Password } = req.body;
        console.log(Name, Number, Email, Password)
        if (isstringvalidate(Name) || isstringvalidate(Email) || isstringvalidate(Password)) {
            return res.status(400).json({ err: "something is missing" })
        }

            const saltRounds=10;
            bcrypt.hash(Password,saltRounds,async(err,hash)=>{
            let user=new User({ Name:Name, Number:Number,Email:Email,Password:hash})
            user.save()
            .then(result=>{
                res.status(201).json({ message: "signUp successfully" })
            })
        })
    }
    catch(err){
        console.log("err>>>",err)
        res.status(500).json({ err: "something went wrong" })
    }
}

const login = async (req, res, next) => {
    try {
        const { Email, Password } = req.body
        const isData = await User.findOne({ Email: Email})
        if (isData){
            console.log(Password,isData.Password)
            bcrypt.compare(Password,isData.Password,(err,result)=>{
                if(result==true){
                    return res.status(200).json({ message: "User Logged in succesfully",token:generateToken(isData.id,isData.Name,isData.ispremium) })
                }
                else{
                    return res.status(401).json({ message: "password mismatch" })
                }
            })
        } else {
            return res.status(404).json({ message: "user is not exist" })
        }
    }
    catch (err) {
        console.log("err",err)
        res.status(500).json({ message: "something went wrong" })
    }
}
module.exports = {
    signUp: signUp,
    isUser: login,
    generateToken:generateToken
}