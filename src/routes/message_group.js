const express = require("express");
const router = express.Router();
const ControllerMessage = require("../controller/message");
const { protect } = require("../middlewares/auth");
// const upload = require("../middlewares/upload");
// const { validateRegister,
//     validateLogin,
//     validateUpdateProfile,
//     validateChangeEmail,
//     validateChangePassword } = require('../middlewares/common')

router


.get("/", protect, ControllerMessage.messagePagination)
.delete("/delete-sender-receiver", protect, ControllerMessage.messageDeleteSenderIdReceiverId)

module.exports = router;
