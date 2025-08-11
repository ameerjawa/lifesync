export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      health_metrics: {
        Row: {
          id: string;
          user_id: string;
          metric_type: string;
          value: number;
          recorded_at: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          metric_type: string;
          value: number;
          recorded_at?: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          metric_type?: string;
          value?: number;
          recorded_at?: string;
          notes?: string | null;
        };
      };
      health_goals: {
        Row: {
          id: string;
          user_id: string;
          metric_type: string;
          target_value: number;
          current_value: number;
          start_date: string;
          end_date: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          metric_type: string;
          target_value: number;
          current_value?: number;
          start_date: string;
          end_date: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          metric_type?: string;
          target_value?: number;
          current_value?: number;
          start_date?: string;
          end_date?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}