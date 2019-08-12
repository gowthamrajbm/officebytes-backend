const mongoose = require('mongoose');

const Profile = require('../models/profile.model');

exports.create_profile = (req, res, next) => {
    const profile = new Profile({
        _id: new mongoose.Types.ObjectId(),
        game: req.body.game_id,
        username: req.body.username,
        nick_name: req.body.nick_name,
        image_url: req.body.image_url
    })

    profile
        .save()
        .then((result) => {
            req.profileId = result._id;
            next();
        })
        .catch((err) => {
            return res.status(200).json({
                success: false,
                response: err
            });
        })
    return;
}

exports.get_profiles = (req, res, next) => {
    Profile.find()
        .populate('game')
        .exec()
        .then((profiles) => {
            return res.status(201).json({
                success: true,
                response: profiles
            })
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                response: err
            })
        })
};

