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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      calendar_events: {
        Row: {
          created_at: string
          device_id: string
          end_time: string | null
          event_date: string
          id: string
          kind: string
          memo: string | null
          place: string | null
          start_time: string | null
          status: string
          status_note: string | null
          title: string
        }
        Insert: {
          created_at?: string
          device_id: string
          end_time?: string | null
          event_date: string
          id?: string
          kind: string
          memo?: string | null
          place?: string | null
          start_time?: string | null
          status?: string
          status_note?: string | null
          title: string
        }
        Update: {
          created_at?: string
          device_id?: string
          end_time?: string | null
          event_date?: string
          id?: string
          kind?: string
          memo?: string | null
          place?: string | null
          start_time?: string | null
          status?: string
          status_note?: string | null
          title?: string
        }
        Relationships: []
      }
      clue_discoveries: {
        Row: {
          clue_id: string
          device_id: string
          discovered_at: string
          id: number
        }
        Insert: {
          clue_id: string
          device_id: string
          discovered_at?: string
          id?: never
        }
        Update: {
          clue_id?: string
          device_id?: string
          discovered_at?: string
          id?: never
        }
        Relationships: []
      }
      dm_messages: {
        Row: {
          body: string
          created_at: string
          deliver_at: number
          device_id: string
          id: number
          read_at: number | null
          sender: string
          status: string
          thread_id: string
          typing_cycles: number
          unsend_after_min: number | null
          unsent_at: number | null
        }
        Insert: {
          body: string
          created_at?: string
          deliver_at?: number
          device_id: string
          id?: never
          read_at?: number | null
          sender: string
          status?: string
          thread_id: string
          typing_cycles?: number
          unsend_after_min?: number | null
          unsent_at?: number | null
        }
        Update: {
          body?: string
          created_at?: string
          deliver_at?: number
          device_id?: string
          id?: never
          read_at?: number | null
          sender?: string
          status?: string
          thread_id?: string
          typing_cycles?: number
          unsend_after_min?: number | null
          unsent_at?: number | null
        }
        Relationships: []
      }
      game_state: {
        Row: {
          codex: Json
          device_id: string
          run: Json
          updated_at: string
        }
        Insert: {
          codex?: Json
          device_id: string
          run?: Json
          updated_at?: string
        }
        Update: {
          codex?: Json
          device_id?: string
          run?: Json
          updated_at?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          count: number
          device_id: string
          window_start: string
        }
        Insert: {
          count?: number
          device_id: string
          window_start: string
        }
        Update: {
          count?: number
          device_id?: string
          window_start?: string
        }
        Relationships: []
      }
      save_slots: {
        Row: {
          created_at: string
          device_id: string
          name: string
          pin_hash: string
        }
        Insert: {
          created_at?: string
          device_id: string
          name: string
          pin_hash: string
        }
        Update: {
          created_at?: string
          device_id?: string
          name?: string
          pin_hash?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      consume_rate_limit: {
        Args: { p_key: string; p_limit: number; p_window: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
