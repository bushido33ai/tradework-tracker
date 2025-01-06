import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { EnquiryFormValues } from "../types";

interface LocationFieldProps {
  form: UseFormReturn<EnquiryFormValues>;
}

export const LocationField = ({ form }: LocationFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location</FormLabel>
          <FormControl>
            <Input placeholder="Enter location" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};