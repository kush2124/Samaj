import Users from "../db/schema/userSchema.js";
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
        message: "User not found",
      });
    } else {
      res.status(200).json({
        user: userIndb,
      });
    }
  } catch (ex) {
    logger.error(ex.message, { exception: ex });

    res.status(500).json({
      message: "Internal failure",
    });
  }
};

export default getUser;
