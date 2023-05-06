const express=require("express")
const bodyParser=require("body-parser")
const mongoose=require("mongoose")
const cors=require("cors")

const app=express()
app.use(cors({
    origin:"*"
}))

app.use(bodyParser.json({extended:false}));

const signUpRoute=require("./routes/signup")
const expenseRoute=require("./routes/expense")
const purchaseRoute=require('./routes/purchase');
const premiumRoute=require('./routes/premiumFeatures');
const forgotPasswordRoute=require('./routes/forgotPassword');



app.use(signUpRoute)
app.use(expenseRoute)
app.use(purchaseRoute)
app.use(premiumRoute)
app.use(forgotPasswordRoute)

mongoose.connect("mongodb+srv://alokabhigyan65:Abhi1997$$@sharpenerproject.msds32f.mongodb.net/?retryWrites=true&w=majority")
.then(result=>{
    app.listen(3000)
    console.log("Connected to MongoDB")
})
.catch(err=>{
    console.log(err)
})