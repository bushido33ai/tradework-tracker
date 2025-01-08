import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { EnquiryFormValues } from "../types";

interface VisitDateFieldProps {
  form: UseFormReturn<EnquiryFormValues>;
}

export const VisitDateField = ({ form }: VisitDateFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="visit_date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Visit Date (optional)</FormLabel>
          <FormControl>
            <Input
              type="date"
              placeholder="Select a date"
              {...field}
              value={field.value || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};