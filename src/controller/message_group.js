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
      const result = await messageModel.selectPagination({ limit, offset, sortby, sort, querysearch });
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
