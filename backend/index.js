const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const { UserModel } = require("./db");
app.use(cors());
app.use(bodyParser.json());

app.post("/signup", async (req, res) => {
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

app.post("/signin", async (req, res) => {
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

app.put("/update", async (req, res) => {
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

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
