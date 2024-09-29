import Users from "../db/schema/userSchema.js";
import logger from "../modules/logger.js";
import sanitize from "mongo-sanitize";
import { ADMIN_ACTIONS } from "../models/adminActions.js";
import { USER_STATUS } from "../models/userStatus.js";

export const takeActionOnUser = async (req, res, db) => {
  const User = Users(db);
  const userEmail = sanitize(req.params.userId);
  const adminEmail = sanitize(req.user.email);
  const action = sanitize(req.params.action);

  const actionToStatus = convertActionToStatus(action);
  logger.info(`takeActionOnUser: Admin ${adminEmail} taking action ${action} on user ${userEmail}`);
  try {
    const userIndb = await User.findOneAndUpdate(
      { email: userEmail },
      { $set: { status: actionToStatus, approvedBy: adminEmail } },
      { new: true, fields: { password: 0 } },
    );

    if (!userIndb) {
      logger.debug(`takeActionOnUser: User was not found for email ${userEmail}`);  
      return res.status(400).json({
        msg: "User not found",
      });
    }

    logger.debug(`takeActionOnUser: User was ${actionToStatus} by ${adminEmail}`);
    return res.status(200).json({
      user: userIndb,
      msg: "Operation completed successfully",
    });
  } catch (ex) {

    logger.error(ex.message, { exception: ex });
    return res.status(500).json({
      msg: "Internal failure",
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
