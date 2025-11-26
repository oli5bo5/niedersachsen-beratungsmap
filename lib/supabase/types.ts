/**
 * TypeScript interfaces for Supabase database types
 */

export interface Specialization {
  id: string
  name: string
  icon: string
  color: string
}

export interface Company {
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

export interface CompanySpecialization {
  id: string
  company_id: string
  specialization_id: string
  created_at: string
}

export interface CompanyWithSpecializations extends Company {
  specializations: Specialization[]
}

export interface CompanyInput {
  name: string
  description?: string
  address?: string
  latitude?: number
  longitude?: number
  website?: string
  email?: string
  phone?: string
  specialization_ids: string[]
}

export type SortOption = 'alphabetical' | 'newest' | 'nearest'

export interface FilterState {
  searchQuery: string
  selectedSpecializations: string[]
  sortBy: SortOption
}

