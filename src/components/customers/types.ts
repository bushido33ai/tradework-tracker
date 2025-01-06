import { z } from "zod";

export const customerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  telephone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  preferredContactMethod: z.string().min(1, "Preferred contact method is required"),
  notes: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;