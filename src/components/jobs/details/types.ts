import { Database } from "@/integrations/supabase/types";

export type JobNote = {
  id: string;
  job_id: string;
  content: string;
  note_type: Database["public"]["Enums"]["note_type"] | null;
  created_at: string;
  created_by_name: string;
};