const express = require("express");
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig.js");
app.use(express.json());
const adminRoute = require("./routes/adminRoute.js");
const userRoute = require("./routes/userRoute.js");
const lawyerRoute = require("./routes/lawyerRoute.js");

const port = process.env.PORT || 5000;
const cors = require("cors");
// const { v2 } = require("cloudinary");
// v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
app.use(cors());
app.use("/api/admin", adminRoute);
app.use("/api/user", userRoute);
app.use("/api/lawyer", lawyerRoute);

app.listen(port, () => console.log(`node server started at port ${port}`));
