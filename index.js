require("dotenv").config();
const { createServer } = require("http");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User Connected");

  socket.on("join", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("leave", (room) => {
    socket.leave(room);
    console.log("User left room: " + room);
  });

  socket.on("message", (room, message) => {
    io.to(room).emit("message", message);

    console.log(`Message sent to room ${room}: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

// Import Routes
const api = require("./src/routes/api.route");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  req.io = io;
  return next();
});

// Routing
app.use(api);

// Swagger
app.use(
  "/doc",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, {
    swaggerOptions: { persistAuthorization: true },
  })
);

// Static File
app.use("/public", express.static("public"));

// Error Handling
app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: "PAGE_NOT_FOUND",
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
