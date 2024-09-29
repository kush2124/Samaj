import express from "express";
import logger from "../modules/logger.js";
import authorization from "../modules/authorization.js";
import getUser from "../controller/userGetController.js";
import loginParse from "../models/login.js";
import signupParse from "../models/signup.js";
import updateUserParse from "../models/updateUser.js";
import submitUserParse from "../models/submitUser.js";
import { login } from "../controller/loginController.js";
import { signup } from "../controller/signupController.js";
import {
  editUser,
  submitUser,
  updateUser,
} from "../controller/userWriteController.js";

const router = express.Router();

const userRouter = (db) => {
  logger.info("Setting up user router...");

  router.post("/login", loginParse, (req, res) => {
    login(req, res, db);
  });

  router.post("/signup", signupParse, (req, res) => {
    signup(req, res, db);
  });

  router.get("/details", authorization.authorize, (req, res) => {
    getUser(req, res, db);
  });

  router.post(
    "/action/update",
    authorization.authorize,
    updateUserParse,
    (req, res) => {
      updateUser(req, res, db);
    },
  );

  router.post("/action/edit", authorization.authorize, (req, res) => {
    editUser(req, res, db);
  });

  router.post(
    "/action/submit",
    authorization.authorize,
    submitUserParse,
    (req, res) => {
      submitUser(req, res, db);
    },
  );

  return router;
};

export default userRouter;
