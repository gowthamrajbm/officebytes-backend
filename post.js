const fs = require("fs");
var d = new Date();

exports.write = (req, res, next) => {
  fs.writeFile(
    __dirname + "/posts/post" + d.getTime() + ".ejs",
    "req.body.post",
    function(err) {
      if (err) {
        return res.status(200).json({
          success: false,
          response: err
        });
      }
      next(d.getTime());
      console.log("The file was saved!");
    }
  );
};
exports.delete = (post, next) => {
  fs.unlink(__dirname + "/posts/" + post, next);
};
