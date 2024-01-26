const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const {UserModel} = require("./db");
app.use(cors());
app.use(bodyParser.json());
//create 3 user routes sign in, sign up, Allow user to update their information (firstName, lastName, password).

app.post("/signup", async (req, res) => {
    const {username, password, firstName, lastName}= req.body;
    const user = new UserModel({
        username,
        password,
        firstName,
        lastName
    });
    try {
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(error?.status || 500).send(error.message || error.error.message || "Internal server error");  
    }
});

app.post("/signin", async (req, res) => {
    const {username, password}= req.body;
    UserModel.findOne({username, password}, (err, user) => {
        if (err) {
            res.status(500).send("Internal server error");
        } else if (!user) {
            res.status(404).send("User not found");
        }
        else {
            res.status(200).send(user);
        }
    });
});

app.put("/update", async (req, res) => {
    const {id} = req.body;
    const {firstName, lastName, password} = req.body;
    UserModel.findByIdAndUpdate(id, {firstName, lastName, password}, (err, user) => {
        if (err) {
            res.status(500).send("Internal server error");
        } else if (!user) {
            res.status(404).send("User not found");
        }
        else {
            res.status(200).send(user);
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);
