import { z } from "zod";
import logger from "../modules/logger.js";
import { USER_STATUS } from "./userStatus.js";

const querySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => parseInt(val, 10) || 25),
  nextToken: z.string().optional(),
});

const statusSchema = z.object({
  status: z.enum([
    USER_STATUS.APPROVED,
    USER_STATUS.DRAFT,
    USER_STATUS.PENDING,
    USER_STATUS.REJECTED,
  ]),
});

const listUserParse = (req, res, next) => {
  const parsedQuery = querySchema.safeParse(req.query);
  const parsedStatus = statusSchema.safeParse(req.params);

  logger.debug(
    "listUserParse: Parsing was successful",
    parsedQuery,
    parsedStatus,
  );

  if (parsedQuery.success && parsedStatus.success) {
    next();
  } else {
    res.status(400).json({
      message: "Invalid request",
    });
  }
};

export default listUserParse;
