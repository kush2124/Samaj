import Users from "../db/schema/userSchema.js";
import logger from "../modules/logger.js";
import sanitize from "mongo-sanitize";
import { USER_STATUS } from "../models/userStatus.js";
import { getUserState } from "./userGetController.js";

export const updateUser = async (req, res, db) => {
  logger.info(`updateUser: Updating user for request ${req}`);
  const User = Users(db);
  const email = sanitize(req.user.email);
  const updatedFields = { ...sanitize(req.body), status: USER_STATUS.DRAFT };

  try {
    const status = await getUserState(email, User);
    if (status === USER_STATUS.UNKNOWN) {
      logger.debug(`updateUser: User does not exist`);
      return res.status(400).json({
        msg: "User not found",
      });
    } else if (
      status === USER_STATUS.PENDING ||
      status === USER_STATUS.APPROVED
    ) {
      logger.debug(
        `updateUser: User not in correct status ${status} to be updated.`,
      );
      return res.status(400).json({
        msg: "User cannot be updated",
      });
    }
  } catch (ex) {
    logger.error(ex.message, { exception: ex });
    return res.status(500).json({
      msg: "Internal failure",
    });
  }

  try {
    const userIndb = await User.findOneAndUpdate(
      { email: email },
      { $set: updatedFields },
      { new: true, fields: { password: 0 } },
    );

    if (!userIndb) {
      return res.status(400).json({
        msg: "User not found",
      });
    }
    return res.status(200).json({
      user: userIndb,
    });
  } catch (ex) {
    logger.error(ex.message, { exception: ex });

    return res.status(500).json({
      msg: "Internal failure",
    });
  }
};

export const submitUser = async (req, res, db) => {
  logger.info(`submitUser: Submitting user for request ${req}`);
  const User = Users(db);
  const email = req.user.email;
  const updatedFields = sanitize({ ...req.body, status: USER_STATUS.PENDING });

  try {
    const status = await getUserState(email, User);
    if (status === USER_STATUS.UNKNOWN) {
      logger.debug(`submitUser: User does not exist`);
      return res.status(400).json({
        msg: "User not found",
      });
    } else if (
      status === USER_STATUS.PENDING ||
      status === USER_STATUS.APPROVED
    ) {
      logger.debug(
        `submitUser: User not in correct status ${status} to be updated.`,
      );
      return res.status(400).json({
        msg: "User cannot be submiitted",
      });
    }
  } catch (ex) {
    logger.error(ex.message, { exception: ex });
    return res.status(500).json({
      msg: "Internal failure",
    });
  }

  try {
    const userIndb = await User.findOneAndUpdate(
      { email: email },
      { $set: updatedFields },
      { new: true, fields: { password: 0 } },
    );

    if (!userIndb) {
      return res.status(400).json({
        msg: "User not found",
      });
    }
    return res.status(200).json({
      user: userIndb,
    });
  } catch (ex) {
    logger.error(ex.message, { exception: ex });

    return res.status(500).json({
      msg: "Internal failure",
    });
  }
};

export const editUser = async (req, res, db) => {
  const User = Users(db);
  const email = req.user.email;
  const updatedFields = sanitize({ status: USER_STATUS.DRAFT });

  try {
    const status = await getUserState(email, User);
    if (status === USER_STATUS.UNKNOWN) {
      logger.debug(`editUser: User not found`);
      return res.status(400).json({
        msg: "User not found",
      });
    } else if (status === USER_STATUS.DRAFT) {
      logger.debug(
        `editUser: User not in correct status ${status} to be updated.`,
      );
      return res.status(400).json({
        msg: "User is already in editable state",
      });
    }
  } catch (ex) {
    logger.error(ex.message, { exception: ex });
    return res.status(500).json({
      msg: "Internal failure",
    });
  }

  try {
    const userIndb = await User.findOneAndUpdate(
      { email: email },
      { $set: updatedFields },
      { new: true, fields: { password: 0 } },
    );

    if (!userIndb) {
      return res.status(400).json({
        msg: "User not found",
      });
    }
    return res.status(200).json({
      user: userIndb,
    });
  } catch (ex) {
    logger.error(ex.message, { exception: ex });

    return res.status(500).json({
      msg: "Internal failure",
    });
  }
};
