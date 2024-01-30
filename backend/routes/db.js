const mongoose = require("mongoose");
const mongo_url = process.env.MONGO_URL;
mongoose.connect(mongo_url + "paytm");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
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

const accountSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const requestSchema = new mongoose.Schema({
  from: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  to: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
    required: true,
  },
});

const PaymentRequest = mongoose.model("PaymentRequest", requestSchema);
const Account = mongoose.model("Account", accountSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Account, User, PaymentRequest };
