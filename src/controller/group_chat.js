const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const groupChatModel = require("../models/group_chat");
const commonHelper = require("../helper/common");
const authHelper = require("../helper/auth");
const createError = require("http-errors");

const crypto = require("crypto");
const sendEmail = require("../middlewares/sendEmail");

const { authenticateGoogle, uploadToGoogleDrive, deleteFromGoogleDrive } = require("../middlewares/googleDriveService");

const ControllerMessage = {
  insertGroupChat: async (req, res) => {
    try {
      if (!req.file) {
        const { id, owner_id, group_name, group_member } = req.body;

        const checkGroupChat = await groupChatModel.selectGroupChat(id);

        try {
          if (checkGroupChat.rows[0].count == 1) throw "Id Group Chat has been used";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        const checkUsers = await groupChatModel.selectUsers(owner_id);
        try {
          if (checkUsers.rowCount == 0) throw "Users has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        const result = await groupChatModel.insertGroupChatNoLogo(id, owner_id, group_name, group_member);
        commonHelper.response(res, result.rows, 201, "New Group Chat Created");
      } else {
        const { id, owner_id, group_name, group_member } = req.body;

        const checkGroupChat = await groupChatModel.selectGroupChat(id);

        try {
          if (checkGroupChat.rows[0].count == 1) throw "Id Group Chat has been used";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        const checkUsers = await groupChatModel.selectUsers(owner_id);
        try {
          if (checkUsers.rowCount == 0) throw "Users has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        const auth = authenticateGoogle();
        const response = await uploadToGoogleDrive(req.file, auth);
        const group_logo = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;

      
        const result = await groupChatModel.insertGroupChatLogo(id, owner_id, group_name, group_member, group_logo);
        commonHelper.response(res, result.rows, 201, "New Group Chat Created");
      }
    } catch (error) {
      console.log(error);
      res.send(createError(400));
    }
  },
  updateGroupChat: async (req, res) => {
    try {
      const id = req.params.id;
      if (!req.file) {
        const { owner_id, group_name, group_member } = req.body;

        const checkGroupChat = await groupChatModel.selectGroupChat(id);

        try {
          if (checkGroupChat.rows[0].count == 0) throw "Group Chat has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        const checkUsers = await groupChatModel.selectUsers(owner_id);
        try {
          if (checkUsers.rowCount == 0) throw "Users has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        const result = await groupChatModel.updateGroupChatNoLogo(id, owner_id, group_name, group_member);
        commonHelper.response(res, result.rows, 201, "Group Chat Updated");
      } else {
        const { owner_id, group_name, group_member } = req.body;

        const checkGroupChat = await groupChatModel.selectGroupChat(id);

        try {
          if (checkGroupChat.rows[0].count == 0) throw "Group Chat has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        const checkUsers = await groupChatModel.selectUsers(owner_id);
        try {
          if (checkUsers.rowCount == 0) throw "Users has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        const auth = authenticateGoogle();
        const response = await uploadToGoogleDrive(req.file, auth);
        const group_logo = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;

        
        const result = await groupChatModel.updateGroupChatLogo(id, owner_id, group_name, group_member, group_logo);
        commonHelper.response(res, result.rows, 201, "Group Chat Updated");
      }
    } catch (error) {
      console.log(error);
      res.send(createError(400));
    }
  },
  deleteGroupChat: async (req, res) => {
    try {
      const id = req.params.id;

      const checkGroupChat = await groupChatModel.selectGroupChat(id);
      try {
        if (checkGroupChat.rows[0].count == 0) throw "Group Chat has not Found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      await groupChatModel.deleteGroupChat(id);
      commonHelper.response(res, null, 200, "Groud Chat Deleted");
    } catch (error) {
      res.send(createError(404));
    }
  },
};

module.exports = ControllerMessage;
