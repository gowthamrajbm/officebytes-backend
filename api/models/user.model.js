const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  workemail: {
    type: String,
    require: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  email: {
    type: String,
    require: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  name: {
    type: String,
    require: true
  },
  password: { type: String, required: true },
  mobile: {
    type: String
  },
  byteschedule: { type: String, default: false },
  is_email_verified: { type: Boolean, default: false },
  is_wemail_verified: { type: Boolean, default: false },
  is_active: { type: Boolean, default: false },
  is_mobile_verified: { type: Boolean, default: false },
  game_profiles: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Profile", require: true }
  ],
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    require: true
  },
  tournaments_joined: { type: Number, default: 0 },
  last_logged: { type: Date, default: Date.now() },
  firebase_token: String
});

module.exports = mongoose.model("User", userSchema);
