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
              {...field}
              value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : undefined;
                field.onChange(date);
              }}
              min={new Date().toISOString().split('T')[0]}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};