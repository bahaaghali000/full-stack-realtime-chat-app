const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

exports.isAuthenticated = asyncErrorHandler(async (req, res, next) => {
  if (
    !req.headers.authorization &&
    !req.headers.authorization?.startsWith("Bearer")
  ) {
    return res.status(401).json({
      status: "fail",
      message: "Please Login to Access",
    });
  } else {
    const token = req.headers.authorization.replace("Bearer ", "");

    const decodedData = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.userId);
    next();
  }
});
