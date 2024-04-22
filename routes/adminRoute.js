const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getAllUsers, getAllLawyers, changeLawyerStatus } = require("../controller/admin-controller");
router.get("/get-all-users", authMiddleware, getAllUsers);
router.get("/get-all-lawyers", authMiddleware, getAllLawyers);
router.post("/change-lawyer-account-status", authMiddleware, changeLawyerStatus)
module.exports = router;
