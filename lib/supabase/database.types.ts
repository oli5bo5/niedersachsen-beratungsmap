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
          city: string
          address: string | null
          lat: number
          lng: number
          website: string | null
          phone: string | null
          email: string | null
          description: string | null
          logo_url: string | null
          employee_count: number | null
          founded_year: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          city: string
          address?: string | null
          lat: number
          lng: number
          website?: string | null
          phone?: string | null
          email?: string | null
          description?: string | null
          logo_url?: string | null
          employee_count?: number | null
          founded_year?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          city?: string
          address?: string | null
          lat?: number
          lng?: number
          website?: string | null
          phone?: string | null
          email?: string | null
          description?: string | null
          logo_url?: string | null
          employee_count?: number | null
          founded_year?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      specializations: {
        Row: {
          id: string
          name: string
          icon: string | null
          color: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon?: string | null
          color?: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          color?: string
          description?: string | null
          created_at?: string
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
      cities: {
        Row: {
          id: string
          name: string
          latitude: number
          longitude: number
          population: number
          digitalization_budget: number
          city_category: string
          description: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          latitude: number
          longitude: number
          population?: number
          digitalization_budget?: number
          city_category?: string
          description?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          latitude?: number
          longitude?: number
          population?: number
          digitalization_budget?: number
          city_category?: string
          description?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
