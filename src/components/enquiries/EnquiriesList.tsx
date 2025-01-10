import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

type EnquiryStatus = "pending" | "in_progress" | "completed" | "cancelled";

interface EnquiriesListProps {
  status: EnquiryStatus[];
}

const EnquiriesList = ({ status }: EnquiriesListProps) => {
  const navigate = useNavigate();

  const { data: enquiries, isLoading } = useQuery({
    queryKey: ["enquiries", status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .in("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading enquiries...</div>;
  }

  if (!enquiries?.length) {
    return <div className="text-muted-foreground">No enquiries found.</div>;
  }

  return (
    <div className="grid gap-4 mt-4">
      {enquiries.map((enquiry) => (
        <Card 
          key={enquiry.id} 
          className="p-4 cursor-pointer bg-white shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-l-4 border-l-primary-600"
          onClick={() => navigate(`/enquiries/${enquiry.id}`)}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                {enquiry.enquiry_number}
              </div>
              <h3 className="font-semibold text-lg">{enquiry.title}</h3>
              <p className="text-muted-foreground mt-1">{enquiry.description}</p>
              <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                <span>📍 {enquiry.location}</span>
                {enquiry.visit_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(enquiry.visit_date), "PPP")}
                  </span>
                )}
              </div>
            </div>
            <Badge
              variant={
                enquiry.status === "completed"
                  ? "default"
                  : enquiry.status === "cancelled"
                  ? "destructive"
                  : "secondary"
              }
              className={enquiry.status === "pending" ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {enquiry.status === "pending" ? "current" : enquiry.status.replace("_", " ")}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EnquiriesList;