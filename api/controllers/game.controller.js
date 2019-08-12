const mongoose = require('mongoose');

const Game = require('../models/game.model');

exports.create_game = (req, res, next) => {
    const game = new Game({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        release_date: req.body.release_date,
        minimun_android_version: req.body.minimun_android_version,
        minimun_api_version: req.body.minimun_api_version,
        minimum_ram: req.body.minimum_ram,
        image_url: req.body.image_url,
        wallpaper_url: req.body.wallpaper_url,
        package_name: req.body.package_name,
        active: req.body.active,
        stars: req.body.stars,
        overview: req.body.overview,
        platform: req.body.platform,
        rating: req.body.rating,
        developer: req.body.developer,
        publisher: req.body.publisher,
        min_age: req.body.min_age,
        website_url: req.body.website_url,
        genre: req.body.genre,
        tags: req.body.tags
    })

    game
        .save()
        .then((result) => {
            return res.status(201).json({
                success: true,
                response: result,
            })
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                response: err
            });
        })
    return;
}

exports.get_games = (req, res, next) => {
    Game.find()
        .select("name image_url active")
        .exec()
        .then((games) => {
            return res.status(201).json({
                success: true,
                response: games
            })
        })
        .catch((err) => {
            return res.status(201).json({
                success: false,
                response: err
            })
        })
};

exports.get_game = (req, res, next) => {
    Game.find({ _id: req.params.id })
        .exec()
        .then((games) => {
            return res.status(200).json({
                success: true,
                response: games[0]
            })
        })
        .catch((err) => {
            return res.status(200).json({
                success: false,
                response: err
            })
        })
}