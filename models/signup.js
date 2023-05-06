const mongoose=require("mongoose")
const Schema=mongoose.Schema
const User=new Schema({

      Name:{
        type:String,
        required:true
      },
      Number:{
        type:Number,
        required:true
      },
      Email:{
        type:String,
        required:true
      },
      Password:{
        type:String,
        required:true
      },
      ispremium:{
        type:Boolean,
      required:true,
      default:false
      },
      total_amount:{
        type:Number,
        required:true,
        default: 0
      }
})

module.exports=mongoose.model("User",User)