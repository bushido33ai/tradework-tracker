import { format } from "date-fns";
import { Card } from "@/components/ui/card";

interface JobNoteItemProps {
  note: {
    content: string;
    created_at: string;
    creator: {
      full_name: string | null;
    } | null;
  };
}

export const JobNoteItem = ({ note }: JobNoteItemProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-2">
        <span className="font-medium">
          {note.creator?.full_name || "Unknown User"}
        </span>
        <span className="text-sm text-muted-foreground">
          {format(new Date(note.created_at), "PPp")}
        </span>
      </div>
      <p className="whitespace-pre-wrap">{note.content}</p>
    </Card>
  );
};