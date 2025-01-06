import { formatDistanceToNow } from "date-fns";
import type { JobNote } from "./types";

interface JobNoteItemProps {
  note: JobNote;
}

export const JobNoteItem = ({ note }: JobNoteItemProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-medium">{note.created_by_name}</p>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
          </p>
        </div>
        {note.note_type && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {note.note_type}
          </span>
        )}
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
    </div>
  );
};