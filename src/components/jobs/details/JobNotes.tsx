import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobNoteForm } from "./JobNoteForm";
import { JobNoteItem } from "./JobNoteItem";
import type { JobNote } from "./types";

interface JobNotesProps {
  jobId: string;
}

const JobNotes = ({ jobId }: JobNotesProps) => {
  const { data: notes, isLoading } = useQuery<JobNote[]>({
    queryKey: ["jobNotes", jobId],
    queryFn: async () => {
      const { data: notesData, error: notesError } = await supabase
        .from("job_notes")
        .select(`
          id,
          job_id,
          content,
          note_type,
          created_at,
          profiles!created_by (
            full_name
          )
        `)
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });

      if (notesError) throw notesError;

      return notesData.map(note => ({
        id: note.id,
        job_id: note.job_id,
        content: note.content,
        note_type: note.note_type,
        created_at: note.created_at,
        created_by_name: note.profiles?.full_name || "Unknown User"
      }));
    },
  });

  if (isLoading) {
    return <div>Loading notes...</div>;
  }

  return (
    <div className="space-y-4">
      <JobNoteForm jobId={jobId} />
      <div className="space-y-4">
        {notes?.map((note) => (
          <JobNoteItem key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
};

export default JobNotes;