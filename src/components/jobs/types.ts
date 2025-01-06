import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  budget: z.string().optional(),
});

export type JobFormValues = z.infer<typeof jobSchema>;