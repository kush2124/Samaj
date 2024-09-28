import Users from "../db/schema/userSchema.js";
import logger from "../modules/logger.js";
import sanitize from "mongo-sanitize";

export const searchUsersWithStatus = async (req, res, db) => {
  try {
    const User = Users(db);

    const status = sanitize(req.params.status);
    const limit = sanitize(req.query.limit);
    const nextToken = sanitize(req.query.nextToken);

    const MAX_RESULTS_TO_FETCH = limit < 25 ? limit : 25;

    const query = {
      status,
      ...(nextToken && { _id: { $gt: nextToken } }),
    };

    logger.info(`Query is ${query}`);
    const users = await User.find(query)
      .select("-password")
      .sort("_id")
      .limit(MAX_RESULTS_TO_FETCH);

    const next = users.length > 0 ? users[users.length - 1]._id : null;

    res.status(200).json({
      users: users,
      resultSize: users.length,
      nextToken: next,
    });
  } catch (ex) {
    logger.error("Internal failure", ex);
    res.status(500).json({
      msg: "Internal failure",
    });
  }
};
