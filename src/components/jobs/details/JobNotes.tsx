import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface JobNotesProps {
  jobId: string;
}

const JobNotes = ({ jobId }: JobNotesProps) => {
  const [newNote, setNewNote] = useState("");
  const queryClient = useQueryClient();

  const { data: notes, isLoading } = useQuery({
    queryKey: ["jobNotes", jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_notes")
        .select(`
          *,
          profiles(full_name)
        `)
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      const { error } = await supabase.from("job_notes").insert({
        job_id: jobId,
        content,
        created_by: userData.user.id
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobNotes", jobId] });
      setNewNote("");
      toast.success("Note added successfully");
    },
    onError: (error) => {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addNoteMutation.mutate(newNote);
  };

  if (isLoading) {
    return <div>Loading notes...</div>;
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={addNoteMutation.isPending || !newNote.trim()}
          className="self-end"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <div className="space-y-4">
        {notes?.map((note) => (
          <Card key={note.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium">
                {note.profiles?.full_name || "Unknown User"}
              </span>
              <span className="text-sm text-muted-foreground">
                {format(new Date(note.created_at), "PPp")}
              </span>
            </div>
            <p className="whitespace-pre-wrap">{note.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobNotes;