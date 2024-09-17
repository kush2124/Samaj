import { z } from "zod";
import logger from "../modules/logger.js";

const updateUserSchema = z.object({
  name: z
    .object({
      first: z.string(),
      last: z.string(),
    })
    .optional(),

  education: z
    .object({
      level: z.number().min(1).max(5),
      value: z.string(),
    })
    .optional(),
});

const updateUserParse = (req, res, next) => {
  const parsed = updateUserSchema.safeParse(req.body);

  logger.debug("updateUserParse: Parsing was successful", parsed);
  if (parsed.success) {
    next();
  } else {
    res.status(400).json({
      message: "Invalid request",
    });
  }
};

export default updateUserParse;
