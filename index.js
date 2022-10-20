require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const createError = require("http-errors");
const helmet = require("helmet");
const xss = require("xss-clean");

// configurate express
const app = express();

const mainRouter = require("./src/routes/index");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use(
  cors({
    origin: "*",
  })
);

app.use(helmet());

app.use(xss());

app.use("/api/v1", mainRouter);

// app.use("/", mainRouter);

app.use("/tmp", express.static("./tmp"));

app.all("*", (req, res, next) => {
  next(createError());
});

app.use((err, req, res, next) => {
  const statusCode = err.status;
  if (res.status(statusCode)) {
    res.send(createError(statusCode, err));
  }
  next();
});

// const port = process.env.PORT;
// app.listen(port, () => {
//   console.log(`server running on :${port}`);
// });

// configurate socket.io
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    // origin: 'http://localhost:3000',
  },
});

const crypto = require("crypto");
const randomId = () => crypto.randomBytes(64).toString("hex");

const sessionModel = require("./src/models/session");
const messageModel = require("./src/models/message");

io.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionId;
  // console.log(sessionID)
  if (sessionID) {
    const session = await sessionModel.selectAllSessionId(sessionID);
    if (session.rowCount != 0) {
      socket.sessionID = sessionID;
      socket.userID = session.rows[0].users_id;
      socket.username = session.rows[0].username;
      socket.email = session.rows[0].email;
      socket.name = session.rows[0].name;
      socket.picture = session.rows[0].picture;
      socket.status = session.rows[0].status;
      return next();
    }
  }
  next();
});

io.on("connection", async (socket) => {
  const sessionID = await socket.sessionID;
  //  console.log(sessionID);
  if (sessionID) {
    await sessionModel.updateSessionConnectionTrue(sessionID);
    const session = await sessionModel.selectAllSessionId(sessionID);

    socket.join(session.rows[0].users_id);

    const users = [];

    const messagesPerUser = new Map();

    const messageAllUsersID = await messageModel.selectAllUsersID(session.rows[0].users_id);

    // console.log(messageAllUsersID)

    messageAllUsersID.rows.forEach((message) => {
      const { id, sender, receiver } = message;
      const otherUser = session.rows[0].users_id === sender ? receiver : sender;
      // console.log(id)

      // if (messagesPerUser.has(otherUser) ) {
      //   console.log( " ini push ")
      // // if (messagesPerUser.has(otherUser) && messagesPerUser.has(id) ) {
      //   messagesPerUser.get(otherUser).push(message);
      // } else {
      //   console.log( " ini push gas")
      //   messagesPerUser.set(otherUser, [message]);
      // }

      // console.log(messagesPerUser.has(id));

      if (messagesPerUser.has(id)) {
        if (messagesPerUser.has(otherUser)) {
          // console.log(" ini get ");
          // if (messagesPerUser.has(otherUser) && messagesPerUser.has(id) ) {
          messagesPerUser.get(otherUser).push(message);
        } else {
          // console.log(" ini set");
          messagesPerUser.set(otherUser, [message]);
        }
      } else {
        // console.log(" ini set");
        messagesPerUser.set(id, [message]);
      }
    });

    const sessionAll = await sessionModel.selectAllSession();

    sessionAll.rows.forEach((session) => {
      users.push({
        id: session.users_id,
        userID: session.users_id,
        username: session.username,
        connected: session.connection,
        email: session.email,
        name: session.name,
        picture: session.picture,
        status: session.status,
        messages: messagesPerUser.get(session.users_id) || [],
        messagesUnread : 0
      });
    });

    socket.emit("users", users);

    socket.broadcast.emit("user connected", {
      id: session.rows[0].users_id,
      userID: session.rows[0].users_id,
      username: session.rows[0].username,
      email: session.rows[0].email,
      name: session.rows[0].name,
      picture: session.rows[0].picture,
      status: session.rows[0].status,
      connected: true,
      messages: [],
    });

    socket.on("messagePrivate", async ({ id, content, sender, receiver, created_on }) => {
      // console.log({ id, content, sender, receiver, created_on });
      socket.to(receiver).to(sender).emit("messagePrivateForward", { id, content, sender, receiver, created_on });
      await messageModel.insertMessage(id, content, sender, receiver, created_on);
    });

    socket.on("disconnect", async () => {
      const matchingSockets = await io.in(session.rows[0].users_id).allSockets();
      const isDisconnected = matchingSockets.size === 0;
      if (isDisconnected) {
        socket.broadcast.emit("user disconnected", session.rows[0].users_id);
        await sessionModel.updateSessionConnectionFalse(sessionID);
      }
    });
  }
});

// server listen port
const port = process.env.PORT;
httpServer.listen(port, () => {
  console.log(`listen on port ${port}`);
});
