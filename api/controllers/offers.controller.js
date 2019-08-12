const mongoose = require('mongoose');

const Offers = require('../models/offers.model');

exports.set_offers = (req, res, next) => {
    const offer = new Offers({
        _id: new mongoose.Types.ObjectId(),
        image_url: req.body.image_url,
        path: req.body.path,
    })

    offer
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


exports.get_offers = (req, res, next) => {
    Offers.find({ active: true })
        .exec()
        .then((offers) => {
            return res.status(201).json({
                success: true,
                response: offers
            })
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                response: err
            })
        })
}