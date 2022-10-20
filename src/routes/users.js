const express = require("express");
const router = express.Router();
const ControllerUsers = require("../controller/users");
const { protect } = require("../middlewares/auth");
const upload = require("../middlewares/upload");
// const { validateRegister,
//     validateLogin,
//     validateUpdateProfile,
//     validateChangeEmail,
//     validateChangePassword } = require('../middlewares/common')

router

  .post("/register", ControllerUsers.registerAccount)
  .post("/login", ControllerUsers.loginAccount)
  .post("/refresh-token", ControllerUsers.refreshToken)
  .get("/profile", protect, ControllerUsers.profileAccount)
  .put("/profile", protect, upload.single("picture"), ControllerUsers.profileAccount)
  .delete("/profile", protect, ControllerUsers.profileAccount)
  .put("/profile/changeEmail", protect, ControllerUsers.changeEmail)
  .put("/profile/changePassword", protect, ControllerUsers.changePassword)

  .post("/verify", ControllerUsers.VerifyAccount)
  

module.exports = router;
