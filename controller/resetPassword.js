const uuid=require('uuid');
const User=require('../models/signup')
const ForgotPassword=require('../models/forgotpassword')


const sgMail = require('@sendgrid/mail');
const bcrypt=require('bcrypt');

exports.forgotpassword= async(req,res,next)=>{
        try {
            const {email}  =  req.body;
            /* console.log("it entered ")
            console.log(">>>>>>>>>>",email); */
            const user = await User.findOne({Email: email });
            console.log(user);
            if(user){
                const id = uuid.v4();
               const forgotPassword = new ForgotPassword({id:id,isactive:true,userId:user._id})

                    await forgotPassword.save();
                sgMail.setApiKey(process.env.SENGRID_API_KEY)

                const msg = {
                    to: email,
                    from: process.env.FROM_EMAIL, 
                    subject: 'Reset Password',
                    text: 'Forgot Password Do Not Worry Click below  ',
                    html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
                }

                sgMail
                .send(msg)
                .then((response) => {
                   /*  console.log(response); */
                    // console.log(response[0].statusCode)
                    // console.log(response[0].headers)
                    return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', success: true})

                })
                .catch((err) => {
                    console.log(">>>>>>>>",err);
                    return res.status(500).json({ message: err, success: false });
                })
            }else {
                return res.status(500).json({ message:"User does Not Exist", success: false });
            }
        } catch(err){
            /* console.error(err) */
            return res.status(500).json({ message: err, success: false });
        }
}

exports.resetpassword=async(req,res,next)=>{

    try{
        const uuid=req.params.id;

     const forgotpasswordrequest = await  ForgotPassword.findOne({id:uuid})
     /* console.log(forgotpasswordrequest);
        console.log(uuid); */
    if(forgotpasswordrequest){
          await forgotpasswordrequest.updateOne({isactive:false})

            res.status(200).send(`<html>
            <script>
                function formsubmitted(e){
                    e.preventDefault();
                }
            </script>
            <form action="/password/updatepassword/${uuid}" method="get">
                <label for="newpassword">Enter New password</label>
                <input name="newpassword" type="password" required></input>
                <button>Reset password</button>
            </form>
        </html>`
        )
res.end()
    }
    else{
        throw new Error("invalid uuid")
    }
    }
    catch(err){
       /*  console.log(err); */
        res.status(500).json({message:err,success:false})
    }
}

exports.updatepassword= async (req,res,next)=>{

        try {
            const { newpassword } = req.query;
            const  resetpasswordid  = req.params.resetpasswordid;
           const resetpasswordrequest= await  ForgotPassword.findOne({ id: resetpasswordid })
              const user= await  User.findOne({ _id : resetpasswordrequest.userId})
                    if(user) {
                        const saltRounds = 10;
                            bcrypt.hash(newpassword,saltRounds,function(err, hash){
                                if(err){
                                    console.log(err);
                                  return res.status(500).json({message:err})
                                }
                               User.updateOne({_id:user._id},{ Password: hash }).then(() => {
                                    res.status(201).json({message: 'Successfuly updated the new password'})
                                }).catch((err)=>{
                                   return res.status(500).json({message:err})
                                })
                            });
                } else{
                    return res.status(404).json({message:'No user Exists', success: false})
                }
        } catch(error){
            return res.status(403).json({ message:error, success: false } )
        }

    }