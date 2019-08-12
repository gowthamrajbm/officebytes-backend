const mongoose = require('mongoose');

const walletSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    cash_balance: { type: mongoose.Schema.Types.Number, default: 0 },
    promo_balance: { type: mongoose.Schema.Types.Number, default: 0 },
    token: { type: mongoose.Schema.Types.Number, default: 0 }
})

module.exports = mongoose.model('Wallet', walletSchema)