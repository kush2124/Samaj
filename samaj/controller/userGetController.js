import Users from "../db/schema/userSchema.js";
import { USER_STATUS } from "../models/userStatus.js";
import logger from "../modules/logger.js";
import sanitize from "mongo-sanitize";

const getUser = async (req, res, db) => {
  const User = Users(db);
  const user = sanitize(req.user);
  try {
    const userIndb = await User.findOne({ email: user.email }, "-password");
    if (!userIndb) {
      logger.debug("get-details: User does not exists, data corrupted");
      res.status(500).json({
        msg: "User not found",
      });
    } else {
      res.status(200).json({
        user: userIndb,
        msg: "User fetched successfully"
      });
    }
  } catch (ex) {
    logger.error(ex.message, { exception: ex });

    res.status(500).json({
      msg: "Internal failure",
    });
  }
};

export const getUserState = async (email, userModel) => {
  try {
    const userIndb = await userModel.findOne({ email: email }, "-password");
    if (!userIndb) {
      logger.debug("getUserState: User does not exists, data corrupted");
      return USER_STATUS.UNKNOWN;
    } else {
      return userIndb.status;
    }
  } catch (ex) {
    logger.error(ex.message, { exception: ex });
    throw new Error("Internal failure");
  }
};

export default getUser;
