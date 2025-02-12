
import { Database } from "@/integrations/supabase/types";

export type JobNote = {
  id: string;
  job_id: string;
  content: string;
  note_type: Database["public"]["Enums"]["note_type"] | null;
  created_at: string;
  created_by_name: string;
};

export type JobMiscCost = {
  id: string;
  description: string;
  amount: number;
  created_at: string;
  created_by: string;
};
