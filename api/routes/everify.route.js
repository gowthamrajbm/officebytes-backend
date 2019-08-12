const express = require("express");
const router = express.Router();

const everifyController = require("../controllers/everify.controller");
const checkAuth = require("../middlewares/check-auth");

router.get("/", everifyController.verify_email);
router.get("/email", checkAuth, everifyController.resend_email);
router.get("/workemail", checkAuth, everifyController.resend_wemail);

module.exports = router;
