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
      activity_log: {
        Row: {
          created_at: string
          event_detail: Json | null
          event_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_detail?: Json | null
          event_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_detail?: Json | null
          event_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      alliance_ratings: {
        Row: {
          access_token: string | null
          bond_quality: number
          created_at: string
          goal_agreement: number
          id: string
          patient_id: string
          rater_type: string
          session_id: string
          task_agreement: number
        }
        Insert: {
          access_token?: string | null
          bond_quality: number
          created_at?: string
          goal_agreement: number
          id?: string
          patient_id: string
          rater_type: string
          session_id: string
          task_agreement: number
        }
        Update: {
          access_token?: string | null
          bond_quality?: number
          created_at?: string
          goal_agreement?: number
          id?: string
          patient_id?: string
          rater_type?: string
          session_id?: string
          task_agreement?: number
        }
        Relationships: [
          {
            foreignKeyName: "alliance_ratings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      anxiety_abcde_records: {
        Row: {
          created_at: string
          debate: string | null
          emotion_conduct: string | null
          id: string
          record_date: string
          result: string | null
          situation: string | null
          thought: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          debate?: string | null
          emotion_conduct?: string | null
          id?: string
          record_date?: string
          result?: string | null
          situation?: string | null
          thought?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          debate?: string | null
          emotion_conduct?: string | null
          id?: string
          record_date?: string
          result?: string | null
          situation?: string | null
          thought?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      app_notifications: {
        Row: {
          archived_at: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json
          notification_type: string
          read_at: string | null
          recipient_user_id: string
          related_record_id: string | null
          related_table: string | null
          route: string | null
          title: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json
          notification_type: string
          read_at?: string | null
          recipient_user_id: string
          related_record_id?: string | null
          related_table?: string | null
          route?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json
          notification_type?: string
          read_at?: string | null
          recipient_user_id?: string
          related_record_id?: string | null
          related_table?: string | null
          route?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      case_formulations: {
        Row: {
          created_at: string
          edges: Json
          id: string
          nodes: Json
          notes: string | null
          patient_id: string
          title: string | null
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          edges?: Json
          id?: string
          nodes?: Json
          notes?: string | null
          patient_id: string
          title?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          edges?: Json
          id?: string
          nodes?: Json
          notes?: string | null
          patient_id?: string
          title?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
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
      ema_configs: {
        Row: {
          access_token: string
          created_at: string
          id: string
          is_active: boolean
          patient_id: string
          updated_at: string
        }
        Insert: {
          access_token?: string
          created_at?: string
          id?: string
          is_active?: boolean
          patient_id: string
          updated_at?: string
        }
        Update: {
          access_token?: string
          created_at?: string
          id?: string
          is_active?: boolean
          patient_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      ema_responses: {
        Row: {
          emotion: string
          id: string
          mood_score: number
          note: string | null
          patient_id: string
          responded_at: string
        }
        Insert: {
          emotion: string
          id?: string
          mood_score: number
          note?: string | null
          patient_id: string
          responded_at?: string
        }
        Update: {
          emotion?: string
          id?: string
          mood_score?: number
          note?: string | null
          patient_id?: string
          responded_at?: string
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
      informes_pdf: {
        Row: {
          created_at: string
          generated_by: string
          id: string
          storage_path: string | null
          test_record_id: string | null
          test_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          generated_by: string
          id?: string
          storage_path?: string | null
          test_record_id?: string | null
          test_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          generated_by?: string
          id?: string
          storage_path?: string | null
          test_record_id?: string | null
          test_type?: string
          user_id?: string
        }
        Relationships: []
      }
      judicial_case_attachments: {
        Row: {
          attachment_type: string
          case_id: string
          created_at: string
          description: string | null
          id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string
          title: string
          uploaded_by: string
        }
        Insert: {
          attachment_type: string
          case_id: string
          created_at?: string
          description?: string | null
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path: string
          title: string
          uploaded_by: string
        }
        Update: {
          attachment_type?: string
          case_id?: string
          created_at?: string
          description?: string | null
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string
          title?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "judicial_case_attachments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "judicial_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      judicial_cases: {
        Row: {
          additional_notes: string | null
          case_status: string
          case_title: string
          complainant_dni: string | null
          complainant_name: string | null
          complainant_relationship: string | null
          complaint_date: string | null
          complaint_place: string | null
          confidentiality_notice: string | null
          court_division: string | null
          court_name: string | null
          created_at: string
          cuij: string | null
          defense_lawyer_email: string | null
          defense_lawyer_matricula: string | null
          defense_lawyer_name: string | null
          defense_lawyer_phone: string | null
          gesell_chamber_date: string | null
          gesell_chamber_notes: string | null
          id: string
          jurisdiction: string
          legajo_number: string | null
          next_hearing_date: string | null
          owner_user_id: string
          prosecutor_name: string | null
          reported_facts: string | null
          sentence_date: string | null
          sentence_summary: string | null
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          case_status?: string
          case_title: string
          complainant_dni?: string | null
          complainant_name?: string | null
          complainant_relationship?: string | null
          complaint_date?: string | null
          complaint_place?: string | null
          confidentiality_notice?: string | null
          court_division?: string | null
          court_name?: string | null
          created_at?: string
          cuij?: string | null
          defense_lawyer_email?: string | null
          defense_lawyer_matricula?: string | null
          defense_lawyer_name?: string | null
          defense_lawyer_phone?: string | null
          gesell_chamber_date?: string | null
          gesell_chamber_notes?: string | null
          id?: string
          jurisdiction?: string
          legajo_number?: string | null
          next_hearing_date?: string | null
          owner_user_id: string
          prosecutor_name?: string | null
          reported_facts?: string | null
          sentence_date?: string | null
          sentence_summary?: string | null
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          case_status?: string
          case_title?: string
          complainant_dni?: string | null
          complainant_name?: string | null
          complainant_relationship?: string | null
          complaint_date?: string | null
          complaint_place?: string | null
          confidentiality_notice?: string | null
          court_division?: string | null
          court_name?: string | null
          created_at?: string
          cuij?: string | null
          defense_lawyer_email?: string | null
          defense_lawyer_matricula?: string | null
          defense_lawyer_name?: string | null
          defense_lawyer_phone?: string | null
          gesell_chamber_date?: string | null
          gesell_chamber_notes?: string | null
          id?: string
          jurisdiction?: string
          legajo_number?: string | null
          next_hearing_date?: string | null
          owner_user_id?: string
          prosecutor_name?: string | null
          reported_facts?: string | null
          sentence_date?: string | null
          sentence_summary?: string | null
          updated_at?: string
        }
        Relationships: []
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
      life_events: {
        Row: {
          created_at: string
          created_by: string
          description: string
          event_date: string
          event_type: string
          id: string
          patient_annotation: string | null
          patient_id: string
          updated_at: string
          valence: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          description: string
          event_date: string
          event_type: string
          id?: string
          patient_annotation?: string | null
          patient_id: string
          updated_at?: string
          valence?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          event_date?: string
          event_type?: string
          id?: string
          patient_annotation?: string | null
          patient_id?: string
          updated_at?: string
          valence?: string
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
      mcmi3_tests: {
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
      micro_tasks: {
        Row: {
          access_token: string | null
          category: string
          completed_at: string | null
          created_at: string
          due_date: string | null
          id: string
          instructions: string | null
          patient_id: string
          response: string | null
          session_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          category: string
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          instructions?: string | null
          patient_id: string
          response?: string | null
          session_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          category?: string
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          instructions?: string | null
          patient_id?: string
          response?: string | null
          session_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "micro_tasks_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
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
      narrative_analyses: {
        Row: {
          created_at: string
          distortions: Json
          emotional_vocabulary: Json
          id: string
          language_ratio: Json
          patient_id: string
          session_date: string | null
          session_id: string | null
          source_text: string | null
          summary: string | null
          themes: Json
        }
        Insert: {
          created_at?: string
          distortions?: Json
          emotional_vocabulary?: Json
          id?: string
          language_ratio?: Json
          patient_id: string
          session_date?: string | null
          session_id?: string | null
          source_text?: string | null
          summary?: string | null
          themes?: Json
        }
        Update: {
          created_at?: string
          distortions?: Json
          emotional_vocabulary?: Json
          id?: string
          language_ratio?: Json
          patient_id?: string
          session_date?: string | null
          session_id?: string | null
          source_text?: string | null
          summary?: string | null
          themes?: Json
        }
        Relationships: [
          {
            foreignKeyName: "narrative_analyses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      notebook_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          shared_with_therapist: boolean
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          shared_with_therapist?: boolean
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          shared_with_therapist?: boolean
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      outcome_measures: {
        Row: {
          created_at: string
          id: string
          patient_id: string
          responses: Json
          scale_type: string
          session_date: string | null
          session_id: string | null
          total_score: number
        }
        Insert: {
          created_at?: string
          id?: string
          patient_id: string
          responses?: Json
          scale_type: string
          session_date?: string | null
          session_id?: string | null
          total_score?: number
        }
        Update: {
          created_at?: string
          id?: string
          patient_id?: string
          responses?: Json
          scale_type?: string
          session_date?: string | null
          session_id?: string | null
          total_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "outcome_measures_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_consents: {
        Row: {
          accepted_at: string
          auth_method: string | null
          created_at: string
          dni: string
          document_text: string | null
          document_version: string
          full_name: string
          id: string
          inactivity_clause_accepted: boolean
          ip_address: string | null
          license_college: string
          license_number: string
          pdf_storage_path: string | null
          review_decision: string | null
          review_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          signature_hash: string | null
          signature_typed: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          accepted_at?: string
          auth_method?: string | null
          created_at?: string
          dni: string
          document_text?: string | null
          document_version?: string
          full_name: string
          id?: string
          inactivity_clause_accepted?: boolean
          ip_address?: string | null
          license_college: string
          license_number: string
          pdf_storage_path?: string | null
          review_decision?: string | null
          review_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          signature_hash?: string | null
          signature_typed: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          accepted_at?: string
          auth_method?: string | null
          created_at?: string
          dni?: string
          document_text?: string | null
          document_version?: string
          full_name?: string
          id?: string
          inactivity_clause_accepted?: boolean
          ip_address?: string | null
          license_college?: string
          license_number?: string
          pdf_storage_path?: string | null
          review_decision?: string | null
          review_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          signature_hash?: string | null
          signature_typed?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      professional_profile_content: {
        Row: {
          content: Json
          id: string
          section_key: string
          updated_at: string
        }
        Insert: {
          content?: Json
          id?: string
          section_key: string
          updated_at?: string
        }
        Update: {
          content?: Json
          id?: string
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      professional_profile_items: {
        Row: {
          created_at: string
          description: string | null
          features: Json | null
          icon_name: string | null
          id: string
          institution: string | null
          is_popular: boolean | null
          item_type: string
          sort_order: number | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json | null
          icon_name?: string | null
          id?: string
          institution?: string | null
          is_popular?: boolean | null
          item_type: string
          sort_order?: number | null
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json | null
          icon_name?: string | null
          id?: string
          institution?: string | null
          is_popular?: boolean | null
          item_type?: string
          sort_order?: number | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      professional_resources: {
        Row: {
          author: string | null
          created_at: string
          description: string | null
          id: string
          resource_type: string
          role_tag: string
          section: string
          sort_order: number
          source: string | null
          storage_path: string | null
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          author?: string | null
          created_at?: string
          description?: string | null
          id?: string
          resource_type: string
          role_tag?: string
          section: string
          sort_order?: number
          source?: string | null
          storage_path?: string | null
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          author?: string | null
          created_at?: string
          description?: string | null
          id?: string
          resource_type?: string
          role_tag?: string
          section?: string
          sort_order?: number
          source?: string | null
          storage_path?: string | null
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      professional_stats: {
        Row: {
          created_at: string
          id: string
          sort_order: number
          stat_key: string
          stat_label: string
          stat_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          sort_order?: number
          stat_key: string
          stat_label: string
          stat_value?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          sort_order?: number
          stat_key?: string
          stat_label?: string
          stat_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      professional_subscriptions: {
        Row: {
          amount_usd: number | null
          created_at: string
          id: string
          last_activity_at: string
          last_payment_at: string | null
          last_payment_id: string | null
          paid_until: string | null
          plan: string | null
          status: string
          trial_ends_at: string
          trial_started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_usd?: number | null
          created_at?: string
          id?: string
          last_activity_at?: string
          last_payment_at?: string | null
          last_payment_id?: string | null
          paid_until?: string | null
          plan?: string | null
          status?: string
          trial_ends_at?: string
          trial_started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_usd?: number | null
          created_at?: string
          id?: string
          last_activity_at?: string
          last_payment_at?: string | null
          last_payment_id?: string | null
          paid_until?: string | null
          plan?: string | null
          status?: string
          trial_ends_at?: string
          trial_started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: string
          approval_decided_at: string | null
          approval_decided_by: string | null
          approval_decision: string | null
          approval_reason: string | null
          avatar_url: string | null
          consent_accepted_at: string | null
          consent_signature_name: string | null
          created_at: string
          dni: string | null
          email: string | null
          full_name: string | null
          id: string
          is_approved: boolean
          license_college: string | null
          license_jurisdiction: string | null
          license_number: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: string
          approval_decided_at?: string | null
          approval_decided_by?: string | null
          approval_decision?: string | null
          approval_reason?: string | null
          avatar_url?: string | null
          consent_accepted_at?: string | null
          consent_signature_name?: string | null
          created_at?: string
          dni?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_approved?: boolean
          license_college?: string | null
          license_jurisdiction?: string | null
          license_number?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: string
          approval_decided_at?: string | null
          approval_decided_by?: string | null
          approval_decision?: string | null
          approval_reason?: string | null
          avatar_url?: string | null
          consent_accepted_at?: string | null
          consent_signature_name?: string | null
          created_at?: string
          dni?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_approved?: boolean
          license_college?: string | null
          license_jurisdiction?: string | null
          license_number?: string | null
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
          consultation_reason: string | null
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
          referred_by: string | null
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
          consultation_reason?: string | null
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
          referred_by?: string | null
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
          consultation_reason?: string | null
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
          referred_by?: string | null
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
      report_drafts: {
        Row: {
          case_caption: string | null
          court_division: string | null
          court_name: string | null
          created_at: string
          cuij: string | null
          current_step: number
          form_data: Json
          id: string
          patient_id: string
          report_title: string | null
          report_type: string
          status: string
          updated_at: string
        }
        Insert: {
          case_caption?: string | null
          court_division?: string | null
          court_name?: string | null
          created_at?: string
          cuij?: string | null
          current_step?: number
          form_data?: Json
          id?: string
          patient_id: string
          report_title?: string | null
          report_type?: string
          status?: string
          updated_at?: string
        }
        Update: {
          case_caption?: string | null
          court_division?: string | null
          court_name?: string | null
          created_at?: string
          cuij?: string | null
          current_step?: number
          form_data?: Json
          id?: string
          patient_id?: string
          report_title?: string | null
          report_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      resource_downloads: {
        Row: {
          downloaded_at: string
          id: string
          resource_id: string
          user_id: string
        }
        Insert: {
          downloaded_at?: string
          id?: string
          resource_id: string
          user_id: string
        }
        Update: {
          downloaded_at?: string
          id?: string
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_downloads_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "professional_resources"
            referencedColumns: ["id"]
          },
        ]
      }
      scl90r_tests: {
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
      secure_pdf_codes: {
        Row: {
          code: string
          consumed_at: string | null
          consumed_ip: string | null
          created_at: string
          expires_at: string
          id: string
          issued_at: string
          issued_by: string
          metadata: Json
          patient_id: string | null
          resource_type: string
          storage_bucket: string
          storage_path: string
        }
        Insert: {
          code: string
          consumed_at?: string | null
          consumed_ip?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          issued_at?: string
          issued_by: string
          metadata?: Json
          patient_id?: string | null
          resource_type: string
          storage_bucket: string
          storage_path: string
        }
        Update: {
          code?: string
          consumed_at?: string | null
          consumed_ip?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          issued_at?: string
          issued_by?: string
          metadata?: Json
          patient_id?: string | null
          resource_type?: string
          storage_bucket?: string
          storage_path?: string
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
      suggestion_comments: {
        Row: {
          author_id: string
          author_role: string
          body: string
          created_at: string
          id: string
          suggestion_id: string
        }
        Insert: {
          author_id: string
          author_role: string
          body: string
          created_at?: string
          id?: string
          suggestion_id: string
        }
        Update: {
          author_id?: string
          author_role?: string
          body?: string
          created_at?: string
          id?: string
          suggestion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_comments_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions: {
        Row: {
          admin_response: string | null
          approved_at: string | null
          category: string
          created_at: string
          decision_reason: string | null
          id: string
          message: string
          rejected_at: string | null
          responded_at: string | null
          responded_by: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          approved_at?: string | null
          category?: string
          created_at?: string
          decision_reason?: string | null
          id?: string
          message: string
          rejected_at?: string | null
          responded_at?: string | null
          responded_by?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_response?: string | null
          approved_at?: string | null
          category?: string
          created_at?: string
          decision_reason?: string | null
          id?: string
          message?: string
          rejected_at?: string | null
          responded_at?: string | null
          responded_by?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      symbolic_awards: {
        Row: {
          award_description: string | null
          award_key: string
          award_title: string
          awarded_at: string
          category_key: string
          clinical_note: string | null
          created_at: string
          granted_by: string
          id: string
          patient_id: string
          therapeutic_objective: string | null
          updated_at: string
        }
        Insert: {
          award_description?: string | null
          award_key: string
          award_title: string
          awarded_at?: string
          category_key: string
          clinical_note?: string | null
          created_at?: string
          granted_by: string
          id?: string
          patient_id: string
          therapeutic_objective?: string | null
          updated_at?: string
        }
        Update: {
          award_description?: string | null
          award_key?: string
          award_title?: string
          awarded_at?: string
          category_key?: string
          clinical_note?: string | null
          created_at?: string
          granted_by?: string
          id?: string
          patient_id?: string
          therapeutic_objective?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      symptom_networks: {
        Row: {
          bridge_symptom: string | null
          created_at: string
          edges: Json
          id: string
          nodes: Json
          patient_id: string
          updated_at: string
        }
        Insert: {
          bridge_symptom?: string | null
          created_at?: string
          edges?: Json
          id?: string
          nodes?: Json
          patient_id: string
          updated_at?: string
        }
        Update: {
          bridge_symptom?: string | null
          created_at?: string
          edges?: Json
          id?: string
          nodes?: Json
          patient_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      telegram_bot_state: {
        Row: {
          id: number
          update_offset: number
          updated_at: string
        }
        Insert: {
          id: number
          update_offset?: number
          updated_at?: string
        }
        Update: {
          id?: number
          update_offset?: number
          updated_at?: string
        }
        Relationships: []
      }
      telegram_contacts: {
        Row: {
          chat_id: number
          chat_type: string
          created_at: string
          id: string
          is_active: boolean
          last_incoming_at: string | null
          linked_at: string
          notify_documents: boolean
          notify_micro_tasks: boolean
          notify_sessions: boolean
          notify_symbolic_awards: boolean
          phone_number: string | null
          telegram_first_name: string | null
          telegram_last_name: string | null
          telegram_username: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chat_id: number
          chat_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_incoming_at?: string | null
          linked_at?: string
          notify_documents?: boolean
          notify_micro_tasks?: boolean
          notify_sessions?: boolean
          notify_symbolic_awards?: boolean
          phone_number?: string | null
          telegram_first_name?: string | null
          telegram_last_name?: string | null
          telegram_username?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chat_id?: number
          chat_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_incoming_at?: string | null
          linked_at?: string
          notify_documents?: boolean
          notify_micro_tasks?: boolean
          notify_sessions?: boolean
          notify_symbolic_awards?: boolean
          phone_number?: string | null
          telegram_first_name?: string | null
          telegram_last_name?: string | null
          telegram_username?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      telegram_delivery_logs: {
        Row: {
          chat_id: number | null
          created_at: string
          delivery_status: string
          error_message: string | null
          event_type: string
          id: string
          message_text: string | null
          payload: Json
          sent_at: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          chat_id?: number | null
          created_at?: string
          delivery_status?: string
          error_message?: string | null
          event_type: string
          id?: string
          message_text?: string | null
          payload?: Json
          sent_at?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          chat_id?: number | null
          created_at?: string
          delivery_status?: string
          error_message?: string | null
          event_type?: string
          id?: string
          message_text?: string | null
          payload?: Json
          sent_at?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      telegram_link_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          updated_at: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          updated_at?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          updated_at?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      telegram_messages: {
        Row: {
          chat_id: number
          created_at: string
          direction: string
          message_id: number | null
          message_text: string | null
          raw_update: Json
          received_at: string
          update_id: number
          user_id: string | null
        }
        Insert: {
          chat_id: number
          created_at?: string
          direction?: string
          message_id?: number | null
          message_text?: string | null
          raw_update?: Json
          received_at?: string
          update_id: number
          user_id?: string | null
        }
        Update: {
          chat_id?: number
          created_at?: string
          direction?: string
          message_id?: number | null
          message_text?: string | null
          raw_update?: Json
          received_at?: string
          update_id?: number
          user_id?: string | null
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
      documents_patient_view: {
        Row: {
          code_generated_at: string | null
          created_at: string | null
          description: string | null
          document_type: string | null
          file_url: string | null
          id: string | null
          is_paid: boolean | null
          patient_id: string | null
          payment_date: string | null
          payment_id: string | null
          price: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          code_generated_at?: string | null
          created_at?: string | null
          description?: string | null
          document_type?: string | null
          file_url?: string | null
          id?: string | null
          is_paid?: boolean | null
          patient_id?: string | null
          payment_date?: string | null
          payment_id?: string | null
          price?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          code_generated_at?: string | null
          created_at?: string | null
          description?: string | null
          document_type?: string | null
          file_url?: string | null
          id?: string | null
          is_paid?: boolean | null
          patient_id?: string | null
          payment_date?: string | null
          payment_id?: string | null
          price?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      mark_professional_active: { Args: never; Returns: undefined }
      patient_update_session: {
        Args: {
          _patient_notes?: string
          _patient_questions?: string
          _session_id: string
        }
        Returns: undefined
      }
      profile_safe_update: {
        Args: {
          _new: Database["public"]["Tables"]["profiles"]["Row"]
          _old: Database["public"]["Tables"]["profiles"]["Row"]
        }
        Returns: boolean
      }
      suspend_inactive_professionals: { Args: never; Returns: number }
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
