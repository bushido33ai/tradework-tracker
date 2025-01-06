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
      const { data, error } = await supabase
        .from("job_notes")
        .select(`
          id,
          job_id,
          content,
          note_type,
          created_by,
          created_at,
          updated_at,
          creator:profiles!created_by(full_name)
        `)
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as JobNote[];
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