const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true }
})

module.exports = mongoose.model('Admin', adminSchema);