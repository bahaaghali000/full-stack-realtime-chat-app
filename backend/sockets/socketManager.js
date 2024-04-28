const { Server } = require("socket.io");
const Conversation = require("../models/coversation.model");

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  const user = users.find((user) => user.userId === userId);
  return user ? user.socketId : null;
};

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_BASE_URL,
    },
  });

  io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });

    // typing states
    socket.on("typing", async ({ sender, receiver }) => {
      const receiverSocketId = getUser(receiver);

      // find the conversation between the receiver and the sender
      const conversation = await Conversation.findOne({
        participants: { $all: [sender, receiver] },
      });

      io.to(receiverSocketId).emit("typing", {
        sender,
        conversation: conversation?._id,
      });
    });

    socket.on("typing stop", async ({ sender, receiver }) => {
      const receiverSocketId = getUser(receiver);

      // find the conversation between the receiver and the sender
      const conversation = await Conversation.findOne({
        participants: { $all: [sender, receiver] },
      });
      io.to(receiverSocketId).emit("typing stop", {
        sender,
        conversation: conversation?._id,
      });
    });

    //    user disconnected
    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
}

function emitNewChat(receiverId, conversation) {
  const receiverSocketId = getUser(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newChat", conversation);
  }
}

function emitNewMessage(receiverId, message, conversationId, unseenMessages) {
  const receiverSocketId = getUser(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", {
      message,
      conversationId,
      unseenMessages,
    });
  }
}

function emitSeenMessages(receiverId, conversationId) {
  const receiverSocketId = getUser(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("seenMessages", conversationId);
  }
}

module.exports = {
  initializeSocket,
  emitNewChat,
  emitNewMessage,
  emitSeenMessages,
};
