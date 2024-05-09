const User = require("../models/userModel");
const Lawyer = require("../models/lawyerModel");
const Appointment = require("../models/appointmentModel");
const cloudinary = require("cloudinary");
const moment = require("moment");

const getUserInfoById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });

    if (!user) {
      return res
        .status(200)
        .send({ message: "کاربر وجود ندارد!", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: { ...user._doc, password: "" },
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Error getting user info", error });
  }
};

const applyLawyer = async (req, res) => {
  try {
    // const image = req.file;
    // const base64Image = Buffer.from(image.buffer).toString("base64");
    // const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    // const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    const newLawyer = new Lawyer({ ...req.body, status: "pending" });
    // newLawyer.imageUrl = uploadResponse.url;
    await newLawyer.save();
    const adminUser = await User.findOne({ isAdmin: true });
    const user = await User.findOne({ _id: newLawyer?.userId });
    console.log(user);
    const unseenNotifications = adminUser.unseenNotifications;
    unseenNotifications.push({
      type: "new-lawyer-request",
      message: `${newLawyer.firstName} ${newLawyer.lastName} یرای تغییر اکانت به وکالت درخواست داده است!`,
      createdAt: new Date(),
      profile: user?.profile,
      data: {
        lawyerId: newLawyer._id,
        name: newLawyer.firstName + " " + newLawyer.lastName,
      },
      onClickPath: "/admin/lawyerslist",
    });
    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
    res.status(200).send({
      success: true,
      message: "درخواست شما با موفقیت ثبت شد!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "مشکلی در درخواست شما رخ داده است!",
      success: false,
      error,
    });
  }
};

const markAllAsSeen = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    const unseenNotifications = user.unseenNotifications;
    const seenNotifications = user.seenNotifications;
    seenNotifications.push(...unseenNotifications);
    user.unseenNotifications = [];
    user.seenNotifications = seenNotifications;
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "تمام پیام ها نشان دار شدند!",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "مشکلی در نشان دار کردن پیام ها رخ داده است!",
      success: false,
      error,
    });
  }
};

const deleteAllNotifications = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.seenNotifications = [];
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      message: "تمام پیام ها حذف شدند!",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "مشکلی در حذف پیام ها رخ داده است!",
      success: false,
      error,
    });
  }
};

const getAllApprovedLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.find({ status: "approved" });
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

const checkAvailability = async (req, res) => {
  try {
    const selectedDay = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const lawyerId = req.body.lawyerId;

    const appointments = await Appointment.find({
      lawyerId,
      selectedDay,
      time: { $gte: fromTime, $lte: toTime },
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        message: "شخص دیگری این تاریخ را رزرو کرده است!",
        success: false,
      });
    } else {
      return res.status(200).send({
        message: "نویت موجود است!",
        success: true,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "مشکلی در رزرو وکیل رخ داده است!",
      success: false,
      error,
    });
  }
};

const bookAppointment = async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.selectedDay = moment(
      req.body.selectedDay,
      "YYYY-MM-DD"
    ).toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    const appointment = new Appointment(req.body);
    await appointment.save();
    //pushing notification to lawyer based on his userId
    const user = await User.findOne({ _id: req.body.lawyerInfo.userId });
    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `${req.body.userInfo.user.name} یک درخواست نوبت داده است! `,
      onClickPath: "/dashboard/lawyer/appointments",
      createdAt: new Date(),
    });
    await user.save();
    res.status(200).send({
      message: "رزرو موفقیت آمیز بود!",
      onClickPath: "/dashboard/user/appointments",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "مشکلی در رزرو وکیل رخ داده است!",
      success: false,
      error,
    });
  }
};

const getAppointmentsByUserId = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId });
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

const searchLawyers = async (req, res) => {
  try {
    const city = req.params.city;
    const searchQuery = req.query.searchQuery || "";
    const selectedSkills = req.query.selectedSkills || "";
    const sortOption = req.query.sortOption || "lastUpdated";
    // const page = parseInt(req.query.page) || 1;
    let query = {};
    query["city"] = new RegExp(city, "i");
    const cityCheck = await Lawyer.countDocuments(query);
    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        // pagination: {
        //   total: 0,
        //   page: 1,
        //   pages: 1,
        // },
      });
    }
    if (selectedSkills) {
      const skillsArray = selectedSkills
        .split(",")
        .map((skill) => new RegExp(skill, "i"));

      query["skills"] = { $all: skillsArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { lastName: searchRegex },
        { skills: { $in: [searchRegex] } },
      ];
    }

    // const pageSize = 2;
    // const skip = (page - 1) * pageSize;
    const lawyers = await Lawyer.find(query).lean();
    // const total = await Lawyer.countDocuments(query);
    const response = {
      data: lawyers,
      // pagination: {
      //   total,
      //   page,
      //   pages: Math.ceil(total / pageSize),
      // },
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getUserInfoById,
  applyLawyer,
  markAllAsSeen,
  deleteAllNotifications,
  getAllApprovedLawyers,
  checkAvailability,
  bookAppointment,
  getAppointmentsByUserId,
  searchLawyers,
};
