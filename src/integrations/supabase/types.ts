export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      access_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          id: string
          notes: string | null
          requested_at: string | null
          status: Database["public"]["Enums"]["access_request_status"] | null
          trial_end_at: string | null
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          id?: string
          notes?: string | null
          requested_at?: string | null
          status?: Database["public"]["Enums"]["access_request_status"] | null
          trial_end_at?: string | null
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          id?: string
          notes?: string | null
          requested_at?: string | null
          status?: Database["public"]["Enums"]["access_request_status"] | null
          trial_end_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      customer_profiles: {
        Row: {
          address: string | null
          created_at: string
          created_by: string | null
          email: string | null
          full_name: string | null
          id: string
          notes: string | null
          preferred_contact_method: string | null
          telephone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          notes?: string | null
          preferred_contact_method?: string | null
          telephone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          notes?: string | null
          preferred_contact_method?: string | null
          telephone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string
          description: string
          enquiry_number: string
          id: string
          location: string
          measurement_notes: string | null
          status: Database["public"]["Enums"]["enquiry_status"] | null
          title: string
          updated_at: string
          visit_date: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by: string
          description: string
          enquiry_number?: string
          id?: string
          location: string
          measurement_notes?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"] | null
          title: string
          updated_at?: string
          visit_date?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          description?: string
          enquiry_number?: string
          id?: string
          location?: string
          measurement_notes?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"] | null
          title?: string
          updated_at?: string
          visit_date?: string | null
        }
        Relationships: []
      }
      enquiry_designs: {
        Row: {
          enquiry_id: string | null
          file_path: string
          filename: string
          id: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          enquiry_id?: string | null
          file_path: string
          filename: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          enquiry_id?: string | null
          file_path?: string
          filename?: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiry_designs_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      job_access_permissions: {
        Row: {
          granted_at: string
          granted_by: string
          id: string
          job_id: string
          merchant_id: string
        }
        Insert: {
          granted_at?: string
          granted_by: string
          id?: string
          job_id: string
          merchant_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string
          id?: string
          job_id?: string
          merchant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_access_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_access_permissions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_access_permissions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_days_worked: {
        Row: {
          created_at: string | null
          created_by: string
          date_worked: string
          day_rate: number | null
          day_rate_type: string | null
          hours_worked: number
          id: string
          job_id: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string
          date_worked: string
          day_rate?: number | null
          day_rate_type?: string | null
          hours_worked: number
          id?: string
          job_id: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          date_worked?: string
          day_rate?: number | null
          day_rate_type?: string | null
          hours_worked?: number
          id?: string
          job_id?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_days_worked_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_designs: {
        Row: {
          file_path: string
          filename: string
          id: string
          job_id: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          file_path: string
          filename: string
          id?: string
          job_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          file_path?: string
          filename?: string
          id?: string
          job_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_designs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_invoices: {
        Row: {
          amount: number
          external_reference: string | null
          file_path: string
          filename: string
          id: string
          job_id: string | null
          received_at: string | null
          source: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          amount: number
          external_reference?: string | null
          file_path: string
          filename: string
          id?: string
          job_id?: string | null
          received_at?: string | null
          source?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          amount?: number
          external_reference?: string | null
          file_path?: string
          filename?: string
          id?: string
          job_id?: string | null
          received_at?: string | null
          source?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_invoices_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_misc_costs: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          description: string
          id: string
          job_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          description: string
          id?: string
          job_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          job_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_misc_costs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_notes: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          job_id: string
          note_type: Database["public"]["Enums"]["note_type"] | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          job_id: string
          note_type?: Database["public"]["Enums"]["note_type"] | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          job_id?: string
          note_type?: Database["public"]["Enums"]["note_type"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_notes_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          assigned_to: string | null
          budget: number | null
          created_at: string
          created_by: string
          day_rate: number | null
          description: string
          end_date: string | null
          id: string
          job_manager: string
          job_number: string
          job_type: string
          location: string
          start_date: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          title: string
          total_days_cost: number | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          budget?: number | null
          created_at?: string
          created_by: string
          day_rate?: number | null
          description: string
          end_date?: string | null
          id?: string
          job_manager: string
          job_number?: string
          job_type?: string
          location: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title: string
          total_days_cost?: number | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          budget?: number | null
          created_at?: string
          created_by?: string
          day_rate?: number | null
          description?: string
          end_date?: string | null
          id?: string
          job_manager?: string
          job_number?: string
          job_type?: string
          location?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title?: string
          total_days_cost?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_job_manager_fkey"
            columns: ["job_manager"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          notes: string | null
          preferred_contact_method: string | null
          surname: string | null
          telephone: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          notes?: string | null
          preferred_contact_method?: string | null
          surname?: string | null
          telephone?: string | null
          updated_at?: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          notes?: string | null
          preferred_contact_method?: string | null
          surname?: string | null
          telephone?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string
          business_type: string
          company_name: string
          contact_name: string
          created_at: string
          created_by: string
          email: string
          id: string
          phone: string
          status: Database["public"]["Enums"]["supplier_status"] | null
          updated_at: string
        }
        Insert: {
          address: string
          business_type: string
          company_name: string
          contact_name: string
          created_at?: string
          created_by: string
          email: string
          id?: string
          phone: string
          status?: Database["public"]["Enums"]["supplier_status"] | null
          updated_at?: string
        }
        Update: {
          address?: string
          business_type?: string
          company_name?: string
          contact_name?: string
          created_at?: string
          created_by?: string
          email?: string
          id?: string
          phone?: string
          status?: Database["public"]["Enums"]["supplier_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user_completely: {
        Args: {
          _user_id: string
        }
        Returns: undefined
      }
      generate_unique_job_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      access_request_status: "pending" | "approved" | "rejected"
      app_role: "admin" | "user"
      enquiry_status: "pending" | "in_progress" | "completed" | "cancelled"
      job_status: "pending" | "in_progress" | "completed" | "cancelled"
      note_type: "general" | "update" | "issue" | "resolution"
      supplier_status: "active" | "inactive"
      user_type: "tradesman" | "customer" | "merchant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
