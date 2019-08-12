const moment = require("moment");
const mongoose = require("mongoose");
const User = require("./user.controller");
const UserModel = require("../models/user.model");
const Everify = require("../models/everify.model");
const crypto = require("crypto-random-string");
const mailer = require("../../mailer/mailer");

exports.generate_everify = (email, type) => {
  const token = crypto({ length: 80, type: "url-safe" });
  const everify = new Everify({
    _id: new mongoose.Types.ObjectId(),
    type: type,
    email: email,
    token: token,
    expires: moment()
      .add("24", "hours")
      .format("YYYY-MM-DDTHH:mm:ss.SSS")
  });

  everify.save().then(() => {
    const find = type === "email" ? { email: email } : { workemail: email };
    const set =
      type === "email"
        ? { is_email_verified: false }
        : { is_wemail_verified: false };
    UserModel.update(find, { $set: set }).then(() => {
      console.log(find, { $set: set });
    });
  });

  return token;
};

exports.resend_email = (req, res, next) => {
  const userId = req.userData.userId;
  UserModel.find({ _id: userId })
    .select("-password")
    .then(user => {
      if (user.length > 0) {
        mailer.verifyEmail(userId);
        return res.status(200).json({
          success: true,
          response: "Verification link sent to your registered email."
        });
      } else {
        return res.status(200).json({
          success: false,
          response: "Invalid request."
        });
      }
    })
    .catch(err => {
      return res.status(201).json({
        success: false,
        response: err
      });
    });
};

exports.resend_wemail = (req, res, next) => {
  const userId = req.userData.userId;
  User.find({ _id: userId })
    .select("-password")
    .exec()
    .then(user => {
      if (user.length > 0) {
        mailer.verifyWorkEmail(userId);
        return res.status(201).json({
          success: true,
          response: "Verification link sent to your registered work email."
        });
      } else {
        return res.status(201).json({
          success: false,
          response: "Invalid request."
        });
      }
    })
    .catch(err => {
      return res.status(201).json({
        success: false,
        response: err
      });
    });
};

exports.verify_email = (req, res, next) => {
  Everify.find({
    email: req.query.email,
    token: req.query.te
  })
    .exec()
    .then(result => {
      console.log("result", result);

      if (result.length === 0) {
        res.status(200).json({
          success: false,
          response:
            "Verification link expired, please try again" +
            req.query.email +
            req.query.te
        });
        return;
      }

      const verificationResult = result[result.length - 1];

      if (
        req.query.te === verificationResult.token &&
        req.query.email === verificationResult.email
      ) {
        if (verificationResult.type === "email")
          User.mark_email_as_verified(verificationResult.email);
        else if (verificationResult.type === "workemail")
          User.mark_wemail_as_verified(verificationResult.email);

        console.log(result);

        res.status(200).json({
          success: true,
          response: "Email Verified"
        });
        return;
      } else {
        res.status(200).json({
          success: false,
          response: "Invalid verification link."
        });
        return;
      }
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        response: err
      });
    });
};
