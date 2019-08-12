const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");
const checkAuth = require("../middlewares/check-auth");
const adminCheck = require("../middlewares/admin-check");

router.get("/", checkAuth, UserController.get_user);
router.get("/ca", checkAuth, adminCheck, UserController.check_access);
router.post("/signup", UserController.user_signup);
router.post("/login", UserController.user_signin);
router.post("/resetpasswordlink", UserController.send_reset_link);
router.post("/resetpassword", UserController.reset_password);
router.post("/setDetails", checkAuth, UserController.update_details);
router.post("/setSettings", checkAuth, UserController.update_settings);

module.exports = router;
