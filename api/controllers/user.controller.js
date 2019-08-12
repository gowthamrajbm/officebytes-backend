const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../../mailer/mailer");

const User = require("../models/user.model");
const Reset = require("../models/reset.model");

exports.user_signup = (req, res, next) => {
  User.find({ $or: [{ email: req.body.email }] })
    .exec()
    .then(user => {
      console.log("user", user);
      if (user.length > 0) {
        return res.status(200).json({
          success: false,
          response: "Email addresses registered already"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(200).json({
              success: false,
              response: err
            });
          } else {
            const userId = new mongoose.Types.ObjectId();
            const user = new User({
              _id: userId,
              name: req.body.name,
              workemail: req.body.workemail,
              email: req.body.email,
              password: hash
            });

            user
              .save()
              .then(result => {
                mailer.verifyWorkEmail(userId);
                mailer.verifyEmail(userId);

                res.status(201).json({
                  success: true,
                  response:
                    "Account created successfully ! Login using email and password"
                });
              })
              .catch(err => {
                res.status(200).json({
                  success: false,
                  response: err
                });
              });
          }
        });
      }
    });
};

exports.get_user = (req, res, next) => {
  User.find({ _id: req.userData.userId })
    .select("-password")
    .then(user => {
      if (user.length == 0) {
        return res.status(201).json({
          success: false,
          response: "something went wrong"
        });
      }

      return res.status(201).json({
        success: true,
        response: user[0]
      });
    })
    .catch(err => {
      return res.status(201).json({
        success: false,
        response: err
      });
    });
};

exports.attach_user = (req, res, next) => {
  User.find({ _id: req.userData.userId })
    .select("-password")
    .populate({
      path: "game_profiles wallet",
      populate: {
        path: "game"
      }
    })
    .exec()
    .then(user => {
      req.user = user[0];
      next();
    })
    .catch(err => {
      return res.status(201).json({
        success: false,
        response: err
      });
    });
};

exports.update_details = (req, res, next) => {
  const userId = req.userData.userId;
  const workemail = req.body.workemail;
  User.updateOne(
    { _id: userId },
    { $set: { workemail: workemail, is_wemail_verified: false } }
  )
    .exec()
    .then(() => {
      mailer.verifyWorkEmail(userId);

      return res.status(201).json({
        success: true,
        response: "Verify work email to start recieving bytes."
      });
    })
    .catch(err => {
      return res.status(200).json({
        success: false,
        response: err
      });
    });
};

exports.update_settings = (req, res, next) => {
  const userId = req.userData.userId;
  const byteschedule = req.body.byteschedule;
  const is_active = req.body.is_active;
  User.updateOne(
    { _id: userId },
    { $set: { byteschedule: byteschedule, is_active: is_active } }
  )
    .exec()
    .then(() => {
      return res.status(201).json({
        success: true,
        response: "Settings updated"
      });
    })
    .catch(err => {
      return res.status(200).json({
        success: false,
        response: err
      });
    });
};

exports.mark_email_as_verified = email => {
  User.updateOne({ email: email }, { $set: { is_email_verified: true } }).then(
    () => {
      console.log("updated");
    }
  );
};

exports.mark_wemail_as_verified = email => {
  User.updateOne(
    { workemail: email },
    { $set: { is_wemail_verified: true } }
  ).then(() => {
    console.log("updated");
  });
};

exports.send_reset_link = (req, res, next) => {
  User.find({ email: req.body.email })
    .select("-password")
    .then(user => {
      if (user.length > 0) {
        mailer
          .sendResetLink(req.body.email)
          .then(() => {
            return res.status(200).json({
              success: true,
              response: "Reset link sent to email"
            });
          })
          .catch(err => {
            return res.status(201).json({
              success: false,
              response: "Error occurred. Try again."
            });
          });
      } else {
        return res.status(201).json({
          success: true,
          response: "Email not registered"
        });
      }
    });
  return res.status(200).json({
    success: true,
    response: "Reset link sent to email"
  });
};

exports.reset_password = (req, res, next) => {
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  const re = req.body.re;
  const te = req.body.te;
  const se = req.body.se;
  if (password === confirm_password) {
    bcrypt.hash(password, 10, (err, hash) => {
      Reset.find({ re: re, te: te })
        .exec()
        .then(reset => {
          if (reset.length > 0) {
            const resetLine = reset[0];
            User.update(
              { email: resetLine["email"] },
              { $set: { password: hash } }
            )
              .then(() => {
                return res.status(200).json({
                  success: true,
                  response: "Password reset successful"
                });
              })
              .catch(err => {
                return res.status(200).json({
                  success: false,
                  response: "Error occurred. Try again."
                });
              });
          } else {
            return res.status(201).json({
              success: false,
              response: "Invalid request"
            });
          }
        });
    });
  } else {
    return res.status(201).json({
      success: false,
      response: "Password confirmation failed"
    });
  }
};

exports.reset_password2 = () => {
  const password = "Passwor";
  const confirm_password = "Passwor";
  const re = "Vq80O4aBV.~CN_mMwAD6";
  const te = "dEJr_7VcQ.ch5o_Gg9ySOoh8Xgum.NIiRa8-jnLy~-jvTd1BDz";
  const se = "eCl.kmgf5H";
  if (password === confirm_password) {
    bcrypt.hash(password, 10, (err, hash) => {
      Reset.find({ re: re, te: te })
        .exec()
        .then(reset => {
          if (reset.length > 0) {
            const resetLine = reset[0];
            User.update(
              { email: resetLine["email"] },
              { $set: { password: hash } }
            )
              .then(() => {
                console.log("Password reset successful");
              })
              .catch(err => {
                console.log("Error Occurred");
              });
          } else {
            console.log("invalid Request");
          }
        });
    });
  } else {
    console.log("Password confirmation failed");
  }
};

exports.mark_mobile_as_verified = (req, res, next) => {
  const userId = req.userData.userId;
  const mobile = req.mobileNumber;
  User.update(
    { _id: userId },
    { $set: { is_mobile_verified: true, mobile: mobile } }
  )
    .exec()
    .then(() => {
      return res.status(201).json({
        success: true,
        response: "Mobile number verified"
      });
    })
    .catch(err => {
      return res.status(200).json({
        success: false,
        response: err
      });
    });
};

exports.user_signin = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(200).json({
          success: false,
          response: "Unable to login"
        });
      }

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(200).json({
            success: false,
            response: "Unable to login"
          });
        }

        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            "tyyyyrrrorororo",
            {
              expiresIn: "50h"
            }
          );

          console.log("tokkken", token);

          const returnUser = Object.assign(user[0], { password: undefined });

          return res.status(200).json({
            success: true,
            response: returnUser,
            token
          });
        }

        res.status(200).json({
          success: false,
          response: "Unable to login"
        });
      });
    })
    .catch(err => {
      res.status(200).json({
        success: false,
        response: err
      });
    });
};

exports.check_access = (req, res, next) => {
  res.status(200).json({
    success: true,
    response: "checked"
  });
};
