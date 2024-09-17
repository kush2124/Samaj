import express from "express";
import logger from "../modules/logger.js";
import authorization from "../modules/authorization.js";
import getUser from "../controller/userGetController.js";
import loginParse from "../models/login.js";
import signupParse from "../models/signup.js";
import updateUserParse from "../models/updateUser.js";
import saveUserParse from "../models/saveUser.js";
import { login } from "../controller/loginController.js";
import { signup } from "../controller/signupController.js";
import { saveUser, updateUser } from "../controller/userWriteController.js";

const router = express.Router();

const userRouter = (db) => {
  logger.info("Setting up user router...");

  router.post("/user/login", loginParse, (req, res) => {
    login(req, res, db);
  });

  router.post("/user/signup", signupParse, (req, res) => {
    signup(req, res, db);
  });

  router.get("/user/details", authorization.authorize, (req, res) => {
    getUser(req, res, db);
  });

  router.post(
    "/user/details",
    authorization.authorize,
    updateUserParse,
    (req, res) => {
      updateUser(req, res, db);
    },
  );

  router.post(
    "/user/submit",
    authorization.authorize,
    saveUserParse,
    (req, res) => {
      saveUser(req, res, db);
    },
  );

  return router;
};

export default userRouter;
