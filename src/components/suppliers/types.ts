import { z } from "zod";
import type { TablesInsert } from "@/integrations/supabase/types";

// Define the type for supplier insert
export type SupplierInsert = TablesInsert<"suppliers">;

// Create a schema that matches the required database fields
export const supplierSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  contact_name: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  business_type: z.string().min(1, "Business type is required"),
});

// This ensures the form values match exactly what's required
export type SupplierFormValues = z.infer<typeof supplierSchema>;