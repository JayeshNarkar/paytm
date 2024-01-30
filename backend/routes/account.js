const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Account, PaymentRequest } = require("./db");
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
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
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

router.post("/sendRequest", authMiddleware, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.verify(token, jwt_secret).userId;
    const { to, amount } = req.body;
    if (amount <= 0) throw new Error("Amount must be greater than 0");
    if (userId === to) throw new Error("Cannot request to self");
    const account = await Account.findOne({ userId: to });
    if (!account) throw new Error("Account does not exist");
    if (account.balance < amount)
      throw new Error("They have insufficient funds!");
    const newRequest = new PaymentRequest({
      from: userId,
      to,
      amount,
    });
    const request = await newRequest.save();
    res.json({ message: "Request sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/myRequests", authMiddleware, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.verify(token, jwt_secret).userId;
    const requests = await PaymentRequest.find({ to: userId });
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/acceptRequest", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.verify(token, jwt_secret).userId;
    const { requestId, from } = req.body;
    const request = await PaymentRequest.findOne({ _id: requestId });
    if (!request) throw new Error("Request does not exist");
    if (request.to.toString() !== userId) throw new Error("Unauthorized");
    const fromAccount = await Account.findOne({
      userId: from,
    }).session(session);
    const toAccount = await Account.findOne({ userId }).session(session);
    if (!fromAccount) throw new Error("Account does not exist");
    if (fromAccount.balance < request.amount)
      throw new Error("Insufficient funds");
    await Account.updateOne(
      { userId: request.from },
      { $inc: { balance: request.amount } }
    ).session(session);
    await Account.updateOne(
      { userId },
      { $inc: { balance: -request.amount } }
    ).session(session);
    await PaymentRequest.updateOne(
      { _id: requestId },
      { $set: { status: "accepted" } }
    ).session(session);
    await session.commitTransaction();
    const { balance } = await Account.findOne({ userId });
    res.json({
      message: "Request accepted successfully!",
      balance: balance.toFixed(2),
    });
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;
