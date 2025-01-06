import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface JobNoteFormProps {
  jobId: string;
}

export const JobNoteForm = ({ jobId }: JobNoteFormProps) => {
  const [newNote, setNewNote] = useState("");
  const queryClient = useQueryClient();

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

  return (
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
  );
};