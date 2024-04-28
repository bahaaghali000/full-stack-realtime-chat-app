const express = require("express");
const {
  sendMessage,
  getMessages,
  getChats,
  updateMessage,
  deleteMessage,
  deleteChat,
} = require("../controllers/message.controller");
const { isAuthenticated } = require("../middlewares/protectRoute");

const router = express.Router();

router.get("/:id", isAuthenticated, getMessages);
router.get("/", isAuthenticated, getChats);
router.delete("/delete/:receiverId", isAuthenticated, deleteChat);
router.post("/send/:receiverId", isAuthenticated, sendMessage);
router.patch("/:msgId/update", isAuthenticated, updateMessage);
router.delete("/:msgId/delete", isAuthenticated, deleteMessage);

module.exports = router;
