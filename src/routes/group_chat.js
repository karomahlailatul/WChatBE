const express = require("express");
const router = express.Router();
const ControllerGroupChat = require("../controller/group_chat");
const { protect } = require("../middlewares/auth");
const upload = require("../middlewares/upload");
// const { validateRegister,
//     validateLogin,
//     validateUpdateProfile,
//     validateChangeEmail,
//     validateChangePassword } = require('../middlewares/common')

router
.post("/", protect, upload.single("group_logo"), ControllerGroupChat.insertGroupChat)
.put("/:id", protect, upload.single("group_logo"), ControllerGroupChat.updateGroupChat)
.delete("/:id", protect, ControllerGroupChat.deleteGroupChat);

module.exports = router;
