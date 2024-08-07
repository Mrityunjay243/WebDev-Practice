const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const zod = require('zod');
const { User, Account } = require('../db');
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

    // creating a new account with some randomly initialised balance value
    await Account.create({
        userID,
        balance: 1 + Math.random()*1000
    })

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

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put('/', async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success){
        res.status(411).json({
            message: "error while updating information"
        })
    }
    await User.updateOne({ _id: req.userId }, req.body);

    res.json({
        message: "Updated Successfully"
    })
});

// router too get users from the database filterable based on first name and last name
router.get('/bulk', async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username, 
            firstName: user.firstName, 
            lastName: user.lastName,
            _id: user._id   
        }))
    });
})

module.exports = user;