const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { UserModel } = require("./db");
const router = express.Router();
router.use(cors());
router.use(bodyParser.json());

router.post("/signup", async (req, res) => {
  const { username, password, firstName, lastName } = req.body;
  const existingUser = await UserModel.findOne({ username });
  if (existingUser)
    return res.status(400).send("User with this username already exists");
  const user = new UserModel({
    username,
    password,
    firstName,
    lastName,
  });
  try {
    await user.save();
    res.status(200).send(user._id);
  } catch (error) {
    res
      .status(error?.status || 500)
      .send(error.message || error.error.message || "Internal server error");
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (!user || user.password !== password)
      return res.status(400).send("Invalid username or password");
    res.status(200).send("signed in correctly! ");
  } catch (error) {
    res.status(500).send("Internal server error " + error.message);
  }
});

router.put("/update", async (req, res) => {
  const { id } = req.body;
  const { firstName, lastName, password } = req.body;
  try {
    const response = await UserModel.findByIdAndUpdate(id, {
      firstName,
      lastName,
      password,
    });
    res.status(200).send("updated correctly! ");
  } catch (error) {
    res
      .status(error?.status || 500)
      .send(error.message || "Internal server error");
  }
});

module.exports = router;
