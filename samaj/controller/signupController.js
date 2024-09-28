import Users from "../db/schema/userSchema.js";
import bcrypt from "bcrypt";
import logger from "../modules/logger.js";
import Admins from "../db/schema/adminSchema.js";
import Invite from "../db/schema/inviteSchema.js";
import sanitize from "mongo-sanitize";
import { CODE_STATUS } from "../models/codeStatus.js";
import { USER_STATUS } from "../models/userStatus.js";

export const signup = async (req, res, db) => {
  const User = Users(db);
  const { email, password } = sanitize(req.body);

  try {
    const userIndb = await User.findOne({ email: email });

    if (userIndb) {
      logger.debug("signup: User found in db");
      return res.status(409).json({
        email: email,
        msg: "User already exists",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await User.create({
      email: email,
      password: hash,
      status: USER_STATUS.DRAFT,
    });

    res.status(201).json({
      email: email,
      msg: "User successfully created",
    });
  } catch (ex) {
    logger.error(ex.message, { exception: ex });

    res.status(500).json({
      email: email,
      msg: "Intrenal failure",
    });
  }
};

export const adminSignup = async (req, res, db) => {
  const Admin = Admins(db);
  const InviteCode = Invite(db);
  const { email, password, inviteCode, name } = sanitize(req.body);

  try {
    const adminIndb = await Admin.findOne({ email: email });

    const inviteCodeInDb = await InviteCode.findOne({
      code: sanitize(inviteCode),
    });
    if (!inviteCodeInDb || inviteCodeInDb.status === CODE_STATUS.USED) {
      return res.status(400).json({
        email: email,
        msg: "Invite code does not exists or already in use",
      });
    }

    if (adminIndb) {
      logger.debug("signup: Admin found in db");
      return res.status(409).json({
        email: email,
        msg: "Admin exists in the system",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await Admin.create({
      email: email,
      password: hash,
      name: name,
    });

    await InviteCode.findOneAndUpdate(
      { code: inviteCode },
      { $set: { status: CODE_STATUS.USED } },
    );

    res.status(201).json({
      email: email,
      msg: "Admin successfully created",
    });
  } catch (ex) {
    logger.error(ex.message, { exception: ex });

    await Admin.deleteOne({ email: email });

    res.status(500).json({
      email: email,
      msg: "Internal failure",
    });
  }
};
