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
      account_roles: {
        Row: {
          account_id: number
          role_id: number
        }
        Insert: {
          account_id: number
          role_id: number
        }
        Update: {
          account_id?: number
          role_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "account_roles_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          avatar: string | null
          created_at: string
          email: string | null
          id: number
          name: string
          user_id: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email?: string | null
          id?: number
          name: string
          user_id: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string | null
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      carts: {
        Row: {
          created_at: string
          id: number
          is_select: boolean
          product_id: string
          total: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_select?: boolean
          product_id: string
          total: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_select?: boolean
          product_id?: string
          total?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: number
          product_id: string
          total_items: number
          transaction_id: string
          user_id: string
        }
        Insert: {
          id?: number
          product_id: string
          total_items: number
          transaction_id: string
          user_id: string
        }
        Update: {
          id?: number
          product_id?: string
          total_items?: number
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_items_order_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "customer_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_items_order_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          category_id: number
          product_id: string
        }
        Insert: {
          category_id: number
          product_id?: string
        }
        Update: {
          category_id?: number
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_category_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_photos: {
        Row: {
          id: number
          product_id: string
          url: string
        }
        Insert: {
          id?: number
          product_id?: string
          url: string
        }
        Update: {
          id?: number
          product_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_photo_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          price: number
          stock: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          price: number
          stock: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          price?: number
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          id: number
          title: string
        }
        Insert: {
          id?: number
          title: string
        }
        Update: {
          id?: number
          title?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          arrived_at: string | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          id: string
          invoice: string
          shipping_at: string | null
          status: Database["public"]["Enums"]["order_status"]
          user_id: string | null
          value: number
        }
        Insert: {
          arrived_at?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          id?: string
          invoice: string
          shipping_at?: string | null
          status: Database["public"]["Enums"]["order_status"]
          user_id?: string | null
          value: number
        }
        Update: {
          arrived_at?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          id?: string
          invoice?: string
          shipping_at?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          user_id?: string | null
          value?: number
        }
        Relationships: []
      }
    }
    Views: {
      customer_transactions: {
        Row: {
          created_at: string | null
          id: string | null
          invoice: string | null
          items: Json | null
          status: Database["public"]["Enums"]["order_status"] | null
          value: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_product: {
        Args: {
          new_description: string
          new_name: string
          new_price: number
          new_stock: number
          new_categories: string[]
          new_filepaths: string[]
        }
        Returns: string
      }
      create_account_with_role: {
        Args: {
          new_email: string
          new_name: string
          new_user_id: string
        }
        Returns: string
      }
      create_transaction: {
        Args: {
          new_invoice: string
          auth_user_id: string
        }
        Returns: string
      }
      update_product: {
        Args: {
          u_product_id: string
          product_description: string
          product_name: string
          product_stock: number
          product_price: number
          u_categories: string[]
          product_file_paths: string[]
        }
        Returns: string
      }
    }
    Enums: {
      order_status: "on progress" | "confirmed" | "shipping" | "arrived"
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
