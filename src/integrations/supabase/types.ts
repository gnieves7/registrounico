export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      documents: {
        Row: {
          code_generated_at: string | null
          created_at: string
          description: string | null
          document_type: string
          download_code: string | null
          file_url: string | null
          id: string
          is_paid: boolean | null
          patient_id: string
          payment_date: string | null
          payment_id: string | null
          price: number
          title: string
          updated_at: string
        }
        Insert: {
          code_generated_at?: string | null
          created_at?: string
          description?: string | null
          document_type: string
          download_code?: string | null
          file_url?: string | null
          id?: string
          is_paid?: boolean | null
          patient_id: string
          payment_date?: string | null
          payment_id?: string | null
          price?: number
          title: string
          updated_at?: string
        }
        Update: {
          code_generated_at?: string | null
          created_at?: string
          description?: string | null
          document_type?: string
          download_code?: string | null
          file_url?: string | null
          id?: string
          is_paid?: boolean | null
          patient_id?: string
          payment_date?: string | null
          payment_id?: string | null
          price?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      dream_records: {
        Row: {
          created_at: string
          dream_content: string
          dream_date: string
          dream_emojis: Json | null
          id: string
          interpretation: string | null
          interpretation_date: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dream_content: string
          dream_date?: string
          dream_emojis?: Json | null
          id?: string
          interpretation?: string | null
          interpretation_date?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dream_content?: string
          dream_date?: string
          dream_emojis?: Json | null
          id?: string
          interpretation?: string | null
          interpretation_date?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      emotional_records: {
        Row: {
          created_at: string
          emoji: string
          id: string
          mood_score: number | null
          record_date: string
          reflection: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          mood_score?: number | null
          record_date?: string
          reflection?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          mood_score?: number | null
          record_date?: string
          reflection?: string | null
          user_id?: string
        }
        Relationships: []
      }
      forensic_cases: {
        Row: {
          additional_info: string | null
          case_number: string | null
          case_status: string | null
          complainant_name: string | null
          complainant_relationship: string | null
          complaint_date: string | null
          confidentiality_notice: string | null
          court_name: string | null
          created_at: string
          defense_lawyer_email: string | null
          defense_lawyer_name: string | null
          defense_lawyer_phone: string | null
          hearing_date: string | null
          id: string
          intervening_actors: Json | null
          next_hearing_date: string | null
          reported_fact: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_info?: string | null
          case_number?: string | null
          case_status?: string | null
          complainant_name?: string | null
          complainant_relationship?: string | null
          complaint_date?: string | null
          confidentiality_notice?: string | null
          court_name?: string | null
          created_at?: string
          defense_lawyer_email?: string | null
          defense_lawyer_name?: string | null
          defense_lawyer_phone?: string | null
          hearing_date?: string | null
          id?: string
          intervening_actors?: Json | null
          next_hearing_date?: string | null
          reported_fact?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          additional_info?: string | null
          case_number?: string | null
          case_status?: string | null
          complainant_name?: string | null
          complainant_relationship?: string | null
          complaint_date?: string | null
          confidentiality_notice?: string | null
          court_name?: string | null
          created_at?: string
          defense_lawyer_email?: string | null
          defense_lawyer_name?: string | null
          defense_lawyer_phone?: string | null
          hearing_date?: string | null
          id?: string
          intervening_actors?: Json | null
          next_hearing_date?: string | null
          reported_fact?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      forensic_documents: {
        Row: {
          case_id: string
          created_at: string
          description: string | null
          document_name: string
          document_type: string | null
          file_url: string | null
          id: string
          upload_date: string
          user_id: string
        }
        Insert: {
          case_id: string
          created_at?: string
          description?: string | null
          document_name: string
          document_type?: string | null
          file_url?: string | null
          id?: string
          upload_date?: string
          user_id: string
        }
        Update: {
          case_id?: string
          created_at?: string
          description?: string | null
          document_name?: string
          document_type?: string | null
          file_url?: string | null
          id?: string
          upload_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forensic_documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "forensic_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      laura_conversations: {
        Row: {
          created_at: string
          id: string
          messages: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mbti_tests: {
        Row: {
          clinical_notes: string | null
          consent_accepted: boolean | null
          consent_date: string | null
          created_at: string
          extraversion_score: number | null
          feeling_score: number | null
          id: string
          introversion_score: number | null
          intuition_score: number | null
          is_complete: boolean | null
          judging_score: number | null
          perceiving_score: number | null
          personality_type: string | null
          responses: Json
          sensing_score: number | null
          test_date: string
          thinking_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          clinical_notes?: string | null
          consent_accepted?: boolean | null
          consent_date?: string | null
          created_at?: string
          extraversion_score?: number | null
          feeling_score?: number | null
          id?: string
          introversion_score?: number | null
          intuition_score?: number | null
          is_complete?: boolean | null
          judging_score?: number | null
          perceiving_score?: number | null
          personality_type?: string | null
          responses?: Json
          sensing_score?: number | null
          test_date?: string
          thinking_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          clinical_notes?: string | null
          consent_accepted?: boolean | null
          consent_date?: string | null
          created_at?: string
          extraversion_score?: number | null
          feeling_score?: number | null
          id?: string
          introversion_score?: number | null
          intuition_score?: number | null
          is_complete?: boolean | null
          judging_score?: number | null
          perceiving_score?: number | null
          personality_type?: string | null
          responses?: Json
          sensing_score?: number | null
          test_date?: string
          thinking_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mmpi2_tests: {
        Row: {
          clinical_interpretation: string | null
          clinical_notes: string | null
          consent_accepted: boolean | null
          consent_date: string | null
          created_at: string
          id: string
          interpretation_date: string | null
          is_complete: boolean | null
          responses: Json
          test_date: string
          total_questions_answered: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          clinical_interpretation?: string | null
          clinical_notes?: string | null
          consent_accepted?: boolean | null
          consent_date?: string | null
          created_at?: string
          id?: string
          interpretation_date?: string | null
          is_complete?: boolean | null
          responses?: Json
          test_date?: string
          total_questions_answered?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          clinical_interpretation?: string | null
          clinical_notes?: string | null
          consent_accepted?: boolean | null
          consent_date?: string | null
          created_at?: string
          id?: string
          interpretation_date?: string | null
          is_complete?: boolean | null
          responses?: Json
          test_date?: string
          total_questions_answered?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      psychobiographies: {
        Row: {
          address: string | null
          birth_date: string | null
          birth_place: string | null
          created_at: string
          education_level: string | null
          family_data: Json | null
          id: string
          is_complete: boolean | null
          legal_history: Json | null
          lifestyle_data: Json | null
          marital_status: string | null
          medical_history: Json | null
          nationality: string | null
          occupation: string | null
          personal_values: Json | null
          psychological_history: Json | null
          sessions_absent: number | null
          sessions_attended: number | null
          social_data: Json | null
          traumatic_events: Json | null
          treatment_start_date: string | null
          updated_at: string
          user_id: string
          work_history: Json | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          birth_place?: string | null
          created_at?: string
          education_level?: string | null
          family_data?: Json | null
          id?: string
          is_complete?: boolean | null
          legal_history?: Json | null
          lifestyle_data?: Json | null
          marital_status?: string | null
          medical_history?: Json | null
          nationality?: string | null
          occupation?: string | null
          personal_values?: Json | null
          psychological_history?: Json | null
          sessions_absent?: number | null
          sessions_attended?: number | null
          social_data?: Json | null
          traumatic_events?: Json | null
          treatment_start_date?: string | null
          updated_at?: string
          user_id: string
          work_history?: Json | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          birth_place?: string | null
          created_at?: string
          education_level?: string | null
          family_data?: Json | null
          id?: string
          is_complete?: boolean | null
          legal_history?: Json | null
          lifestyle_data?: Json | null
          marital_status?: string | null
          medical_history?: Json | null
          nationality?: string | null
          occupation?: string | null
          personal_values?: Json | null
          psychological_history?: Json | null
          sessions_absent?: number | null
          sessions_attended?: number | null
          social_data?: Json | null
          traumatic_events?: Json | null
          treatment_start_date?: string | null
          updated_at?: string
          user_id?: string
          work_history?: Json | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          calendar_link: string | null
          clinical_notes: string | null
          created_at: string
          id: string
          is_editable_by_patient: boolean | null
          patient_id: string
          patient_notes: string | null
          patient_questions: string | null
          session_date: string
          topic: string | null
          updated_at: string
        }
        Insert: {
          calendar_link?: string | null
          clinical_notes?: string | null
          created_at?: string
          id?: string
          is_editable_by_patient?: boolean | null
          patient_id: string
          patient_notes?: string | null
          patient_questions?: string | null
          session_date: string
          topic?: string | null
          updated_at?: string
        }
        Update: {
          calendar_link?: string | null
          clinical_notes?: string | null
          created_at?: string
          id?: string
          is_editable_by_patient?: boolean | null
          patient_id?: string
          patient_notes?: string | null
          patient_questions?: string | null
          session_date?: string
          topic?: string | null
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "patient"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "patient"],
    },
  },
} as const
