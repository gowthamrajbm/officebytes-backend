const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    mobile: String,
    otp: String,
    expires: mongoose.Schema.Types.Date
})

module.exports = mongoose.model('Otp', otpSchema);