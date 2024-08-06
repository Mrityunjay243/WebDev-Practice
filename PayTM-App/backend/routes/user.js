const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const zod = require('zod');
const User = require('../db');
const JWT_SECRET = require('../config');
const router = express.router();

const signupBody = zod.object({
    username: zod.string().email(), 
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
                message: "Invalid inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    });

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })

    const userID = user._id;

    const token = jwt.sign({
        userID
    }, JWT_SECRET);

    res.json({
        message: "User Created Successfully", 
        token: token
    })          
});

const signInBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signInBody.safeParse(req.body);

    if (!success){
        return res.status(411).json({
            message: "Wrong email or password"
        })
    }

    const user = await findOne({
        username: req.body.username,
        password: req.body.password
    })

    if (user) {
        const token = jwt.sign({
            userId: user._id,
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})
module.exports = user;