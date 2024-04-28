const app = require("./app");
const http = require("http");
const connectToMongodb = require("./db/connectToMongodb");
const { initializeSocket } = require("./sockets/socketManager");
const cloudinary = require("cloudinary").v2;

const PORT = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const server = http.createServer(app);

// ============= socket.io ==============

initializeSocket(server);

server.listen(PORT, () => {
  connectToMongodb();
  console.log("server is listening on port " + PORT);
});

module.exports = {
  server,
};
