import { z } from "zod";

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
  if (parsed.success) {
    next();
  } else {
    res.status(400).json({
      message: "Invalid request",
    });
  }
};

export default updateUserParse;
