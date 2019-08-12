const mongoose = require('mongoose');

const participationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' },
    profile: { type: mongoose.Schema.ObjectId, ref: 'Profile' },
    amount: Number,
})

module.exports = mongoose.model('ParticipationRequest', participationSchema);