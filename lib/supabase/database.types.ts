/**
 * Database type definitions for Supabase
 * This file would normally be generated using: npx supabase gen types typescript
 * For now, we provide a manual type definition
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      consulting_companies: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string | null
          latitude: number | null
          longitude: number | null
          website: string | null
          email: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          website?: string | null
          email?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          website?: string | null
          email?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      specializations: {
        Row: {
          id: string
          name: string
          icon: string
          color: string
        }
        Insert: {
          id?: string
          name: string
          icon: string
          color: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          color?: string
        }
      }
      company_specializations: {
        Row: {
          id: string
          company_id: string
          specialization_id: string
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          specialization_id: string
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          specialization_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

