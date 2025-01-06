import { Database } from "@/integrations/supabase/types";

export type JobNote = {
  id: string;
  job_id: string;
  content: string;
  note_type: Database["public"]["Enums"]["note_type"] | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  creator: {
    full_name: string | null;
  } | null;
};