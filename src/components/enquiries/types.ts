import { z } from "zod";

export const enquirySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  visit_date: z.string().nullable(),
  measurement_notes: z.string().optional(),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;