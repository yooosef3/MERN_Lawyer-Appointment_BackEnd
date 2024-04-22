const Lawyer = require("../models/lawyerModel");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const getLawyerInfoByUserId = async (req, res) => {
  try {
    const lawyer = await Lawyer.findOne({ userId: req.body.userId });

    res.status(200).send({
      success: true,
      message: "اطلاعات وکیل با موفقیت دریافت شد!",
      data: lawyer,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "خطا در دریافت اطلاعات وکیل", error });
  }
};

const getLawyerInfoById = async (req, res) => {
  try {
    const lawyer = await Lawyer.findOne({ _id: req.body.lawyerId });

    res.status(200).send({
      success: true,
      message: "اطلاعات وکیل با موفقیت دریافت شد!",
      data: lawyer,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "خطا در دریافت اطلاعات وکیل", error });
  }
};

const updateLawyerProfile = async (req, res) => {
  try {
    const lawyer = await Lawyer.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );

    res.status(200).send({
      success: true,
      message: "اطلاعات وکیل با موفقیت به روزرسانی شد!",
      data: lawyer,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "خطا در به روزرسانی اطلاعات وکیل",
      error,
    });
  }
};

const getAppointmentsByLawyerId = async (req, res) => {
  try {
    const lawyer = await Lawyer.findOne({ userId: req.body.userId });
    const appointments = await Appointment.find({ lawyerId: lawyer._id });
    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching appointments",
      success: false,
      error,
    });
  }
};

const changeClientAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
      status,
    });

    const user = await User.findOne({ _id: appointment.userId });
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "appointment-status-changed",
      message: `درخواست نوبت شما توسط وکیل ${
        appointment.lawyerInfo.firstName
      } ${appointment.lawyerInfo.lastName} ${
        status === "approved" ? "تایید شد" : "رد شد"
      }`,
      onClickPath: "/dashboard/user/appointments",
      createdAt: new Date(),
    });
    await user.save();
    res.status(200).send({
      message: "وضعیت نویت موکل با موفقیت تغییر کرد!",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "مشکلی در تغییر وضعیت نویت موکل رخ داده است!",
      success: false,
      error,
    });
  }
};

module.exports = {
  getLawyerInfoByUserId,
  updateLawyerProfile,
  getLawyerInfoById,
  getAppointmentsByLawyerId,
  changeClientAppointmentStatus,
};
