const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        require: true,
    },
    release_date: {
        type: Date,
    },
    minimun_android_version: String,
    minimun_api_version: String,
    minimum_ram: String,
    image_url: String,
    wallpaper_url: String,
    package_name: {
        type: String,
        require: true
    },
    active: { type: Boolean, default: true },
    stars: String,
    overview: String,
    platform: String,
    rating: String,
    developer: String,
    publisher: String,
    min_age: String,
    website_url: String,
    genre: [String],
    tags: [String],
    profile_structure: [{ key: String, type: String, required: Boolean }]
})

module.exports = mongoose.model('Game', gameSchema);