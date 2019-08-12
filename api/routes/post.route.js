const express = require("express");
const router = express.Router();

const PostController = require("../controllers/post.controller");
const checkAuth = require("../middlewares/check-auth");

router.post("/", checkAuth, PostController.create_post);
router.post("/imageupload", PostController.upload_test);
router.get("/", checkAuth, PostController.get_all_posts);
router.get("/compress", PostController.compress_image);
router.get("/:id", checkAuth, PostController.get_post);
router.post("/:id", checkAuth, PostController.update_post);
router.get("/:id/delete", checkAuth, PostController.delete_post);

module.exports = router;
