const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', require: true },
    username: String,
    nick_name: String,
    image_url: String,
    profile_meta: Object
})

module.exports = mongoose.model('Profile', profileSchema);