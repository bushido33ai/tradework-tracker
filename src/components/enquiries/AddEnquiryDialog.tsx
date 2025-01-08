import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import EnquiryFormFields from "./EnquiryFormFields";
import { enquirySchema, type EnquiryFormValues } from "./types";

interface AddEnquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddEnquiryDialog = ({ open, onOpenChange }: AddEnquiryDialogProps) => {
  const queryClient = useQueryClient();
  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      measurement_notes: "",
      visit_date: null,
    },
  });

  const generateEnquiryNumber = async () => {
    const { count } = await supabase
      .from("enquiries")
      .select("*", { count: "exact", head: true });
    
    const nextNumber = (count ?? 0) + 1;
    return `ENQ-${String(nextNumber).padStart(4, '0')}`;
  };

  const addEnquiry = useMutation({
    mutationFn: async (values: EnquiryFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const enquiryNumber = await generateEnquiryNumber();

      const enquiryData = {
        title: values.title,
        description: values.description,
        location: values.location,
        measurement_notes: values.measurement_notes || null,
        visit_date: values.visit_date || null,
        created_by: user.id,
        enquiry_number: enquiryNumber,
      };

      const { error } = await supabase.from("enquiries").insert(enquiryData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      form.reset();
      onOpenChange(false);
      toast.success("Enquiry created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create enquiry: " + error.message);
    },
  });

  const onSubmit = (values: EnquiryFormValues) => {
    addEnquiry.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Enquiry</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <EnquiryFormFields form={form} />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addEnquiry.isPending}>
                {addEnquiry.isPending ? "Creating..." : "Create Enquiry"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEnquiryDialog;
