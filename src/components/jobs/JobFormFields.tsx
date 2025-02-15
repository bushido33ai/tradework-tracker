
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import type { JobFormValues } from "./types";
import { useEffect } from "react";

interface JobFormFieldsProps {
  form: UseFormReturn<JobFormValues>;
}

const JobFormFields = ({ form }: JobFormFieldsProps) => {
  // When job type changes to "Day Rate", set budget to "0"
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'job_type' && value.job_type === 'Day Rate') {
        form.setValue('budget', '0');
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const isDayRate = form.watch('job_type') === 'Day Rate';

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter job title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter job description"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="Enter job location" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="job_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Fully Quoted">Fully Quoted</SelectItem>
                <SelectItem value="Day Rate">Day Rate</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {isDayRate && (
        <FormField
          control={form.control}
          name="day_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Day Rate (£)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter day rate amount"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="budget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {isDayRate ? 'Initial Budget' : 'Budget'} 
              {!isDayRate && ' (optional)'}
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter budget amount"
                {...field}
                disabled={isDayRate}
              />
            </FormControl>
            {isDayRate && (
              <p className="text-sm text-muted-foreground">
                Budget will increase based on days worked × day rate
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const date = new Date(e.target.value);
                      date.setHours(12, 0, 0, 0);
                      field.onChange(date.toISOString());
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date (optional)</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const date = new Date(e.target.value);
                      date.setHours(12, 0, 0, 0);
                      field.onChange(date.toISOString());
                    } else {
                      field.onChange('');
                    }
                  }}
                  min={form.watch('start_date') ? new Date(form.watch('start_date')).toISOString().split('T')[0] : undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default JobFormFields;
