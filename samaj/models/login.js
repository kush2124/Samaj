import { z } from "zod";
import logger from "../modules/logger.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginParse = (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body);

  logger.debug("loginParse: Parsing was successful", parsed);
  if (parsed.success) {
    next();
  } else {
    res.status(400).json({
      message: "Invalid request",
    });
  }
};

export default loginParse;
