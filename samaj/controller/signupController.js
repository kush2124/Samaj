import Users from "../db/schema/userSchema.js";
import bcrypt from "bcrypt";
import logger from "../modules/logger.js";
import Admins from "../db/schema/adminSchema.js";
import Invite from "../db/schema/inviteSchema.js";
import sanitize from "mongo-sanitize";
import { STATUS } from "../models/status.js";
import { CODE_STATUS } from "../models/codeStatus.js";

export const signup = async (req, res, db) => {
  const User = Users(db);
  const { email, password } = sanitize(req.body);

  try {
    const userIndb = await User.findOne({ email: email });

    if (userIndb) {
      logger.debug("signup: User found in db");
      return res.status(409).json({
        email: email,
        status: STATUS.EXISTS.toString(),
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await User.create({
      email: email,
      password: hash,
    });

    res.status(201).json({
      email: email,
      status: STATUS.SUCCESSFUL.toString(),
    });
  } catch (ex) {
    logger.error(ex.message, { exception: ex });

    res.status(500).json({
      email: email,
      status: STATUS.FAILED.toString(),
    });
  }
};

export const adminSignup = async (req, res, db) => {
  const Admin = Admins(db);
  const InviteCode = Invite(db);
  const { email, password, inviteCode, name } = sanitize(req.body);

  try {
    const adminIndb = await Admin.findOne({ email: email });

    const inviteCodeInDb = InviteCode.findOne({ code: sanitize(inviteCode) });
    if (!inviteCodeInDb && inviteCodeInDb.status === CODE_STATUS.USED) {
      return res.status(400).json({
        email: email,
        status: STATUS.FAILED.toString(),
      });
    }

    if (adminIndb) {
      logger.debug("signup: Admin found in db");
      return res.status(409).json({
        email: email,
        status: STATUS.EXISTS.toString(),
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await Admin.create({
      email: email,
      password: hash,
      name: name,
    });

    await InviteCode.findoneAndUpdate(
      { code: inviteCode },
      { $set: { status: CODE_STATUS.USED } },
    );

    res.status(201).json({
      email: email,
      status: STATUS.SUCCESSFUL.toString(),
    });
  } catch (ex) {
    logger.error(ex.message, { exception: ex });

    res.status(500).json({
      email: email,
      status: STATUS.FAILED.toString(),
    });
  }
};
