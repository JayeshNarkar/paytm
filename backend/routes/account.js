const express = require("express");
const router = express.Router();
const { Account } = require("./db");
const { authMiddleware } = require("./middleware");
const bodyParser = require("body-parser");
router.use(bodyParser.json());

router.get("/balance", async (req, res) => {
  try {
    const userId = req.headers.userid;
    const { balance } = await Account.findOne({ userId });
    res.json({
      balance: balance.toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const { amount, to } = req.body;
  const from = req.headers.userid;
  try {
    const fromAccount = await Account.findOne({ userId: from });
    const toAccount = await Account.findOne({ userId: to });
    if (!toAccount) return res.json({ message: "Account does not exist" });
    if (toAccount.userId === fromAccount.userId)
      return res.json({ message: "Cannot transfer to self" });
    if (fromAccount.balance < amount)
      return res.json({ message: "Insufficient funds" });
    fromAccount.balance -= amount;
    toAccount.balance += amount;
    await fromAccount.save();
    await toAccount.save();
    res.json({ message: "Transfer successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
