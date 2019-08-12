const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Sentry = require("@sentry/node");

const userRoutes = require("./api/routes/user.route");
const postRoutes = require("./api/routes/post.route");
const adminRoutes = require("./api/routes/admin.route");
const everifyRoutes = require("./api/routes/everify.route");
const mailer = require("./mailer/mailer");
const User = require("./api/controllers/user.controller");
const Everify = require("./api/controllers/everify.controller");
const cryptoRandomString = require("crypto-random-string");
const ManualRes = require("./utils/manualRes");
const cron = require("./cron");

Sentry.init({
  dsn: "https://f5303b7f3152422a893cf12fabbecccf@sentry.io/1477867"
});

const app = express();

/*var cors = require('cors');
var whitelist = ['https://officebytes.herokuapp.com', 'https://rtepu.codesandbox.io']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// Then pass them to cors:
app.use(cors(corsOptions));*/

mongoose.connect(
  "mongodb+srv://gowthamraj:support@123@cluster0-flcd7.mongodb.net/officebytes?retryWrites=true",
  {
    useNewUrlParser: true
  }
);
mongoose.Promise = global.Promise;

app.use(Sentry.Handlers.requestHandler());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(Sentry.Handlers.errorHandler());
app.get("/", (req, res, next) => {
  res.send(
    "<h1>Service Connected</h1><li><a href='/post/test'>Create</a><li><a href='/post/:id/test'>Update</a><li><a href='/post/compress'>Compress Image</a><li>" +
      "<form action='/post/imageupload' method='post' enctype='multipart/form-data'><input type='file' name='file' /><button type='submit'>Submit</button></form>"
  );
  //const result = Everify.generate_everify("gowthamrajbm@gmail.com", "email");
  //console.log(result);
  //const mailLog = User.mark_wemail_as_verified("bmg@anz.com");
  //console.log(mailLog);
  //const mailLog = mailer.verifyWorkEmail("5d09d3da38fc320017f6ab0f");
  //console.log(mailLog);
  //User.reset_password2();
  /*res.render("pages/wemailverify", {
    name: "Gowtham Raj BM",
    verificationLink:
      "https://officebytes.co.in/verify?a=asdlkjajdadamna&v=aslkdjadl"
  });*/
});
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/everify", everifyRoutes);
app.use("/post", postRoutes);

cron.startCron();

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

/*app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    success: false,
    response: error.message
  });
});*/

module.exports = app;
