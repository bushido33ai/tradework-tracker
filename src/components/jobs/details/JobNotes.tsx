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
      // First, get the notes
      const { data: notesData, error: notesError } = await supabase
        .from("job_notes")
        .select("*")
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });

      if (notesError) throw notesError;

      // Then, get all unique creator IDs
      const creatorIds = [...new Set(notesData.map(note => note.created_by))];
      
      // Fetch profiles for all creators in one query
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", creatorIds);

      if (profilesError) throw profilesError;

      // Create a map of creator IDs to names
      const creatorNames = new Map(
        profilesData.map(profile => [profile.id, profile.full_name || "Unknown User"])
      );

      // Combine the data
      return notesData.map(note => ({
        id: note.id,
        job_id: note.job_id,
        content: note.content,
        note_type: note.note_type,
        created_at: note.created_at,
        created_by_name: creatorNames.get(note.created_by) || "Unknown User"
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