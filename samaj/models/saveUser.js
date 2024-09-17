import { z } from "zod";
import logger from "../modules/logger.js";

const saveUserSchema = z.object({
  name: z.object({
    first: z.string(),
    last: z.string(),
  }),

  education: z.object({
    level: z.number().min(1).max(5),
    value: z.string(),
  }),
});

const saveUserParse = (req, res, next) => {
  const parsed = saveUserSchema.safeParse(req.body);

  logger.debug("saveUserParse: Parsing was successful", parsed);
  if (parsed.success) {
    next();
  } else {
    res.status(400).json({
      message: "Invalid request",
    });
  }
};

export default saveUserParse;
