const mongoose = require("mongoose");

const everifySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: String,
  email: {
    type: String,
    require: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  token: String,
  expires: mongoose.Schema.Types.Date
});

module.exports = mongoose.model("Everify", everifySchema);
