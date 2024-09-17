import Users from "../db/schema/userSchema.js";
import logger from "../modules/logger.js";
import sanitize from "mongo-sanitize";
import { ADMIN_ACTIONS } from "../models/adminActions.js";
import { USER_STATUS } from "../models/userStatus.js";

export const updateUser = async (req, res, db) => {
  const User = Users(db);
  const email = sanitize(req.user.email);
  const updatedFields = { ...sanitize(req.body) };

  try {
    const userIndb = await User.findOneAndUpdate(
      { email: email },
      { $set: updatedFields },
      { new: true, fields: { password: 0 } },
    );

    if (!userIndb) {
      res.status(400).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      user: userIndb,
    });
  } catch (ex) {
    logger.error(ex.message, { exception: ex });

    res.status(500).json({
      message: "Internal failure",
    });
  }
};

export const saveUser = async (req, res, db) => {
  const User = Users(db);
  const email = req.user.email;
  const updatedFields = sanitize({ ...req.body, status: "PENDING" });

  try {
    const userIndb = await User.findOneAndUpdate(
      { email: email },
      { $set: updatedFields },
      { new: true, fields: { password: 0 } },
    );

    if (!userIndb) {
      res.status(400).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      user: userIndb,
    });
  } catch (ex) {
    logger.error(ex.message, { exception: ex });

    res.status(500).json({
      message: "Internal failure",
    });
  }
};

export const takeActionOnUser = async (req, res, db) => {
  const User = Users(db);
  const userEmail = sanitize(req.params.userId);
  const adminEmail = sanitize(req.user.email);
  const action = sanitize(req.params.action);

  const actionToStatus = convertActionToStatus(action);
  try {
    const userIndb = await User.findOneAndUpdate(
      { email: userEmail },
      { $set: { status: actionToStatus, actionBy: adminEmail } },
      { new: true, fields: { password: 0 } },
    );

    if (!userIndb) {
      res.status(400).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      user: userIndb,
    });
  } catch (ex) {
    logger.error(ex.message, { exception: ex });

    res.status(500).json({
      message: "Internal failure",
    });
  }
};

const convertActionToStatus = (action) => {
  switch (action) {
    case ADMIN_ACTIONS.APPROVE:
      return USER_STATUS.APPROVED;
    case ADMIN_ACTIONS.REJECT:
      return USER_STATUS.REJECTED;
    default:
      throw new Error("Invalid action performed");
  }
};
