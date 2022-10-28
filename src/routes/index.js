const express = require("express");
const router = express.Router();

const usersRouter = require("./users");
const messageRouter = require("./message")
const groupChatRouter = require("./group_chat")


router
    .use("/users", usersRouter)
    .use("/message", messageRouter)
    .use("/group_chat", groupChatRouter);

module.exports = router;
 