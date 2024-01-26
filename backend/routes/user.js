const express = require("express");
const router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const { UserModel } = require("./db");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.jwt_secret;
router.use(cors());
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
  const existingUser = await UserModel.findOne({ username });
  if (existingUser)
    return res
      .status(400)
      .json({ message: "User with this username already exists" });
  const user = new UserModel({
    username,
    password,
    firstName,
    lastName,
  });
  try {
    const user = await user.save();
    const userId = user._id;
    const token = jwt.sign(
      {
        userId,
      },
      jwt_secret
    );
    res.json({
      message: "User created successfully",
      token: token,
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
    const user = await UserModel.findOne({ username });
    if (!user || user.password !== password)
      return res.status(400).json({ error: "Invalid username or password" });
    const userId = user._id;
    const token = jwt.sign(
      {
        userId,
      },
      jwt_secret
    );
    res.json({
      message: "User signed up successfully",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error " + error.message });
  }
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const { id } = req.body;
  const { firstName, lastName, password } = req.body;
  try {
    const response = await UserModel.findByIdAndUpdate(id, {
      firstName,
      lastName,
      password,
    });
    res.status(200).json({ message: "updated correctly! " });
  } catch (error) {
    res
      .status(error?.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

module.exports = router;
