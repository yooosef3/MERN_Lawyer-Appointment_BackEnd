const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .json({ message: "کاربر از قبل موجود است", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    req.body.confirmPassword = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res
      .status(200)
      .json({ message: "کاربر با موفقیت ساخته شد", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ساخت کاربر", success: false, error });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "کاربر موجود نیست!", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "رمز صحیح نیست!", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .send({ message: "با موفقیت وارد شدید!", success: true, data: token });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "مشکلی در ورود رخ داده است", success: false, error });
  }
};

module.exports = { register, login };
