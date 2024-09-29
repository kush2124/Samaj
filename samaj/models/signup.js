import { z } from "zod";
import logger from "../modules/logger.js";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const signupParse = (req, res, next) => {
  const parsed = signupSchema.safeParse(req.body);
  if (parsed.success) {
    next();
  } else {
    res.status(400).json({
      message: "Invalid request",
    });
  }
};

export default signupParse;
