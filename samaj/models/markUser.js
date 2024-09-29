import { z } from "zod";
import logger from "../modules/logger.js";
import { ADMIN_ACTIONS } from "./adminActions.js";

const actionSchema = z.object({
  action: z.enum([ADMIN_ACTIONS.APPROVE, ADMIN_ACTIONS.REJECT]),
  userId: z.string().email(),
});

const actionParse = (req, res, next) => {
  const parsedQuery = actionSchema.safeParse(req.params);
  if (parsedQuery.success) {
    next();
  } else {
    res.status(400).json({
      message: "Invalid request",
    });
  }
};

export default actionParse;
