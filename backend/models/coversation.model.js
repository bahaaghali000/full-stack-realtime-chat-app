const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
    lastMsg: {
      type: String,
      default: "",
    },
    unseenMessages: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Define pre-save middleware to calculate unseenMessages
conversationSchema.pre("save", async function (next) {
  await this.populate("messages");
  // Count the number of messages with seen equal to false
  const unseenMessages = this.messages.reduce(
    (count, message) => (message.seen === false ? count + 1 : count),
    0
  );
  this.unseenMessages = unseenMessages;
  next();
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
