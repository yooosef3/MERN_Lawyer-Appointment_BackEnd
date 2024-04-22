const Lawyer = require("../models/lawyerModel");
const User = require("../models/userModel");
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "کاربران با موفقیت دریافت شدند!",
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(200).send({
      message: "مشکلی در دریافت کاربران رخ داده است!",
      success: false,
      error,
    });
  }
};

const getAllLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.find({});
    res.status(200).send({
      message: "وکلا با موفقیت دریافت شدند!",
      success: true,
      data: lawyers,
    });
  } catch (error) {
    res.status(500).send({
      message: "مشکلی در دریافت وکلا رخ داده است!",
      success: false,
      error,
    });
  }
};

const changeLawyerStatus = async (req, res) => {
  try {
    const { lawyerId, status } = req.body;
    const lawyer = await Lawyer.findByIdAndUpdate(lawyerId, {
      status,
    });

    const user = await User.findOne({ _id: lawyer.userId });
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "new-doctor-request-changed",
      message: `درخواست تغییر اکانت شما به اکانت وکالت ${
        status === "blocked" ? "بلاک شد" : "تایید شد"
      }`,
      onClickPath: "/notifications",
      createdAt: Date.now(),
    });
    user.isLawyer = status === "approved" ? true : false;
    await user.save();
    res.status(200).send({
      message: "درخواست تغییر اکانت موفقیت آمیز بود!",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      message: "مشکلی در تغییر اکانت رخ داده است!",
      success: false,
      error,
    });
  }
};

module.exports = { getAllUsers, getAllLawyers, changeLawyerStatus };
