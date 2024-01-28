const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { User, Account } = require("./db");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.jwt_secret;
router.use(bodyParser.json());
const { signupBody, signinBody, updateBody } = require("./zod");
const { authMiddleware } = require("./middleware");

router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Username already taken / Incorrect inputs",
    });
  }
  const { username, password, firstName, lastName } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser)
    return res
      .status(400)
      .json({ message: "User with this username already exists" });
  const newUser = new User({
    username,
    password,
    firstName,
    lastName,
  });
  try {
    const user = await newUser.save();
    const userId = user._id;
    const token = jwt.sign(
      {
        userId,
      },
      jwt_secret
    );
    const balance = 1 + Math.random() * 10000;
    await Account.create({
      userId,
      balance,
    });
    res.json({
      message: "User created successfully",
      token: token,
      balance: balance.toFixed(2),
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error.message || error.error.message || "Internal server error",
    });
  }
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password)
      return res.status(400).json({ error: "Invalid username or password" });
    const userId = user._id;
    const token = jwt.sign(
      {
        userId,
      },
      jwt_secret
    );
    const { balance } = await Account.findOne({ userId });
    res.json({
      message: "User signed up successfully",
      token: token,
      balance: balance.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error " + error.message });
  }
});

router.put("/update", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const { username } = req.body;
  const { firstName, lastName, password } = req.body;
  try {
    const response = await User.findOneAndUpdate(
      { username },
      {
        firstName,
        lastName,
        password,
      },
      { new: true }
    );
    res.status(200).json({ message: "updated successfully! " });
  } catch (error) {
    res
      .status(error?.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    if (!req.headers.authorization)
      return res.status(401).json({ message: "Unauthorized" });
    if (!req.headers.authorization.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.verify(token, jwt_secret).userId;
    const { username } = await User.findById(userId);
    const { balance } = await Account.findOne({ userId });
    res.status(200).json({ username, balance: balance.toFixed(2) });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/users", authMiddleware, async (req, res) => {
  try {
    if (!req.headers.authorization)
      return res.status(401).json({ message: "Unauthorized" });
    if (!req.headers.authorization.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });
    const token = req.headers.authorization.split(" ")[1];
    const currentUserId = jwt.verify(token, jwt_secret).userId;
    const users = await User.find(
      { _id: { $ne: currentUserId } },
      "username _id firstName lastName"
    );
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
