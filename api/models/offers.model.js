const mongoose = require('mongoose');

const offersSchemea = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    image_url: String,
    path: String,
    active: { type: Boolean, default: true }
})

module.exports = mongoose.model('Offers', offersSchemea);