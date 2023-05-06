const Expense = require('../models/expense')
const User = require('../models/signup')
const UserServices = require('../services/userServices')
const S3Services = require('../services/s3services')


const postItem = async (req, res, next) => {
    try {
        const { amount, description, Item, } = req.body
        const userId = req.user.id
        const expense = new Expense({ amount:amount, description:description, Item:Item, userId:userId})
        expense.save()
        .then(result=>{
            const totalExpense = Number(req.user.total_amount) + Number(amount)
            User.findOneAndUpdate(
                { _id: req.user.id },
                { total_amount: totalExpense },
                { new: true }
              ).then(result=>{
                  res.status(201).json({ expense: expense })
              })
        })

    } catch (err) {
        res.status(501).json({ err: "something went wrong" })
    }
}

const getItem = async (req, res) => {
    try {

        const page = +req.query.page || 1;
        const limit = +req.query.limit || 3
        const expenses = await Expense.find({ userId: req.user.id })
        .skip((page - 1) * limit)
        .limit(limit);

        const allData = await Expense.find({ userId: req.user.id })

        res.status(201).json({
            expense: expenses, hasnextpage: (limit * page < allData.length),
            nextpage: page + 1,
            currentpage: page,
            haspreviouspage: page > 1,
            previouspage: page - 1
        })
    }
    catch (err) {
        console.log(err)
        res.status(501).json({ err: "something went wrong" })
    }
}
const deleteItem = async (req, res, next) => {
    try {
        const ItemId = req.params.id
        const gettingExpenseDetails = await Expense.findById(ItemId)
        const UserDetails = await User.findById(gettingExpenseDetails.userId)
        const response = await Expense.deleteOne({ _id: ItemId, userId: req.user.id })
        console.log(response)
        if (response.deletedCount == 1) {
            const deletedAmount = gettingExpenseDetails.amount
            const UserTotalAmount = UserDetails.total_amount
            const remmainingAmount = Number(UserTotalAmount) - Number(deletedAmount)
            User.findOneAndUpdate(
                { _id: gettingExpenseDetails.userId },
                { total_amount: remmainingAmount},
                { new: true }
              ).then(result=>{
                res.status(201).json({ success: true })
              })
        }
    } catch (err) {
        res.status(501).json({ err: "something went wrong" })
    }
}

const download = async (req, res) => {
    try {
        const expenses = await UserServices.getExpenses(req)

        const stringified = JSON.stringify(expenses);
        const fileName = `expense${req.user.id}/${new Date()}.txt`;

        const fileURL = await S3Services.uploadS3(stringified, fileName)
        file=new fileTable({ link: fileURL, userId: req.user.id })
        res.status(201).json({ fileURL, success: true })

    } catch (err) {
        res.status(401).json({ success: false, err: err })
    }

};


module.exports = {
    postItem: postItem,
    getItem: getItem,
    deleteItem: deleteItem,
    download
}