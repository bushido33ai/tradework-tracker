import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, PoundSterling } from "lucide-react";

interface PaymentFormProps {
  jobId: string;
}

export const PaymentForm = ({ jobId }: PaymentFormProps) => {
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { session } = useSessionContext();
  const queryClient = useQueryClient();

  const addPaymentMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("job_payments")
        .insert({
          job_id: jobId,
          amount: parseFloat(amount),
          payment_date: paymentDate,
          description: description || null,
          created_by: session.user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-payments", jobId] });
      toast.success("Payment recorded successfully");
      setAmount("");
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setDescription("");
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Failed to add payment:", error);
      toast.error("Failed to record payment");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    addPaymentMutation.mutate();
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)} 
        className="w-full"
        variant="outline"
      >
        <Plus className="h-4 w-4 mr-2" />
        Record Payment
      </Button>
    );
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="amount">Amount (£)</Label>
          <div className="relative">
            <PoundSterling className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="paymentDate">Payment Date</Label>
          <Input
            id="paymentDate"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Initial deposit, Progress payment, Final payment"
            rows={2}
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={addPaymentMutation.isPending}
            className="flex-1"
          >
            {addPaymentMutation.isPending ? "Recording..." : "Record Payment"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};