const express = require("express");
const {
  signup,
  login,
  getAllUsers,
  updateProfile,
  getMyProfile
} = require("../controllers/auth.controller");
const { isAuthenticated } = require("../middlewares/protectRoute");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/update", isAuthenticated, updateProfile);
router.get("/me", isAuthenticated, getMyProfile)

router.get("/", isAuthenticated, getAllUsers);

module.exports = router;
