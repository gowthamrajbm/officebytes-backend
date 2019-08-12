var express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");
const postUtils = require("../../post");
const Post = require("../models/post.model");
const path = require("path");

exports.create_post = (req, res) => {
  const postId = new mongoose.Types.ObjectId();
  const date = new Date(new Date().toLocaleString("en-US", "Asia/Kolkata"));

  console.log(req.body.post);

  const postCreate = file => {
    const post = new Post({
      _id: postId,
      post_id: file,
      hour: req.body.hour,
      post_date: req.body.post_date,
      post: "post" + file + ".ejs",
      post_title: req.body.post_title,
      post_thumbnail: req.body.post_thumbnail,
      post_content: req.body.post_content,
      created_at: date,
      created_by: req.userData.userId
    });

    post
      .save()
      .then(response => {
        return res.status(200).json({
          success: true,
          response: "Post created"
        });
      })
      .catch(err => {
        return res.status(200).json({
          success: false,
          response: err
        });
      });
  };
  postUtils.write(req, res, file => postCreate(file));
};

exports.upload_test = (req, res) => {
  console.log(req.body.post);

  var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.join(__dirname, "/uploads/"));
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    }
  });
  //req.file = req.body.file;
  var upload = multer({ storage: storage }).single("file");
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(200).json({
        success: true,
        response: err
      });
    } else if (err) {
      console.log(err);
      return res.status(200).json({
        success: false,
        response: err
      });
    }
    return res.status(200).json({
      success: true,
      response: "Uploaded Successfully"
    });
  });
};

exports.getCurrentPost = hour => {};

exports.get_post = (req, res) => {
  Post.find({ post_id: req.params.id })
    .exec()
    .then(response => {
      if (response.length > 0) {
        return res.status(200).json({
          success: true,
          response: response[0]
        });
      } else {
        return res.status(200).json({
          success: false,
          response: "Post not found"
        });
      }
    })
    .catch(err => {
      return res.status(200).json({
        success: false,
        response: err
      });
    });
};

exports.get_all_posts = (req, res) => {
  Post.find()
    .exec()
    .then(response => {
      if (response.length > 0) {
        return res.status(200).json({
          success: true,
          response: response
        });
      } else {
        return res.status(200).json({
          success: false,
          response: "Post not found"
        });
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(200).json({
        success: false,
        response: "Error"
      });
    });
};

exports.delete_post = (req, res) => {
  Post.find({ _id: req.params.id })
    .exec()
    .then(response => {
      const callBack = () => {
        Post.deleteOne({ _id: req.params.id })
          .then(response => {
            res.status(200).json({
              success: true,
              response: "Post deleted"
            });
          })
          .catch(err => {
            res.status(200).json({
              success: false,
              response: "Unknown error"
            });
          });
      };
      postUtils.delete(response.post, callBack);
    })
    .catch(err => {
      res.status(200).json({
        success: false,
        response: "Post not found"
      });
    });
};

exports.update_post = (req, res) => {
  const postId = req.params.id;
  const date = new Date(new Date().toLocaleString("en-US", "Asia/Kolkata"));

  const postUpdate = file => {
    Post.update(
      { post_id: postId },
      {
        $set: {
          hour: req.body.hour,
          post_date: req.body.post_date,
          post: "post" + file + ".ejs",
          post_title: req.body.post_title,
          post_content: req.body.post_content,
          created_at: date,
          created_by: req.userData.userId
        }
      }
    )
      .then(response => {
        return res.status(200).json({
          success: true,
          response: "Post updated"
        });
      })
      .catch(err => {
        return res.status(200).json({
          success: false,
          response: err
        });
      });
  };
  Post.find({ post_id: postId })
    .exec()
    .then(res => {
      if (res.length > 0) {
        const updatePost = () =>
          postUtils.write(req, res, file => postUpdate(file));

        postUtils.delete(res[0].post, updatePost);
      } else {
        return res.status(200).json({
          success: false,
          response: "Post not found"
        });
      }
    })
    .catch(err => {
      return res.status(200).json({
        success: false,
        response: "Unknown error"
      });
    });
};
exports.compress_image = (req, res) => {
  const sharp = require("sharp");
  sharp(__dirname + "/Lighthouse.jpg")
    .resize({
      width: 200,
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy
    })
    .toFile("compressed.jpg")
    .then(() => {
      console.log("compressed");
    })
    .catch(err => {
      console.log(err);
    });
  return res.status(200).json({
    success: true,
    response: "compressed"
  });
};
