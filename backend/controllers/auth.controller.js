const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const cloudinary = require("cloudinary").v2;

const signup = asyncErrorHandler(async (req, res) => {
  const { email, username } = req.body;

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (user) {
    return res
      .status(400)
      .json({ status: "fail", msg: "username or email already exists" });
  }

  const newUser = await User.create(req.body);

  const token = await generateToken(newUser._id);

  return res.status(201).json({
    status: "success",
    data: {
      user: {
        _id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        profilePic: newUser.profilePic,
      },
      token,
    },
  });
});

const login = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "This Email Is Not Exsit",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json({ status: "fail", message: "Invalid password" });
  }

  const token = await generateToken(user._id);

  res.status(200).json({
    status: "success",
    data: {
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        profilePic: user.profilePic,
      },
      token,
    },
  });
});

const getAllUsers = asyncErrorHandler(async (req, res) => {
  const { search } = req.query;

  let users = [];

  if (search) {
    users = await User.find({
      $nor: [{ _id: req.user._id }],

      $or: [
        {
          username: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    }).select("-password -__v");
  } else {
    users = await User.find({
      $nor: [{ _id: req.user._id }],
    });
  }

  return res.json({
    status: "success",
    data: {
      users,
    },
  });
});

const updateProfile = asyncErrorHandler(async (req, res) => {
  const photo = req.body.imageBase64
    ? await cloudinary.uploader.upload(req.body.imageBase64)
    : null;

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { ...req.body, profilePic: photo?.url }
  );

  return res.status(202).json({
    status: "success",
    data: {
      user: {
        _id: user._id,
        email: user.email,
        bio: req.body.bio || user.bio,
        username: req.body.username || user.username,
        profilePic: photo ? photo.url : user.profilePic,
      },
    },
  });
});

const getMyProfile = asyncErrorHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  return res.status(200).json({
    status: "success",
    data: {
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        profilePic: user.profilePic,
      },
    },
  });
});

module.exports = {
  signup,
  login,
  getAllUsers,
  updateProfile,
  getMyProfile,
};
