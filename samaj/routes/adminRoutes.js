import express from "express";
import logger from "../modules/logger.js";
import loginParse from "../models/login.js";
import adminSignupParse from "../models/adminSignup.js";
import listUserParse from "../models/listUsers.js";
import authorization from "../modules/authorization.js";
import actionParse from "../models/markUser.js";
import { adminLogin } from "../controller/loginController.js";
import { adminSignup } from "../controller/signupController.js";
import { searchUsersWithStatus } from "../controller/userSearchController.js";
import { takeActionOnUser } from "../controller/adminActionController.js";

const router = express.Router();

const adminRouter = (db) => {
  logger.info("Setting up admin router...");

  router.post("/admin/login", loginParse, (req, res) => {
    adminLogin(req, res, db);
  });

  router.post("/admin/signup", adminSignupParse, (req, res) => {
    adminSignup(req, res, db);
  });

  router.get(
    "/admin/search/users/:status",
    authorization.adminAuthorize,
    listUserParse,
    (req, res) => {
      searchUsersWithStatus(req, res, db);
    },
  );

  router.post(
    "/admin/action/user/:action/:userId",
    authorization.adminAuthorize,
    actionParse,
    (req, res) => {
      takeActionOnUser(req, res, db);
    },
  );

  return router;
};

export default adminRouter;
