
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const roomPasswords = {
  "friends": "1234",
  "devs": "abcd",
};

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Route to main page
app.get("/", (req, res) => {
  res.render("index");
});

// ✅ Single connection handler
io.on("connection", (socket) => {
  console.log("New client connected");

  // Join a specific room
  socket.on("join-room", ({ username, room, password }) => {
    const roomPassword = roomPasswords[room];
    
    if(!roomPassword){
        socket.emit("no-entry")
    return;
}
    if( roomPassword !== password){
    socket.emit("no-welcome", "incorrect-password" );
return;
}


    socket.join(room);
    socket.data.username = username;
    socket.data.room = room;

    socket.emit("welcome", `Welcome to room "${room}", ${username}!`);

    socket.to(room).emit("receive-message", {
      username: "System",
      message: `${username} has joined the room.`,
    });

    // Handle message sending
    //socket.on("send-message", ({ message }) => {
      //io.to(room).emit("receive-message", {
      // username,
       // message,
    //  });
  //  });

    // Handle location sharing
    socket.on("send-location", (data) => {
      io.to(room).emit("receive-location", {
        id: socket.id,
        username,
        ...data,
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      io.to(room).emit("receive-message", {
        username: "System",
        message: `${username} has left the room.`,
      });
    });
  });
});

// Start server
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
