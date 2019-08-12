const mongoose = require('mongoose');

const walletTransactionsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    amount: mongoose.Schema.Types.Number,
    status: { type: String, default: 'PENDING' },
    server_response: { type: Object, default: {} },
    created_at: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('WalletTransactions', walletTransactionsSchema)