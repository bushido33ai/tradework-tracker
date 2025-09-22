import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, PoundSterling } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useSessionContext } from "@supabase/auth-helpers-react";

interface PaymentsListProps {
  jobId: string;
}

export const PaymentsList = ({ jobId }: PaymentsListProps) => {
  const { session } = useSessionContext();
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ["job-payments", jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_payments")
        .select("*")
        .eq("job_id", jobId)
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return data;
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
      queryClient.invalidateQueries({ queryKey: ["job-payments", jobId] });
      toast.success("Payment deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete payment:", error);
      toast.error("Failed to delete payment");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const totalReceived = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

  return (
    <div className="space-y-4">
      {totalReceived > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <span className="font-medium text-green-900">Total Received:</span>
            <span className="font-bold text-lg text-green-900">£{totalReceived.toFixed(2)}</span>
          </div>
        </Card>
      )}

      {payments && payments.length > 0 ? (
        <div className="space-y-3">
          {payments.map((payment) => (
            <Card key={payment.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <PoundSterling className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-lg">£{Number(payment.amount).toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(payment.payment_date), "PPP")}
                  </p>
                  {payment.description && (
                    <p className="text-sm mt-1">{payment.description}</p>
                  )}
                </div>
                {payment.created_by === session?.user?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePaymentMutation.mutate(payment.id)}
                    disabled={deletePaymentMutation.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center text-muted-foreground">
          <PoundSterling className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No payments recorded yet</p>
        </Card>
      )}
    </div>
  );
};