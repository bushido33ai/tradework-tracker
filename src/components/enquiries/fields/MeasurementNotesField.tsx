import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import type { EnquiryFormValues } from "../types";

interface MeasurementNotesFieldProps {
  form: UseFormReturn<EnquiryFormValues>;
}

export const MeasurementNotesField = ({ form }: MeasurementNotesFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="measurement_notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Additional Notes (optional)</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Enter any additional notes about your enquiry"
              className="min-h-[100px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};