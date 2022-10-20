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

// .get("/message", protect, ControllerMessage.messageReceiver)
// .get("/message", protect, ControllerMessage.messageSenderReceiver)

//   .post("/register", ControllerUsers.registerAccount)
//   .post("/login", ControllerUsers.loginAccount)
//   .post("/refresh-token", ControllerUsers.refreshToken)
//   .get("/profile", protect, ControllerUsers.profileAccount)
//   .put("/profile", protect, upload.single("picture"), ControllerUsers.profileAccount)
//   .delete("/profile", protect, ControllerUsers.profileAccount)
//   .put("/profile/changeEmail", protect, ControllerUsers.changeEmail)
//   .put("/profile/changePassword", protect, ControllerUsers.changePassword)

//   .post("/verify", ControllerUsers.VerifyAccount)
  

module.exports = router;
