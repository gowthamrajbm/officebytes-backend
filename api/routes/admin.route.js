const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/admin.controller");
const checkAuth = require("../middlewares/check-auth");

router.post("/", checkAuth, AdminController.set_admin);
router.get("/", checkAuth, AdminController.get_admins);

module.exports = router;
