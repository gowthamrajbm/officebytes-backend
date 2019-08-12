let nodemailer = require("nodemailer");
const cron = require("node-cron");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

// set the view engine to ejs
//app.set("view engine", "ejs");
//app.set("views", __dirname + "/../views");

const send = (view, params, to, subject, bcc = "") => {
  var emailData = "";
  ejs.renderFile(
    __dirname + "/../views/pages/" + view + ".ejs",
    params,
    function(err, data) {
      if (err) {
        console.log(err);
      } else {
        emailData = data;
      }
    }
  );

  console.log(to, bcc);

  var mailOptions = {
    from: "Officebytes - Do not Reply info@gringo.co.in",
    to: to,
    subject: subject,
    bcc: bcc,
    html: emailData
  };

  var transporter = nodemailer.createTransport({
    service: "Godaddy",
    host: "smtpout.secureserver.net",
    secureConnection: true,
    port: 465,
    auth: {
      user: "info@gringo.co.in",
      pass: "Gringo_co_in@123"
    }
  });
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      return error;
    } else {
      console.log(info.response);
      return info.response;
    }
  });
};

module.exports = {
  send: (view, params, to, subject, bcc) => send(view, params, to, subject, bcc)
};
