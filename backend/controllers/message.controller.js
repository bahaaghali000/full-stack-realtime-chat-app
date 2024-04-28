const Conversation = require("../models/coversation.model");
const Message = require("../models/message.model");
const cloudinary = require("cloudinary").v2;
const {
  emitNewChat,
  emitNewMessage,
  emitSeenMessages,
} = require("../sockets/socketManager");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const sendMessage = asyncErrorHandler(async (req, res) => {
  const { message, isImage, caption } = req.body;
  const { receiverId } = req.params;
  const senderId = req.user._id;

  // find the conversation between the receiver and the sender
  const conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  let newMessage;

  if (isImage) {
    const result = await cloudinary.uploader.upload(message);
    newMessage = new Message({
      senderId,
      receiverId,
      message: result.url,
      isImage: true,
      caption,
    });
  } else {
    newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
  }

  if (newMessage) {
    conversation.messages.push(newMessage);
    conversation.lastMsg = isImage ? "Image" : message;
  }

  await Promise.all([conversation.save(), newMessage.save()]);
  // SOCKET IO FUNCTIONALTY WILL GO HERE
  emitNewMessage(
    receiverId,
    newMessage,
    conversation._id,
    conversation.unseenMessages
  );

  res.status(201).json({
    status: "success",
    data: {
      message: newMessage,
    },
  });
});

const getMessages = asyncErrorHandler(async (req, res) => {
  const { id: userToChatId } = req.params;
  const senderId = req.user._id;

  const conversation = await Conversation.findOne({
    participants: { $all: [senderId, userToChatId] },
  }).populate("messages"); // Not reference but actual messages

  if (!conversation) {
    const conversation = await Conversation.create({
      participants: [senderId, userToChatId],
    });

    const chat = await conversation.populate("participants");

    emitNewChat(userToChatId, chat);
    return res.status(200).json({
      status: "success",
      data: [],
      chat,
      isNewConversation: true,
    });
  }

  // Update all messages in the conversation to be seen
  conversation.messages.forEach(async (message) => {
    if (!message.seen) {
      message.seen = true;
      await message.save();
    }
  });
  conversation.unseenMessages = 0;

  await conversation.save();

  emitSeenMessages(userToChatId, conversation._id);
  res.status(200).json({
    status: "success",
    data: conversation.messages,
  });
});

const getChats = asyncErrorHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
  })
    .populate("participants")
    .select("-messages");

  return res.status(200).json({
    status: "success",
    data: conversations,
  });
});

const deleteChat = asyncErrorHandler(async (req, res) => {
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;

  // Find the conversation
  const conversation = await Conversation.findOneAndDelete({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    return res.status(404).json({
      status: "error",
      message: "Conversation not found",
    });
  }

  // Delete all messages in the conversation
  await Message.deleteMany({ _id: { $in: conversation.messages } });

  return res.status(200).json({
    status: "success",
    message: "Conversation and associated messages deleted successfully",
  });
});

const updateMessage = asyncErrorHandler(async (req, res) => {
  const { msgId } = req.params;

  const message = await Message.findOneAndUpdate(
    { _id: msgId, senderId: req.user._id },
    req.body,
    { new: true }
  );

  return res.status(200).json({
    status: "success",
    data: message,
  });
});

const deleteMessage = asyncErrorHandler(async (req, res) => {
  const { msgId } = req.params;

  const msg = await Message.findOneAndDelete({
    _id: msgId,
    senderId: req.user._id,
  });

  if (!msg) {
    return res.status(400).json({
      status: "fail",
      message: "You don't have an permsion to do that",
    });
  }

  return res.status(200).json({
    status: "success",
    data: {
      message: "Message deleted successfully",
    },
  });
});

module.exports = {
  sendMessage,
  getMessages,
  getChats,
  updateMessage,
  deleteMessage,
  deleteChat,
};
