import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar, CheckCircle, Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, type EnquiryFormValues } from "@/components/enquiries/types";
import { Form } from "@/components/ui/form";
import EnquiryFormFields from "@/components/enquiries/EnquiryFormFields";

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
      title: enquiry?.title || "",
      description: enquiry?.description || "",
      location: enquiry?.location || "",
      measurement_notes: enquiry?.measurement_notes || "",
      visit_date: enquiry?.visit_date ? new Date(enquiry.visit_date) : undefined,
    },
  });

  // Update the form values when the enquiry data is loaded
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

  const handleUpdateEnquiry = (values: EnquiryFormValues) => {
    updateEnquiryMutation.mutate(values);
  };

  const handleCompleteEnquiry = () => {
    completeEnquiryMutation.mutate();
  };

  const handleDeleteEnquiry = () => {
    deleteEnquiryMutation.mutate();
  };

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
          <div className="flex flex-col md:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(true)}
              className="w-full md:w-auto"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Enquiry
            </Button>
            {enquiry.status !== "completed" && enquiry.status !== "cancelled" && (
              <Button
                onClick={handleCompleteEnquiry}
                className="bg-green-500 hover:bg-green-600 w-full md:w-auto"
                disabled={completeEnquiryMutation.isPending}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {completeEnquiryMutation.isPending ? "Completing..." : "Mark as Complete"}
              </Button>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full md:w-auto">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Enquiry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Enquiry</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this enquiry? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteEnquiry}
                    disabled={deleteEnquiryMutation.isPending}
                  >
                    {deleteEnquiryMutation.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground mt-1">{enquiry.description}</p>
            </div>
            {enquiry.measurement_notes && (
              <div>
                <h3 className="font-medium">Measurement Notes</h3>
                <p className="text-muted-foreground mt-1">{enquiry.measurement_notes}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>📍 {enquiry.location}</span>
              {enquiry.visit_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(enquiry.visit_date), "PPP")}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Enquiry</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateEnquiry)} className="space-y-4">
              <EnquiryFormFields form={form} />

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateEnquiryMutation.isPending}>
                  {updateEnquiryMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnquiryDetails;