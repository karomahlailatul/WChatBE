const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const messageModel = require("../models/message");
const commonHelper = require("../helper/common");
const authHelper = require("../helper/auth");
const createError = require("http-errors");

const crypto = require("crypto");
const sendEmail = require("../middlewares/sendEmail");

const { authenticateGoogle, uploadToGoogleDrive, deleteFromGoogleDrive } = require("../middlewares/googleDriveService");

const ControllerMessage = {
  //   registerAccount: async (req, res) => {
  //     try {
  //       const { email, password } = req.body;
  //       const checkEmail = await usersModel.findEmail(email);

  //       delete checkEmail.rows[0].password;

  //       // console.log(checkEmail)
  //       // console.log(checkEmail.rows[0].count)

  //       try {
  //         if (checkEmail.rowCount == 1) throw "Email already used";
  //       } catch (error) {
  //         return commonHelper.response(res, null, 403, error);
  //       }

  //       // users
  //       const saltRounds = 10;
  //       const passwordHash = bcrypt.hashSync(password, saltRounds);
  //       const id = uuidv4().toLocaleLowerCase();

  //       // verification
  //       const verify = "false";

  //       const users_verification_id = uuidv4().toLocaleLowerCase();
  //       const users_id = id;
  //       const token = crypto.randomBytes(64).toString("hex");

  //       // url localhost
  //       // const url = `${process.env.BASE_URL}users/verify?id=${users_id}&token=${token}`;

  //       // url deployment
  //       const url = `${process.env.BASE_URL}/verification?type=email&id=${users_id}&token=${token}`;

  //       // session
  //       const session_id = crypto.randomBytes(64).toString("hex");
  //       const connection = "false";

  //       //send email
  //       await sendEmail(email, "Verify Email", url);

  //       // insert db table users
  //       await usersModel.createUsers(id, email, passwordHash, verify);

  //       // insert db table verification
  //       await usersModel.createUsersVerification(users_verification_id, users_id, token);

  //       // insert db table session
  //       await usersModel.createSession(session_id, users_id, connection);

  //       commonHelper.response(res, null, 201, "Sign Up Success, Please check your email for verification");
  //     } catch (error) {
  //       res.send(createError(400));
  //     }
  //   },
  //   VerifyAccount: async (req, res) => {
  //     try {
  //       const queryUsersId = req.query.id;
  //       const queryToken = req.query.token;

  //       if (typeof queryUsersId === "string" && typeof queryToken === "string") {
  //         const checkUsersVerify = await usersModel.findId(queryUsersId);

  //         if (checkUsersVerify.rowCount == 0) {
  //           return commonHelper.response(res, null, 403, "Error users has not found");
  //         }

  //         if (checkUsersVerify.rows[0].verify != "false") {
  //           return commonHelper.response(res, null, 403, "Users has been verified");
  //         }

  //         const result = await usersModel.checkUsersVerification(queryUsersId, queryToken);

  //         if (result.rowCount == 0) {
  //           return commonHelper.response(res, null, 403, "Error invalid credential verification");
  //         } else {
  //           await usersModel.updateAccountVerification(queryUsersId);
  //           await usersModel.deleteUsersVerification(queryUsersId, queryToken);
  //           commonHelper.response(res, null, 200, "Users verified succesful");
  //         }
  //       } else {
  //         return commonHelper.response(res, null, 403, "Invalid url verification");
  //       }
  //     } catch (error) {
  //       res.send(createError(404));
  //     }
  //   },
  //   loginAccount: async (req, res) => {
  //     try {
  //       const { email_username, password } = req.body;

  //       // console.log(email_username)
  //       // console.log(email_username.includes("@"))
  //       let findEmailUsername;
  //       let alert;

  //       if (email_username.includes("@")) {
  //         findEmailUsername = await usersModel.findEmailSession(email_username);
  //         alert = "Email"
  //       } else {
  //         findEmailUsername = await usersModel.findUsernameSession(email_username);
  //         alert = "Username"
  //       }

  //       // console.log(findEmailUsername);

  //       const {
  //         rows: [user],
  //       } = findEmailUsername;

  //       // console.log(user);

  //       if (!user) {
  //         return commonHelper.response(res, null, 403, `${alert} is invalid`);
  //       }

  //       const isValidPassword = bcrypt.compareSync(password, user.password);
  //       // console.log(isValidPassword);
  //       if (!isValidPassword) {
  //         return commonHelper.response(res, null, 403, "Password is invalid");
  //       }

  //       if (user.verify === "false") {
  //         return commonHelper.response(res, null, 403, "Account not verified, Please check your email");
  //       }

  //       delete user.password;

  //       const payload = {
  //         id : user.id,
  //         email: user.email,
  //         session: user.session_id,
  //       };
  //       user.token = authHelper.generateToken(payload);
  //       user.refreshToken = authHelper.generateRefreshToken(payload);

  //       commonHelper.response(res, user, 201, "Login is Successful");
  //     } catch (error) {
  //       res.send(createError(400));
  //     }
  //   },
  //   profileAccount: async (req, res) => {
  //     try {
  //       const queryUpdate = req.query.update;
  //       const queryDelete = req.query.delete;

  //       const email = req.payload.email;
  //       const {
  //         rows: [user],
  //       } = await usersModel.findEmailSession(email);
  //       delete user.password;

  //       if (typeof queryUpdate === "undefined" && typeof queryDelete === "undefined") {
  //         commonHelper.response(res, user, 200);
  //       } else if (typeof queryUpdate === "string" && typeof queryDelete === "undefined") {
  //         if (req.file) {
  //           const auth = authenticateGoogle();

  //           if (user.picture != null || user.picture != undefined) {
  //             await deleteFromGoogleDrive(user.picture, auth);
  //           }

  //           // Upload to Drive
  //           const response = await uploadToGoogleDrive(req.file, auth);
  //           const picture = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;

  //           const { name, gender, phone, date_of_birth, job_desk, system, location, description, role } = req.body;

  //           await usersModel.updateAccount(email, name, gender, phone, date_of_birth, picture, job_desk, system, location, description, role);

  //           commonHelper.response(res, null, 201, "Profile has been updated");
  //         } else {
  //           const { name, gender, phone, date_of_birth, job_desk, system, location, description, role } = req.body;

  //           await usersModel.updateNoPict(email, name, gender, phone, date_of_birth, job_desk, system, location, description, role);

  //           commonHelper.response(res, null, 201, "Profile has been updated");
  //         }
  //       } else if (typeof queryUpdate === "undefined" && typeof queryDelete === "string") {
  //         await usersModel.deleteAccount(email);
  //         commonHelper.response(res, null, 200, "Account has been deleted");
  //       }
  //     } catch (error) {
  //       res.send(createError(404));
  //     }
  //   },
  //   changeEmail: async (req, res) => {
  //     try {
  //       const email = req.payload.email;
  //       const emailBody = req.body.email;
  //       // console.log(email + emailBody);
  //       // console.log(req.body.email);
  //       await usersModel.changeEmailAccount(email, emailBody);
  //       commonHelper.response(res, null, 201, "Email Account has been update, Please Login again");
  //     } catch (error) {
  //       res.send(createError(404));
  //     }
  //   },
  //   changePassword: async (req, res) => {
  //     try {
  //       const email = req.payload.email;
  //       const { password } = req.body;
  //       const saltRounds = 10;
  //       const passwordNewHash = bcrypt.hashSync(password, saltRounds);
  //       // console.log(email + " " + password + "   " + passwordNewHash);
  //       await usersModel.changePassword(email, passwordNewHash);
  //       commonHelper.response(res, null, 200, "Password Account has been update");
  //     } catch (error) {
  //       res.send(createError(404));
  //     }
  //   },
  //   refreshToken: async (req, res) => {
  //     const refreshToken = req.body.refreshToken;
  //     const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);
  //     // const payload = {
  //     //   email: decoded.email,
  //     //   role: decoded.role,
  //     // };
  //     const payload = {
  //       id : decoded.id,
  //       email: decoded.email,
  //       session: decoded.session_id,
  //     };
  //     const result = {
  //       token: authHelper.generateToken(payload),
  //       refreshToken: authHelper.generateRefreshToken(payload),
  //     };
  //     commonHelper.response(res, result, 200, "Refresh Token Success");
  //   },

  messagePagination: async (req, res) => {
    try {
      const querySender = req.query.sender;
      const queryReceiver = req.query.receiver;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50000;
      const offset = (page - 1) * limit;
      const search = req.query.search;
      let querysearch;
      let totalData;

      if (typeof querySender === "string" && typeof queryReceiver === "string") {
        if (search === undefined) {
          querysearch = `  where sender =  '${querySender}' and receiver = '${queryReceiver}' or sender =  '${queryReceiver}' and receiver = '${querySender}' `;
          totalData = parseInt((await messageModel.selectAllSearch(querysearch)).rowCount);
        } else {
          querysearch = ` where sender =  '${querySender}' and receiver = '${queryReceiver}' or sender =  '${queryReceiver}' and receiver = '${querySender}' users.name ilike '%${search}%' `;
          totalData = parseInt((await messageModel.selectAllSearch(querysearch)).rowCount);
        }
      } else if (typeof querySender === "undefined" && typeof queryReceiver === "string") {
        if (search === undefined) {
          querysearch = `  where sender =  '${queryReceiver}' and receiver = '${queryReceiver}' `;
          totalData = parseInt((await messageModel.selectAllSearch(querysearch)).rowCount);
        } else {
          querysearch = ` where sender =  '${queryReceiver}' and receiver = '${queryReceiver}' users.name ilike '%${search}%' `;
          totalData = parseInt((await messageModel.selectAllSearch(querysearch)).rowCount);
        }
      } else if (typeof querySender === "string" && typeof queryReceiver === "undefined") {
        if (search === undefined) {
          querysearch = `  where sender =  '${querySender}' and receiver = '${queryReceiver}' `;
          totalData = parseInt((await messageModel.selectAllSearch(querysearch)).rowCount);
        } else {
          querysearch = ` where sender =  '${querySender}' and receiver = '${queryReceiver}'  users.name ilike '%${search}%' `;
          totalData = parseInt((await messageModel.selectAllSearch(querysearch)).rowCount);
        }
      } else {
        return commonHelper.response(res, null, 403, "Url Message Error");
      }

      const sortby = "message." + (req.query.sortby || "created_on");
      const sort = req.query.sort || "desc";
      // console.log({ limit, offset, sortby, sort, querysearch })
      const result = await messageModel.selectPagination({ limit, offset, sortby, sort, querysearch });
      // console.log(await skillModel.selectPagination());
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };

      commonHelper.response(res, result.rows, 200, null, pagination);
    } catch (error) {
      console.log(error);
      res.send(createError(404));
    }
  },
  messageDeleteSenderIdReceiverId: async (req, res) => {
    try {
      const querySender = req.query.sender;
      const queryReceiver = req.query.receiver;

      if (typeof querySender === "string" && typeof queryReceiver === "string") {
        await messageModel.deleteAllMessageSenderIdReceiverId({ querySender, queryReceiver });
        commonHelper.response(res, null, 200, "All Message has been deleted");
      } else if (typeof querySender === "undefined" && typeof queryReceiver === "string") {
        return commonHelper.response(res, null, 403, "Sender message not found");
      } else if (typeof querySender === "string" && typeof queryReceiver === "undefined") {
        return commonHelper.response(res, null, 403, "Receiver message not foundr");
      } else {
        return commonHelper.response(res, null, 403, "Sender and Receiver message not found");
      }
    } catch (error) {
      console.log(error);
      res.send(createError(404));
    }
  },
};

module.exports = ControllerMessage;
