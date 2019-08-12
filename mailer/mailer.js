const moment = require("moment");
const mongoose = require("mongoose");
const mailer = require("./utils");
const User = require("../api/models/user.model");
const Everify = require("../api/controllers/everify.controller");
const Reset = require("../api/models/reset.model");
const crypto = require("crypto-random-string");

exports.verifyWorkEmail = id => {
  User.find({ _id: id })
    .select("-password")
    .then(user => {
      let token = false;
      do {
        token = Everify.generate_everify(user[0].workemail, "workemail");
      } while (!token);
      const re = crypto({ length: 10, type: "url-safe" });
      const se = crypto({ length: 10, type: "url-safe" });
      mailer.send(
        "wemailverify",
        {
          name: user[0].name,
          verificationLink:
            "https://officebytes.co.in/everify/" +
            user[0].workemail +
            "/" +
            token +
            "/" +
            re +
            "/" +
            se
        },
        user[0].workemail,
        "Work email verification"
      );
    })
    .catch(err => {
      console.log(err);
    });
};

exports.verifyEmail = id => {
  User.find({ _id: id })
    .select("-password")
    .then(user => {
      let token = false;
      do {
        token = Everify.generate_everify(user[0].email, "email");
      } while (!token);
      const re = crypto({ length: 10, type: "url-safe" });
      const se = crypto({ length: 10, type: "url-safe" });
      mailer.send(
        "emailverify",
        {
          name: user[0].name,
          verificationLink:
            "https://officebytes.co.in/everify/" +
            user[0].email +
            "/" +
            token +
            "/" +
            re +
            "/" +
            se
        },
        user[0].email,
        "Email verification"
      );
    })
    .catch(err => {
      console.log(err);
    });
};

exports.sendResetLink = email => {
  const re = crypto({ length: 20, type: "url-safe" });
  const te = crypto({ length: 50, type: "url-safe" });
  const se = crypto({ length: 10, type: "url-safe" });
  const reset = new Reset({
    _id: new mongoose.Types.ObjectId(),
    email: email,
    re: re,
    te: te,
    expires: moment()
      .add("24", "hours")
      .format("YYYY-MM-DDTHH:mm:ss.SSS")
  });

  reset.save().then(() => {
    mailer.send(
      "resetlink",
      {
        resetLink:
          "https://officebytes.co.in/user/resetpassword/" +
          re +
          "/" +
          te +
          "/" +
          se
      },
      email,
      "Password reset link"
    );
  });
};

exports.sendPost = (hour, postId, mailingList) => {
  var indiaTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata"
  });
  indiaTime = new Date(indiaTime);
  const hours = indiaTime.getHours();

  mailingList = mailingList.join(",");

  console.log(hour, postId, mailingList);

  mailer.send(
    "poster",
    {
      postId: postId
    },
    "",
    hours + " o'clock Byte",
    mailingList
  );
};
