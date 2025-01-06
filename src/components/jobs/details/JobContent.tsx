import { CardContent } from "@/components/ui/card";

interface JobContentProps {
  description: string;
  location: string;
  budget?: number | null;
}

const JobContent = ({ description, location, budget }: JobContentProps) => {
  return (
    <CardContent>
      <div className="grid gap-4">
        <div>
          <h3 className="font-medium">Description</h3>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>📍 {location}</span>
          {budget && <span>💰 ${budget}</span>}
        </div>
      </div>
    </CardContent>
  );
};

export default JobContent;