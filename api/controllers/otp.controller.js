const moment = require('moment');
const mongoose = require('mongoose');

const Otp = require('../models/otp.model');

exports.generate_top = (req, res, next) => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000);
    console.log('generatedOtp', generatedOtp)
    const otp = new Otp({
        _id: new mongoose.Types.ObjectId(),
        mobile: req.body.mobile,
        otp: generatedOtp,
        expires: moment().add('15', 'minutes').format('YYYY-MM-DD')
    })

    otp
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                response: 'OTP sent successfully',
            })
        })
        .catch((err) => {
            return res.status(200).json({
                success: false,
                response: 'Something went wrong'
            });
        })
    return;
}


exports.verify_otp = (req, res, next) => {
    Otp.find({
        mobile: req.body.mobile,
    })
        .exec()
        .then((result) => {
            console.log('result', result);

            if (result.length == 0) {
                res.status(200).json({
                    success: false,
                    response: 'OTP expired, please try again'
                })
                return;
            }

            const otpResult = result[result.length - 1];

            if (req.body.otp == otpResult.otp) {
                req.mobileNumber = otpResult.mobile;
                next();
            } else {
                res.status(200).json({
                    success: false,
                    response: 'wrong otp'
                })
                return;
            }
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                response: err
            })
        })
}