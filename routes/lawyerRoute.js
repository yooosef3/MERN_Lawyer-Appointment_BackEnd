const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getLawyerInfoByUserId,
  updateLawyerProfile,
  getLawyerInfoById,
  getAppointmentsByLawyerId,
  changeClientAppointmentStatus,
} = require("../controller/lawyer-controller");
router.post(
  "/get-lawyer-info-by-userId",
  authMiddleware,
  getLawyerInfoByUserId
);
router.post("/get-lawyer-info-by-id", authMiddleware, getLawyerInfoById);
router.post("/update-lawyer-profile", authMiddleware, updateLawyerProfile);
router.get(
  "/get-appointments-by-lawyer-id",
  authMiddleware,
  getAppointmentsByLawyerId
);
router.post(
  "/change-client-appointment-status",
  authMiddleware,
  changeClientAppointmentStatus
);

module.exports = router;
