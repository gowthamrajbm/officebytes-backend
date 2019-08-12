const mongoose = require('mongoose');

const tournamentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    created_at: Date,
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', require: true },
    pricing: mongoose.Schema.Types.Mixed,
    game_meta: [{ key: String, value: String }],
    start_time: mongoose.Schema.Types.Date,
    closing_time: mongoose.Schema.Types.Date,
    max_people: Number,
    min_people: Number,
    price_detail: String,
    tournament_description: String,
    terms_and_condition: String,
    participents: [{
        participation: { type: mongoose.Schema.Types.ObjectId, ref: 'ParticipationRequest', require: true },
        score: Object,
        win_amount: {
            promo_amount: { type: Number, default: 0 },
            cash_amount: { type: Number, default: 0 },
            token: { type: Number, default: 0 }
        },
        rank: { type: Number, default: -1 }
    }],
    completed: { type: Boolean, default: false },
    tournament_credentials: {
        room_id: String,
        room_password: String,
    },
    is_participated: Boolean,
    user_participation_id: mongoose.Schema.Types.ObjectId
})

module.exports = mongoose.model('Tournament', tournamentSchema);