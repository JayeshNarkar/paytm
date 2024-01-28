const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Account } = require("./db");
const { authMiddleware } = require("./middleware");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const jwt_secret = process.env.jwt_secret;

router.get("/balance", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.verify(token, jwt_secret).userId;
    const { balance } = await Account.findOne({ userId });
    res.json({
      balance: balance.toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, to } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const from = jwt.verify(token, jwt_secret).userId;
    const fromAccount = await Account.findOne({ userId: from }).session(
      session
    );
    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
      throw new Error("Account does not exist");
    }

    if (toAccount.userId === fromAccount.userId) {
      throw new Error("Cannot transfer to self");
    }

    if (fromAccount.balance < amount) {
      throw new Error("Insufficient funds");
    }

    await Account.updateOne(
      { userId: from },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    await session.commitTransaction();

    res.json({ message: "Transfer successful" });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;
