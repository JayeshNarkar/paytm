const mongoose = require("mongoose");
const mongo_url = process.env.mongo_url
mongoose.connect(mongo_url+"paytm");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const User = new Schema({
    id: ObjectId,
    username: String,
    password: String,
    firstName: String,
    lastName: String
});
const UserModel = mongoose.model("User", User);
module.exports = {UserModel};
