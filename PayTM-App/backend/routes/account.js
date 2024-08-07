const express = require('express');
const app = express()
const router = express.Router();

const { mongoose } = require('mongoose');
const { Account } = require('../db');
const { authMiddleware } = require('../middleware');

router.get('/balance', authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });
    
    res.json({
        balance: account.balance
    })
});

// creating a transaction in MongoDB

router.post('/transfer', authMiddleware, async (req, res) => {

    // Allows us to do a bunch of thing together, and if anyone of them fails, then just revert
    const session = await mongoose.startSession();

    const { amount, to } = req.body;

    // fetching the accounts within the transaction 
    const account = await Account.findOne({userId: req.userId }).session(session);

    if (!account || account.balance<amount){
        // aborting the transaction 
        await session.abortTransaction();

        return res.status(400).json({
            message: "The account is invalid"
        });
    }

    // fetching the details of the person we're sending the money to
    const toAccount = await Account.findOne({userId: to}).session(session);

    if (!toAccount){
        await session.abortTransaction();

        return res.status(400).json({
            message: "Invalid Account"
        })
    }

    // Performing the transfer
    await Account.updateOne({userId: req.userId}, { $inc: { balance: -amount }}).session(session);
    await Account.updateOne({userId: to}, {$inc: { balance: amount}}).session(session);

    await session.commitTransaction();

    res.json({
        message: "Transaction successful"
    })
});


