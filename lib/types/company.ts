import { Database } from '@/lib/supabase/database.types'

export type Company = Database['public']['Tables']['consulting_companies']['Row']
export type Specialization = Database['public']['Tables']['specializations']['Row']

export type CompanyWithSpecializations = Company & {
  company_specializations: {
    specializations: Specialization
  }[]
}

export type CompanyInsert = Database['public']['Tables']['consulting_companies']['Insert']
export type CompanyUpdate = Database['public']['Tables']['consulting_companies']['Update']



