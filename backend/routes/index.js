const express = require("express");
const router = express.Router();
const accountRouter = require("./account");
const userRouter = require("./user");

router.use("/account", accountRouter);
router.use("/user", userRouter);

module.exports = router;
