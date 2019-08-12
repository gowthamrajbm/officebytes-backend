const mongoose = require('mongoose');

const Admin = require('../models/admin.model');

exports.set_admin = (req, res, next) => {
    const userId = req.userData.userId;
    const admin = new Admin({
        _id: new mongoose.Types.ObjectId(),
        user: userId
    })

    admin
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

exports.get_admins = (req, res, next) => {
    Admin.find()
        .populate('user')
        .exec()
        .then((admin) => {
            return res.status(201).json({
                success: true,
                response: admin,
            })
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                response: err
            });
        })
}