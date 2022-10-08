require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const createError = require("http-errors");
const helmet = require("helmet");
const xss = require("xss-clean");

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

// app.use("/api/v1", mainRouter);

app.use("/", mainRouter);

app.use("/tmp", express.static("./tmp"));

// app.all("*", (req, res, next) => {
//   next(createError());
// });

// app.use((err, req, res, next) => {
//   const statusCode = err.status;
//   if (res.status(statusCode)) {
//     res.send(createError(statusCode, err));
//   }
//   next();
// });

const port = process.env.PORT;
// app.listen(port, () => {
//   console.log(`server running on :${port}`);
// });

// configurate socket io
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const sessionModel = require("./src/models/session");
const messageModel = require("./src/models/message");

io.use(async (socket, next) => {
  // console.log(socket)
  const sessionID = socket.handshake.auth.sessionID;

  // const session = await sessionModel.selectAllSessionId(sessionID)

  // console.log(session)
  // console.log(sessionID)
  if (sessionID) {
    // const session = sessionStore.findSession(sessionID);
    const session = await sessionModel.selectAllSessionId(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.users_id;
      socket.username = session.username;
      return next();
    }
  } else {
    const username = socket.handshake.auth.username;

    // console.log(username)
    if (!username) {
      return next(new Error("eror username"));
    } else {
      const id = randomId();
      const email = "test123@email.com";
      const password = "123";
      const verify = "false";

      const session_id = randomId();
      const users_id = id;
      const connection = "false";

      await sessionModel.insertSessionAndUsers(id, email, password, username, verify, session_id, users_id, connection);

      socket.sessionID = session_id;
      socket.userID = id;
      socket.username = username;
    }

    return next();
  }
});

io.on("connection", async (socket) => {
  const sessionID = socket.sessionID;

  await sessionModel.updateSessionConnectionTrue(sessionID);

  const session = await sessionModel.selectAllSessionId(sessionID);

  socket.emit("session", {
    sessionID: session.rows[0].id,
    userID: session.rows[0].users_id,
  });

  socket.join(session.rows[0].users_id);

  const users = [];

  const messagesPerUser = new Map();

  const messageAllUsersID = await messageModel.selectAllUsersID(session.rows[0].users_id);

  messageAllUsersID.rows.forEach((message) => {
    const { from, to } = message;
    const otherUser = session.rows[0].users_id === from ? to : from;
    if (messagesPerUser.has(otherUser)) {
      messagesPerUser.get(otherUser).push(message);
    } else {
      messagesPerUser.set(otherUser, [message]);
    }
  });

  const sessionAll = await sessionModel.selectAllSession();

  sessionAll.rows.forEach((session) => {
    users.push({
      userID: session.users_id,
      username: session.username,
      connected: session.connection,
      messages: messagesPerUser.get(session.users_id) || [],
    });
  });

  socket.emit("users", users);

  socket.broadcast.emit("user connected", {
    userID: session.rows[0].users_id,
    username: session.rows[0].username,
    connected: true,
    messages: [],
  });

  socket.on("private message", async ({ content, to }) => {
    const message = {
      content,
      from: session.rows[0].users_id,
      to,
    };
    const id = randomId();
    socket.to(to).to(session.rows[0].users_id).emit("private message", message);
    await messageModel.insertMessage(id, session.rows[0].users_id, to, content);
  });

  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(session.rows[0].users_id).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      socket.broadcast.emit("user disconnected", session.rows[0].users_id);
      await sessionModel.updateSessionConnectionFalse(sessionID);
    }
  });
});

httpServer.listen(port, () => {
  console.log(`local ${port}`);
});
