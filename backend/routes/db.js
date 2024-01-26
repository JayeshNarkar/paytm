const mongoose = require("mongoose");
const mongo_url = process.env.MONGO_URL;
mongoose.connect(mongo_url + "paytm");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const User = new Schema({
  id: ObjectId,
  username: {
    unique: true,
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 6,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 20,
  },
  firstName: { type: String, required: true, trim: true, maxLength: 50 },
  lastName: { type: String, required: true, trim: true, maxLength: 50 },
});

const UserModel = mongoose.model("User", User);

module.exports = { UserModel };
