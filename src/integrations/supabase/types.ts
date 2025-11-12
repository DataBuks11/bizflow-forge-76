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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string | null
          date: string
          employee_id: string | null
          employee_name: string
          id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date?: string
          employee_id?: string | null
          employee_name: string
          id?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date?: string
          employee_id?: string | null
          employee_name?: string
          id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          module: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          module: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          module?: string
          user_id?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          budget: number | null
          campaign_name: string
          campaign_type: string
          created_at: string
          description: string | null
          end_date: string
          id: string
          start_date: string
          status: string
          target_audience: string | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          campaign_name: string
          campaign_type: string
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          start_date: string
          status?: string
          target_audience?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          campaign_name?: string
          campaign_type?: string
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          start_date?: string
          status?: string
          target_audience?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          contact: string
          country: string | null
          created_at: string | null
          email: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          phone: string
          state: string | null
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact: string
          country?: string | null
          created_at?: string | null
          email: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          phone: string
          state?: string | null
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          contact?: string
          country?: string | null
          created_at?: string | null
          email?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string
          state?: string | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      distributor_stock: {
        Row: {
          batch: string | null
          brand: string
          case_size: number
          category: string
          created_at: string
          distributor_code: string
          distributor_name: string
          id: string
          item_code: string
          item_name: string
          quantity_cases: number
          quantity_pcs: number
          stock_value: number
          updated_at: string
        }
        Insert: {
          batch?: string | null
          brand: string
          case_size?: number
          category: string
          created_at?: string
          distributor_code: string
          distributor_name: string
          id?: string
          item_code: string
          item_name: string
          quantity_cases?: number
          quantity_pcs?: number
          stock_value?: number
          updated_at?: string
        }
        Update: {
          batch?: string | null
          brand?: string
          case_size?: number
          category?: string
          created_at?: string
          distributor_code?: string
          distributor_name?: string
          id?: string
          item_code?: string
          item_name?: string
          quantity_cases?: number
          quantity_pcs?: number
          stock_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      distributors: {
        Row: {
          contact: string
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string
          region: string
          revenue: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          contact: string
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone: string
          region: string
          revenue?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          contact?: string
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string
          region?: string
          revenue?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string | null
          department: string
          email: string
          id: string
          name: string
          phone: string
          role: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          department: string
          email: string
          id?: string
          name: string
          phone: string
          role: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          role?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string | null
          employee_id: string | null
          employee_name: string
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description?: string | null
          employee_id?: string | null
          employee_name: string
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          employee_id?: string | null
          employee_name?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          customer: string
          discount: number
          id: string
          notes: string | null
          order_id: string | null
          status: string
          tax: number
          total: number
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer: string
          discount?: number
          id?: string
          notes?: string | null
          order_id?: string | null
          status?: string
          tax?: number
          total: number
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer?: string
          discount?: number
          id?: string
          notes?: string | null
          order_id?: string | null
          status?: string
          tax?: number
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string
          contact: string
          created_at: string
          email: string
          id: string
          notes: string | null
          phone: string
          status: string
          updated_at: string
          value: number
        }
        Insert: {
          company: string
          contact: string
          created_at?: string
          email: string
          id?: string
          notes?: string | null
          phone: string
          status?: string
          updated_at?: string
          value?: number
        }
        Update: {
          company?: string
          contact?: string
          created_at?: string
          email?: string
          id?: string
          notes?: string | null
          phone?: string
          status?: string
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          created_at: string | null
          employee_id: string | null
          employee_name: string
          end_date: string
          id: string
          leave_type: string
          reason: string | null
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          employee_name: string
          end_date: string
          id?: string
          leave_type: string
          reason?: string | null
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          employee_name?: string
          end_date?: string
          id?: string
          leave_type?: string
          reason?: string | null
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      location_tracking: {
        Row: {
          created_at: string
          employee_id: string | null
          employee_name: string
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          employee_name: string
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          role: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          employee_name?: string
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_tracking_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll: {
        Row: {
          allowances: number | null
          basic_salary: number
          created_at: string | null
          deductions: number | null
          employee_id: string | null
          employee_name: string
          id: string
          month: string
          net_salary: number
          status: string
          updated_at: string | null
          year: number
        }
        Insert: {
          allowances?: number | null
          basic_salary: number
          created_at?: string | null
          deductions?: number | null
          employee_id?: string | null
          employee_name: string
          id?: string
          month: string
          net_salary: number
          status?: string
          updated_at?: string | null
          year: number
        }
        Update: {
          allowances?: number | null
          basic_salary?: number
          created_at?: string | null
          deductions?: number | null
          employee_id?: string | null
          employee_name?: string
          id?: string
          month?: string
          net_salary?: number
          status?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          id: string
          location: string | null
          min_stock: number
          name: string
          price: number
          status: string
          stock: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          location?: string | null
          min_stock?: number
          name: string
          price: number
          status?: string
          stock?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          location?: string | null
          min_stock?: number
          name?: string
          price?: number
          status?: string
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_modules: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          module_code: string
          module_name: string
          status: string
          updated_at: string
          version: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          module_code: string
          module_name: string
          status?: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          module_code?: string
          module_name?: string
          status?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          manager_id: string | null
          progress: number | null
          project_code: string
          project_name: string
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          manager_id?: string | null
          progress?: number | null
          project_code: string
          project_name: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          manager_id?: string | null
          progress?: number | null
          project_code?: string
          project_name?: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      quotations: {
        Row: {
          amount: number
          created_at: string
          customer: string
          id: string
          items: number
          notes: string | null
          status: string
          updated_at: string
          valid_until: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer: string
          id?: string
          items?: number
          notes?: string | null
          status?: string
          updated_at?: string
          valid_until: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer?: string
          id?: string
          items?: number
          notes?: string | null
          status?: string
          updated_at?: string
          valid_until?: string
        }
        Relationships: []
      }
      report_schedules: {
        Row: {
          created_at: string
          frequency: string
          id: string
          last_run_date: string | null
          next_run_date: string | null
          recipients: string[] | null
          report_name: string
          report_type: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          frequency: string
          id?: string
          last_run_date?: string | null
          next_run_date?: string | null
          recipients?: string[] | null
          report_name: string
          report_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          frequency?: string
          id?: string
          last_run_date?: string | null
          next_run_date?: string | null
          recipients?: string[] | null
          report_name?: string
          report_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      retailers: {
        Row: {
          address: string | null
          city: string | null
          contact_person: string
          created_at: string
          distributor_id: string | null
          email: string
          gstin: string | null
          id: string
          name: string
          phone: string
          state: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_person: string
          created_at?: string
          distributor_id?: string | null
          email: string
          gstin?: string | null
          id?: string
          name: string
          phone: string
          state?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_person?: string
          created_at?: string
          distributor_id?: string | null
          email?: string
          gstin?: string | null
          id?: string
          name?: string
          phone?: string
          state?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sales_orders: {
        Row: {
          amount: number
          created_at: string
          customer: string
          delivery_date: string
          id: string
          items: number
          notes: string | null
          quotation_ref: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer: string
          delivery_date: string
          id?: string
          items?: number
          notes?: string | null
          quotation_ref?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer?: string
          delivery_date?: string
          id?: string
          items?: number
          notes?: string | null
          quotation_ref?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sales_targets: {
        Row: {
          achieved: number
          created_at: string
          employee_id: string | null
          employee_name: string
          id: string
          percentage: number
          rank: number | null
          role: string
          target: number
          updated_at: string
        }
        Insert: {
          achieved?: number
          created_at?: string
          employee_id?: string | null
          employee_name: string
          id?: string
          percentage?: number
          rank?: number | null
          role: string
          target: number
          updated_at?: string
        }
        Update: {
          achieved?: number
          created_at?: string
          employee_id?: string | null
          employee_name?: string
          id?: string
          percentage?: number
          rank?: number | null
          role?: string
          target?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_targets_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      super_distributor_stock: {
        Row: {
          batch: string | null
          brand: string
          case_size: number
          category: string
          created_at: string
          id: string
          item_code: string
          item_name: string
          quantity_cases: number
          quantity_pcs: number
          stock_value: number
          super_distributor_code: string
          super_distributor_name: string
          updated_at: string
        }
        Insert: {
          batch?: string | null
          brand: string
          case_size?: number
          category: string
          created_at?: string
          id?: string
          item_code: string
          item_name: string
          quantity_cases?: number
          quantity_pcs?: number
          stock_value?: number
          super_distributor_code: string
          super_distributor_name: string
          updated_at?: string
        }
        Update: {
          batch?: string | null
          brand?: string
          case_size?: number
          category?: string
          created_at?: string
          id?: string
          item_code?: string
          item_name?: string
          quantity_cases?: number
          quantity_pcs?: number
          stock_value?: number
          super_distributor_code?: string
          super_distributor_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      survey_feedback: {
        Row: {
          category: string | null
          feedback: string | null
          id: string
          rating: number | null
          respondent_email: string | null
          respondent_name: string | null
          submitted_at: string
          survey_name: string
        }
        Insert: {
          category?: string | null
          feedback?: string | null
          id?: string
          rating?: number | null
          respondent_email?: string | null
          respondent_name?: string | null
          submitted_at?: string
          survey_name: string
        }
        Update: {
          category?: string | null
          feedback?: string | null
          id?: string
          rating?: number | null
          respondent_email?: string | null
          respondent_name?: string | null
          submitted_at?: string
          survey_name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          capacity: number | null
          created_at: string
          driver_name: string | null
          driver_phone: string | null
          id: string
          last_service_date: string | null
          model: string | null
          next_service_date: string | null
          status: string
          updated_at: string
          vehicle_number: string
          vehicle_type: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          driver_name?: string | null
          driver_phone?: string | null
          id?: string
          last_service_date?: string | null
          model?: string | null
          next_service_date?: string | null
          status?: string
          updated_at?: string
          vehicle_number: string
          vehicle_type: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          driver_name?: string | null
          driver_phone?: string | null
          id?: string
          last_service_date?: string | null
          model?: string | null
          next_service_date?: string | null
          status?: string
          updated_at?: string
          vehicle_number?: string
          vehicle_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_employee_id_for_user: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "hr" | "sales" | "finance"
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
      app_role: ["admin", "moderator", "user", "hr", "sales", "finance"],
    },
  },
} as const
