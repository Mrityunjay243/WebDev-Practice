const express = require('express');
const app = express();
const mainRouter = require("./user");

const router = express.router();

router.use("/user", userRouter);
router.use("/accounts", accountRouter);

module.exports = router;