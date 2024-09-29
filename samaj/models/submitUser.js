import { z } from "zod";

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

const submitUserParse = (req, res, next) => {
  const parsed = saveUserSchema.safeParse(req.body);
  if (parsed.success) {
    next();
  } else {
    res.status(400).json({
      message: "Invalid request",
    });
  }
};

export default submitUserParse;
