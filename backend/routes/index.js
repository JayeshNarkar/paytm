const express = require("express");
const router = express.Router();
const accountRouter = require("./account");
const userRouter = require("./user");

router.use("/account", accountRouter);
router.use("/user", userRouter);

router.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

module.exports = router;
