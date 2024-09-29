import { z } from "zod";
import logger from "../modules/logger.js";

const adminSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  inviteCode: z.string().min(10),
  name: z.object({
    first: z.string(),
    last: z.string(),
  }),
});

const adminSignupParse = (req, res, next) => {
  const parsed = adminSignupSchema.safeParse(req.body);
  if (parsed.success) {
    next();
  } else {
    res.status(400).json({
      message: "Invalid request",
    });
  }
};

export default adminSignupParse;
