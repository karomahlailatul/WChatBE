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

const sessionModel = require("./src/models/session");
const messageModel = require("./src/models/message");
const groupChatModel = require("./src/models/group_chat");
const messageGroupChatModel = require("./src/models/message_group");

io.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionId;
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
  if (sessionID) {
    // checking user
    await sessionModel.updateSessionConnectionTrue(sessionID);
    const session = await sessionModel.selectAllSessionId(sessionID);

    // join global socket.io user
    socket.join(session.rows[0].users_id);

    // GROUP AREA
    // check list message group
    const messageGrup = new Map();
    const messageAllGroupID = await messageGroupChatModel.selectAllUsersID();
    messageAllGroupID.rows.forEach((messageGroup) => {
      if (messageGrup.has(messageGroup.group_chat_id)) {
        messageGrup.get(messageGroup.group_chat_id).push(messageGroup);
      } else {
        messageGrup.set(messageGroup.group_chat_id, [messageGroup]);
      }
    });

    // check list join group
    const listGroup = new Array();
    const listAllGroupID = await groupChatModel.selectAllUsersID();
    listAllGroupID.rows.forEach(async (item) => {
      if (!listGroup.includes(item.id)) {
        listGroup.push({
          id: item.id,
          owner_id: item.owner_id,
          group_name: item.group_name,
          group_logo: item.group_logo,
          group_member: item.group_member,
          created_on: item.created_on,
          email: item.email,
          phone: item.phone,
          username: item.username,
          name: item.name,
          picture: item.picture,
          status: item.status,
          users_created_on: item.users_created_on,
          message_group: messageGrup.get(item.id) || [],
          message_group_unread: 0,
        });
      }
    });

    // forward to client list group and message group
    socket.emit("listGroup", listGroup);

    // incoming message and forward message to all member
    socket.on("messageGroupPrivate", async ({ id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on }) => {
      const resultMember = await groupChatModel.checkMemberGroupChat(group_chat_id);
      resultMember.rows[0].group_member.forEach(async (item) => {
        socket.to(item).to(sender).emit("messageGroupPrivateForward", { id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on });
      });
      await messageGroupChatModel.insertMessage(id, content, sender, group_chat_id, content_type, created_on);
    });

    // incoming join member and forward broadcast to all member
    socket.on("joinGroup", async ({ id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on }) => {
      const resultMember = await groupChatModel.checkMemberGroupChat(group_chat_id);
      resultMember.rows[0].group_member.forEach(async (item) => {
        socket.to(item).to(sender).emit("joinGroupForward", { id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on });
      });
      await messageGroupChatModel.insertMessage(id, content, sender, group_chat_id, content_type, created_on);
      await groupChatModel.insertMember(sender, group_chat_id);
    });

    // incoming leave member and forward broadcast to all member
    socket.on("leaveGroup", async ({ id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on }) => {
      const resultMember = await groupChatModel.checkMemberGroupChat(group_chat_id);
      resultMember.rows[0].group_member.forEach(async (item) => {
        socket.to(item).to(sender).emit("leaveGroupForward", { id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on });
      });
      await messageGroupChatModel.insertMessage(id, content, sender, group_chat_id, content_type, created_on);
      await groupChatModel.updateMemberLeave(sender, group_chat_id);
    });

    // incoming create group and forward brodcast to all user
    socket.on("createGroup", async ({ id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on, owner_id, group_member, group_name, group_logo }) => {
      await messageGroupChatModel.insertMessage(id, content, sender, group_chat_id, content_type, created_on);
      socket.broadcast.emit("createGroupForward", {
        id,
        content,
        content_type,
        sender,
        group_chat_id,
        created_on,
        email,
        name,
        username,
        phone,
        status,
        picture,
        users_created_on,
        owner_id,
        group_member,
        group_name,
        group_logo,
      });
    });

    // incoming update group and forward broadcast to all user
    socket.on("updatedGroup", async ({ id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on, owner_id, group_member, group_name, group_logo }) => {
      await messageGroupChatModel.insertMessage(id, content, sender, group_chat_id, content_type, created_on);
      socket.broadcast.emit("updatedGroupForward", {
        id,
        content,
        content_type,
        sender,
        group_chat_id,
        created_on,
        email,
        name,
        username,
        phone,
        status,
        picture,
        users_created_on,
        owner_id,
        group_member,
        group_name,
        group_logo,
      });
    });

    // incoming update list member group and forward broadcast to all user
    socket.on("leaveGroupAdmin", async ({ id, content, content_type, sender, group_chat_id, created_on, email, name, username, phone, status, picture, users_created_on, dataGroupMemberListForward }) => {
      await messageGroupChatModel.insertMessage(id, content, sender, group_chat_id, content_type, created_on);
      await groupChatModel.updateMemberLeaveAdmin(dataGroupMemberListForward, group_chat_id);
      socket.broadcast.emit("leaveGroupAdminForward", {
        id,
        content,
        content_type,
        sender,
        group_chat_id,
        created_on,
        email,
        name,
        username,
        phone,
        status,
        picture,
        users_created_on,
        dataGroupMemberListForward,
      });
    });

    // incoming remove group and forward broadcast to all user
    socket.on("removeGroup", async ({ group_chat_id }) => {
      await groupChatModel.deleteGroupChat(group_chat_id);
      socket.broadcast.emit("removeGroupForward", { group_chat_id });
    });

    // USER AREA
    // broadcast users some people update their profile
    socket.on("updatedUsers", async ({ id, email, name, username, phone, status, picture }) => {
      socket.broadcast.emit("updatedUsersForward", {
        id,
        email,
        name,
        username,
        phone,
        status,
        picture,
      });
    });

    // check message list global users
    const messagesPerUser = new Map();
    const messageAllUsersID = await messageModel.selectAllUsersID(session.rows[0].users_id);
    messageAllUsersID.rows.forEach((message) => {
      const { id, sender, receiver } = message;
      const otherUser = session.rows[0].users_id === sender ? receiver : sender;
      if (messagesPerUser.has(id)) {
        if (messagesPerUser.has(otherUser)) {
          messagesPerUser.get(otherUser).push(message);
        } else {
          messagesPerUser.set(otherUser, [message]);
        }
      } else {
        messagesPerUser.set(id, [message]);
>>>>>>>>> Temporary merge branch 2
      }
    });

    // push all list user and message
    const listUsers = [];
    const sessionAll = await sessionModel.selectAllSession();
    sessionAll.rows.forEach((session) => {
      listUsers.push({
        id: session.users_id,
        userID: session.users_id,
        username: session.username,
        connected: session.connection,
        email: session.email,
        name: session.name,
        picture: session.picture,
        status: session.status,
        created_on: session.created_on,
        messages: messagesPerUser.get(session.users_id) || [],
<<<<<<<<< Temporary merge branch 1
=========
        messagesUnread : 0
>>>>>>>>> Temporary merge branch 2
      });
    });

    // forward to client list user and message
    socket.emit("listUsers", listUsers);

    // forward message from client to client
    socket.on("messagePrivate", async ({ id, content, sender, receiver, created_on }) => {
      socket.to(receiver).to(sender).emit("messagePrivateForward", { id, content, sender, receiver, created_on });
      await messageModel.insertMessage(id, content, sender, receiver, created_on);
    });

    // socket broadcast user connected
    socket.broadcast.emit("user connected", {
      id: session.rows[0].users_id,
      userID: session.rows[0].users_id,
      username: session.rows[0].username,
      email: session.rows[0].email,
      name: session.rows[0].name,
      picture: session.rows[0].picture,
      status: session.rows[0].status,
      created_on: session.rows[0].created_on,
      connected: true,
      messages: [],
    });

    // socket broadcast user disconnected
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

// configurate passport
const passport = require("passport");
app.use(passport.initialize());
require("./src/middlewares/Passport.js");
