import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type AccessRequest = {
  id: string;
  user_id: string | null;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string | null;
  trial_end_at: string | null;
  approved_at: string | null;
  approved_by: string | null;
  notes: string | null;
  profiles: {
    email: string | null;
    full_name: string | null;
    user_type: string;
  } | null;
}

const AccessRequests = () => {
  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ["access-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("access_requests")
        .select(`
          *,
          profiles:profiles!inner(
            email,
            full_name,
            user_type
          )
        `)
        .order("requested_at", { ascending: false });

      if (error) {
        console.error("Error fetching access requests:", error);
        throw error;
      }

      return data as AccessRequest[];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, trialDays = 14 }: { id: string; trialDays?: number }) => {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + trialDays);

      const { data: request, error: requestError } = await supabase
        .from("access_requests")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
          trial_end_at: trialEndDate.toISOString(),
        })
        .eq("id", id)
        .select(`
          *,
          profiles:profiles!inner(
            email,
            full_name
          )
        `)
        .single();

      if (requestError) throw requestError;

      // Send approval email
      const response = await fetch("/functions/v1/send-access-request-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          to: request.profiles.email,
          type: "approved",
          userName: request.profiles.full_name,
          trialEndDate: format(new Date(request.trial_end_at), "PPP"),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send approval email");
      }
    },
    onSuccess: () => {
      toast.success("Access request approved successfully");
      refetch();
    },
    onError: (error) => {
      console.error("Error approving request:", error);
      toast.error("Failed to approve access request");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: request, error: requestError } = await supabase
        .from("access_requests")
        .update({ status: "rejected" })
        .eq("id", id)
        .select(`
          *,
          profiles:profiles!inner(
            email,
            full_name
          )
        `)
        .single();

      if (requestError) throw requestError;

      // Send rejection email
      const response = await fetch("/functions/v1/send-access-request-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          to: request.profiles.email,
          type: "rejected",
          userName: request.profiles.full_name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send rejection email");
      }
    },
    onSuccess: () => {
      toast.success("Access request rejected");
      refetch();
    },
    onError: (error) => {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject access request");
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Access Requests</h1>
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Requested At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Trial End Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests?.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{request.profiles?.full_name}</p>
                    <p className="text-sm text-gray-500">{request.profiles?.email}</p>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{request.profiles?.user_type}</TableCell>
                <TableCell>
                  {request.requested_at && format(new Date(request.requested_at), "PPP")}
                </TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>
                  {request.trial_end_at
                    ? format(new Date(request.trial_end_at), "PPP")
                    : "-"}
                </TableCell>
                <TableCell>
                  {request.status === "pending" && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => approveMutation.mutate({ id: request.id })}
                        disabled={approveMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejectMutation.mutate(request.id)}
                        disabled={rejectMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AccessRequests;