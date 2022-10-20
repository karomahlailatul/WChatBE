const express = require("express");
const router = express.Router();

const usersRouter = require("./users");
const messageRouter = require("./message")


router

    .use("/users", usersRouter)
    .use("/message", messageRouter)

module.exports = router;
 