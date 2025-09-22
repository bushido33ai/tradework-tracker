import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Payment {
  id: string;
  amount: number;
  payment_date: string;
  description: string | null;
  created_at: string;
}

interface PaymentsListProps {
  jobId: string;
}

export const PaymentsList = ({ jobId }: PaymentsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["job-payments", jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_payments")
        .select("*")
        .eq("job_id", jobId)
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return data as Payment[];
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      const { error } = await supabase
        .from("job_payments")
        .delete()
        .eq("id", paymentId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Payment deleted",
        description: "Payment has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["job-payments"] });
      queryClient.invalidateQueries({ queryKey: ["totalReceived"] });
      queryClient.invalidateQueries({ queryKey: ["currentJobs"] });
      queryClient.invalidateQueries({ queryKey: ["completedJobs"] });
      queryClient.invalidateQueries({ queryKey: ["totalSpend"] });
      queryClient.invalidateQueries({ queryKey: ["totalInvoices"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete payment. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting payment:", error);
    },
  });

  const totalReceived = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-muted animate-pulse rounded-lg" />
        <div className="h-20 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total Received Summary */}
      <Card className="bg-green-50 border-green-200">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-green-600" />
            <h3 className="font-medium text-green-800">Total Received</h3>
          </div>
          <p className="text-2xl font-bold text-green-900">
            £{totalReceived.toFixed(2)}
          </p>
        </div>
      </Card>

      {/* Payments List */}
      {payments.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            No payments recorded yet.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <Card key={payment.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-lg">
                      £{Number(payment.amount).toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(payment.payment_date), "PPP")}
                    </span>
                  </div>
                  {payment.description && (
                    <p className="text-sm text-muted-foreground">
                      {payment.description}
                    </p>
                  )}
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Payment</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this payment of £{Number(payment.amount).toFixed(2)}?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deletePaymentMutation.mutate(payment.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};