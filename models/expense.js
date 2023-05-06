const { ObjectId } = require("bson")
const mongoose=require("mongoose")
const Schema=mongoose.Schema
const Expense=new Schema ({
    amount:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    Item:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})
module.exports=mongoose.model("Expense",Expense)