import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { EnquiryFormValues } from "../types";

interface TitleFieldProps {
  form: UseFormReturn<EnquiryFormValues>;
}

export const TitleField = ({ form }: TitleFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input placeholder="Enter enquiry title" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};