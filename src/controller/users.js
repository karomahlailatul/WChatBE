const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/users");
const commonHelper = require("../helper/common");
const authHelper = require("../helper/auth");
const createError = require("http-errors");

const crypto = require("crypto");
const sendEmail = require("../middlewares/sendEmail");

const { authenticateGoogle, uploadToGoogleDrive, deleteFromGoogleDrive } = require("../middlewares/googleDriveService");

const UserController = {
  registerAccount: async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkEmail = await usersModel.findEmail(email);

      try {
        if (checkEmail.rowCount == 1) throw "Email already used";
        // delete checkEmail.rows[0].password;
      } catch (error) {
        delete checkEmail.rows[0].password;
        return commonHelper.response(res, null, 403, error);
      }

      // users
      const saltRounds = 10;
      const passwordHash = bcrypt.hashSync(password, saltRounds);
      const id = uuidv4().toLocaleLowerCase();

      // verification
      const verify = "false";

      const users_verification_id = uuidv4().toLocaleLowerCase();
      const users_id = id;
      const token = crypto.randomBytes(64).toString("hex");

      // url localhost
      // const url = `${process.env.BASE_URL}users/verify?id=${users_id}&token=${token}`;

      // url deployment
      const url = `${process.env.BASE_URL}/verification?type=email&id=${users_id}&token=${token}`;

      // session
      const session_id = crypto.randomBytes(64).toString("hex");
      const connection = "false";

      //send email
      await sendEmail(email, "Verify Email", url);

      // insert db table users
      await usersModel.createUsers(id, email, passwordHash, verify);

      // insert db table verification
      await usersModel.createUsersVerification(users_verification_id, users_id, token);

      // insert db table session
      await usersModel.createSession(session_id, users_id, connection);

      commonHelper.response(res, null, 201, "Sign Up Success, Please check your email for verification");
    } catch (error) {
      console.log(error);
      res.send(createError(400));
    }
  },
  VerifyAccount: async (req, res) => {
    try {
      const queryUsersId = req.query.id;
      const queryToken = req.query.token;

      if (typeof queryUsersId === "string" && typeof queryToken === "string") {
        const checkUsersVerify = await usersModel.findId(queryUsersId);

        if (checkUsersVerify.rowCount == 0) {
          return commonHelper.response(res, null, 403, "Error users has not found");
        }

        if (checkUsersVerify.rows[0].verify != "false") {
          return commonHelper.response(res, null, 403, "Users has been verified");
        }

        const result = await usersModel.checkUsersVerification(queryUsersId, queryToken);

        if (result.rowCount == 0) {
          return commonHelper.response(res, null, 403, "Error invalid credential verification");
        } else {
          await usersModel.updateAccountVerification(queryUsersId);
          await usersModel.deleteUsersVerification(queryUsersId, queryToken);
          commonHelper.response(res, null, 200, "Users verified succesful");
        }
      } else {
        return commonHelper.response(res, null, 403, "Invalid url verification");
      }
    } catch (error) {
      res.send(createError(404));
    }
  },
  loginAccount: async (req, res) => {
    try {
      const { email_username, password } = req.body;

      let findEmailUsername;
      let alert;

      if (email_username.includes("@")) {
        findEmailUsername = await usersModel.findEmailSession(email_username);
        alert = "Email";
      } else {
        findEmailUsername = await usersModel.findUsernameSession(email_username);
        alert = "Username";
      }

      const {
        rows: [user],
      } = findEmailUsername;

      if (!user) {
        return commonHelper.response(res, null, 403, `${alert} is invalid`);
      }

      const isValidPassword = bcrypt.compareSync(password, user.password);
     
      if (!isValidPassword) {
        return commonHelper.response(res, null, 403, "Password is invalid");
      }

      if (user.verify === "false") {
        return commonHelper.response(res, null, 403, "Account not verified, Please check your email");
      }

      delete user.password;

      const payload = {
        id: user.id,
        email: user.email,
        session: user.session_id,
      };
      user.token = authHelper.generateToken(payload);
      user.refreshToken = authHelper.generateRefreshToken(payload);

      commonHelper.response(res, user, 201, "Login is Successful");
    } catch (error) {
      res.send(createError(400));
    }
  },
  profileAccount: async (req, res) => {
    try {
      const queryUpdate = req.query.update;
      const queryDelete = req.query.delete;

      const email = req.payload.email;
      const {
        rows: [user],
      } = await usersModel.findEmailSession(email);
      delete user.password;

      if (typeof queryUpdate === "undefined" && typeof queryDelete === "undefined") {
        commonHelper.response(res, user, 200);
      } else if (typeof queryUpdate === "string" && typeof queryDelete === "undefined") {
        if (req.file) {
          const auth = authenticateGoogle();

          if (user.picture != null || user.picture != undefined) {
            await deleteFromGoogleDrive(user.picture, auth);
          }

          // Upload to Drive
          const response = await uploadToGoogleDrive(req.file, auth);
          const picture = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;

          const { name, phone, status, username } = req.body;

          const result = await usersModel.updateAccount(email, name, phone, status, picture, username);

          commonHelper.response(res, result.rows, 201, "Profile has been updated");
        } else {
          const { name, phone, status, username } = req.body;

          const result = await usersModel.updateNoPict(email, name, phone, status, username);

          commonHelper.response(res, result.rows, 201, "Profile has been updated");
        }
      } else if (typeof queryUpdate === "undefined" && typeof queryDelete === "string") {
        await usersModel.deleteAccount(email);
        commonHelper.response(res, null, 200, "Account has been deleted");
      }
    } catch (error) {
      console.log(error);
      res.send(createError(404));
    }
  },
  changeEmail: async (req, res) => {
    try {
      const email = req.payload.email;
      const emailBody = req.body.email;
      await usersModel.changeEmailAccount(email, emailBody);
      commonHelper.response(res, null, 201, "Email Account has been update, Please Login again");
    } catch (error) {
      res.send(createError(404));
    }
  },
  changePassword: async (req, res) => {
    try {
      const email = req.payload.email;
      const { password } = req.body;
      const saltRounds = 10;
      const passwordNewHash = bcrypt.hashSync(password, saltRounds);
      // console.log(email + " " + password + "   " + passwordNewHash);
      await usersModel.changePassword(email, passwordNewHash);
      commonHelper.response(res, null, 200, "Password Account has been update");
    } catch (error) {
      res.send(createError(404));
    }
  },
  refreshToken: async (req, res) => {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);
    // const payload = {
    //   email: decoded.email,
    //   role: decoded.role,
    // };
    const payload = {
      id: decoded.id,
      email: decoded.email,
      session: decoded.session_id,
    };
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    };
    commonHelper.response(res, result, 200, "Refresh Token Success");
  },
  googleSign: async (req, res) => {
    const { name, email, picture } = JSON.parse(req.user)._json;
    const result = await usersModel.findEmailSession(email);

    let uuid;
    let session_id;

    if (result.rowCount == 1) {
      uuid = result.rows[0].id;
      session_id = result.rows[0].session_id;
    } else {
      uuid = uuidv4().toLocaleLowerCase();
      const verify = "true";
      await usersModel.createAccountGoogle(uuid, email, picture, name, verify);
      session_id = crypto.randomBytes(64).toString("hex");
      const connection = "false";
      await usersModel.createSession(session_id, uuid, connection);
    }

    const payload = {
      email: email,
      session_id: session_id,
    };

    const token = authHelper.generateToken(payload);
    const refreshToken = authHelper.generateRefreshToken(payload);

    const data = {
      id: uuid,
      token: token,
      refreshToken: refreshToken,
      session_id: session_id,
    };

    // encodeBase64
    let bufferDataEncode = Buffer.from(JSON.stringify(data));
    let resultBase64DataEncode = bufferDataEncode.toString("base64");

    return res.redirect(`${process.env.CALLBACK_URL_FRONT_END}?success&code=${resultBase64DataEncode}`);
  },
};

module.exports = UserController;
