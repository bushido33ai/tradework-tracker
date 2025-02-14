
import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  budget: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  job_manager: z.string(),
  job_type: z.enum(["Fully Quoted", "Day Rate"]),
});

export type JobFormValues = z.infer<typeof jobSchema>;
