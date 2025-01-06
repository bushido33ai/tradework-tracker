import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobNoteForm } from "./JobNoteForm";
import { JobNoteItem } from "./JobNoteItem";

interface JobNotesProps {
  jobId: string;
}

type JobNote = {
  id: string;
  job_id: string;
  content: string;
  created_at: string;
  created_by: string;
  note_type: "general" | "update" | "issue" | "resolution" | null;
  updated_at: string;
  creator: {
    full_name: string | null;
  } | null;
}

const JobNotes = ({ jobId }: JobNotesProps) => {
  const { data: notes, isLoading } = useQuery<JobNote[]>({
    queryKey: ["jobNotes", jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_notes")
        .select(`
          *,
          creator:profiles!job_notes_created_by_fkey (
            full_name
          )
        `)
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
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