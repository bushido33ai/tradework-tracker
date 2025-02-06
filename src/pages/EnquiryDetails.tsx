import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, type EnquiryFormValues } from "@/components/enquiries/types";
import { EnquiryActions } from "@/components/enquiries/details/EnquiryActions";
import { EnquiryContent } from "@/components/enquiries/details/EnquiryContent";
import { EditEnquiryDialog } from "@/components/enquiries/details/EditEnquiryDialog";

const EnquiryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { data: enquiry, isLoading } = useQuery({
    queryKey: ["enquiry", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      measurement_notes: "",
      visit_date: undefined,
    },
  });

  useEffect(() => {
    if (enquiry) {
      form.reset({
        title: enquiry.title,
        description: enquiry.description,
        location: enquiry.location,
        measurement_notes: enquiry.measurement_notes || "",
        visit_date: enquiry.visit_date ? new Date(enquiry.visit_date) : undefined,
      });
    }
  }, [enquiry, form]);

  const updateEnquiryMutation = useMutation({
    mutationFn: async (values: EnquiryFormValues) => {
      const { error } = await supabase
        .from("enquiries")
        .update({
          title: values.title,
          description: values.description,
          location: values.location,
          measurement_notes: values.measurement_notes || null,
          visit_date: values.visit_date ? values.visit_date.toISOString() : null,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Enquiry updated successfully");
      queryClient.invalidateQueries({ queryKey: ["enquiry", id] });
      setShowEditDialog(false);
    },
    onError: (error) => {
      console.error("Error updating enquiry:", error);
      toast.error("Failed to update enquiry");
    },
  });

  const deleteEnquiryMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("enquiries")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Enquiry deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      navigate("/enquiries");
    },
    onError: (error) => {
      console.error("Error deleting enquiry:", error);
      toast.error("Failed to delete enquiry");
    },
  });

  const completeEnquiryMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("enquiries")
        .update({ status: "completed" })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Enquiry marked as completed");
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      queryClient.invalidateQueries({ queryKey: ["enquiry", id] });
      navigate("/enquiries");
    },
    onError: (error) => {
      console.error("Error completing enquiry:", error);
      toast.error("Failed to complete enquiry");
    },
  });

  if (isLoading) {
    return <div>Loading enquiry details...</div>;
  }

  if (!enquiry) {
    return <div>Enquiry not found</div>;
  }

  return (
    <div className="space-y-6 pt-4 md:pt-0">
      <Card>
        <CardHeader className="space-y-4 md:space-y-0 md:flex md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              {enquiry.enquiry_number}
            </div>
            <CardTitle className="text-xl md:text-2xl">{enquiry.title}</CardTitle>
          </div>
          <EnquiryActions
            showEditDialog={showEditDialog}
            setShowEditDialog={setShowEditDialog}
            status={enquiry.status}
            completeEnquiryMutation={completeEnquiryMutation}
            deleteEnquiryMutation={deleteEnquiryMutation}
          />
        </CardHeader>
        <CardContent>
          <EnquiryContent
            id={enquiry.id}
            description={enquiry.description}
            measurementNotes={enquiry.measurement_notes}
            location={enquiry.location}
            visitDate={enquiry.visit_date}
          />
        </CardContent>
      </Card>

      <EditEnquiryDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        form={form}
        updateEnquiryMutation={updateEnquiryMutation}
      />
    </div>
  );
};

export default EnquiryDetails;