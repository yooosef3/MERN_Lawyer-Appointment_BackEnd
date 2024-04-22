const multer = require("multer");
const express = require("express");

const { param } = require("express-validator");

const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { register, login } = require("../controller/auth-controller");
const {
  getUserInfoById,
  applyLawyer,
  markAllAsSeen,
  deleteAllNotifications,
  getAllApprovedLawyers,
  checkAvailability,
  bookAppointment,
  getAppointmentsByUserId,
  searchLawyers,
} = require("../controller/user-controller");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5mb
  },
});
router.post("/register", register);

router.post("/login", login);

router.post("/get-user-info-by-id", authMiddleware, getUserInfoById);

router.get("/get-all-approved-lawyers", authMiddleware, getAllApprovedLawyers);

router.post(
  "/apply-lawyer-account",
  // upload.single("imageFile"),
  authMiddleware,
  applyLawyer
);

router.post("/mark-all-notifications-as-seen", authMiddleware, markAllAsSeen);

router.post(
  "/delete-all-notifications",
  authMiddleware,
  deleteAllNotifications
);

router.post("/check-booking-available", authMiddleware, checkAvailability);

router.post("/book-appointment", authMiddleware, bookAppointment);

router.get(
  "/get-appointments-by-user-id",
  authMiddleware,
  getAppointmentsByUserId
);

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("شهر باید یک رشته ی معتبر باشد!"),
  searchLawyers
);

module.exports = router;
