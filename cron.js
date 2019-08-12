const cron = require("node-cron");
const mailer = require("./mailer/mailer");

const Post = require("./api/models/post.model");

const userdata = [
  {
    name: "Name 1",
    email: "gowthamrajbm@gmail.com",
    wemail: "bmg@anz.com",
    byteschedule: "9--18",
    is_email_verified: true,
    is_wemail_verified: true,
    is_active: true
  },
  {
    name: "Name 2",
    email: "gowthamrajbm@gmail.com",
    wemail: "gowthamrajbm@gmail.com",
    byteschedule: "10--19",
    is_email_verified: true,
    is_wemail_verified: true,
    is_active: true
  },
  {
    name: "Name 3",
    email: "gowthamrajbm@gmail.com",
    wemail: "resortstains@gmail.com",
    byteschedule: "9--17",
    is_email_verified: true,
    is_wemail_verified: true,
    is_active: true
  },
  {
    name: "Name 4",
    email: "gowthamrajbm@gmail.com",
    wemail: "gowtham.m@science.christuniversity.in",
    byteschedule: "8--16",
    is_email_verified: true,
    is_wemail_verified: true,
    is_active: true
  },
  {
    name: "Name 5",
    email: "gowthamrajbm@gmail.com",
    wemail: "test@science.christuniversity.in",
    byteschedule: "6--15",
    is_email_verified: true,
    is_wemail_verified: true,
    is_active: true
  },
  {
    name: "Name 6",
    email: "gowthamrajbm@gmail.com",
    wemail: "test2@gmail.com",
    byteschedule: "8--15",
    is_email_verified: true,
    is_wemail_verified: true,
    is_active: true
  }
];

const sendByte = (byteCount, mailingList) => {
  //console.log(byteCount, mailingList);
  let postId = null;
  const moment = require("moment");
  const today = moment().startOf("day");

  Post.find({
    hour: byteCount,
    post_date: {
      $gte: today.toDate(),
      $lte: moment(today)
        .endOf("day")
        .toDate()
    }
  })
    .exec()
    .then(res => {
      if (res.length > 0) {
        postId = res[0].post.split(".")[0];
        mailer.sendPost(byteCount, postId, mailingList);

        //console.log("Post found", mailingList);
      } else {
        postId = "random";
        //console.log("No Post found", mailingList);
      }
    })
    .catch(err => {
      console.log(err);
    });
};

exports.startCron = () => {
  cron.schedule("* * * * *", function() {
    var indiaTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata"
    });
    indiaTime = new Date(indiaTime);
    const hours = indiaTime.getHours();

    const mailList = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: []
    };

    userdata.map(user => {
      let byteSchedule = [];
      [start, end] = user.byteschedule.split("--");
      for (var d = Number(start) + 1; d < Number(end); d = d + 2) {
        byteSchedule.push(d);
      }
      //console.log(byteSchedule);
      const byteCount = byteSchedule.indexOf(hours);
      if (byteCount !== -1) mailList[byteCount + 1].push(user.wemail);
    });

    //console.log(mailList);

    Object.keys(mailList).map(key => {
      sendByte(key, mailList[key]);
    });
  });
};
