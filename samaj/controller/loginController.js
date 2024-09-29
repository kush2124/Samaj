import Users from "../db/schema/userSchema.js";
import bcrypt from "bcrypt";
import logger from "../modules/logger.js";
import jwt from "jsonwebtoken";
import authorization from "../modules/authorization.js";
import Admins from "../db/schema/adminSchema.js";
import sanitize from "mongo-sanitize";

export const login = async (req, res, db) => {
  const User = Users(db);
  const { email, password } = sanitize(req.body);

  logger.info(`login: User ${email} trying to login `);
  try {
    const userIndb = await User.findOne({ email: email });

    if (!userIndb) {
      logger.debug(`login: User ${email} not found in db`);
      return res.status(400).json({
        email: email,
        msg: "User not found",
      });
    }

    const passwordMatch = await bcrypt.compare(password, userIndb.password);

    if (passwordMatch) {
      const tokenPayload = {
        email: email,
      };
      const token = jwt.sign(tokenPayload, authorization.secret, {
        expiresIn: "1h",
      });
      return res.status(200).json({
        email: email,
        token: token,
        msg: "Login successful",
      });
    } else {
      logger.debug(`login: Invalid username or password`);
      return res.status(400).json({
        email: email,
        msg: "Invalid username or password",
      });
    }
  } catch (ex) {
    logger.error(ex.message, { exception: ex });
    return res.status(500).json({
      email: email,
      msg: "Internal server error",
    });
  }
};

export const adminLogin = async (req, res, db) => {
  const Admin = Admins(db);
  const { email, password } = sanitize(req.body);

  logger.info(`adminLogin: Admin ${email} trying to login `);
  try {
    const adminIndb = await Admin.findOne({ email: email });

    if (!adminIndb) {
      logger.debug("adminLogin: Admin not found in db");
      return res.status(400).json({
        email: email,
        message: "Admin not found",
      });
    }

    const passwordMatch = await bcrypt.compare(password, adminIndb.password);

    if (passwordMatch) {
      const tokenPayload = {
        email: email,
      };
      const token = jwt.sign(tokenPayload, authorization.adminSecret, {
        expiresIn: "1h",
      });
      return res.status(200).json({
        email: email,
        token: token,
        msg: "Login successful",
      });
    } else {
      logger.debug("adminLogin: Invalid username or password");
      return res.status(400).json({
        email: email,
        msg: "Invalid username or password",
      });
    }
  } catch (ex) {
    logger.error(ex.message, { exception: ex });

    return res.status(500).json({
      email: email,
      msg: "Internal server error",
    });
  }
};
