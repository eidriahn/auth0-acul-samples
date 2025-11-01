import z from "zod";

export const loginIdSchema = z.object({
  email: z.email(),
});
